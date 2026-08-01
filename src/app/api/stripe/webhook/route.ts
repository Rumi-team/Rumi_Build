import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET, getCallOption } from "@/lib/stripe";
import { retentionPost } from "@/lib/retention/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("[stripe webhook] signature verification failed", e);
    return NextResponse.json(
      { error: "Bad signature" },
      { status: 400 },
    );
  }

  // Event ledger gate (idempotency)
  const ledgerResp = await retentionPost("/api/v1/rumi-build/stripe-events", {
    event_id: event.id,
    event_type: event.type,
    livemode: event.livemode,
    payload: event,
  });

  if (!ledgerResp.ok) {
    console.error("[stripe webhook] ledger insert failed", ledgerResp);
    // Return 5xx so Stripe retries
    return NextResponse.json({ error: "Ledger write failed" }, { status: 500 });
  }

  const alreadyProcessed =
    ledgerResp.data && typeof ledgerResp.data === "object"
      ? (ledgerResp.data as { already_processed?: boolean }).already_processed
      : false;

  if (alreadyProcessed) {
    return NextResponse.json({ ok: true, replay: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    } else if (event.type === "charge.refunded" || event.type === "charge.refund.updated") {
      await handleRefund(event.data.object as Stripe.Charge);
    }

    await retentionPost(`/api/v1/rumi-build/stripe-events/${event.id}/processed`, {});
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[stripe webhook] handler error", e);
    // Stripe will retry on 5xx
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Re-retrieve with expansion to get total_details breakdown
  const full = await getStripe().checkout.sessions.retrieve(session.id, {
    expand: ["payment_intent", "total_details.breakdown"],
  });

  if (full.payment_status !== "paid") {
    // We only mark paid on actual payment success. Other statuses (e.g.
    // 'unpaid' for async payment methods) can be handled by additional
    // events; for v1 the lead row already exists from the pre-payment upsert.
    return;
  }

  const cd = full.customer_details;
  const breakdown = full.total_details?.breakdown;
  // promotion_code lives on discounts[0].promotion_code (string id) or .discount.coupon
  const couponCode =
    (breakdown?.discounts?.[0] as { promotion_code?: string } | undefined)?.promotion_code ||
    null;

  const piId =
    typeof full.payment_intent === "string"
      ? full.payment_intent
      : full.payment_intent?.id || null;

  const stripeCustomerId =
    typeof full.customer === "string" ? full.customer : full.customer?.id || null;

  const checkoutAttemptId = full.metadata?.checkout_attempt_id || null;

  // Which of the two calls was bought, straight off the metadata /api/checkout
  // set at the point of sale. NOT derived from amount_total: the session allows
  // promotion codes, so a discounted 60-minute call can total less than a
  // 30-minute one and the CRM would file it as the wrong product.
  const callDuration = full.metadata?.call_duration || null;
  const callMinutesRaw = full.metadata?.call_minutes;
  const callMinutes = callMinutesRaw ? Number(callMinutesRaw) : null;

  // What Stripe actually charged, against what the site advertises for that
  // call. /api/checkout only ever sends a price id, so nothing upstream of here
  // compares the two — and v1.1.0.0 repriced the 30-minute call while reusing
  // STRIPE_PRICE_ID_30MIN, so a variable still pointing at the old Price
  // charges the old figure and looks entirely normal. Subtotal, not total:
  // promotion codes are enabled, and a discount is the customer's doing, not a
  // misconfiguration. Logged only — the money has already moved, and refusing
  // to record a paid customer would help nobody.
  const soldOption = callDuration ? getCallOption(callDuration) : undefined;
  if (
    soldOption &&
    full.amount_subtotal !== null &&
    full.amount_subtotal !== undefined &&
    full.amount_subtotal !== soldOption.amountUsd * 100
  ) {
    console.error(
      `[stripe webhook] session ${full.id} charged ${full.amount_subtotal} cents before discounts for the ${soldOption.label} call, which the site sells at ${soldOption.amountUsd * 100}. Check ${soldOption.envVar}.`,
    );
  }

  // Build payload only with non-null fields the API accepts
  const payload: Record<string, unknown> = {
    status: "paid",
    amount_subtotal_cents: full.amount_subtotal ?? null,
    amount_discount_cents: full.total_details?.amount_discount ?? null,
    amount_total_cents: full.amount_total ?? null,
    currency: full.currency,
    stripe_payment_intent: piId,
    stripe_customer_id: stripeCustomerId,
    stripe_livemode: full.livemode,
    coupon_code: couponCode,
    paid_at: new Date().toISOString(),
  };

  if (checkoutAttemptId) payload.checkout_attempt_id = checkoutAttemptId;
  // Only when present, same as checkout_attempt_id above: sessions created
  // before the two-option checkout shipped carry no such metadata, and sending
  // an explicit null would clobber a value the CRM may already hold.
  if (callDuration) payload.call_duration = callDuration;
  if (callMinutes && Number.isFinite(callMinutes)) payload.call_minutes = callMinutes;
  if (cd?.email) payload.email = cd.email;
  if (cd?.name) payload.name = cd.name;
  if (cd?.phone) payload.phone = cd.phone;

  // Strip null/undefined to avoid clobbering existing lead fields with null
  for (const k of Object.keys(payload)) {
    if (payload[k] === null || payload[k] === undefined) delete payload[k];
  }
  // status must always be present
  payload.status = "paid";

  const path = `/api/v1/rumi-build/customers/by-session/${full.id}`;
  let r = await retentionPost(path, payload);

  // `call_duration` and `call_minutes` are new keys on a schema that lives in
  // another repo. If that endpoint validates strictly, they turn a 200 into a
  // 4xx — and the throw below turns that into a 500, which makes Stripe retry,
  // which posts the same event back into the ledger gate above, which may well
  // answer `already_processed` and short-circuit past this handler entirely.
  // Net result: the CRM's opinion about an unknown column costs a paying
  // customer their `paid` flag, permanently. The paid status is the
  // load-bearing field here and the call length is a nice-to-have, so a 4xx
  // buys exactly one retry without them.
  const hasCallFields = "call_duration" in payload || "call_minutes" in payload;
  if (!r.ok && hasCallFields && r.status >= 400 && r.status < 500) {
    console.error(
      `[stripe webhook] by-session upsert rejected the call fields (${r.status} ${r.error || ""}); retrying without them`,
    );
    delete payload.call_duration;
    delete payload.call_minutes;
    r = await retentionPost(path, payload);
  }

  if (!r.ok) {
    throw new Error(`upsert by-session failed: ${r.status} ${r.error || ""}`);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!piId) return;

  const refundAmount = charge.amount_refunded ?? 0;
  const reason =
    charge.refunds?.data?.[0]?.reason ||
    charge.refunds?.data?.[0]?.metadata?.reason ||
    null;

  const r = await retentionPost(
    `/api/v1/rumi-build/customers/by-payment-intent/${piId}/refund`,
    {
      refund_amount_cents: refundAmount,
      refund_reason: reason,
      refunded_at: new Date().toISOString(),
    },
  );
  if (!r.ok) {
    throw new Error(`refund update failed: ${r.status} ${r.error || ""}`);
  }
}

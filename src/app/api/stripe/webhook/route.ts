import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
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
  if (cd?.email) payload.email = cd.email;
  if (cd?.name) payload.name = cd.name;
  if (cd?.phone) payload.phone = cd.phone;

  // Strip null/undefined to avoid clobbering existing lead fields with null
  for (const k of Object.keys(payload)) {
    if (payload[k] === null || payload[k] === undefined) delete payload[k];
  }
  // status must always be present
  payload.status = "paid";

  const r = await retentionPost(
    `/api/v1/rumi-build/customers/by-session/${full.id}`,
    payload,
  );
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

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import {
  getStripe,
  getCallOption,
  CALL_OPTIONS,
  SITE_URL,
  type CallOptionId,
} from "@/lib/stripe";
import { retentionPost } from "@/lib/retention/client";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";
import { SUPPORT_EMAIL } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Derived from the catalog rather than written out as z.enum(["30min","60min"]).
// A hand-written list here is a second copy of the ids, and the copy that drifts
// is the one that decides which Stripe price a buyer is charged.
const CALL_OPTION_IDS = CALL_OPTIONS.map((o) => o.id) as [
  CallOptionId,
  ...CallOptionId[],
];

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  project: z.string().min(1).max(2000),
  consentChecked: z.literal(true),
  // REQUIRED, and it must be declared here or it does not exist. `z.object()`
  // strips unknown keys instead of rejecting them, so the form could post a
  // `duration` the schema never mentions, have it silently dropped, and charge
  // every buyer the 30-minute price with no error anywhere.
  duration: z.enum(CALL_OPTION_IDS),
});

export async function POST(req: NextRequest) {
  const ip = ipFromRequest(req);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": Math.ceil(rl.retryAfterMs / 1000).toString() } },
    );
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request", detail: e instanceof Error ? e.message : "" },
      { status: 400 },
    );
  }

  const { name, email, phone, company, project, consentChecked, duration } = parsed;
  if (!consentChecked) {
    return NextResponse.json({ error: "Consent required" }, { status: 400 });
  }

  // Every string returned from here reaches the customer verbatim: book-form.tsx
  // renders `data.error` straight into the danger box under the submit button.
  // So none of them may be internal jargon — "Stripe not configured" was, and
  // it stopped being unreachable the moment configuration became per-option.
  // The reason an operator needs goes to the log instead.

  // The schema above already refuses an id outside the catalog, so this is the
  // belt to that braces: it is what makes `option` non-optional for the rest of
  // the handler, and it is the only thing standing between a future hand-edited
  // enum and a Checkout Session created with `price: undefined`.
  const option = getCallOption(duration);
  if (!option) {
    console.error(
      `[checkout] "${duration}" passed the schema but resolves to no option — CALL_OPTION_IDS and getCallOption have diverged.`,
    );
    return NextResponse.json(
      { error: "That call length isn't one we offer. Reload the page and pick again." },
      { status: 400 },
    );
  }

  // Configuration is per-option now, not one global boolean. Checking a single
  // variable would let a 60-minute purchase through with `price: ""`, which
  // Stripe rejects and the catch below turns into a generic 502 — the wrong
  // answer for a fault that is entirely ours.
  if (!option.priceId) {
    console.error(
      `[checkout] ${option.envVar} is not set — the ${option.label} call cannot be sold. Set it in the Vercel project.`,
    );
    // Name the lengths that ARE for sale rather than a hardcoded "30 minutes":
    // a buyer told only that this one is unavailable has no reason to try again.
    const alternatives = CALL_OPTIONS.filter(
      (o) => o.priceId && o.id !== option.id,
    );
    return NextResponse.json(
      {
        error: alternatives.length
          ? `The ${option.label} call isn't available to book right now. Pick ${alternatives
              .map((o) => o.label)
              .join(" or ")} instead, or email ${SUPPORT_EMAIL} and we'll set it up.`
          : `Booking is temporarily unavailable — that's on our side, not yours. Email ${SUPPORT_EMAIL} and we'll get your call booked.`,
      },
      { status: 503 },
    );
  }

  const checkoutAttemptId = randomUUID();

  // Best-effort lead capture. We do NOT block on retention API failure —
  // Stripe is the durable source of truth and the webhook upserts by
  // stripe_session_id with full session-derived state.
  //
  // Deliberately still carries no call details: this payload is the lead, and
  // which length they bought is only true once the payment lands. The webhook
  // enriches the same row from the session metadata set below.
  try {
    await retentionPost("/api/v1/rumi-build/customers/upsert", {
      checkout_attempt_id: checkoutAttemptId,
      status: "lead",
      name,
      email,
      phone: phone || null,
      company: company || null,
      project_description: project,
      source: "rumi.build",
    });
  } catch (e) {
    console.error("[checkout] lead capture failed (non-blocking)", e);
  }

  let session;
  try {
    session = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        line_items: [{ price: option.priceId, quantity: 1 }],
        allow_promotion_codes: true,
        customer_email: email,
        metadata: {
          checkout_attempt_id: checkoutAttemptId,
          source: "rumi.build",
          // Which call was bought, recorded at the point of sale. Do NOT infer
          // it downstream from amount_total: `allow_promotion_codes` is on, so
          // a discounted 60-minute call can total less than a 30-minute one.
          call_duration: option.id,
          call_minutes: String(option.minutes),
        },
        success_url: `${SITE_URL}/book/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/book?canceled=1`,
      },
      { idempotencyKey: `rumi-build:${checkoutAttemptId}` },
    );
  } catch (e) {
    console.error("[checkout] stripe error", e);
    return NextResponse.json(
      { error: "Checkout creation failed", detail: e instanceof Error ? e.message : "" },
      { status: 502 },
    );
  }

  if (!session.url) {
    return NextResponse.json({ error: "Stripe returned no URL" }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}

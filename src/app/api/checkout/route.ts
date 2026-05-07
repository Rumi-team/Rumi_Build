import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { getStripe, STRIPE_PRICE_ID_30MIN, SITE_URL } from "@/lib/stripe";
import { retentionPost } from "@/lib/retention/client";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  project: z.string().min(1).max(2000),
  consentChecked: z.literal(true),
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

  if (!STRIPE_PRICE_ID_30MIN) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
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

  const { name, email, phone, company, project, consentChecked } = parsed;
  if (!consentChecked) {
    return NextResponse.json({ error: "Consent required" }, { status: 400 });
  }

  const checkoutAttemptId = randomUUID();

  // Best-effort lead capture. We do NOT block on retention API failure —
  // Stripe is the durable source of truth and the webhook upserts by
  // stripe_session_id with full session-derived state.
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
        line_items: [{ price: STRIPE_PRICE_ID_30MIN, quantity: 1 }],
        allow_promotion_codes: true,
        customer_email: email,
        metadata: {
          checkout_attempt_id: checkoutAttemptId,
          source: "rumi.build",
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

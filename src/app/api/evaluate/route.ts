import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { retentionPost } from "@/lib/retention/client";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  business: z.string().max(160).optional().or(z.literal("")),
  website: z.string().max(300).optional().or(z.literal("")),
  languages: z.string().max(300).optional().or(z.literal("")),
  needs: z.array(z.string().max(80)).max(12).optional().default([]),
  message: z.string().max(2000).optional().or(z.literal("")),
  consentChecked: z.literal(true),
});

export async function POST(req: NextRequest) {
  const ip = ipFromRequest(req);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": Math.ceil(rl.retryAfterMs / 1000).toString() },
      },
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

  const { name, email, phone, business, website, languages, needs, message } =
    parsed;

  const evaluationId = randomUUID();

  // Flatten the evaluation answers into project_description so we mirror the
  // known-good retention upsert schema used by /api/checkout (no new fields the
  // backend might reject).
  const project_description = [
    "Free evaluation request.",
    `Needs: ${needs.length ? needs.join(", ") : "unspecified"}.`,
    `Current site: ${website || "none"}.`,
    `Languages: ${languages || "unspecified"}.`,
    message ? `Notes: ${message}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Persist the lead into the retention backend (same sink as /api/checkout).
  // Unlike checkout, this endpoint has NO durable fallback (no Stripe record),
  // so capture is REQUIRED: we must not tell the visitor "success" while the
  // lead silently vanishes. On any failure we log the full payload (recoverable
  // from server logs) and return an honest error so the visitor can retry or
  // email us. Requires RETENTION_API_URL + RETENTION_API_KEY in the environment.
  let captured = false;
  try {
    const r = await retentionPost("/api/v1/rumi-build/customers/upsert", {
      checkout_attempt_id: evaluationId,
      status: "lead",
      name,
      email,
      phone: phone || null,
      company: business || null,
      project_description,
      source: "rumi.build/evaluate",
    });
    captured = r.ok;
    if (!r.ok) {
      console.error("[evaluate] retention upsert failed", r.status, r.error, { name, email, project_description });
    }
  } catch (e) {
    console.error("[evaluate] lead capture error", e, { name, email, project_description });
  }

  if (!captured) {
    return NextResponse.json(
      {
        error:
          "We couldn't save your request just now. Please email support@rumi.build and we'll follow up — or try again in a moment.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

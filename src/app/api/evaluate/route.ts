import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { Resend } from "resend";
import { retentionPost } from "@/lib/retention/client";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Email delivery. The evaluation request is emailed to support@rumi.build.
// Requires RESEND_API_KEY in the environment and a verified sender domain in
// Resend (so EVALUATION_FROM can send as rumi.build). EVALUATION_TO/FROM let
// you override the addresses without a code change.
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EVAL_TO = process.env.EVALUATION_TO || "support@rumi.build";
const EVAL_FROM =
  process.env.EVALUATION_FROM || "Rumi Evaluations <evaluations@rumi.build>";

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
  const ref = randomUUID();

  const text = [
    "New free-evaluation request from rumi.build",
    "",
    `Name:      ${name}`,
    `Email:     ${email}`,
    `Phone:     ${phone || "—"}`,
    `Business:  ${business || "—"}`,
    `Website:   ${website || "—"}`,
    `Languages: ${languages || "—"}`,
    `Needs:     ${needs.length ? needs.join(", ") : "—"}`,
    "",
    "Message:",
    message || "—",
    "",
    `Ref: ${ref}`,
  ].join("\n");

  const project_description = [
    "Free evaluation request.",
    `Needs: ${needs.length ? needs.join(", ") : "unspecified"}.`,
    `Current site: ${website || "none"}.`,
    `Languages: ${languages || "unspecified"}.`,
    message ? `Notes: ${message}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Primary: email the request to support@rumi.build. replyTo is the
  // prospect's address so support can reply to them directly.
  let emailed = false;
  if (RESEND_API_KEY) {
    try {
      const resend = new Resend(RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: EVAL_FROM,
        to: EVAL_TO,
        replyTo: email,
        subject: `New evaluation request — ${name}${business ? ` (${business})` : ""}`,
        text,
      });
      emailed = !error;
      if (error) console.error("[evaluate] resend error", error);
    } catch (e) {
      console.error("[evaluate] email send error", e);
    }
  } else {
    console.warn("[evaluate] RESEND_API_KEY not set — cannot email support@rumi.build");
  }

  // Secondary (best-effort): also upsert into the retention backend if configured.
  let captured = false;
  try {
    const r = await retentionPost("/api/v1/rumi-build/customers/upsert", {
      checkout_attempt_id: ref,
      status: "lead",
      name,
      email,
      phone: phone || null,
      company: business || null,
      project_description,
      source: "rumi.build/evaluate",
    });
    captured = r.ok;
    if (!r.ok) console.error("[evaluate] retention upsert failed", r.status, r.error);
  } catch (e) {
    console.error("[evaluate] retention error", e);
  }

  // The request must reach us — via email (primary) or retention (secondary).
  // If neither delivered, fail honestly so the visitor isn't told it sent when
  // it didn't. Full payload is logged for manual recovery.
  if (!emailed && !captured) {
    console.error("[evaluate] LEAD NOT DELIVERED", { name, email, project_description });
    return NextResponse.json(
      {
        error:
          "We couldn't send your request just now. Please email support@rumi.build directly — or try again in a moment.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

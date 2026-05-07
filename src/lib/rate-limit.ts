// Lightweight in-memory IP bucket for Vercel serverless functions. Per-instance,
// not global — accepts that an attacker spreading across instances bypasses
// some quota. This is a guardrail against accidental floods, not a hard
// security control. Upgrade to Vercel KV / Upstash Ratelimit if abuse appears.

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

const MAX = 5; // requests
const WINDOW_MS = 60_000; // per minute

export function rateLimit(ip: string): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return { ok: true, retryAfterMs: 0 };
  }
  if (b.count >= MAX) {
    return { ok: false, retryAfterMs: b.reset - now };
  }
  b.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

export function ipFromRequest(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

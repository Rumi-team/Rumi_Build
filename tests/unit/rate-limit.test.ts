import { afterEach, describe, expect, it, vi } from "vitest";
import { ipFromHeaders, ipFromRequest, rateLimit } from "@/lib/rate-limit";

// ── Why this file exists ──────────────────────────────────────────────────────
// /book/success now rate-limits an unauthenticated GET the same way
// /api/checkout limits its POST, and the two entry points share one derivation:
// ipFromRequest is ipFromHeaders over req.headers. A server component only has
// next/headers, which is why the headers-level helper exists at all — so this
// pins the derivation order (first x-forwarded-for hop, then x-real-ip, then a
// shared bucket) and that the two entry points cannot drift apart.

describe("ipFromHeaders", () => {
  it("takes the first x-forwarded-for hop, trimmed — the client, not the proxies behind it", () => {
    expect(
      ipFromHeaders(new Headers({ "x-forwarded-for": " 203.0.113.7 , 10.0.0.1" }))
    ).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip, then to one shared bucket", () => {
    expect(ipFromHeaders(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe(
      "198.51.100.2"
    );
    // No headers at all: every anonymous caller shares one bucket rather than
    // each minting an unlimited fresh one.
    expect(ipFromHeaders(new Headers())).toBe("unknown");
  });

  it("reads a Request identically, so the API route and the page share one notion of caller", () => {
    const req = new Request("https://example.test/", {
      headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" },
    });
    expect(ipFromRequest(req)).toBe(ipFromHeaders(req.headers));
    expect(ipFromRequest(req)).toBe("203.0.113.7");
  });
});

describe("rateLimit", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows a burst, then refuses with a positive retry hint — without locking out other IPs", () => {
    // The cap itself (5/min) is the module's business; what matters here is
    // that a limit EXISTS, names a wait, and is scoped per IP. Random suffixes
    // because the bucket map is module state shared across this file's tests.
    const flooded = `flooded-${Math.random()}`;
    const bystander = `bystander-${Math.random()}`;
    let allowed = 0;
    let refusal: { ok: boolean; retryAfterMs: number } | undefined;
    for (let i = 0; i < 100 && !refusal; i++) {
      const r = rateLimit(flooded);
      if (r.ok) allowed += 1;
      else refusal = r;
    }
    expect(allowed, "the limiter never allows anything").toBeGreaterThan(0);
    expect(refusal, "100 hits from one IP all passed — there is no limit").toBeTruthy();
    expect(refusal!.retryAfterMs).toBeGreaterThan(0);
    expect(rateLimit(bystander).ok, "one IP's flood locked out another IP").toBe(true);
  });

  it("opens a fresh window once the old one expires", () => {
    vi.useFakeTimers();
    const ip = `window-${Math.random()}`;
    let spins = 0;
    while (rateLimit(ip).ok && ++spins < 100) {
      // exhaust the window
    }
    expect(spins, "no limit to exhaust — the loop guard tripped").toBeLessThan(100);
    vi.advanceTimersByTime(61_000);
    expect(rateLimit(ip).ok, "the window never reopens").toBe(true);
  });
});

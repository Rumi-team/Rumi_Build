import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/stripe";

// ── Why this file exists ──────────────────────────────────────────────────────
// getSiteUrl() decides where Stripe returns a buyer after their card is
// charged. It used to be a const:
//
//     export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rumi.build";
//
// On 2026-08-04 that variable existed on the live Vercel project holding the
// EMPTY STRING. `""` is falsy, so `||` fired, and every buyer on rumiai.ai was
// handed a success_url on https://rumi.build — a different site, deployed from
// a different repo, holding a different Stripe account's keys. Its /book/success
// looks that session id up, cannot find it, and says "this session isn't marked
// paid yet" above a button inviting the buyer to pay again. The money had
// already moved.
//
// Nothing failed. That is the point: a fallback naming a real, reachable,
// plausible-looking origin cannot fail visibly. So there is no fallback, and
// these cases are what keeps one from coming back — the first case below goes
// red the moment anybody reintroduces a default.

const VAR = "NEXT_PUBLIC_SITE_URL";

let original: string | undefined;

beforeEach(() => {
  original = process.env[VAR];
});

afterEach(() => {
  if (original === undefined) delete process.env[VAR];
  else process.env[VAR] = original;
});

describe("getSiteUrl refuses to guess an origin", () => {
  it("throws when the variable is absent rather than defaulting to a host", async () => {
    delete process.env[VAR];
    // Not a bare `.toThrow()`: a reintroduced default would make this RETURN a
    // string, and a test that only asserted "did not crash" would have stayed
    // green throughout the entire bug.
    expect(() => getSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it.each(["", "   ", "\t", "\n  "])(
    "throws on %j — the empty string is the shape this actually shipped as",
    async (value) => {
      process.env[VAR] = value;
      // The live failure was NOT an absent variable, it was a present one set
      // to "". A guard written as `=== undefined` passes the case above and
      // still ships the bug, so the blank forms get their own case.
      expect(() => getSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
    }
  );

  it.each(["www.example.com", "example.com/book", "://nope", "ftp://example.com"])(
    "throws on %j rather than building a URL Stripe will reject",
    async (value) => {
      process.env[VAR] = value;
      // A scheme-less host is the likeliest hand-typed mistake. It would build
      // "www.example.com/book/success", which Stripe refuses, which the route
      // reports to the buyer as "Checkout creation failed" — an error that
      // reads as their card being declined.
      expect(() => getSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
    }
  );
});

describe("getSiteUrl returns what it was configured with", () => {
  it("returns the configured origin unchanged", async () => {
    process.env[VAR] = "https://site.example";
    expect(getSiteUrl()).toBe("https://site.example");
  });

  it("accepts http, for a non-TLS preview host", async () => {
    process.env[VAR] = "http://localhost:3000";
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it.each([
    { input: "https://site.example/", expected: "https://site.example" },
    { input: "https://site.example///", expected: "https://site.example" },
    { input: "  https://site.example/  ", expected: "https://site.example" },
  ])(
    "strips the trailing slash off $input so the path is not doubled",
    async ({ input, expected }) => {
      // The caller appends "/book/success". A value pasted with its trailing
      // slash would otherwise produce "https://site.example//book/success".
      process.env[VAR] = input;
      expect(getSiteUrl()).toBe(expected);
      expect(`${getSiteUrl()}/book/success`).not.toContain("//book");
    }
  );

  it("keeps a sub-path, which is not a trailing slash", async () => {
    // Only the trailing slash is noise. A deployment served under a sub-path
    // needs the rest of it, so the strip must not reach past the slashes.
    process.env[VAR] = "https://site.example/app/";
    expect(getSiteUrl()).toBe("https://site.example/app");
  });
});

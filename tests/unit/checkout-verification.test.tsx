// @vitest-environment jsdom
// This file renders a page component, so it needs a DOM. The suite defaults to
// the `node` environment (vitest.config.ts); only the files that render opt in.
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ── Why this file exists ──────────────────────────────────────────────────────
// /book/success is the one page on this site that renders a stranger's data:
// it takes a Stripe session id straight off the URL and, if it verifies, prints
// the payer's email address. `verifySession` is the whole access check, and this
// diff changed it — the product check used to read
// `if (!matches && STRIPE_PRICE_ID_30MIN)`, which meant an UNSET price id turned
// the check off entirely and any paid Checkout Session on the account rendered
// the success page, echoing that customer's email back to whoever pasted the id.
// It now fails closed on a missing price id, with its own `unconfigured` reason.
//
// Nothing exercised any of that. The e2e suite loads /book/success with no
// session and asserts the response is under 400, which only ever reaches the
// `missing` branch — the seven-way reason ladder and the fail-closed fix are
// invisible to it, and to every unit test in the suite. The page has since
// grown two gates in front of Stripe — the id must be shaped like a real
// Checkout Session id, and the caller's IP must not be over the same per-IP
// window /api/checkout uses — so the cases that never reach Stripe at all are
// the ones this file has to prove hardest.
//
// `verifySession` is module-private, so the page's default export is driven
// instead: that is the surface a visitor gets, and asserting on it also catches
// a correct verdict wired to the wrong message. Stripe is stubbed per case
// through vi.doMock + a fresh module registry, because STRIPE_PRICE_ID_30MIN is
// read at import time — the unconfigured case IS the module loading without it.

const PAYER = "customer@example.com";
const OUR_PRICE = "price_30min_strategy_call";

type Case = {
  /** What src/lib/stripe.ts exports for the price id when the page imports it. */
  priceId: string;
  /** What the retrieve stub does: return this session, or throw this error. */
  session: Record<string, unknown> | { throws: unknown };
  /** Simulate this visitor's IP having exhausted the lookup rate limit. */
  overLimit?: boolean;
};

const paidForOurProduct = {
  payment_status: "paid",
  customer_details: { email: PAYER },
  amount_total: 10000,
  currency: "usd",
  line_items: { data: [{ price: { id: OUR_PRICE } }] },
};

// What stripe-node throws for an id Stripe has never seen: typed, 404,
// resource_missing. Plain objects with a `type` rather than instances of
// Stripe.errors.*: vi.resetModules gives the page its own copy of the stripe
// package, so a class identity from this file could never match there anyway —
// which is why the page matches on `type` too.
const noSuchSession = () =>
  Object.assign(new Error("No such checkout.session: 'cs_test_madeup'"), {
    type: "StripeInvalidRequestError",
    code: "resource_missing",
    statusCode: 404,
  });

// What an outage looks like: any Stripe failure that is NOT an invalid id —
// network drop, 5xx, 429.
const stripeDown = () =>
  Object.assign(new Error("An error occurred with our connection to Stripe."), {
    type: "StripeConnectionError",
  });

/** Import the page with Stripe stubbed, render it, and hand back the markup. */
async function renderSuccess(
  { priceId, session, overLimit = false }: Case,
  searchParams: { session_id?: string }
) {
  vi.resetModules();
  vi.doMock("@/lib/stripe", () => ({
    STRIPE_PRICE_ID_30MIN: priceId,
    getStripe: () => ({
      checkout: {
        sessions: {
          retrieve: async () => {
            retrieved += 1;
            if ("throws" in session) throw session.throws;
            return session;
          },
        },
      },
    }),
  }));
  // The page reads the visitor's IP for its rate limiter; a unit render has no
  // request scope for next/headers to read, so hand it a fixed one.
  vi.doMock("next/headers", () => ({
    headers: async () => new Headers({ "x-forwarded-for": "203.0.113.9" }),
  }));
  if (overLimit) {
    vi.doMock("@/lib/rate-limit", async (importOriginal) => ({
      ...(await importOriginal<typeof import("@/lib/rate-limit")>()),
      rateLimit: () => ({ ok: false, retryAfterMs: 30_000 }),
    }));
  } else {
    // Not just afterEach's job: the cross-check below renders every refusal
    // inside ONE test, so a stub left standing from the over-limit case would
    // hand the next case the rate-limited message instead of its own.
    vi.doUnmock("@/lib/rate-limit");
  }
  const { default: BookSuccessPage } = await import("@/app/book/success/page");
  const element = await BookSuccessPage({
    searchParams: Promise.resolve(searchParams),
  });
  return render(element);
}

let retrieved = 0;
let errors: string[];

beforeEach(() => {
  retrieved = 0;
  errors = [];
  // The unconfigured branch is required to log — the page deliberately does not
  // tell the customer what is wrong, so the server log is the only place an
  // operator finds out. Captured rather than silenced so it can be asserted.
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock("@/lib/stripe");
  vi.doUnmock("next/headers");
  vi.doUnmock("@/lib/rate-limit");
  localStorage.clear();
});

describe("/book/success verifies the session before it renders anything", () => {
  it("shows the calendar and the payer's own email for a paid session on our product", async () => {
    // The success state, which every assertion below is the absence of. Without
    // this case a `verifySession` that returned `ok: false` unconditionally
    // would satisfy the whole rest of this file.
    const { container } = await renderSuccess(
      { priceId: OUR_PRICE, session: paidForOurProduct },
      { session_id: "cs_test_ok" }
    );

    expect(
      screen.getByRole("heading", { level: 1 }).textContent,
      "a verified payment no longer reaches the booking step"
    ).toMatch(/pick your time/i);
    expect(container.textContent).toContain(PAYER);
    expect(retrieved, "the page never asked Stripe about the session").toBe(1);
    expect(errors).toEqual([]);
  });

  it("fails closed when the product id is unset — a paid session must not render", async () => {
    // THE regression. `STRIPE_PRICE_ID_30MIN` defaults to "" when the env var is
    // missing (src/lib/stripe.ts), and the previous check skipped itself in that
    // case: this exact session — genuinely paid, on an account we cannot match a
    // product against — rendered the success page and printed the address below.
    const { container } = await renderSuccess(
      { priceId: "", session: paidForOurProduct },
      { session_id: "cs_test_unconfigured" }
    );

    expect(
      container.textContent,
      "an unverifiable session echoed the payer's email address back to whoever holds the session id"
    ).not.toContain(PAYER);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
      /something looks off/i
    );
    // And it blames the right party: the fault is ours, so the copy must not
    // suggest the customer paid for the wrong thing.
    expect(container.textContent).toMatch(/on our side, not yours/i);
    expect(
      errors.join("\n"),
      "failing closed is silent — an operator has no way to learn the price id is unset"
    ).toMatch(/STRIPE_PRICE_ID_30MIN/);
  });

  // Every way the check can refuse, with the message each one owes the visitor.
  // Driven as a table because the page picks between them with a four-deep
  // nested ternary, where a shifted branch shows the wrong explanation rather
  // than failing.
  type Refusal = {
    reason: string;
    when: Case;
    params: { session_id?: string };
    says: RegExp;
    asksStripe: boolean;
    /** Set when the failure is OUR fault and must leave a trace for the operator. */
    logs?: RegExp;
  };
  const REFUSALS: Refusal[] = [
    {
      reason: "not_paid",
      when: {
        priceId: OUR_PRICE,
        session: { ...paidForOurProduct, payment_status: "unpaid" },
      },
      params: { session_id: "cs_test_unpaid" },
      says: /isn't marked paid yet/i,
      asksStripe: true,
    },
    {
      reason: "wrong_product",
      when: {
        priceId: OUR_PRICE,
        session: {
          ...paidForOurProduct,
          line_items: { data: [{ price: { id: "price_something_else" } }] },
        },
      },
      params: { session_id: "cs_test_otherproduct" },
      says: /isn't for our 30-min call/i,
      asksStripe: true,
    },
    {
      reason: "missing",
      when: { priceId: OUR_PRICE, session: paidForOurProduct },
      params: {},
      says: /no session id was provided/i,
      // The only case that must never reach Stripe: with no id there is nothing
      // to look up, and a call here would be an unauthenticated request fired by
      // every crawler that finds the URL.
      asksStripe: false,
    },
    {
      reason: "invalid",
      when: { priceId: OUR_PRICE, session: { throws: noSuchSession() } },
      params: { session_id: "cs_test_madeup" },
      says: /couldn't find that checkout session/i,
      asksStripe: true,
    },
    {
      reason: "rate_limited",
      when: { priceId: OUR_PRICE, session: paidForOurProduct, overLimit: true },
      params: { session_id: "cs_test_wouldverify" },
      says: /try again in a moment/i,
      // The whole point of the limit: an over-quota visitor costs no API call.
      asksStripe: false,
    },
    {
      reason: "unavailable",
      when: { priceId: OUR_PRICE, session: { throws: stripeDown() } },
      params: { session_id: "cs_test_outage" },
      says: /your payment is safe/i,
      asksStripe: true,
      logs: /stripe session lookup failed/i,
    },
  ];

  it.each(REFUSALS)(
    "$reason: explains itself, prints no email, and offers the way back to /book",
    async ({ when, params, says, asksStripe, logs }) => {
      const { container } = await renderSuccess(when, params);

      expect(container.textContent, "the refusal message is missing").toMatch(says);
      expect(
        container.textContent,
        "a session that did not verify still printed the payer's email"
      ).not.toContain(PAYER);
      // A visitor who has just been refused must not be stranded — every failure
      // state carries the same recovery link.
      expect(
        screen.getByRole("link", { name: /try booking again/i }),
        "no way back to /book from this failure state"
      ).toHaveAttribute("href", "/book");
      expect(
        retrieved > 0,
        asksStripe
          ? "the page never asked Stripe about the session"
          : "the page called Stripe with no session id"
      ).toBe(asksStripe);
      // Failures that are OUR fault must leave a trace for the operator;
      // failures that are the visitor's must not cry wolf in the logs.
      if (logs) {
        expect(
          errors.join("\n"),
          "the outage was swallowed silently — an operator cannot see Stripe failing"
        ).toMatch(logs);
      } else {
        expect(errors).toEqual([]);
      }
    }
  );

  it("keeps each refusal message to its own reason", async () => {
    // The ladder is a nested ternary, so an inserted branch shifts every message
    // below it onto the wrong verdict — each page would still render a
    // plausible sentence, and each case above would still pass on its own.
    const rendered = new Map<string, string>();
    for (const { reason, when, params } of REFUSALS) {
      const { container } = await renderSuccess(when, params);
      rendered.set(reason, container.textContent!);
      screen.getByRole("heading", { level: 1 });
      document.body.innerHTML = "";
    }
    for (const { reason, says } of REFUSALS) {
      for (const [other, text] of rendered) {
        if (other === reason) continue;
        expect(
          text,
          `the ${other} page shows the ${reason} message — the ternary ladder has shifted`
        ).not.toMatch(says);
      }
    }
  });

  it.each([
    "not-a-session-id",
    "cs_test_",
    "cs_live_abc<script>",
    // A Stripe id of the WRONG KIND — right prefix family, still not a session.
    "price_30min_strategy_call",
  ])(
    "never asks Stripe about %j — junk shapes are refused before the API call",
    async (junk) => {
      const { container } = await renderSuccess(
        { priceId: OUR_PRICE, session: paidForOurProduct },
        { session_id: junk }
      );
      expect(
        retrieved,
        "a junk-shaped id reached Stripe — free quota burn for whoever loops this URL"
      ).toBe(0);
      // Same verdict a genuinely unknown id gets, so a probe learns nothing
      // about which shapes exist.
      expect(container.textContent).toMatch(/couldn't find that checkout session/i);
      expect(container.textContent).not.toContain(PAYER);
      expect(errors).toEqual([]);
    }
  );

  it("tells a paying customer the outage is ours — never that their session doesn't exist", async () => {
    // The old bare catch mapped EVERY throw to "couldn't find that checkout
    // session" — including the Stripe blip that hits right after a real
    // payment, which read as "your money went nowhere".
    const { container } = await renderSuccess(
      { priceId: OUR_PRICE, session: { throws: stripeDown() } },
      { session_id: "cs_live_realpayment" }
    );
    expect(container.textContent).toMatch(/on our side/i);
    expect(container.textContent).toMatch(/your payment is safe/i);
    expect(container.textContent).not.toMatch(/couldn't find/i);
    expect(container.textContent).not.toContain(PAYER);
  });
});

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
// `missing` branch — the five-way reason ladder and the fail-closed fix are
// invisible to it, and to every unit test in the suite.
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
  /** The Checkout Session the stub returns, or "throw" for an unknown id. */
  session: Record<string, unknown> | "throw";
};

const paidForOurProduct = {
  payment_status: "paid",
  customer_details: { email: PAYER },
  amount_total: 10000,
  currency: "usd",
  line_items: { data: [{ price: { id: OUR_PRICE } }] },
};

/** Import the page with Stripe stubbed, render it, and hand back the markup. */
async function renderSuccess(
  { priceId, session }: Case,
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
            if (session === "throw") throw new Error("No such checkout session");
            return session;
          },
        },
      },
    }),
  }));
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
  const REFUSALS = [
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
      params: { session_id: "cs_test_other_product" },
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
      when: { priceId: OUR_PRICE, session: "throw" as const },
      params: { session_id: "cs_made_up" },
      says: /couldn't find that checkout session/i,
      asksStripe: true,
    },
  ] as const;

  it.each(REFUSALS)(
    "$reason: explains itself, prints no email, and offers the way back to /book",
    async ({ when, params, says, asksStripe }) => {
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
      // Only the unconfigured case is our fault, so only it logs.
      expect(errors).toEqual([]);
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
});

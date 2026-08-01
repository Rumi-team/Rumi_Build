// @vitest-environment jsdom
// This file renders a page component, so it needs a DOM. The suite defaults to
// the `node` environment (vitest.config.ts); only the files that render opt in.
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CALL_OPTIONS } from "@/lib/stripe";

// ── Why this file exists ──────────────────────────────────────────────────────
// /book/success is the one page on this site that renders a stranger's data:
// it takes a Stripe session id straight off the URL and, if it verifies, prints
// the payer's email address. `verifySession` is the whole access check, and it
// has been rewritten twice. The first rewrite fixed a check that read
// `if (!matches && STRIPE_PRICE_ID_30MIN)`, which meant an UNSET price id turned
// the check off entirely and any paid Checkout Session on the account rendered
// the success page, echoing that customer's email back to whoever pasted the id.
// It fails closed on a missing price id now, with its own `unconfigured` reason.
//
// The second rewrite is the two-option call ($75/30min, $125/60min), and it
// turned "configured" from a boolean into a per-option question. That created a
// NEW way to fail open and a new way to blame the customer, both covered below:
//   - a session must match EITHER configured price, and the page must know
//     WHICH — the matched price id is the only trustworthy signal of what was
//     bought (amount_total is not: /api/checkout allows promotion codes, so a
//     discounted 60-minute call can total less than a 30-minute one);
//   - PARTIAL configuration — one id set, the other not — must not be reported
//     as `wrong_product`, which tells a paying customer they bought the wrong
//     thing when the fault is entirely ours.
//
// Nothing exercised any of that. The e2e suite loads /book/success with no
// session and asserts the response is under 400, which only ever reaches the
// `missing` branch — the reason ladder and the fail-closed fix are invisible to
// it, and to every other unit test in the suite. The page has two gates in
// front of Stripe — the id must be shaped like a real Checkout Session id, and
// the caller's IP must not be over the same per-IP window /api/checkout uses —
// so the cases that never reach Stripe at all are the ones this file has to
// prove hardest.
//
// `verifySession` is module-private, so the page's default export is driven
// instead: that is the surface a visitor gets, and asserting on it also catches
// a correct verdict wired to the wrong message. Stripe is stubbed per case
// through vi.doMock + a fresh module registry, because CALL_OPTIONS reads the
// price ids at import time — the unconfigured cases ARE the module loading
// without them.

const PAYER = "customer@example.com";
const PRICE_30 = "price_thirty_minute_call";
const PRICE_60 = "price_sixty_minute_call";
/** The Cal.com event type that does not exist yet — see src/lib/data.ts. */
const SIXTY_SLUG = "rumi-app/60-min-meeting";

/**
 * The real catalog, used to BUILD the stub rather than to check it against
 * itself. Every length, price and amount below is read from here, so this file
 * restates no figure: a repricing that the page then mishandled cannot be
 * hidden by a fixture still agreeing with the old number.
 */
const THIRTY = CALL_OPTIONS.find((o) => o.id === "30min")!;
const SIXTY = CALL_OPTIONS.find((o) => o.id === "60min")!;

/** The shape src/lib/stripe.ts exports, rebuilt per case with chosen ids. */
function callOptions(priceId30: string, priceId60: string, calLink60: string) {
  return CALL_OPTIONS.map((o) =>
    o.id === "30min"
      ? { ...o, priceId: priceId30 }
      : {
          ...o,
          priceId: priceId60,
          // The calendar hangs off the option now, so the "no 60-minute event
          // type exists yet" state is set HERE rather than by stubbing
          // @/lib/data — the page no longer reads a Cal link of its own.
          calLink: calLink60,
          calUrl: calLink60 ? `https://cal.com/${calLink60}` : "",
        }
  );
}

type Case = {
  /** What CALL_OPTIONS carries for the 30-minute price when the page imports it. */
  priceId30?: string;
  /** …and for the 60-minute one. Unset here means the env var is unset. */
  priceId60?: string;
  /** What the retrieve stub does: return this session, or throw this error. */
  session: Record<string, unknown> | { throws: unknown };
  /** Simulate this visitor's IP having exhausted the lookup rate limit. */
  overLimit?: boolean;
  /** Simulate the 60-minute Cal.com event type not existing yet (the default). */
  calLink60?: string;
};

const optionFor = (priceId: string) => (priceId === PRICE_60 ? SIXTY : THIRTY);

/**
 * A paid session for one of our calls. `unit_amount` is what Stripe would
 * actually charge for the Price behind that id — the page checks it against the
 * catalog, because the id alone cannot tell a repriced Price from the old one,
 * and `STRIPE_PRICE_ID_30MIN` was deliberately reused across a reprice.
 */
const paidFor = (priceId: string, unitAmount?: number) => ({
  id: "cs_test_fixture",
  payment_status: "paid",
  customer_details: { email: PAYER },
  currency: "usd",
  metadata: { call_duration: optionFor(priceId).id },
  line_items: {
    data: [
      {
        price: {
          id: priceId,
          unit_amount: unitAmount ?? optionFor(priceId).amountUsd * 100,
        },
      },
    ],
  },
});

const paidForOurProduct = paidFor(PRICE_30);

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
  {
    priceId30 = PRICE_30,
    priceId60 = PRICE_60,
    session,
    overLimit = false,
    calLink60 = "",
  }: Case,
  searchParams: { session_id?: string }
) {
  vi.resetModules();
  // The 60-minute Cal.com event type does not exist yet, so its calLink is ""
  // in production; both sides of that gap are driven from the catalog stub.
  vi.doMock("@/lib/stripe", () => ({
    CALL_OPTIONS: callOptions(priceId30, priceId60, calLink60),
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

/**
 * Which Cal.com event the embed was pointed at. CalEmbed never writes calLink
 * into the DOM — it hands it to `window.Cal("inline", …)`, which queues onto
 * `window.Cal.q` because the real embed script never loads under jsdom. That
 * queue is therefore the only place the chosen calendar is observable, and
 * asserting on the visible "open in a new tab" link instead would miss a page
 * that words the link correctly and embeds the wrong event.
 */
function calendarsRequested(): string[] {
  const cal = (window as unknown as { Cal?: { q?: unknown[][] } }).Cal;
  return (cal?.q ?? [])
    .filter((call) => call[0] === "inline")
    .map((call) => (call[1] as { calLink?: string })?.calLink ?? "");
}

let retrieved = 0;
let errors: string[];

beforeEach(() => {
  retrieved = 0;
  errors = [];
  // `window.Cal` is installed once and then reused (`cal.loaded`), so its queue
  // survives between renders and the next case would read the previous case's
  // calendar.
  delete (window as unknown as { Cal?: unknown }).Cal;
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
      { session: paidForOurProduct },
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

  // ── The two options ────────────────────────────────────────────────────────

  it("matches the 60-minute price too, and says 60 rather than 30", async () => {
    // The defect this case exists for: a product check still written against
    // one price id passes every other test in this file and refuses the
    // customer who paid MORE. It also pins the length quoted back to them —
    // reading the wrong option and printing "30-minute" is how a $125 buyer
    // finds out they were shortchanged.
    const { container } = await renderSuccess(
      { session: paidFor(PRICE_60), calLink60: SIXTY_SLUG },
      { session_id: "cs_test_sixty" }
    );

    expect(
      screen.getByRole("heading", { level: 1 }).textContent,
      "a paid 60-minute session was refused"
    ).toMatch(/pick your time/i);
    expect(container.textContent).toContain(PAYER);
    expect(container.textContent, "the confirmation quotes the wrong length").toMatch(
      /60-minute slot/i
    );
    expect(container.textContent).not.toMatch(/30-minute slot/i);
  });

  // Both lengths, driven off the fixture rather than written out twice. The
  // asymmetric version of this pair is how "Choose a 60-minute slot" over a
  // correctly-embedded 30-minute calendar ships: the 60-minute case pinned its
  // wording and the 30-minute case pinned only its slug, so hardcoding the
  // sentence to "60-minute" passed the whole suite. A third length arriving in
  // CALL_OPTIONS is covered here on arrival.
  it.each([
    { priceId: PRICE_30, slug: THIRTY.calLink, minutes: THIRTY.minutes, other: SIXTY.minutes },
    { priceId: PRICE_60, slug: SIXTY_SLUG, minutes: SIXTY.minutes, other: THIRTY.minutes },
  ])(
    "books a $minutes-minute purchase on the $minutes-minute event and says so",
    async ({ priceId, slug, minutes, other }) => {
      const { container } = await renderSuccess(
        { session: paidFor(priceId), calLink60: SIXTY_SLUG },
        { session_id: "cs_test_calendar" }
      );

      expect(
        calendarsRequested(),
        `a ${minutes}-minute purchase was embedded against the wrong calendar`
      ).toEqual([slug]);
      // …and the fallback link beside the embed goes to the same event, not to
      // whichever URL happened to be imported first.
      expect(
        container.querySelector<HTMLAnchorElement>('a[target="_blank"]')?.href
      ).toContain(slug);
      // The sentence above the embed has to agree with the embed. It is
      // derived from the catalog and the calendar used to be picked by a string
      // comparison, so the two could disagree for any option that was not
      // literally "60min".
      expect(
        container.textContent,
        "the confirmation quotes a different length than the calendar books"
      ).toMatch(new RegExp(`${minutes}-minute slot`, "i"));
      expect(container.textContent).not.toMatch(
        new RegExp(`${other}-minute slot`, "i")
      );
    }
  );

  it("offers no calendar at all when the 60-minute event type does not exist", async () => {
    // Production today: CAL_LINK_60MIN is "". The one thing the page must not
    // do is fall back to CAL_LINK — a 60-minute buyer given a 30-minute slot
    // has been quietly shortchanged. It owes them the payment confirmation and
    // a way to reach us instead.
    const { container } = await renderSuccess(
      { session: paidFor(PRICE_60), calLink60: "" },
      { session_id: "cs_test_nocal" }
    );

    expect(
      calendarsRequested(),
      "a 60-minute purchase was handed a calendar of the wrong length"
    ).toEqual([]);
    expect(container.textContent, "the embed rendered with no calendar to show")
      .not.toMatch(/loading calendar/i);
    // The payment still succeeded and they must be told so, plainly.
    expect(container.textContent).toMatch(/payment went through/i);
    expect(container.textContent).toMatch(
      new RegExp(`${SIXTY.minutes}-minute`, "i")
    );
    expect(container.textContent).toMatch(/support@rumi\.build/);
    // …and claims NOTHING beyond it. There is no event type of this length, so
    // there is no calendar entry: a buyer told they are "booked in" or that
    // their minutes are "held" stops watching for the email we owe them.
    expect(
      container.textContent,
      "the page claims a booking that does not exist"
    ).not.toMatch(/booked in|are held/i);
  });

  // ── The amount, not just the id ────────────────────────────────────────────

  it("refuses a session that carries the right price id at the wrong amount", async () => {
    // STRIPE_PRICE_ID_30MIN was REUSED across a reprice, so the old Price
    // object remains a perfectly valid id that still charges the old figure.
    // Matching on the id alone cannot see that; nothing else in the codebase
    // ever looks at the amount.
    const wrong = optionFor(PRICE_30).amountUsd * 100 + 2500;
    const { container } = await renderSuccess(
      { session: paidFor(PRICE_30, wrong) },
      { session_id: "cs_test_wrongamount" }
    );

    expect(
      screen.getByRole("heading", { level: 1 }).textContent,
      "a session charged an amount this site does not advertise was confirmed"
    ).toMatch(/something looks off/i);
    expect(container.textContent).not.toContain(PAYER);
    expect(container.textContent).toMatch(/doesn't match what we charge/i);
    expect(
      errors.join("\n"),
      "the operator is never told which variable points at the wrong Price"
    ).toMatch(/STRIPE_PRICE_ID_30MIN/);
    expect(errors.join("\n")).toMatch(String(wrong));
  });

  it("refuses when the metadata and the price id name different calls", async () => {
    // What one pasted price id in the Vercel UI looks like from here: the
    // buyer picked 60 minutes and /api/checkout recorded that, but the id
    // resolves to the 30-minute option, so `find` hands them the short call's
    // page and calendar while the CRM files them as the long one.
    const { container } = await renderSuccess(
      {
        session: {
          ...paidFor(PRICE_30),
          metadata: { call_duration: SIXTY.id },
        },
      },
      { session_id: "cs_test_collision" }
    );

    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
      /something looks off/i
    );
    expect(container.textContent).not.toContain(PAYER);
    expect(errors.join("\n"), "the collision is invisible to an operator").toMatch(
      /sharing one Stripe Price id/i
    );
  });

  it("still verifies a session created before that metadata existed", async () => {
    // The other branch of the same check. Sessions from before v1.1.0.0 carry
    // no call_duration, and a cross-check written as `declared !== purchased.id`
    // without the presence guard would refuse every one of them.
    const legacy = paidFor(PRICE_30) as Record<string, unknown>;
    delete legacy.metadata;

    const { container } = await renderSuccess(
      { session: legacy },
      { session_id: "cs_test_legacy" }
    );

    expect(
      screen.getByRole("heading", { level: 1 }).textContent,
      "a session with no call metadata was refused"
    ).toMatch(/pick your time/i);
    expect(container.textContent).toContain(PAYER);
    expect(errors).toEqual([]);
  });

  // ── Failing closed ─────────────────────────────────────────────────────────

  it("fails closed when NEITHER price id is set — a paid session must not render", async () => {
    // THE original regression. Both ids default to "" when their env vars are
    // missing (src/lib/stripe.ts), and the old check skipped itself in that
    // case: this exact session — genuinely paid, on an account we cannot match
    // a product against — rendered the success page and printed the address.
    const { container } = await renderSuccess(
      { priceId30: "", priceId60: "", session: paidForOurProduct },
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
      "failing closed is silent — an operator has no way to learn the price ids are unset"
    ).toMatch(/STRIPE_PRICE_ID_30MIN/);
    expect(errors.join("\n")).toMatch(/STRIPE_PRICE_ID_60MIN/);
  });

  it.each([
    {
      missing: "STRIPE_PRICE_ID_60MIN",
      when: { priceId60: "", session: paidFor(PRICE_60) },
    },
    {
      missing: "STRIPE_PRICE_ID_30MIN",
      when: { priceId30: "", session: paidFor(PRICE_30) },
    },
  ])(
    "blames itself, not the customer, when only $missing is set",
    async ({ missing, when }) => {
      // PARTIAL CONFIGURATION — the failure mode the second option introduced.
      // A check that only matches the ids we happen to have set sends this
      // customer to `wrong_product`: "this session isn't for one of our calls",
      // to someone who paid us for exactly one of our calls. The fault is a
      // variable we never set, so the answer is `unconfigured` and a log naming
      // the variable.
      const { container } = await renderSuccess(when as Case, {
        session_id: "cs_test_partial",
      });

      expect(
        container.textContent,
        "a paying customer was told they bought the wrong product"
      ).not.toMatch(/isn't for one of our/i);
      expect(container.textContent).toMatch(/on our side, not yours/i);
      expect(container.textContent).not.toContain(PAYER);
      expect(
        errors.join("\n"),
        `the log does not name ${missing}, so an operator cannot find the fault`
      ).toMatch(new RegExp(missing));
    }
  );

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
      when: { session: { ...paidForOurProduct, payment_status: "unpaid" } },
      params: { session_id: "cs_test_unpaid" },
      says: /isn't marked paid yet/i,
      asksStripe: true,
    },
    {
      reason: "wrong_product",
      when: {
        // BOTH ids configured — that is what makes a miss genuinely the
        // customer's session and not our missing configuration.
        session: {
          ...paidForOurProduct,
          line_items: { data: [{ price: { id: "price_something_else" } }] },
        },
      },
      params: { session_id: "cs_test_otherproduct" },
      says: /isn't for one of our strategy calls/i,
      asksStripe: true,
    },
    {
      reason: "missing",
      when: { session: paidForOurProduct },
      params: {},
      says: /no session id was provided/i,
      // The only case that must never reach Stripe: with no id there is nothing
      // to look up, and a call here would be an unauthenticated request fired by
      // every crawler that finds the URL.
      asksStripe: false,
    },
    {
      reason: "invalid",
      when: { session: { throws: noSuchSession() } },
      params: { session_id: "cs_test_madeup" },
      says: /couldn't find that checkout session/i,
      asksStripe: true,
    },
    {
      reason: "rate_limited",
      when: { session: paidForOurProduct, overLimit: true },
      params: { session_id: "cs_test_wouldverify" },
      says: /try again in a moment/i,
      // The whole point of the limit: an over-quota visitor costs no API call.
      asksStripe: false,
    },
    {
      reason: "unconfigured",
      when: { priceId30: "", priceId60: "", session: paidForOurProduct },
      params: { session_id: "cs_test_noconfig" },
      says: /on our side, not yours/i,
      asksStripe: true,
      logs: /STRIPE_PRICE_ID_30MIN and STRIPE_PRICE_ID_60MIN/,
    },
    {
      reason: "mismatch",
      when: {
        session: paidFor(PRICE_60, optionFor(PRICE_60).amountUsd * 100 - 1000),
      },
      params: { session_id: "cs_test_mismatch" },
      says: /doesn't match what we charge/i,
      asksStripe: true,
      logs: /STRIPE_PRICE_ID_60MIN/,
    },
    {
      reason: "unavailable",
      when: { session: { throws: stripeDown() } },
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
    // `unconfigured` and `unavailable` are the pair most at risk now: both are
    // "the fault is ours" pages, so each one's sentence has to stay unique to
    // it or the two verdicts become indistinguishable to the reader.
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
    "price_thirty_minute_call",
  ])(
    "never asks Stripe about %j — junk shapes are refused before the API call",
    async (junk) => {
      const { container } = await renderSuccess(
        { session: paidForOurProduct },
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
      { session: { throws: stripeDown() } },
      { session_id: "cs_live_realpayment" }
    );
    expect(container.textContent).toMatch(/on our side/i);
    expect(container.textContent).toMatch(/your payment is safe/i);
    expect(container.textContent).not.toMatch(/couldn't find/i);
    expect(container.textContent).not.toContain(PAYER);
  });
});

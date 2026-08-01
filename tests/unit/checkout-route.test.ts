import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CALL_OPTIONS } from "@/lib/stripe";
import { SUPPORT_EMAIL } from "@/lib/data";

// ── Why this file exists ──────────────────────────────────────────────────────
// /api/checkout is the only code path that decides how much a buyer is charged,
// and until the call was split into two lengths there was nothing to decide:
// one price id, one line item, no input. Now the browser names an option and
// this route turns that name into a Stripe Price id, so three new ways to take
// the wrong amount exist and none of them fails loudly:
//
//  1. THE ZOD TRAP. `Body` is a plain `z.object()`, which STRIPS unknown keys
//     rather than rejecting them. The form posts its whole state object, so a
//     `duration` the schema does not declare is silently dropped and every
//     buyer is charged the default price — no error, no log, nothing to notice.
//     That is the single most likely way to ship this change half-broken, so
//     the first test below posts a body with no duration at all and requires a
//     refusal.
//  2. THE WRONG PRICE. The mapping from option id to price id is one line, and
//     both ids are opaque strings from the environment. A swapped pair charges
//     $75 for the hour and $125 for the half, and looks completely normal.
//  3. PARTIAL CONFIGURATION. "Stripe not configured" used to be one global
//     check. With two ids it has to be a question about the option the buyer
//     actually picked, or a 60-minute purchase sails past the gate and reaches
//     Stripe with `price: ""` — which Stripe rejects, and the catch turns into
//     a generic 502 "Checkout creation failed": the wrong error, pointing at
//     the wrong party, for a fault that is entirely ours.
//
// The route reads the price ids at import time (they are baked into
// CALL_OPTIONS), so each case stubs `@/lib/stripe` against a fresh module
// registry — configuring an option and not configuring it are two different
// module loads.

const PRICE_30 = "price_thirty_minute_call";
const PRICE_60 = "price_sixty_minute_call";

type Created = { params: Record<string, unknown>; options: unknown };

let created: Created[] = [];
let leads: Record<string, unknown>[] = [];
let errors: string[] = [];

/**
 * The catalog src/lib/stripe.ts exports, with the price ids chosen per case.
 * Built FROM the real catalog rather than retyped: the ids are the only thing
 * a case here varies, and a hand-copied price or label is a second copy of a
 * figure this suite exists to keep in one place.
 */
function callOptions(priceId30: string, priceId60: string) {
  return CALL_OPTIONS.map((o) => ({
    ...o,
    priceId: o.id === "30min" ? priceId30 : priceId60,
  }));
}

const THIRTY = CALL_OPTIONS.find((o) => o.id === "30min")!;
const SIXTY = CALL_OPTIONS.find((o) => o.id === "60min")!;

const VALID_LEAD = {
  name: "Dana Okafor",
  email: "dana@example.com",
  phone: "",
  company: "Okafor Interiors",
  project: "Calls going to voicemail every afternoon.",
  consentChecked: true,
};

let ipCounter = 0;

/**
 * Load the route with Stripe stubbed and POST `body` at it. Each call gets its
 * own source IP: the route shares the per-IP limiter with /book/success, and a
 * fixed address would have the sixth case in this file answered with a 429.
 */
async function post(
  body: unknown,
  { priceId30 = PRICE_30, priceId60 = PRICE_60, resolves = true } = {}
) {
  vi.resetModules();
  created = [];
  leads = [];
  vi.doMock("@/lib/stripe", () => {
    const options = callOptions(priceId30, priceId60);
    return {
      CALL_OPTIONS: options,
      SITE_URL: "https://rumi.build",
      // `resolves: false` is the divergence the handler's `if (!option)` branch
      // exists for: an id that is in CALL_OPTIONS — and therefore in the zod
      // enum derived from it — that the lookup does not resolve. It cannot
      // happen while the enum is derived, which is exactly why the branch
      // cannot be reached without saying so here.
      getCallOption: (id: string | undefined) =>
        resolves ? options.find((o) => o.id === id) : undefined,
      getStripe: () => ({
        checkout: {
          sessions: {
            create: async (params: Record<string, unknown>, options: unknown) => {
              created.push({ params, options });
              return { url: "https://checkout.stripe.com/c/pay/cs_test_123" };
            },
          },
        },
      }),
    };
  });
  vi.doMock("@/lib/retention/client", () => ({
    retentionPost: async (_path: string, payload: Record<string, unknown>) => {
      leads.push(payload);
      return { ok: true, status: 200 };
    },
  }));

  const { POST } = await import("@/app/api/checkout/route");
  ipCounter += 1;
  const req = new Request("https://rumi.build/api/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `198.51.100.${ipCounter}`,
    },
    body: JSON.stringify(body),
  });
  // The handler's parameter is typed NextRequest, but everything it touches —
  // `.headers` and `.json()` — is plain Request surface.
  const resp = await POST(req as never);
  const json = (await resp.json()) as { url?: string; error?: string };
  return { status: resp.status, json };
}

/** The Checkout Session params from the single create() this case made. */
function onlySession() {
  expect(created.length, "expected exactly one Checkout Session").toBe(1);
  return created[0].params;
}

beforeEach(() => {
  errors = [];
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock("@/lib/stripe");
  vi.doUnmock("@/lib/retention/client");
});

describe("/api/checkout turns the chosen length into a Stripe price", () => {
  it("refuses a body with no duration instead of charging the default price", async () => {
    // THE ZOD TRAP, stated as a test. If `duration` is ever dropped from the
    // schema this passes silently in production and fails here: a body the
    // browser could post today, answered with a price nobody chose.
    const { status, json } = await post(VALID_LEAD);

    expect(status, "a body with no duration was accepted").toBe(400);
    expect(json.error).toBe("Invalid request");
    expect(created, "Stripe was asked to charge for an unspecified call").toEqual(
      []
    );
  });

  it.each([
    { duration: "30min", expected: PRICE_30, minutes: "30" },
    { duration: "60min", expected: PRICE_60, minutes: "60" },
  ])("charges the $duration price for a $duration booking", async (choice) => {
    const { status, json } = await post({ ...VALID_LEAD, duration: choice.duration });

    expect(status).toBe(200);
    expect(json.url).toContain("checkout.stripe.com");

    const params = onlySession();
    expect(
      params.line_items,
      `a ${choice.duration} booking was charged the wrong price`
    ).toEqual([{ price: choice.expected, quantity: 1 }]);
    // And the session records WHICH call was bought. Nothing downstream can
    // work it out from amount_total — `allow_promotion_codes` is on, so a
    // discounted 60-minute call can total less than a 30-minute one.
    expect(params.allow_promotion_codes).toBe(true);
    expect(params.metadata).toMatchObject({
      source: "rumi.build",
      call_duration: choice.duration,
      call_minutes: choice.minutes,
    });
    expect(
      (params.metadata as { checkout_attempt_id?: string }).checkout_attempt_id,
      "the attempt id that ties this session to the lead row went missing"
    ).toBeTruthy();
  });

  it("gives the two options genuinely different price ids", async () => {
    // Guards the case above against agreeing with itself: if both fixtures
    // resolved to the same id, every assertion there would still pass. The
    // line_items comparison below is the whole guard — comparing the two
    // constants to each other would only restate this file's own inputs.
    const thirty = await post({ ...VALID_LEAD, duration: "30min" });
    const thirtyItems = onlySession().line_items;
    expect(thirty.status).toBe(200);
    await post({ ...VALID_LEAD, duration: "60min" });
    expect(onlySession().line_items).not.toEqual(thirtyItems);
  });

  it.each(["45min", "30", "", "60MIN"])(
    "refuses %j as a call length rather than guessing one",
    async (duration) => {
      const { status, json } = await post({ ...VALID_LEAD, duration });

      expect(status).toBe(400);
      expect(json.error).toBe("Invalid request");
      expect(created).toEqual([]);
    }
  );

  it("503s on the option the buyer picked, not on some global switch", async () => {
    // PARTIAL CONFIGURATION. With STRIPE_PRICE_ID_60MIN unset, a check written
    // against the 30-minute id alone lets this through to Stripe with
    // `price: ""` — rejected upstream and reported to the buyer as a generic
    // "Checkout creation failed", which reads as their card being the problem.
    const { status, json } = await post(
      { ...VALID_LEAD, duration: "60min" },
      { priceId60: "" }
    );

    expect(status, "an unconfigured option reached Stripe").toBe(503);
    expect(created).toEqual([]);

    // WHAT THE BUYER READS. This 503 used to be unreachable in practice — it
    // took the whole site being unconfigured — so it answered with the
    // developer string "Stripe not configured", which book-form.tsx renders
    // verbatim into the danger box. Per-option configuration makes it the
    // EXPECTED answer for the 60-minute card until its price id is set, at the
    // end of a filled-in form, on the page that takes money.
    expect(json.error, "the buyer is shown internal jargon").not.toMatch(
      /stripe|not configured|price_id/i
    );
    expect(
      json.error,
      "the buyer is not told which length they CAN book"
    ).toContain(THIRTY.label);
    expect(json.error).toContain(SUPPORT_EMAIL);
    // …and the reason an operator needs goes to the log instead of the page.
    expect(
      errors.join("\n"),
      "nothing in the log names the variable that is missing"
    ).toMatch(/STRIPE_PRICE_ID_60MIN/);
  });

  it("does not send a buyer to another length when there is no other length", async () => {
    // The other branch of that message. With neither id set there is nothing
    // to steer anyone toward, so "pick the other one" would be advice that
    // fails the same way.
    const { status, json } = await post(
      { ...VALID_LEAD, duration: "30min" },
      { priceId30: "", priceId60: "" }
    );

    expect(status).toBe(503);
    expect(json.error, "offered a length that is equally unbuyable").not.toContain(
      SIXTY.label
    );
    expect(json.error).toContain(SUPPORT_EMAIL);
    expect(json.error).toMatch(/on our side, not yours/i);
  });

  it("refuses an id the catalog holds but the lookup cannot resolve", async () => {
    // The `if (!option)` guard. It is unreachable while CALL_OPTION_IDS is
    // derived from CALL_OPTIONS — which is the point of deriving it — so the
    // only way to exercise it is to force the divergence it defends against:
    // a hand-edited enum listing an id `getCallOption` does not know.
    const { status, json } = await post(
      { ...VALID_LEAD, duration: "60min" },
      { resolves: false }
    );

    expect(status).toBe(400);
    expect(created, "a Checkout Session was created with `price: undefined`").toEqual(
      []
    );
    expect(json.error, "the buyer is shown internal jargon").not.toMatch(
      /unknown call option/i
    );
    expect(json.error).toMatch(/reload/i);
    expect(errors.join("\n")).toMatch(/diverged/i);
  });

  it("keeps selling the configured option while the other one is unset", async () => {
    // The other half: a missing 60-minute price must not take the 30-minute
    // call offline. Without this, "fail closed" quietly becomes "sell nothing".
    const { status } = await post(
      { ...VALID_LEAD, duration: "30min" },
      { priceId60: "" }
    );

    expect(status).toBe(200);
    expect(onlySession().line_items).toEqual([{ price: PRICE_30, quantity: 1 }]);
  });

  it("still captures the lead and still refuses without consent", async () => {
    // Unchanged behaviour, asserted because the duration field was inserted
    // into the middle of this handler and both of these sit either side of it.
    const ok = await post({ ...VALID_LEAD, duration: "60min" });
    expect(ok.status).toBe(200);
    expect(leads.length, "the pre-payment lead capture stopped firing").toBe(1);
    expect(leads[0]).toMatchObject({ status: "lead", email: VALID_LEAD.email });

    const denied = await post({
      ...VALID_LEAD,
      consentChecked: false,
      duration: "30min",
    });
    expect(denied.status).toBe(400);
    expect(created).toEqual([]);
    expect(errors).toEqual([]);
  });

  it("rate limits before it does anything else", async () => {
    // The limiter is per-IP and per-module-instance, so one load has to serve
    // every request here — `post` resets the registry each call, which would
    // hand each attempt a fresh empty bucket.
    vi.resetModules();
    vi.doMock("@/lib/stripe", () => ({
      CALL_OPTIONS: callOptions(PRICE_30, PRICE_60),
      SITE_URL: "https://rumi.build",
      getCallOption: (id: string) =>
        callOptions(PRICE_30, PRICE_60).find((o) => o.id === id),
      getStripe: () => ({
        checkout: {
          sessions: { create: async () => ({ url: "https://checkout.stripe.com/x" }) },
        },
      }),
    }));
    vi.doMock("@/lib/retention/client", () => ({
      retentionPost: async () => ({ ok: true, status: 200 }),
    }));
    const { POST } = await import("@/app/api/checkout/route");

    const send = () =>
      POST(
        new Request("https://rumi.build/api/checkout", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": "203.0.113.77",
          },
          body: JSON.stringify({ ...VALID_LEAD, duration: "30min" }),
        }) as never
      );

    const statuses: number[] = [];
    for (let i = 0; i < 7; i += 1) statuses.push((await send()).status);

    expect(statuses.slice(0, 5), "the limiter refuses inside its own window").toEqual(
      [200, 200, 200, 200, 200]
    );
    expect(statuses.slice(5)).toEqual([429, 429]);
  });
});

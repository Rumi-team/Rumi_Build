import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CALL_OPTIONS } from "@/lib/stripe";

// ── Why this file exists ──────────────────────────────────────────────────────
// The webhook is the leg of the money path that decides whether a customer who
// paid is ever recorded as having paid, and it had no test of any kind. The
// metadata round-trip was only half-covered: checkout-route.test.ts asserts
// /api/checkout WRITES `call_duration` and `call_minutes` onto the session, and
// nothing asserted they are read back — or that reading them cannot cost the
// customer the one field that matters.
//
// Two failure modes live here and both are silent:
//
//  1. THE CRM'S OPINION. Those two keys are new on a schema that lives in a
//     different repo. A strict validator turns them into a 4xx, the handler
//     throws, the route 5xxs, Stripe retries — and the retry posts the same
//     event back into the ledger gate at the top of the route, which can answer
//     `already_processed` and short-circuit past the handler entirely. The paid
//     upsert is then lost permanently, for every paid checkout after the
//     deploy. So a 4xx has to cost the call length, never the paid status.
//  2. THE REPLAYED OLD SESSION. Sessions created before this metadata existed
//     carry none of it, and sending explicit nulls would clobber whatever the
//     CRM already holds. Absent means absent, not null.

const SIXTY = CALL_OPTIONS.find((o) => o.id === "60min")!;

type Posted = { path: string; body: Record<string, unknown> };

let posted: Posted[] = [];
let errors: string[] = [];

/** What the retention API answers for the by-session upsert, per case. */
type RetentionBehaviour = {
  /** Status for the FIRST by-session post. Anything but 2xx is a failure. */
  bySession?: number;
  /** …and for the second, if the handler retries without the call fields. */
  bySessionRetry?: number;
};

const SESSION_ID = "cs_test_webhook";

/**
 * Load the route with Stripe and the retention client stubbed, and POST a
 * signed `checkout.session.completed` at it. `metadata` is what the Checkout
 * Session carries; `signature` false makes constructEvent throw the way
 * stripe-node does for a forged body.
 */
async function post({
  metadata,
  amountSubtotal = SIXTY.amountUsd * 100,
  signature = true,
  behaviour = {},
}: {
  metadata?: Record<string, string>;
  amountSubtotal?: number;
  signature?: boolean;
  behaviour?: RetentionBehaviour;
}) {
  vi.resetModules();
  posted = [];

  vi.doMock("@/lib/stripe", async (importOriginal) => {
    const real = await importOriginal<typeof import("@/lib/stripe")>();
    return {
      // Real catalog and real lookup: the amount cross-check below is only
      // meaningful against the prices the site actually advertises.
      ...real,
      STRIPE_WEBHOOK_SECRET: "whsec_test",
      getStripe: () => ({
        webhooks: {
          constructEvent: () => {
            if (!signature) {
              throw Object.assign(new Error("No signatures found matching"), {
                type: "StripeSignatureVerificationError",
              });
            }
            return {
              id: "evt_test_1",
              type: "checkout.session.completed",
              livemode: false,
              data: { object: { id: SESSION_ID } },
            };
          },
        },
        checkout: {
          sessions: {
            retrieve: async () => ({
              id: SESSION_ID,
              payment_status: "paid",
              currency: "usd",
              livemode: false,
              amount_subtotal: amountSubtotal,
              amount_total: amountSubtotal,
              total_details: { amount_discount: 0 },
              customer_details: { email: "dana@example.com", name: "Dana Okafor" },
              payment_intent: "pi_test_1",
              customer: "cus_test_1",
              metadata,
            }),
          },
        },
      }),
    };
  });

  vi.doMock("@/lib/retention/client", () => ({
    retentionPost: async (path: string, body: Record<string, unknown>) => {
      posted.push({ path, body: { ...body } });
      if (!path.includes("/customers/by-session/")) {
        return { ok: true, status: 200 };
      }
      const attempt = posted.filter((p) =>
        p.path.includes("/customers/by-session/"),
      ).length;
      const status =
        attempt === 1
          ? (behaviour.bySession ?? 200)
          : (behaviour.bySessionRetry ?? 200);
      return { ok: status >= 200 && status < 300, status, error: "rejected" };
    },
  }));

  const { POST } = await import("@/app/api/stripe/webhook/route");
  const req = new Request("https://rumi.build/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": "t=1,v1=deadbeef" },
    body: JSON.stringify({ id: "evt_test_1" }),
  });
  const resp = await POST(req as never);
  return { status: resp.status, json: await resp.json() };
}

/** The by-session upserts this case made, in order. */
const upserts = () =>
  posted.filter((p) => p.path.includes("/customers/by-session/"));

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

describe("the Stripe webhook records which call was bought", () => {
  it("carries the session's call metadata onto the CRM upsert", async () => {
    const { status } = await post({
      metadata: {
        call_duration: SIXTY.id,
        call_minutes: String(SIXTY.minutes),
      },
    });

    expect(status).toBe(200);
    expect(upserts().length, "the paid upsert never happened").toBe(1);
    expect(upserts()[0].body).toMatchObject({
      status: "paid",
      call_duration: SIXTY.id,
      // A number, not the string the metadata holds — Stripe metadata values
      // are always strings and the CRM column is numeric.
      call_minutes: SIXTY.minutes,
    });
    expect(errors).toEqual([]);
  });

  it("omits both keys for a session that predates them, rather than sending null", async () => {
    // Replayed pre-1.1.0.0 sessions. An explicit null here would overwrite
    // whatever the CRM already holds for that customer.
    const { status } = await post({ metadata: {} });

    expect(status).toBe(200);
    const body = upserts()[0].body;
    expect(body.status).toBe("paid");
    expect("call_duration" in body, "an absent length was sent as null").toBe(false);
    expect("call_minutes" in body).toBe(false);
  });

  it("drops an unparseable call_minutes instead of sending NaN", async () => {
    const { status } = await post({
      metadata: { call_duration: SIXTY.id, call_minutes: "not-a-number" },
    });

    expect(status).toBe(200);
    const body = upserts()[0].body;
    expect(body.call_duration, "the duration was dropped with the bad number").toBe(
      SIXTY.id,
    );
    expect("call_minutes" in body).toBe(false);
  });

  it("keeps the paid status when the CRM rejects the new call fields", async () => {
    // THE ONE THAT COSTS MONEY. A 422 from a strict schema used to throw, 500,
    // and hand the retry back to a ledger gate that may never run the handler
    // again — so the customer is charged and never marked paid, permanently.
    const { status } = await post({
      metadata: {
        call_duration: SIXTY.id,
        call_minutes: String(SIXTY.minutes),
      },
      behaviour: { bySession: 422, bySessionRetry: 200 },
    });

    expect(status, "a rejected optional field failed the whole webhook").toBe(200);
    expect(upserts().length, "the upsert was not retried without the call fields")
      .toBe(2);
    expect(upserts()[1].body).toMatchObject({ status: "paid" });
    expect("call_duration" in upserts()[1].body).toBe(false);
    expect("call_minutes" in upserts()[1].body).toBe(false);
    expect(
      errors.join("\n"),
      "the CRM's rejection was swallowed — nobody learns the column is missing",
    ).toMatch(/rejected the call fields/i);
  });

  it("still fails loudly when the upsert itself is broken", async () => {
    // The other branch: the retry is for the CRM disliking two optional keys,
    // not a licence to swallow a genuinely failed paid upsert. Stripe has to
    // keep retrying that one.
    const { status } = await post({
      metadata: {
        call_duration: SIXTY.id,
        call_minutes: String(SIXTY.minutes),
      },
      behaviour: { bySession: 422, bySessionRetry: 500 },
    });

    expect(status, "a failed paid upsert was reported to Stripe as success").toBe(
      500,
    );
    expect(upserts().length).toBe(2);
  });

  it("logs when Stripe charged an amount the site does not advertise", async () => {
    // The reprice trap: STRIPE_PRICE_ID_30MIN was reused across a price change,
    // so a variable still pointing at the old Price charges the old figure and
    // looks entirely normal. The money has already moved by the time this runs,
    // so it records the customer and shouts in the log rather than refusing.
    const { status } = await post({
      metadata: {
        call_duration: SIXTY.id,
        call_minutes: String(SIXTY.minutes),
      },
      amountSubtotal: SIXTY.amountUsd * 100 - 1000,
    });

    expect(status, "a mispriced session was refused instead of recorded").toBe(200);
    expect(upserts()[0].body).toMatchObject({ status: "paid" });
    expect(errors.join("\n")).toMatch(new RegExp(SIXTY.envVar));
  });

  it("says nothing about the amount when it matches the catalog", async () => {
    await post({
      metadata: {
        call_duration: SIXTY.id,
        call_minutes: String(SIXTY.minutes),
      },
      amountSubtotal: SIXTY.amountUsd * 100,
    });

    expect(errors, "a correctly priced session cried wolf in the log").toEqual([]);
  });

  it("400s a bad signature without touching the retention API", async () => {
    const { status } = await post({ metadata: {}, signature: false });

    expect(status).toBe(400);
    expect(
      posted,
      "a forged request reached the CRM — the ledger and the upsert both ran",
    ).toEqual([]);
  });
});

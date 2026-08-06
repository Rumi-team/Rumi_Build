import Stripe from "stripe";
import {
  CAL_LINK,
  CALENDLY_URL,
  CAL_LINK_60MIN,
  CALENDLY_URL_60MIN,
} from "@/lib/data";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _stripe = new Stripe(key, { typescript: true });
  return _stripe;
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * The public origin this deployment serves, used to build the Stripe redirect
 * URLs. There is deliberately NO DEFAULT: it throws instead.
 *
 * There used to be one — `process.env.NEXT_PUBLIC_SITE_URL || "https://rumi.build"`
 * — and on 2026-08-04 the variable existed on the Vercel project holding the
 * empty string. `""` is falsy, so `||` fired, and every buyer was handed a
 * `success_url` on a host nobody had chosen.
 *
 * The original write-up of that incident said the fallback sent buyers to "a
 * different site, deployed from a different repo, holding a different Stripe
 * account's keys". That was WRONG, and it is corrected here because it is the
 * mistaken belief that keeps getting acted on: rumi.build, www.rumi.build,
 * rumiai.ai and www.rumiai.ai are all aliases of THIS deployment (verified
 * 2026-08-05 — both `www` hosts return byte-identical HTML). The buyer landed
 * on the same build, the same env and the same Stripe key, so the session id
 * resolved fine. The real defect is narrower and still worth failing closed
 * over: an origin nobody configured is one nobody controls, and the day the
 * aliases diverge the same fallback strands a paying customer silently.
 *
 * A hardcoded origin cannot fail visibly — it fails by sending a paying
 * customer somewhere plausible — so this refuses instead. A checkout that will
 * not start is recoverable; a checkout that completes and strands the buyer is
 * not.
 *
 * A FUNCTION, not a const, and it throws at CALL time rather than at module
 * scope. CI builds the site and runs the e2e suite with no environment at all,
 * so a module-level throw would turn a green pipeline red — the same reason the
 * price ids below default to `""`. Same shape as `getStripe()` above.
 *
 * The trailing-slash strip is not cosmetic: this value is typed into a
 * dashboard by hand, and "https://example.com/" would otherwise build
 * "https://example.com//book/success".
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    // `!raw` and not `raw === undefined`: the live misconfiguration was the
    // EMPTY STRING, not an absent variable. A guard that only checks for
    // undefined reads as correct and passes this exact bug through.
    throw new Error("NEXT_PUBLIC_SITE_URL is not set");
  }
  // A scheme-less "www.example.com" is the obvious way to get this wrong by
  // hand, and it does not fail here — it builds "www.example.com/book/success",
  // which Stripe rejects, which /api/checkout reports to the buyer as a generic
  // "Checkout creation failed": the wrong error, blaming the wrong party.
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not an absolute URL: ${raw} (it needs the https:// scheme)`,
    );
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an http(s) URL, got ${parsed.protocol}`,
    );
  }
  if (parsed.search || parsed.hash) {
    // "https://x.com?a=1" survives every check above, and appending
    // "/book/success" to it does not build a path — it grows the query string.
    // The buyer lands on the right site's homepage with their session id buried
    // in a parameter nothing reads: paid, unconfirmed, the exact failure this
    // function exists to prevent. Refused for the same reason the scheme-less
    // form is, rather than normalized away — the value is typed by hand, and a
    // query string in a site origin means the hand slipped.
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must not carry a query or fragment: ${raw}`,
    );
  }
  // Trailing slashes only. A sub-path is preserved, because the caller appends
  // to this and a deployment served under one would need it.
  return raw.replace(/\/+$/, "");
}

// ── The paid call, in two lengths ────────────────────────────────────────────
//
// ONE source of truth for both options. The price used to be written out four
// times — the <title>, the H1, the submit button and the e2e assertion — with
// nothing tying them together, so three of them could drift from the price
// Stripe actually charges and only the button was covered by a test. Everything
// user-facing now reads these entries.
//
// PRICE IDS ARE ENV-ONLY. Never write a `price_…` literal into this file: the
// live and test ids differ, and a hardcoded one silently charges the wrong
// account. The `|| ""` default is load-bearing — /api/checkout and /book/success
// both fail closed on the empty string, and CI builds the site with neither
// variable set, so a module-level throw here would turn every build red.

export type CallOptionId = "30min" | "60min";

export interface CallOption {
  /** Stable id. Travels in the POST body and in the Stripe session metadata. */
  id: CallOptionId;
  minutes: number;
  /** Display price, exactly as rendered. Derived checks pin it to amountUsd. */
  price: string;
  amountUsd: number;
  /** Short label for the chooser card. */
  label: string;
  /** One line explaining who each length is for. */
  blurb: string;
  /**
   * The Stripe Price id, read from `envVar`. "" when unset — every consumer
   * treats that as "not configured" and refuses rather than guessing.
   */
  priceId: string;
  /** Named so an operator reading a server log knows what to go and set. */
  envVar: string;
  /**
   * The Cal.com event type this length books on, and the same event as a full
   * URL for the "open in a new tab" link. "" when no event type exists yet.
   *
   * ON THE OPTION, deliberately, and not picked with an `if` at the point of
   * render: /book/success used to choose the calendar with
   * `optionId === "60min" ? … : CAL_LINK`, so every length that was not
   * literally "60min" fell through to the 30-minute event while the sentence
   * above the embed read its length off this catalog. A third option would
   * have rendered "Choose a 90-minute slot" over a 30-minute booking, and it
   * would have type-checked, built and passed the suite. Required, so adding
   * an option forces an answer here; "" is the answer that shows the
   * email-you-times fallback instead of a calendar of the wrong length.
   */
  calLink: string;
  calUrl: string;
}

export const CALL_OPTIONS: readonly CallOption[] = [
  {
    id: "30min",
    minutes: 30,
    price: "$75",
    amountUsd: 75,
    label: "30 minutes",
    blurb: "One question, a straight recommendation, and a quote.",
    priceId: process.env.STRIPE_PRICE_ID_30MIN || "",
    envVar: "STRIPE_PRICE_ID_30MIN",
    calLink: CAL_LINK,
    calUrl: CALENDLY_URL,
  },
  {
    id: "60min",
    minutes: 60,
    price: "$125",
    amountUsd: 125,
    label: "60 minutes",
    blurb: "Room to walk through several roles, your tools, and the numbers.",
    priceId: process.env.STRIPE_PRICE_ID_60MIN || "",
    envVar: "STRIPE_PRICE_ID_60MIN",
    // Its own event type since 2026-08-05 (rumi-ai/discovery-call-60min), so a
    // $125 buyer now gets a 60-minute calendar instead of the email-you-times
    // fallback. Still NOT allowed to fall back to CAL_LINK if it ever empties:
    // a 30-minute slot booked against an hour-long purchase looks like it
    // worked and is discovered by the customer, on the call.
    calLink: CAL_LINK_60MIN,
    calUrl: CALENDLY_URL_60MIN,
  },
];

/**
 * Pre-selected on /book. NOT a server-side fallback: `duration` is required by
 * /api/checkout's schema and a body without one is refused, never defaulted —
 * guessing a length is how a buyer gets charged for a call they did not pick.
 * The one visible consequence is the deploy window: a browser still holding a
 * pre-1.1.0.0 /book bundle posts no duration and is answered with a 400, which
 * the form asks them to recover from by reloading.
 */
export const DEFAULT_CALL_OPTION_ID: CallOptionId = "30min";

/** `undefined` for anything that is not one of the ids above. */
export function getCallOption(id: string | undefined): CallOption | undefined {
  return CALL_OPTIONS.find((o) => o.id === id);
}

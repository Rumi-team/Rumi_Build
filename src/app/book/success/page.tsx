import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { CalEmbed } from "@/components/cal-embed";
import { getStripe, CALL_OPTIONS } from "@/lib/stripe";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { SUPPORT_EMAIL } from "@/lib/data";

// Post-payment page, behind a Stripe session id. It was self-canonical and
// indexable, which meant a crawler arriving with no `session_id` — the only way
// a crawler ever arrives — got an indexable, canonical page whose entire
// content is "Could not verify payment / Something looks off". That is the
// version of this URL Google would have had to rank for the brand.
//
// noindex + nofollow, and no canonical at all: there is nothing to consolidate
// (the page has no crawlable state worth indexing), and a noindex page pointing
// a canonical anywhere else risks carrying the noindex to that target — the
// same trap /schedule was in. Its sitemap exclusion is pinned in
// tests/unit/routing.test.ts, which now records the stance as "noindex".
//
// `canonical: null`, NOT a deleted `alternates`: the root layout's canonical is
// inherited wholesale, so removing the key entirely would have this page
// declare itself the homepage instead of itself. `null` is Next's supported
// suppression and emits no <link rel="canonical">.
export const metadata: Metadata = {
  title: "Payment received | Rumi AI",
  description: "Pick your time for the strategy call.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export const dynamic = "force-dynamic";

// Real Checkout Session ids: cs_(live|test)_<alphanumerics>. Anything else —
// crawler junk, injection probes, a pasted price id — is refused here, before
// it becomes an unauthenticated Stripe API call that burns this account's
// quota on behalf of whoever typed the URL.
const SESSION_ID_SHAPE = /^cs_(live|test)_[A-Za-z0-9]+$/;

async function verifySession(sessionId: string) {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    if (session.payment_status !== "paid") {
      return { ok: false as const, reason: "not_paid" as const };
    }
    // Confirm the session bought one of OUR calls, and record WHICH — the
    // matched price id is the only trustworthy signal of what was purchased
    // (amount_total is not: `allow_promotion_codes` is on in /api/checkout, so
    // a discounted 60-minute call can total less than a 30-minute one).
    //
    // FAILS CLOSED on missing configuration. src/lib/stripe.ts defaults every
    // priceId to "" when its env var is unset, and this check used to be
    // `if (!matches && STRIPE_PRICE_ID_30MIN)` — so an unset var turned the
    // whole product check off and any paid Checkout Session on the account
    // rendered the success page, echoing that customer's email address back to
    // whoever pasted the id into the URL. A missing configuration value must
    // never widen what a visitor is allowed to see.
    //
    // With two options "configured" stopped being a boolean, and the dangerous
    // case is PARTIAL configuration. Matching only against the ids we happen to
    // have set would tell a customer who bought the 60-minute call that their
    // session "isn't for our call" when the truth is we never set
    // STRIPE_PRICE_ID_60MIN. So a miss is only ever `wrong_product` when every
    // option is configured and could therefore have matched; otherwise the
    // honest answer is that we cannot verify, and `unconfigured` owns the fault
    // as ours. The server log names the variable actually missing.
    const unset = CALL_OPTIONS.filter((o) => !o.priceId);
    if (unset.length === CALL_OPTIONS.length) {
      console.error(
        `${unset.map((o) => o.envVar).join(" and ")} are not set — cannot verify which product a checkout session bought; failing closed.`
      );
      return { ok: false as const, reason: "unconfigured" as const };
    }
    const lineItems = session.line_items?.data ?? [];
    const purchased = CALL_OPTIONS.find(
      (o) => o.priceId && lineItems.some((li) => li.price?.id === o.priceId)
    );
    if (!purchased) {
      if (unset.length > 0) {
        console.error(
          `${unset.map((o) => o.envVar).join(" and ")} is not set — a session that matches no configured price cannot be told apart from one we simply cannot check; failing closed.`
        );
        return { ok: false as const, reason: "unconfigured" as const };
      }
      return { ok: false as const, reason: "wrong_product" as const };
    }

    // The price id says WHICH product; it does not say what it cost, and
    // nothing else in this codebase ever looks at the amount — /api/checkout
    // sends `price: <id>` and lets Stripe decide the number. That gap became
    // load-bearing when v1.1.0.0 repriced the 30-minute call downward while
    // REUSING STRIPE_PRICE_ID_30MIN: renaming the variable would have failed
    // closed on the 503 in /api/checkout, but reusing it means the old Price
    // object is still a perfectly valid id that still charges the old amount,
    // on a site that now advertises the new one everywhere. So the amount is
    // checked against the catalog here, where line_items is already expanded
    // and it costs no extra API call.
    const expectedCents = purchased.amountUsd * 100;
    const actualCents =
      lineItems.find((li) => li.price?.id === purchased.priceId)?.price
        ?.unit_amount ?? null;
    if (actualCents !== expectedCents) {
      console.error(
        `${purchased.envVar} points at a Stripe Price of ${actualCents ?? "no unit_amount"} cents, but the site sells the ${purchased.label} call at ${expectedCents} cents. Repoint the variable at the right Price; failing closed until then.`
      );
      return { ok: false as const, reason: "mismatch" as const };
    }

    // What /api/checkout recorded the buyer as having picked, cross-checked
    // against what the price id resolved to. They can only disagree if two
    // options carry the SAME price id — one paste in the Vercel UI — in which
    // case `find` returns the first match and a 60-minute buyer is quietly
    // handed the 30-minute page, calendar included, while the CRM files them
    // as 60. Skipped for sessions created before this metadata existed.
    const declared = session.metadata?.call_duration;
    if (declared && declared !== purchased.id) {
      console.error(
        `session ${session.id} was sold as ${declared} but its price id resolves to ${purchased.id} — two options are probably sharing one Stripe Price id; failing closed.`
      );
      return { ok: false as const, reason: "mismatch" as const };
    }

    return {
      ok: true as const,
      email: session.customer_details?.email || null,
      // What they bought, not what they paid — the render picks the calendar
      // and the confirmation wording off these. The calendar travels ON the
      // option (src/lib/stripe.ts) precisely so it cannot be chosen by a
      // string comparison that a third length would fall through.
      minutes: purchased.minutes,
      calLink: purchased.calLink,
      calUrl: purchased.calUrl,
    };
  } catch (err) {
    // Stripe's SDK types every failure. An id Stripe has never seen is a
    // StripeInvalidRequestError (404, resource_missing) — only THAT means the
    // visitor's session id is wrong. An outage, a 429 or a network drop is
    // anything else, and a customer who just paid must not be told their
    // session doesn't exist because Stripe blinked; `unavailable` owns the
    // fault as ours. Matched on `type`, which stripe-node sets to the class
    // name on every error, rather than instanceof: the tests stub the module
    // registry per case, and a class identity can't survive that reset.
    if ((err as { type?: string } | null)?.type === "StripeInvalidRequestError") {
      return { ok: false as const, reason: "invalid" as const };
    }
    console.error("Stripe session lookup failed (not an invalid id):", err);
    return { ok: false as const, reason: "unavailable" as const };
  }
}

/**
 * Everything that must be true before we spend a Stripe API call on a query
 * param a stranger controls: an id present, shaped like a real Checkout
 * Session id, and an IP that is not hammering the lookup. Same limiter as
 * /api/checkout — a GET that triggers an upstream API call is exactly as
 * unauthenticated as the POST is.
 */
async function gatedVerify(sessionId: string | undefined) {
  if (!sessionId) return { ok: false as const, reason: "missing" as const };
  if (!SESSION_ID_SHAPE.test(sessionId)) {
    return { ok: false as const, reason: "invalid" as const };
  }
  const rl = rateLimit(ipFromHeaders(await headers()));
  if (!rl.ok) return { ok: false as const, reason: "rate_limited" as const };
  return verifySession(sessionId);
}

export default async function BookSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  const result = await gatedVerify(session_id);

  // The calendar that matches what they actually bought, read off the option
  // itself. There is exactly one Cal.com event type today (30 minutes); the
  // 60-minute option's calLink is "" until someone creates the second one —
  // see the note in src/lib/data.ts. Empty shows the fallback below rather
  // than a calendar of the wrong length, because a 60-minute buyer handed a
  // 30-minute slot finds out on the call, and by then we have taken their
  // money and wasted their time.
  const calLink = result.ok ? result.calLink : "";
  const calUrl = result.ok ? result.calUrl : "";

  return (
    <>
      <Nav />
      <EnglishMain className="min-h-screen bg-white text-ink pt-16">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          {result.ok ? (
            <>
              <p className="eyebrow mb-3">
                Payment received
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-h1 text-ink mb-3">
                {calLink
                  ? "One last step — pick your time"
                  : "Thanks — we'll send you times"}
              </h1>
              <p className="text-base sm:text-lg text-muted mb-6 sm:mb-8">
                {calLink ? (
                  <>
                    Choose a {result.minutes}-minute slot on our calendar.
                    We&rsquo;ll send a confirmation
                    {result.email ? ` to ${result.email}` : ""} with the meeting
                    link.
                  </>
                ) : (
                  // Nothing is booked and nothing is held on this branch: there
                  // is no event type of this length, so there is no calendar
                  // entry to hold. Saying "you're booked in" would have someone
                  // stop watching for our email and wait for an invite that
                  // never comes. The payment is the only thing that has
                  // actually happened, so it is the only thing claimed.
                  <>
                    Your payment went through. Our {result.minutes}-minute
                    calendar isn&rsquo;t open for self-booking yet, so
                    we&rsquo;ll email you times
                    {result.email ? ` at ${result.email}` : ""} within one
                    business day.
                  </>
                )}
              </p>

              {calLink ? (
                <>
                  <CalEmbed calLink={calLink} email={result.email} />

                  <p className="mt-4 text-xs text-muted">
                    Calendar not loading?{" "}
                    <a
                      href={
                        result.email
                          ? `${calUrl}?email=${encodeURIComponent(result.email)}`
                          : calUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-accent hover:text-accent-hover"
                    >
                      Open it in a new tab
                    </a>
                    .
                  </p>
                </>
              ) : (
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h2 className="text-base font-semibold text-ink mb-2">
                    Want a time sooner?
                  </h2>
                  <p className="text-sm text-ink">
                    Email{" "}
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="underline text-accent hover:text-accent-hover"
                    >
                      {SUPPORT_EMAIL}
                    </a>{" "}
                    with a couple of windows that suit you and we&rsquo;ll
                    confirm one straight back.
                  </p>
                </div>
              )}

              <div className="mt-8 rounded-xl border border-line bg-surface p-6">
                <h2 className="text-base font-semibold text-ink mb-2">Your guarantee</h2>
                <p className="text-sm text-muted">
                  If we can&rsquo;t help, we refund in full. If you hire us, the
                  amount you paid credits toward your project.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow text-danger mb-3">
                Could not verify payment
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-h1 text-ink mb-4">
                Something looks off
              </h1>
              <p className="text-lg text-muted mb-8">
                {result.reason === "not_paid"
                  ? "This session isn't marked paid yet. If you just paid, refresh in a moment."
                  : result.reason === "wrong_product"
                    ? "This session isn't for one of our strategy calls. Contact us if you think this is a mistake."
                    : result.reason === "missing"
                      ? "No session ID was provided."
                      : result.reason === "rate_limited"
                        ? "Too many checks in a row from your connection. Try again in a moment."
                        : // The fault is ours, not the customer's: never imply
                          // their payment was wrong when we simply cannot check.
                          result.reason === "unconfigured"
                          ? "We can't confirm this payment right now — that's on our side, not yours. Email support@rumi.build and we'll get your call booked."
                          : // Our catalog and our Stripe account disagree about
                            // what this call costs, or about which one it is.
                            // Either way the buyer did nothing wrong and their
                            // money is safe, so the copy must not read as a
                            // payment problem.
                            result.reason === "mismatch"
                            ? "This payment doesn't match what we charge for that call — a fault at our end, not yours. Your money is safe. Email support@rumi.build and we'll sort it out and get your call booked."
                            : result.reason === "unavailable"
                              ? "Something went wrong on our side — your payment is safe. Refresh in a minute, or email support@rumi.build and we'll get your call booked."
                              : "We couldn't find that checkout session."}
              </p>
              <Link
                href="/book"
                className="btn-primary px-6 py-3 text-sm"
              >
                Try booking again
              </Link>
            </>
          )}
        </div>
      </EnglishMain>
      <Footer />
    </>
  );
}

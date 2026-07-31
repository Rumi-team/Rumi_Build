import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { CalEmbed } from "@/components/cal-embed";
import { getStripe, STRIPE_PRICE_ID_30MIN } from "@/lib/stripe";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { CAL_LINK, CALENDLY_URL } from "@/lib/data";

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
    // Confirm the session bought OUR product, not some unrelated price.
    //
    // FAILS CLOSED when the price id is missing. src/lib/stripe.ts defaults
    // STRIPE_PRICE_ID_30MIN to "" when the env var is unset, and this check
    // used to be `if (!matches && STRIPE_PRICE_ID_30MIN)` — so an unset var
    // turned the whole product check off and any paid Checkout Session on the
    // account rendered the success page, echoing that customer's email address
    // back to whoever pasted the id into the URL. A missing configuration value
    // must never widen what a visitor is allowed to see: with nothing to
    // compare against, the only safe answer is that we cannot verify this
    // session. `unconfigured` is its own reason so the page does not tell a
    // paying customer their session was for the wrong product when the real
    // fault is ours; the server log is where the operator finds out.
    if (!STRIPE_PRICE_ID_30MIN) {
      console.error(
        "STRIPE_PRICE_ID_30MIN is not set — cannot verify which product a checkout session bought; failing closed."
      );
      return { ok: false as const, reason: "unconfigured" as const };
    }
    const lineItems = session.line_items?.data ?? [];
    const matches = lineItems.some((li) => li.price?.id === STRIPE_PRICE_ID_30MIN);
    if (!matches) {
      return { ok: false as const, reason: "wrong_product" as const };
    }
    return {
      ok: true as const,
      email: session.customer_details?.email || null,
      amount: session.amount_total ?? null,
      currency: session.currency || "usd",
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
                One last step — pick your time
              </h1>
              <p className="text-base sm:text-lg text-muted mb-6 sm:mb-8">
                Choose a 30-minute slot on our calendar. We&rsquo;ll send a
                confirmation{result.email ? ` to ${result.email}` : ""} with the
                meeting link.
              </p>

              <CalEmbed calLink={CAL_LINK} email={result.email} />

              <p className="mt-4 text-xs text-muted">
                Calendar not loading?{" "}
                <a
                  href={
                    result.email
                      ? `${CALENDLY_URL}?email=${encodeURIComponent(result.email)}`
                      : CALENDLY_URL
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-accent hover:text-accent-hover"
                >
                  Open it in a new tab
                </a>
                .
              </p>

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
                    ? "This session isn't for our 30-min call. Contact us if you think this is a mistake."
                    : result.reason === "missing"
                      ? "No session ID was provided."
                      : result.reason === "rate_limited"
                        ? "Too many checks in a row from your connection. Try again in a moment."
                        : // The fault is ours, not the customer's: never imply
                          // their payment was wrong when we simply cannot check.
                          result.reason === "unconfigured"
                          ? "We can't confirm this payment right now — that's on our side, not yours. Email support@rumi.build and we'll get your call booked."
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

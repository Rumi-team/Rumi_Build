import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CalEmbed } from "@/components/cal-embed";
import { getStripe, STRIPE_PRICE_ID_30MIN } from "@/lib/stripe";
import { CAL_LINK, CALENDLY_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Payment received | Rumi Build",
  description: "Pick your time for the strategy call.",
};

export const dynamic = "force-dynamic";

async function verifySession(sessionId: string) {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    if (session.payment_status !== "paid") {
      return { ok: false as const, reason: "not_paid" as const };
    }
    // Confirm the session bought OUR product, not some unrelated price
    const lineItems = session.line_items?.data ?? [];
    const matches = lineItems.some((li) => li.price?.id === STRIPE_PRICE_ID_30MIN);
    if (!matches && STRIPE_PRICE_ID_30MIN) {
      return { ok: false as const, reason: "wrong_product" as const };
    }
    return {
      ok: true as const,
      email: session.customer_details?.email || null,
      amount: session.amount_total ?? null,
      currency: session.currency || "usd",
    };
  } catch {
    return { ok: false as const, reason: "invalid" as const };
  }
}

export default async function BookSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  const result = session_id
    ? await verifySession(session_id)
    : { ok: false as const, reason: "missing" as const };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-white text-ink pt-16">
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
      </div>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { CALL_OPTIONS, DEFAULT_CALL_OPTION_ID } from "@/lib/stripe";
import { BookForm } from "./book-form";

// Only the lengths that can actually be bought. An option whose Stripe price
// id is unset — the documented state of STRIPE_PRICE_ID_60MIN at deploy time,
// see TODOS.md — is one /api/checkout answers with a 503. Advertising it here
// would take a buyer through the whole form, the consent tick and the submit
// button before telling them, and leave them no reason to try the other length.
// The 503 stays as the backstop; this stops us asking for the form first.
const SELLABLE = CALL_OPTIONS.filter((o) => o.priceId);

// Nothing configured at all is a different failure and gets different handling:
// there is no other length to steer anyone toward, and CI builds this page with
// neither price id set, so filtering to nothing would render a form with no
// options and no price. Show the catalog and let the 503 own it.
const OFFERED = SELLABLE.length > 0 ? SELLABLE : CALL_OPTIONS;

// The offer, spelled once. src/lib/stripe.ts is the only place the prices are
// authored; the <title>, the search snippet, the social card, the copy below
// and the submit button all read them from there, so a price change is one edit
// and cannot leave a stale figure behind on this page. No count is written into
// the sentence either — "Two lengths:" glued to a derived list is a stale figure
// waiting for the third option.
const OPTION_SENTENCE = OFFERED.map((o) => `${o.label} for ${o.price}`).join(
  ", or ",
);

// What happens after the card is charged, per option rather than as one flat
// promise. An option with no Cal.com event type hands over no calendar link —
// /book/success emails times instead — and this is the page where the money
// changes hands, so it is the page that must not promise the wrong one.
const BOOKABLE = OFFERED.filter((o) => o.calLink);
const AFTER_PAYMENT =
  BOOKABLE.length === OFFERED.length
    ? "After payment, you’ll get a link to pick your time on our calendar. We respond within one business day."
    : BOOKABLE.length === 0
      ? "After payment, we’ll email you times to choose from within one business day."
      : `After payment: ${BOOKABLE.map((o) => o.label).join(
          " and ",
        )} — a link to pick your time on our calendar. Any other length — we’ll email you times. Either way, within one business day.`;

const DEFAULT_ID =
  OFFERED.find((o) => o.id === DEFAULT_CALL_OPTION_ID)?.id ?? OFFERED[0].id;

const TITLE = "Book a strategy call | Rumi AI";
const DESCRIPTION = `A strategy call, ${OPTION_SENTENCE}. Refunded if we can't help, or credited toward your project if we can.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // The root layout's canonical is "/" and is inherited wholesale, so a page
  // without its own declares itself the homepage. Relative, so it resolves
  // through metadataBase and follows the canonical host.
  alternates: { canonical: "/book" },
  // `openGraph` is inherited wholesale for the same reason. This is the page
  // every CTA on the site points at and the only one that takes money, so a
  // share of it attributing to "/" is the most expensive instance of the bug:
  // the link someone pastes into a DM to close a deal previewed as the
  // homepage. Restating openGraph replaces the layout's object, so
  // images/type/siteName have to be restated too.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/book",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630 }],
  },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;

  return (
    <>
      <Nav />
      <EnglishMain className="min-h-screen bg-white text-ink pt-16">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <p className="eyebrow mb-3">
            Book a call
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-h1 text-ink mb-4">
            Book a strategy call
          </h1>
          <p className="text-lg text-muted mb-3">
            A real conversation, not a sales pitch. We ask about your business and
            where you&rsquo;re actually losing time or customers — your website,
            your social presence, how easy you are to find. You leave with a plain
            recommendation and a quote. In English or Farsi.
          </p>
          <p className="text-lg text-ink mb-8">
            Pick a length: {OPTION_SENTENCE}.
          </p>

          {canceled === "1" && (
            <div className="mb-6 rounded-lg border border-line bg-surface p-4 text-sm text-ink">
              Checkout canceled. Your details are still here — try again whenever
              you&rsquo;re ready.
            </div>
          )}

          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mb-8">
            <h2 className="text-base font-semibold text-ink mb-2">
              Your money works for you, either way.
            </h2>
            <ul className="space-y-2 text-sm text-ink">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">→</span>
                If we can&rsquo;t help, we refund you in full. No questions.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">→</span>
                If you hire us, every dollar credits toward your project.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">→</span>
                Have a code? Apply it on the next screen (Stripe).
              </li>
            </ul>
          </div>

          {/* The Stripe price ids are deliberately dropped here: BookForm is a
              client component, so anything handed to it ships to the browser,
              and the browser only ever needs to name the option — /api/checkout
              resolves the id it charges from the same catalog, server side. */}
          <BookForm
            options={OFFERED.map(({ id, minutes, price, label, blurb }) => ({
              id,
              minutes,
              price,
              label,
              blurb,
            }))}
            defaultId={DEFAULT_ID}
          />

          <p className="mt-6 text-xs text-muted">{AFTER_PAYMENT}</p>
        </div>
      </EnglishMain>
      <Footer />
    </>
  );
}

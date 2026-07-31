import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { BookForm } from "./book-form";

const TITLE = "Book a strategy call | Rumi AI";
const DESCRIPTION =
  "30-minute strategy call. $100, refunded if we can't help, or credited toward your project if we can.";

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
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
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
            30-min strategy call — $100
          </h1>
          <p className="text-lg text-muted mb-8">
            A real conversation, not a sales pitch. We ask about your business and
            where you&rsquo;re actually losing time or customers — your website,
            your social presence, how easy you are to find. You leave with a plain
            recommendation and a quote. In English or Farsi.
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

          <BookForm />

          <p className="mt-6 text-xs text-muted">
            After payment, you&rsquo;ll get a link to pick your time on our calendar.
            We respond within one business day.
          </p>
        </div>
      </EnglishMain>
      <Footer />
    </>
  );
}

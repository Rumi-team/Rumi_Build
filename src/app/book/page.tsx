import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { BookForm } from "./book-form";

export const metadata: Metadata = {
  title: "Book a strategy call | Rumi Build",
  description:
    "30-minute strategy call. $100, refunded if we can't help, or credited toward your project if we can.",
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
      <div className="min-h-screen bg-zinc-900 text-zinc-200 pt-16">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
            Book a call
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            30-min strategy call — $100
          </h1>
          <p className="text-lg text-zinc-400 mb-8">
            We map your team, the work eating your day, and which AI employee would
            replace the most cost. You leave with a recommendation and a quote.
          </p>

          {canceled === "1" && (
            <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 text-sm text-zinc-300">
              Checkout canceled. Your details are still here — try again whenever
              you&rsquo;re ready.
            </div>
          )}

          <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-5 mb-8">
            <h2 className="text-base font-semibold text-amber-200 mb-2">
              Your money works for you, either way.
            </h2>
            <ul className="space-y-2 text-sm text-zinc-200">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">→</span>
                If we can&rsquo;t help, we refund you in full. No questions.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">→</span>
                If you hire us, every dollar credits toward your project.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">→</span>
                Have a code? Apply it on the next screen (Stripe).
              </li>
            </ul>
          </div>

          <BookForm />

          <p className="mt-6 text-xs text-zinc-500">
            After payment, you&rsquo;ll get a link to pick your time on our calendar.
            We respond within one business day.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

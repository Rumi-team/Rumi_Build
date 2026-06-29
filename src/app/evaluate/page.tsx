import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EvaluateForm } from "./evaluate-form";

export const metadata: Metadata = {
  title: "Free evaluation | Rumi Build",
  description:
    "Tell us about your business and your current website. We'll show you where local customers are slipping past you — and exactly what we'd build to catch them. Free, no commitment. English, Farsi, or Spanish.",
};

export default function EvaluatePage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-zinc-900 text-zinc-200 pt-16">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
            Free evaluation
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            See what you&rsquo;re invisible to.
          </h1>
          <p className="text-lg text-zinc-400 mb-8">
            Tell us about your business and your current site. We&rsquo;ll show
            you where local customers are slipping past you today &mdash; in the
            languages they actually search and speak &mdash; and exactly what
            we&rsquo;d build to catch them. Free, no commitment. English, Farsi,
            or Spanish.
          </p>

          <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-6 md:p-8 mb-8">
            <h2 className="text-base font-semibold mb-4">What you get</h2>
            <ul className="space-y-3">
              {[
                "A look at where your current site (or lack of one) loses customers — especially non-English searchers",
                "What we'd build and run: site, AI chatbot front desk, customer list, events, payments",
                "A straight answer on what it would take and where to start — no pitch, no obligation",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed"
                >
                  <span className="text-amber-400 mt-0.5 shrink-0" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <EvaluateForm />
        </div>
      </div>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CALENDLY_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "AI Opportunity Audit | Rumi Build",
  description:
    "We analyze your business and show you exactly where you're losing time and money. 3 specific opportunities, dollar values estimated, report delivered in 48 hours.",
};

export default function AuditPage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-zinc-900 text-zinc-200 pt-16">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
            Discover
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            AI Opportunity Audit
          </h1>
          <p className="text-lg text-zinc-400 mb-10">
            We analyze your business and show you exactly where you&apos;re
            losing time and money. You get a report with 3 specific
            opportunities and their estimated dollar value.{" "}
            <span className="font-mono text-amber-400">$250</span>, credited
            toward your first project.
          </p>

          <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">What you get</h2>
            <ul className="space-y-4">
              {[
                "30-minute deep-dive into your workflows and operations",
                "3 specific places your business is leaking money",
                "Dollar value estimated for each opportunity",
                "Actionable report delivered within 48 hours",
                "$250 fee credited toward your first project",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base text-zinc-300"
                >
                  <span className="text-amber-400 mt-1">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-800/30 p-8 mb-8">
            <h2 className="text-xl font-semibold mb-3">How it works</h2>
            <ol className="space-y-3 text-base text-zinc-400">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                  1
                </span>
                <span>
                  <strong className="text-zinc-200">Book a call</strong> — 30
                  minutes. We ask about your business, your team, your biggest
                  time drains, and the tools you use.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                  2
                </span>
                <span>
                  <strong className="text-zinc-200">We analyze</strong> — Our
                  team maps your workflows and identifies where AI can save the
                  most time and money.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                  3
                </span>
                <span>
                  <strong className="text-zinc-200">
                    You get the report
                  </strong>{" "}
                  — 3 specific opportunities, each with an estimated dollar
                  value. Delivered within 48 hours.
                </span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-amber-400 px-8 py-4 text-center text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Book Your AI Audit ($250)
            </a>
          </div>

          <p className="text-xs text-zinc-500">
            The $250 audit fee is fully credited toward any Launch or Managed
            engagement. If we can&apos;t find at least $1,000/month in savings,
            you pay nothing.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

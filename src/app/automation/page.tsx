import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CALENDLY_URL, STRIPE_URLS } from "@/lib/data";

export const metadata: Metadata = {
  title: "AI Automation Package — $1,500 | Rumi Build",
  description:
    "Multi-workflow automation build. Up to 3 connected AI workflows delivered in 2 weeks.",
};

export default function AutomationPage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-zinc-900 text-zinc-200 pt-16">
      <div className="mx-auto max-w-2xl px-6 py-20">

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          AI Automation Package
        </h1>
        <p className="text-lg text-zinc-400 mb-10">
          Up to 3 connected AI workflows built and deployed in 2 weeks. For
          businesses that need multiple processes automated and working together.
        </p>

        <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">What&apos;s included</h2>
          <ul className="space-y-4">
            {[
              "Up to 3 connected AI workflows that work together as a system",
              "2-week build timeline with daily progress updates",
              "All workflows deployed and accessible via live URLs",
              "Loom walkthroughs for each workflow showing how everything connects",
              "Team training session so your staff can use the system independently",
              "Source code delivered in a GitHub repository",
              "60 days of post-launch support including bug fixes and adjustments",
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
                <strong className="text-zinc-200">Discovery call</strong> — Free
                30-minute call to map out your workflows and identify which 2-3
                processes to automate.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                2
              </span>
              <span>
                <strong className="text-zinc-200">Scope agreement</strong> — We
                define the exact workflows, how they connect, and what success
                looks like.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                3
              </span>
              <span>
                <strong className="text-zinc-200">Payment</strong> — $1,500
                one-time payment starts the 2-week build.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                4
              </span>
              <span>
                <strong className="text-zinc-200">
                  Build, train &amp; deliver
                </strong>{" "}
                — We build all workflows, train your team, and provide 60 days
                of support.
              </span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <a
            href={STRIPE_URLS.automation}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-amber-400 px-8 py-4 text-center text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Pay $1,500 — Get Started
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-700 px-8 py-4 text-center text-base text-zinc-300 transition hover:border-zinc-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Book Discovery Call First
          </a>
        </div>

        <p className="text-xs text-zinc-500">
          The specific workflows and how they connect are determined during the
          discovery call and scope agreement. Payment starts the 2-week build.
          Up to 3 connected workflows per package.
        </p>
      </div>
    </div>
      <Footer />
    </>
  );
}

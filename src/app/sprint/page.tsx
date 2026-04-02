import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Workflow Sprint — $500 | Rumi Build",
  description:
    "5-day focused build sprint. One AI automation workflow delivered as working software.",
};

const STRIPE_URL = "https://buy.stripe.com/aFa5kwgeR8ae5AL7KA0RG00";
const CALENDLY_URL = "https://cal.com/rumi.team/30min";

export default function SprintPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <a
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition mb-8 inline-block"
        >
          &larr; Back to rumi.build
        </a>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          AI Workflow Sprint
        </h1>
        <p className="text-lg text-zinc-400 mb-10">
          One AI automation workflow, delivered as working software in 5
          business days. You see progress daily and get a finished product you
          can use immediately.
        </p>

        <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">What&apos;s included</h2>
          <ul className="space-y-4">
            {[
              "One AI-powered workflow built and deployed for your specific use case",
              "5-day build sprint with daily progress updates so you always know where things stand",
              "Working software delivered to a live URL you can use immediately",
              "5-minute Loom walkthrough showing exactly how everything works",
              "Source code delivered in a GitHub repository if you want it",
              "30 days of post-launch bug-fix support",
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
                30-minute call to understand your business and identify the
                workflow to automate.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                2
              </span>
              <span>
                <strong className="text-zinc-200">Payment</strong> — $500
                one-time payment starts the sprint.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                3
              </span>
              <span>
                <strong className="text-zinc-200">Build</strong> — We build
                your automation over 5 business days with daily updates.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                4
              </span>
              <span>
                <strong className="text-zinc-200">Deliver</strong> — Working
                software deployed, walkthrough recorded, 30 days of support
                begin.
              </span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <a
            href={STRIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-amber-400 px-8 py-4 text-center text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Pay $500 — Start Sprint
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
          The specific workflow to be automated is determined during the
          discovery call. Payment starts the 5-day sprint. One workflow per
          sprint.
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full AI Integration — Deposit | Rumi Build",
  description:
    "End-to-end AI automation for your business. Custom-scoped, delivered in 4 weeks.",
};

const STRIPE_URL = "https://buy.stripe.com/cNi6oAe6J8ae4wHaWM0RG02";
const CALENDLY_URL = "https://cal.com/rumi.team/30min";

export default function DepositPage() {
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
          Full AI Integration
        </h1>
        <p className="text-lg text-zinc-400 mb-10">
          End-to-end AI automation for your business. A dedicated team builds,
          deploys, and supports a custom solution tailored to your operations.
        </p>

        <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            What&apos;s included
          </h2>
          <ul className="space-y-4">
            {[
              "Custom-scoped project designed around your specific workflows and pain points",
              "4-week build timeline with dedicated engineering resources",
              "Dedicated Slack channel for real-time communication throughout the project",
              "Full deployment to your infrastructure or ours",
              "Team training session so your staff can use and manage the system independently",
              "Comprehensive documentation covering architecture, usage, and maintenance",
              "90 days of post-launch support including bug fixes and adjustments",
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
                <strong className="text-zinc-200">Discovery call</strong> — We
                meet for 30 minutes to understand your business, workflows, and
                goals.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                2
              </span>
              <span>
                <strong className="text-zinc-200">Scope agreement</strong> — We
                define the exact deliverables, timeline, and success criteria
                together.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                3
              </span>
              <span>
                <strong className="text-zinc-200">Deposit</strong> — A $5,000
                deposit kicks off the project. Final pricing is based on the
                agreed scope.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                4
              </span>
              <span>
                <strong className="text-zinc-200">Build &amp; deliver</strong>{" "}
                — We build, test, deploy, train your team, and support for 90
                days.
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
            Pay $5,000 Deposit
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
          The deposit secures your project slot and starts the engagement.
          Exact deliverables, timeline, and final pricing are determined during
          the discovery call and scope agreement. The deposit is applied toward
          the total project cost.
        </p>
      </div>
    </div>
  );
}

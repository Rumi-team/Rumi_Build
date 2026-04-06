import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CALENDLY_URL, STRIPE_URLS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Voice AI Agent — $500 Setup | Rumi Build",
  description:
    "AI phone agent deployed in 1 week. Answers calls 24/7, books appointments, handles triage. 30+ languages.",
};

export default function SprintPage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-zinc-900 text-zinc-200 pt-16">
      <div className="mx-auto max-w-2xl px-6 py-20">

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Voice AI Agent
        </h1>
        <p className="text-lg text-zinc-400 mb-10">
          AI phone agent that answers calls 24/7, books appointments, and
          handles triage. Deployed in 1 week. Then{" "}
          <span className="font-mono text-amber-400">$250/mo</span> vs $3-4K/mo
          for a receptionist.
        </p>

        <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">What&apos;s included</h2>
          <ul className="space-y-4">
            {[
              "24/7 AI phone answering with natural conversation",
              "Appointment booking integrated with your calendar",
              "Emergency triage and smart call routing",
              "30+ languages, auto-detected in seconds",
              "Automated follow-up calls and reminders",
              "30 days of post-launch support",
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
                30-minute call to understand your business, call volume, and
                booking workflow.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                2
              </span>
              <span>
                <strong className="text-zinc-200">Payment</strong> — $500
                one-time setup fee starts the deployment.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                3
              </span>
              <span>
                <strong className="text-zinc-200">Build</strong> — We configure
                your AI agent, integrate with your calendar, and test
                thoroughly.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                4
              </span>
              <span>
                <strong className="text-zinc-200">Go live</strong> — Your AI
                agent starts answering calls. 30 days of support included.
              </span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <a
            href={STRIPE_URLS.sprint}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-amber-400 px-8 py-4 text-center text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Pay $500 — Get Started
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
          $500 is a one-time setup fee. After deployment, the AI agent runs on a
          $250-$2K/month subscription depending on call volume and features.
          Details are finalized during the discovery call.
        </p>
      </div>
    </div>
      <Footer />
    </>
  );
}

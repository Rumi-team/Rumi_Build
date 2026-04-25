import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CALENDLY_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hiring Assessment | Rumi Build",
  description:
    "Free 30-minute hiring assessment. We map your workflows, identify which AI employees would have the biggest impact on your payroll, and tell you how fast we can deploy them.",
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
            Hiring Assessment
          </h1>
          <p className="text-lg text-zinc-400 mb-10">
            A 30-minute call where we look at your team, your tools, and the
            work that&rsquo;s eating your day. We tell you which AI employee
            would have the biggest impact on your payroll, and how fast we can
            have them on the job. Free.
          </p>

          <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">What you get</h2>
            <ul className="space-y-4">
              {[
                "30-minute call mapping the work your team does today",
                "Three specific roles where an AI employee would replace cost",
                "Realistic estimate of payroll impact and deployment timeline",
                "Recommendation: which Chief to hire first, and why",
                "No commitment, no obligation",
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
                  <strong className="text-zinc-200">Book the call</strong> — 30
                  minutes. We ask about your team, your biggest time drains,
                  and the tools you use.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                  2
                </span>
                <span>
                  <strong className="text-zinc-200">We assess the roles</strong>{" "}
                  — which work an AI employee can take on, what stays human,
                  and what the payroll math actually looks like.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-bold text-zinc-900">
                  3
                </span>
                <span>
                  <strong className="text-zinc-200">You get a recommendation</strong>{" "}
                  — which Chief to hire first, what it would take to deploy,
                  and a quote you can decide on at your own pace.
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
              Book Your Hiring Assessment →
            </a>
          </div>

          <p className="text-xs text-zinc-500">
            We don&rsquo;t charge for the assessment. If we can&rsquo;t identify
            at least one role where an AI employee earns its cost back inside
            three months, we tell you that too.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

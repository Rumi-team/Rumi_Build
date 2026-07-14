import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Hiring Assessment | Rumi AI",
  description:
    "30-minute hiring assessment. $100, refunded if we can't help — credited toward your project if we can. We map your workflows, identify which AI employees would have the biggest impact on your payroll, and tell you how fast we can deploy them.",
};

export default function AuditPage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-white text-ink pt-16">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <p className="eyebrow mb-3">
            Discover
          </p>

          <h1 className="text-4xl md:text-5xl font-black tracking-h1 text-ink mb-4">
            Hiring Assessment
          </h1>
          <p className="text-lg text-muted mb-10">
            A 30-minute call where we look at your team, your tools, and the
            work that&rsquo;s eating your day. We tell you which AI employee
            would have the biggest impact on your payroll, and how fast we can
            have them on the job. $100 — refunded if we can&rsquo;t help, or
            credited toward your project if we can.
          </p>

          <div className="card rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-ink mb-6">What you get</h2>
            <ul className="space-y-4">
              {[
                "30-minute call mapping the work your team does today",
                "Three specific roles where an AI employee would replace cost",
                "Realistic estimate of payroll impact and deployment timeline",
                "Recommendation: which Chief to hire first, and why",
                "Refunded if we can’t help — or credited toward your project if we can",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base text-muted"
                >
                  <span className="text-accent mt-1">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-ink mb-3">How it works</h2>
            <ol className="space-y-3 text-base text-muted">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  1
                </span>
                <span>
                  <strong className="text-ink">Book the call</strong> — 30
                  minutes. We ask about your team, your biggest time drains,
                  and the tools you use.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  2
                </span>
                <span>
                  <strong className="text-ink">We assess the roles</strong>{" "}
                  — which work an AI employee can take on, what stays human,
                  and what the payroll math actually looks like.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  3
                </span>
                <span>
                  <strong className="text-ink">You get a recommendation</strong>{" "}
                  — which Chief to hire first, what it would take to deploy,
                  and a quote you can decide on at your own pace.
                </span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              href="/book"
              className="btn-primary px-8 py-4 text-center text-base"
            >
              Book Your Hiring Assessment →
            </a>
          </div>

          <p className="text-xs text-muted">
            $100 for the call. If we can&rsquo;t identify at least one role
            where an AI employee earns its cost back inside three months, we
            refund you in full. If we can, the $100 credits toward your
            project.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

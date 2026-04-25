import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionCTA } from "@/components/section-cta";
import { CALENDLY_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hiring an AI Employee — Rumi Build",
  description:
    "Like any other hire, the cost of an AI employee depends on the role, the workload, and the integrations. Book a 30-minute call and we'll size it together.",
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="py-20 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              How hiring works
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              Like any other hire,{" "}
              <span className="text-amber-400">it depends on the role.</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-10">
              The cost of an AI employee depends on what you need them to do —
              call volume, integrations, languages, escalation paths, the depth
              of the back office work. We size it together on a 30-minute call,
              quote a fixed setup, and a flat monthly. No surprises.
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-amber-400 px-8 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Book a 30-minute hiring call →
            </a>
            <p className="mt-4 text-sm text-zinc-500">
              No commitment. We&rsquo;ll show you exactly what an AI employee
              would cost to deploy in your business.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 border-t border-zinc-800">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">
              What you actually get
            </h2>
            <ul className="space-y-4">
              {[
                "A specialist trained on your context — your tone, your tools, your data.",
                "Setup in 1 to 3 weeks. Daily progress updates while we build.",
                "Connections to the systems you already use (CRM, calendar, accounting, support).",
                "60 days of post-launch support — bug fixes, tuning, and onboarding for your team.",
                "Ongoing managed plan optional: monitoring, optimization, additional Chief deployments.",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-base text-zinc-300 leading-relaxed"
                >
                  <span className="text-green-400 mt-1 shrink-0" aria-hidden>
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SectionCTA
          title="Ready to interview your first AI hire?"
          description="30 minutes. We learn the role, you learn the candidate."
        />
      </main>
      <Footer />
    </>
  );
}

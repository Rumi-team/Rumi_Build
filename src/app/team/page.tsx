import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { StatsBar } from "@/components/stats-bar";
import { SectionCTA } from "@/components/section-cta";
import { TEAM } from "@/lib/data";

export const metadata: Metadata = {
  title: "Team — Rumi Build",
  description:
    "Meet the team behind rumi.build. AI engineers and product builders who've shipped systems at Business Insider, Spotter, and Imperial College London.",
};

function Avatar({ name, photo }: { name: string; photo: string }) {
  return (
    <img
      src={photo}
      alt={name}
      className="h-20 w-20 rounded-full object-cover border-2 border-zinc-700"
    />
  );
}

export default function TeamPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl">
            <PageHeader
              overline="Team"
              title="Built by people who&apos;ve done it at scale"
              description="We're a team of AI engineers and product builders who've shipped systems processing millions of daily predictions at companies worth billions. Now we build AI for growing businesses."
            />
          </div>
        </section>

        {/* Team Cards */}
        <section className="pb-20 px-6">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex flex-col rounded-xl border border-zinc-700 bg-zinc-800/30 p-6"
              >
                <div className="flex flex-col items-center text-center mb-5">
                  <Avatar name={member.name} photo={member.photo} />
                  <span className="inline-block mt-3 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-semibold text-zinc-900">
                    {member.role}
                  </span>
                  <p className="text-base font-semibold mt-1.5">
                    {member.name}
                  </p>
                </div>
                <ul className="space-y-2 mt-auto">
                  {member.experience.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <span className="text-amber-400 mt-0.5 shrink-0">
                        &#8226;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <StatsBar />

        {/* Proof of Work */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              Proof of work
            </p>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              We ship our own AI products
            </h2>
            <p className="text-zinc-400 mb-10 max-w-xl">
              We don&apos;t just consult. We build and operate AI systems
              ourselves.
            </p>

            <div className="space-y-5">
              <a
                href="https://www.rumi.team"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-zinc-700 bg-zinc-800/30 p-8 transition hover:border-amber-400/40"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-2xl">
                    &#x1F399;&#xFE0F;
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-400 transition">
                      AI Coaching App
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                      Built a full voice AI product from zero to production.
                      Real-time speech processing, personalized coaching engine
                      with reinforcement learning, and a 20-step behavior change
                      program. Shipped on iOS and web, handling live voice
                      sessions at scale. The same AI, voice, and real-time
                      infrastructure we deploy for our clients.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Voice AI",
                        "Real-time Processing",
                        "Reinforcement Learning",
                        "iOS + Web",
                        "GCP Cloud Run",
                        "Vercel",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>

              <a
                href="https://www.rumiagent.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-zinc-700 bg-zinc-800/30 p-8 transition hover:border-amber-400/40"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-2xl">
                    &#x1F916;
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-400 transition">
                      Agentic AI Platform
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                      Built an autonomous AI decision engine that optimizes user
                      retention across channels. Thompson Sampling, multi-armed
                      bandits, and LLM-powered message personalization. 12-page
                      analytics dashboard with cohort analysis, A/B testing, and
                      real-time decision monitoring. The same data-driven
                      automation stack we bring to client projects.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Agentic AI",
                        "Thompson Sampling",
                        "LLM Pipeline",
                        "Analytics Dashboard",
                        "FastAPI",
                        "Supabase",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <SectionCTA />
      </main>
      <Footer />
    </>
  );
}

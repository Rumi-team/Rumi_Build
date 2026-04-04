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
                  <p className="text-xs text-zinc-500">{member.school}</p>
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

            <div className="rounded-xl border border-zinc-700 bg-zinc-800/30 p-8 flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-2xl">
                &#x1F30A;
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Rumi AI Coaching
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  A voice AI coaching app that listens, surfaces behavioral
                  patterns, and follows up until change sticks. Real-time voice
                  processing, reinforcement learning, 20-step transformation
                  program. Built on LiveKit, deployed on GCP and Vercel. iOS +
                  Web.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Voice AI",
                    "LiveKit",
                    "Reinforcement Learning",
                    "Mobile + Web",
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
          </div>
        </section>

        <SectionCTA />
      </main>
      <Footer />
    </>
  );
}

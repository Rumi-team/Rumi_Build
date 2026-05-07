import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Workplace — How We Work at Rumi Build",
  description:
    "Remote-first AI agency. Async-by-default, outcome-based, deep-work mornings. We ship in days, not roadmaps in months.",
  openGraph: {
    title: "Workplace — How We Work at Rumi Build",
    description:
      "Remote-first AI agency. Async-by-default, outcome-based, deep-work mornings. We ship in days, not roadmaps in months.",
    url: "https://rumi.build/workplace",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workplace — How We Work at Rumi Build",
    description:
      "Remote-first AI agency. Async-by-default, outcome-based, deep-work mornings.",
    images: ["/og-image.png"],
  },
};

const PRINCIPLES = [
  {
    title: "Remote, fully",
    icon: "◎",
    body:
      "Every role is remote. No HQ to commute to, no relocation required. We hire wherever the talent is — California, Tehran, London, Toronto, anywhere with a stable connection.",
  },
  {
    title: "Async by default",
    icon: "↻",
    body:
      "Written work beats standing meetings. Decisions live in docs and PRs so they survive the time-zone gap. We meet when a meeting is the cheapest path — not the default one.",
  },
  {
    title: "Outcomes over hours",
    icon: "✓",
    body:
      "No timesheets, no seat time. We measure shipped work — features in production, clients onboarded, problems solved. If the work is done, the day is done.",
  },
  {
    title: "Deep-work mornings",
    icon: "◐",
    body:
      "Mornings are protected blocks for engineering and design. Calls and client work cluster in the afternoon. We defend the calendar so the calendar can't defend itself.",
  },
  {
    title: "Ship-day cadence",
    icon: "→",
    body:
      "We bias toward shipping. Days, not roadmaps in months. Small bets, fast iteration, real artifacts in front of clients within the first week.",
  },
  {
    title: "Trust, then tools",
    icon: "◇",
    body:
      "We hire people who can run their own loop. Tooling is there to amplify good judgment, not replace it. If you need a manager to make a decision, this isn't the right team.",
  },
];

const WEEK = [
  {
    num: 1,
    title: "Monday — Plan in writing",
    desc:
      "Each engineer posts a short written plan: the one or two things shipping this week, the blockers, and the decision points that need eyes. No standups.",
  },
  {
    num: 2,
    title: "Tuesday–Thursday — Build",
    desc:
      "Deep-work mornings. Client and review windows in the afternoon. Pull requests over status updates. Demos over slide decks.",
  },
  {
    num: 3,
    title: "Friday — Ship and reflect",
    desc:
      "Ship what's ready. Write a one-paragraph retro: what landed, what slipped, what we learned. The retro is the meeting.",
  },
];

const BENEFITS = [
  {
    title: "Work from anywhere",
    body:
      "Fully remote, fully distributed. No mandatory hours, no relocation, no return-to-office. Live where you live.",
  },
  {
    title: "No-meeting mornings",
    body:
      "Calendars are protected before noon local time. Deep work first, calls second. We treat focus as the scarce resource.",
  },
  {
    title: "Outcome-based work",
    body:
      "We measure shipped artifacts, not seat time. If you ship the week's outcomes by Wednesday, the rest of the week is yours.",
  },
];

export default function WorkplacePage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative px-6 pt-20 pb-16 overflow-hidden">
          <div className="hero-glow" />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full border border-zinc-700 bg-zinc-800/80 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-amber-400 mb-6 backdrop-blur-sm">
              Workplace · How we work
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Remote-first.
              <br />
              Async-by-default.
              <br />
              <span className="text-amber-400">Outcomes ship in days.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed mb-10">
              Rumi is a distributed AI agency. We work across time zones, write
              before we meet, and protect deep-work mornings.{" "}
              <span className="text-zinc-200 font-medium">
                We measure outcomes, not hours.
              </span>
            </p>

            <a
              href="/book"
              className="inline-block rounded-lg bg-amber-400 px-8 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Work with us →
            </a>
            <p className="mt-4 text-sm text-zinc-500">
              30-minute call. We learn the problem, you decide the fit.
            </p>
          </div>
        </section>

        {/* Policy in plain English */}
        <section className="px-6 py-20 border-t border-zinc-800">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              The policy, in plain English
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Every role is remote. Every meeting is optional.
            </h2>
            <p className="text-base md:text-lg text-zinc-300 leading-relaxed mb-4">
              We&rsquo;re a small, senior team distributed across time zones. We
              don&rsquo;t have a headquarters. We don&rsquo;t expect anyone to
              relocate. We don&rsquo;t track hours.
            </p>
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
              What we expect instead: written thinking, shipped work, and a bias
              toward action. If the work is done well and the client is happy,
              the rest is up to you.
            </p>
          </div>
        </section>

        {/* Operating principles */}
        <section className="px-6 py-20 border-t border-zinc-800">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              Operating principles
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 max-w-3xl">
              Six principles. They run the team when no one&rsquo;s watching.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-zinc-700 bg-zinc-800/40 p-6"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-2xl text-amber-400 mb-5"
                    aria-hidden
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{p.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* A typical week */}
        <section className="px-6 py-20 border-t border-zinc-800 bg-zinc-900/40">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              A typical week
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
              Plan in writing. Build in the morning. Ship on Friday.
            </h2>

            <ol className="space-y-6">
              {WEEK.map((step) => (
                <li
                  key={step.num}
                  className="rounded-2xl border border-zinc-700 bg-zinc-800/40 p-6 md:p-8 flex gap-6 md:gap-8"
                >
                  <span
                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-amber-400 font-mono text-base md:text-lg font-bold text-zinc-900 shrink-0"
                    aria-hidden
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-base text-zinc-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-6 py-20 border-t border-zinc-800">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              What you get
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 max-w-3xl">
              Three things we don&rsquo;t compromise on.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-zinc-700 bg-zinc-800/40 p-6"
                >
                  <h3 className="text-lg font-semibold mb-3 text-amber-400">
                    {b.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where we are */}
        <section className="px-6 py-20 border-t border-zinc-800">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              Where we are
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Designed in California. Built worldwide.
            </h2>
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
              Our management team is based across the US, the UK, and Iran. Our
              engineers and designers are in another half-dozen cities. We pick
              talent over geography, every time.
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-6 py-24 border-t border-zinc-800">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              Want to see how this works in practice?
              <br />
              <span className="text-amber-400">Book a call.</span>
            </h2>

            <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl mx-auto">
              30 minutes. We learn what you&rsquo;re building, you see how we
              work. No commitment.
            </p>

            <a
              href="/book"
              className="inline-block rounded-lg bg-amber-400 px-8 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Book a call →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

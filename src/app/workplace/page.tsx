import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";

// Deliberately unindexed hiring copy — it is kept out of the sitemap, and this
// is what actually keeps it out of the index (leaving a URL out of the sitemap
// only stops advertising it). The OG/Twitter cards below stay: the page is
// meant to be shared in a DM or a job post, just not to rank.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  // The root layout's canonical is "/" and is inherited wholesale, so without
  // this the page declares itself the homepage. Relative, so it resolves
  // through metadataBase and follows the canonical host.
  alternates: { canonical: "/workplace" },
  title: "Workplace — How We Work at Rumi AI",
  description:
    "Remote-first AI agency. Async-by-default, outcome-based, deep-work mornings. We ship in days, not roadmaps in months.",
  openGraph: {
    title: "Workplace — How We Work at Rumi AI",
    description:
      "Remote-first AI agency. Async-by-default, outcome-based, deep-work mornings. We ship in days, not roadmaps in months.",
    // Relative, like every other canonical and og:url on the site: it resolves
    // through metadataBase and follows the canonical host, rather than pinning
    // a domain a sibling site also ships under.
    url: "/workplace",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workplace — How We Work at Rumi AI",
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
      "We hire people who can run their own loop. Tooling is there to amplify good judgment, not stand in for it. If you need a manager to make a decision, this isn't the right team.",
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
      <EnglishMain className="pt-16">
        {/* Hero */}
        <section className="relative px-6 pt-20 pb-16 overflow-hidden bg-white">
          <div className="hero-glow" />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="eyebrow mb-6 inline-block">
              Workplace · How we work
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-h1 leading-[1.1] text-ink mb-6">
              Remote-first.
              <br />
              Async-by-default.
              <br />
              <span className="text-accent">Outcomes ship in days.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted leading-relaxed mb-10">
              Rumi is a distributed AI agency. We work across time zones, write
              before we meet, and protect deep-work mornings.{" "}
              <span className="text-ink font-medium">
                We measure outcomes, not hours.
              </span>
            </p>

            <a
              href="/book"
              className="btn-primary inline-block px-8 py-3.5 text-base"
            >
              Work with us →
            </a>
            <p className="mt-4 text-sm text-muted">
              30-minute call. We learn the problem, you decide the fit.
            </p>
          </div>
        </section>

        {/* Policy in plain English */}
        <section className="px-6 py-20 border-t border-line">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow mb-3">
              The policy, in plain English
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-6">
              Every role is remote. Every meeting is optional.
            </h2>
            <p className="text-base md:text-lg text-muted leading-relaxed mb-4">
              We&rsquo;re a small, senior team distributed across time zones. We
              don&rsquo;t have a headquarters. We don&rsquo;t expect anyone to
              relocate. We don&rsquo;t track hours.
            </p>
            <p className="text-base md:text-lg text-muted leading-relaxed">
              What we expect instead: written thinking, shipped work, and a bias
              toward action. If the work is done well and the client is happy,
              the rest is up to you.
            </p>
          </div>
        </section>

        {/* Operating principles */}
        <section className="px-6 py-20 border-t border-line">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-3">
              Operating principles
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-12 max-w-3xl">
              Six principles. They run the team when no one&rsquo;s watching.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.title}
                  className="card p-6"
                >
                  <div
                    className="icon-badge text-2xl mb-5"
                    aria-hidden
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-3">{p.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* A typical week */}
        <section className="px-6 py-20 border-t border-line bg-surface">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow mb-3">
              A typical week
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-12">
              Plan in writing. Build in the morning. Ship on Friday.
            </h2>

            <ol className="space-y-6">
              {WEEK.map((step) => (
                <li
                  key={step.num}
                  className="card p-6 md:p-8 flex gap-6 md:gap-8"
                >
                  {/* accent-hover, not accent: white on #059669 fails WCAG AA.
                      Buttons keep white-on-accent; numerals like this do not. */}
                  <span
                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-accent-hover text-base md:text-lg font-bold text-white shrink-0"
                    aria-hidden
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-ink mb-2">
                      {step.title}
                    </h3>
                    <p className="text-base text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-6 py-20 border-t border-line">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-3">
              What you get
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-12 max-w-3xl">
              Three things we don&rsquo;t compromise on.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold mb-3 text-accent">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where we are */}
        <section className="px-6 py-20 border-t border-line">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow mb-3">
              Where we are
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-6">
              Designed in California. Built worldwide.
            </h2>
            <p className="text-base md:text-lg text-muted leading-relaxed">
              Our management team is based across the US, the UK, and Iran. Our
              engineers and designers are in another half-dozen cities. We pick
              talent over geography, every time.
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-navy px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-h2 leading-[1.1] text-white mb-6">
              Want to see how this works in practice?
              <br />
              <span className="text-accent">Book a call.</span>
            </h2>

            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl mx-auto">
              30 minutes. We learn what you&rsquo;re building, you see how we
              work. No commitment.
            </p>

            <a
              href="/book"
              className="btn-primary inline-block px-8 py-3.5 text-base"
            >
              Book a call →
            </a>
          </div>
        </section>
      </EnglishMain>
      <Footer />
    </>
  );
}

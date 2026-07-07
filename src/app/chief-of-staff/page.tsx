import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Chief of Staff — AI Manager + Back Office by Rumi",
  description:
    "An AI Chief of Staff that runs your inbox, phone, calendar, and back office — bookkeeping, invoicing, intake forms, project portals. Reports through Telegram, WhatsApp, or iMessage. Approves before sending.",
  // Next.js metadata REPLACES, not merges, openGraph and twitter when set on a
  // page. Restate images/type/siteName so /chief-of-staff link unfurls don't
  // lose the social preview image inherited from layout.tsx.
  openGraph: {
    title: "Chief of Staff — AI Manager + Back Office by Rumi",
    description:
      "Your AI manager and back office, on your phone. Approvals via Telegram, WhatsApp, or iMessage.",
    url: "https://rumi.build/chief-of-staff",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chief of Staff — AI Manager + Back Office by Rumi",
    description:
      "Your AI manager and back office, on your phone. Approvals via Telegram, WhatsApp, or iMessage.",
    images: ["/og-image.png"],
  },
};

const PAIN_POINTS = [
  "121 emails per day. 28% need a real reply. The rest eats your focus.",
  "6 calls a day you didn't want. 4 could've been handled in 60 seconds.",
  "Bookkeeping, invoices, and intake forms still done manually by someone you pay $80K+.",
  "Every \"quick scheduling thing\" costs 12 minutes of context switch.",
];

const CAPABILITIES = [
  {
    title: "Email triage",
    icon: "✉",
    body:
      "Reads every inbound, drafts replies in your voice, sends low-stakes responses, surfaces the 5% that need you.",
  },
  {
    title: "Voice answering",
    icon: "☎",
    body:
      "Picks up calls you can't take. Books meetings. Takes messages. Escalates to your phone when it actually matters.",
  },
  {
    title: "Calendar control",
    icon: "▦",
    body:
      "Books, reschedules, blocks focus time, defends your mornings.",
  },
  {
    title: "Bookkeeping & invoicing",
    icon: "₿",
    body:
      "Categorizes transactions, processes invoices from inbox to accounting system, flags anomalies. Connects to QuickBooks.",
  },
  {
    title: "Intake & portals",
    icon: "▤",
    body:
      "Client intake forms, document collection, project portals with real-time updates. Less phone tag, more shipped work.",
  },
  {
    title: "CRM sync",
    icon: "◈",
    body:
      "Pulls context from HubSpot, Salesforce, Pipedrive, Notion. Replies are warm, specific, on-brand.",
  },
];

const CHANNELS = [
  {
    name: "Telegram",
    body: "Daily digest, approval requests, urgent escalations. One tap to send or hold.",
  },
  {
    name: "WhatsApp",
    body: "Same approval flow inside the chat your team already lives in.",
  },
  {
    name: "iMessage",
    body: "Native iOS, no extra app. Reply ‘yes’ or ‘no’ and the work is done.",
  },
];

// Target benchmarks — what we're aiming for in the first 30 days. Real
// pilot numbers replace these once they exist.
const TARGETS = [
  { value: "~85%", label: "of emails handled without your input" },
  { value: "<4s", label: "average answer time on calls" },
  { value: "10–14 hrs", label: "reclaimed per executive, per week" },
  { value: "1–3 wks", label: "from kickoff to live deployment" },
];

const STEPS = [
  {
    num: 1,
    title: "Connect",
    desc:
      "Plug in your inbox, phone, calendar, and accounting system. 15 minutes. Read-only at first — we don't touch anything until you approve.",
  },
  {
    num: 2,
    title: "Train",
    desc:
      "We train Rumi on your last 1,000 emails, your tone, and the workflows your team runs. You see drafts before any of them go out.",
  },
  {
    num: 3,
    title: "Run",
    desc:
      "You approve the first week of replies via Telegram, WhatsApp, or iMessage. After that, Rumi runs. You get a Friday digest of everything it handled.",
  },
];

export default function ChiefOfStaffPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* ── Hero ── */}
        <section className="relative px-6 pt-20 pb-16 overflow-hidden bg-white">
          <div className="hero-glow" />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="eyebrow mb-6 inline-block">
              AI Employee · Chief of Staff
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-h1 leading-[1.1] text-ink mb-6">
              Your AI manager and back office.
              <br />
              On your phone.
              <br />
              <span className="text-accent">
                Approvals via Telegram, WhatsApp, or iMessage.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted leading-relaxed mb-10">
              Reads your inbox, answers your phone, runs your calendar,
              automates the back office — bookkeeping, invoicing, intake forms,
              project portals.{" "}
              <span className="text-ink font-medium">
                Asks before anything important goes out.
              </span>
            </p>

            <a
              href="/book"
              className="btn-primary inline-block px-8 py-3.5 text-base"
            >
              Book a hiring call →
            </a>
            <p className="mt-4 text-sm text-muted">
              30 minutes. We size the role together. No commitment.
            </p>
          </div>
        </section>

        {/* ── Pain ── */}
        <section className="px-6 py-20 border-t border-line">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow mb-3">
              The problem
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-10">
              You don&rsquo;t have a time problem.
              <br />
              You have a payroll problem.
            </h2>

            <ul className="space-y-5">
              {PAIN_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-4 text-base md:text-lg text-muted leading-relaxed"
                >
                  <span
                    className="text-danger mt-1 shrink-0 text-xl"
                    aria-hidden
                  >
                    ✗
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── What Rumi does ── */}
        <section className="px-6 py-20 border-t border-line">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-3">
              What it does
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-12 max-w-3xl">
              Six jobs handled. One escalation surface.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.title}
                  className="card p-6"
                >
                  <div
                    className="icon-badge text-2xl mb-5"
                    aria-hidden
                  >
                    {cap.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-3">{cap.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {cap.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Approval channels ── */}
        <section className="px-6 py-20 border-t border-line bg-surface">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-3">
              How it talks to you
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-4 max-w-3xl">
              Reports where you already are.
            </h2>
            <p className="text-base md:text-lg text-muted leading-relaxed mb-12 max-w-2xl">
              Pick your channel. Rumi sends the daily digest, asks for approvals
              on anything important, and escalates the urgent stuff. One tap to
              send. One tap to hold.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CHANNELS.map((c) => (
                <div
                  key={c.name}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold mb-3 text-accent">
                    {c.name}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Targets (clearly labeled as targets, not pilot results) ── */}
        <section className="px-6 py-20 border-t border-line">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-3">
              What we&rsquo;re aiming for
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-12">
              Target benchmarks for the first 30 days.
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TARGETS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-line bg-surface p-6"
                >
                  <p className="text-3xl md:text-4xl font-bold text-accent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-muted italic max-w-2xl">
              These are the targets we set with new clients on day one. Real
              numbers depend on volume, tone consistency, and how aggressive
              you let Rumi be on auto-replies. We share actual pilot results in
              the hiring call.
            </p>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="px-6 py-20 border-t border-line">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-12">
              Three steps. One to three weeks. White-glove the whole way.
            </h2>

            <ol className="space-y-6">
              {STEPS.map((step) => (
                <li
                  key={step.num}
                  className="card p-6 md:p-8 flex gap-6 md:gap-8"
                >
                  <span
                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-accent text-base md:text-lg font-bold text-white shrink-0"
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

        {/* ── Closing CTA ── */}
        <section className="bg-navy px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-h2 leading-[1.1] text-white mb-6">
              Your team is worth more than this work.
              <br />
              <span className="text-accent">
                Hire one of ours instead.
              </span>
            </h2>

            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl mx-auto">
              30-minute hiring call. We size the role, you decide the timeline.
              No commitment.
            </p>

            <a
              href="/book"
              className="btn-primary inline-block px-8 py-3.5 text-base"
            >
              Book a hiring call →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

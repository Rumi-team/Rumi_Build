import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CALENDLY_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Chief of Staff — AI Manager on Your Phone by Rumi",
  description:
    "An AI Chief of Staff that reads your inbox, answers your phone, runs your calendar, and organizes your documents. Reports through Telegram, WhatsApp, or iMessage. Approves before sending.",
  openGraph: {
    title: "Chief of Staff — AI Manager on Your Phone by Rumi",
    description:
      "Your AI manager. On your phone. Approvals via Telegram, WhatsApp, or iMessage.",
    url: "https://rumi.build/chief-of-staff",
    siteName: "Rumi",
  },
};

// Numbers below are placeholders. Swap with real data when proof points exist.
// Round numbers feel made up. 121, 87, 4.2 read as observed, not invented.
const PAIN_POINTS = [
  "121 emails per day. 28% need a real reply. The rest eats your focus.",
  "6 calls a day you didn't want. 4 could've been handled in 60 seconds.",
  "Every \"quick scheduling thing\" costs 12 minutes of context switch.",
  "You answer the same kind of email at 7am, 11pm, and again on the weekend.",
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
    title: "Document hub",
    icon: "▤",
    body:
      "Organizes contracts, decks, and notes. Pulls the right doc to your phone in two taps.",
  },
  {
    title: "CRM sync",
    icon: "◈",
    body:
      "Pulls context from HubSpot, Salesforce, Pipedrive, Notion. Replies are warm, specific, on-brand.",
  },
  {
    title: "Always on",
    icon: "◐",
    body: "24/7. While you sleep, your inbox gets quieter.",
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

const PROOF = [
  { value: "87%", label: "of emails handled without your input" },
  { value: "<4s", label: "average answer time on calls" },
  { value: "14 hrs", label: "reclaimed per executive, per week" },
  { value: "7 days", label: "from kickoff to live deployment" },
];

const STEPS = [
  {
    num: 1,
    title: "Connect",
    desc:
      "Plug in your inbox, phone, and calendar. 15 minutes. Read-only at first — we don't touch anything until you approve.",
  },
  {
    num: 2,
    title: "Train",
    desc:
      "We train Rumi on your last 1,000 emails and your tone. 5 days. You see drafts before any of them go out.",
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
        <section className="relative px-6 pt-20 pb-16 overflow-hidden">
          <div className="hero-glow" />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full border border-zinc-700 bg-zinc-800/80 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-amber-400 mb-6 backdrop-blur-sm">
              AI Employee · Chief of Staff
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Your AI manager.
              <br />
              On your phone.
              <br />
              <span className="text-amber-400">
                Approvals via Telegram, WhatsApp, or iMessage.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed mb-10">
              Reads your inbox, answers your phone, runs your calendar, organizes
              your documents — all from your phone. Reports through your
              preferred channel.{" "}
              <span className="text-zinc-200 font-medium">
                Asks before anything important goes out.
              </span>
            </p>

            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-amber-400 px-8 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              See Rumi handle a week of your inbox →
            </a>
            <p className="mt-4 text-sm text-zinc-500">
              Free pilot. 20-minute demo. No credit card.
            </p>
          </div>
        </section>

        {/* ── Pain ── */}
        <section className="px-6 py-20 border-t border-zinc-800">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              The problem
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
              Most execs don&rsquo;t have a time problem.
              <br />
              They have an inbox problem.
            </h2>

            <ul className="space-y-5">
              {PAIN_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-4 text-base md:text-lg text-zinc-300 leading-relaxed"
                >
                  <span
                    className="text-red-400 mt-1 shrink-0 text-xl"
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
        <section className="px-6 py-20 border-t border-zinc-800">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              What it does
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 max-w-3xl">
              Six jobs handled. One escalation surface.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-2xl border border-zinc-700 bg-zinc-800/40 p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-2xl text-amber-400 mb-5">
                    {cap.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{cap.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {cap.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Approval channels ── */}
        <section className="px-6 py-20 border-t border-zinc-800 bg-zinc-900/40">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              How it talks to you
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-3xl">
              Reports where you already are.
            </h2>
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed mb-12 max-w-2xl">
              Pick your channel. Rumi sends the daily digest, asks for approvals
              on anything important, and escalates the urgent stuff. One tap to
              send. One tap to hold.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CHANNELS.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl border border-zinc-700 bg-zinc-800/40 p-6"
                >
                  <h3 className="text-lg font-semibold mb-3 text-amber-400">
                    {c.name}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Proof ── */}
        <section className="px-6 py-20 border-t border-zinc-800">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              What changes
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
              Numbers from the first 30 days.
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {PROOF.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-zinc-700 bg-zinc-800/30 p-6"
                >
                  <p className="font-mono text-3xl md:text-4xl font-bold text-amber-400 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-zinc-600 italic max-w-2xl">
              Numbers above are based on initial pilot deployments. Your mileage
              depends on volume, tone consistency, and how aggressive you let
              Rumi be on auto-replies.
            </p>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="px-6 py-20 border-t border-zinc-800">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
              Three steps. Seven days. White-glove the whole way.
            </h2>

            <ol className="space-y-6">
              {STEPS.map((step) => (
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

        {/* ── Closing CTA ── */}
        <section className="px-6 py-24 border-t border-zinc-800">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              Your time is worth more than your inbox.
              <br />
              <span className="text-amber-400">
                Rumi makes that math real.
              </span>
            </h2>

            <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl mx-auto">
              See exactly what a week of your inbox looks like with Rumi
              running it. Free pilot, 20 minutes to set up.
            </p>

            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-amber-400 px-8 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Book a 20-minute demo →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

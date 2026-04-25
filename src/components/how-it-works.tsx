const STEPS = [
  {
    num: 1,
    title: "Assess",
    desc: "30-minute hiring call. We map the work your team does today and tell you which AI employee would have the biggest payroll impact, and how fast we can have them on the job.",
  },
  {
    num: 2,
    title: "Hire",
    desc: "Pick the Chief. We deploy them in 1 to 3 weeks — trained on your inbox, calls, calendar, tone, and the systems your team already uses. Daily progress updates while we onboard.",
  },
  {
    num: 3,
    title: "Manage",
    desc: "Your AI employee runs in the background, reports through Telegram, WhatsApp, or iMessage, and asks for approval before anything important goes out. We handle the monitoring and tuning.",
  },
  {
    num: 4,
    title: "Promote",
    desc: "When the first hire is paying off, hire the next Chief. Each new role builds on what the first one already learned about your business.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="py-20 px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          How It Works
        </p>
        <h2
          id="how-heading"
          className="text-3xl font-bold tracking-tight mb-10"
        >
          From hiring call to first paycheck
        </h2>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <li
              key={step.num}
              className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-6"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-mono text-sm font-bold text-zinc-900 mb-4">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

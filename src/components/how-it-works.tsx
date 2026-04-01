const STEPS = [
  {
    num: 1,
    title: "Discovery Call",
    desc: "Free 30-minute video call. We learn your business, identify the manual process costing you the most time.",
  },
  {
    num: 2,
    title: "AI Sprint",
    desc: "5-day focused build. We create a working AI automation for your specific workflow. You see progress daily.",
  },
  {
    num: 3,
    title: "Deploy & Support",
    desc: "Your automation goes live. We train your team and provide 30 days of bug-fix support.",
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
          From conversation to working software
        </h2>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

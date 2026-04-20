const STEPS = [
  {
    num: 1,
    title: "Audit",
    desc: "We analyze your workflows and show you exactly where your business is losing time and money. You get a report with 3 specific opportunities and their dollar value.",
  },
  {
    num: 2,
    title: "Deploy",
    desc: "We build and launch the fix for your highest-impact problem first. Voice AI, automation, or web presence, live in 1-3 weeks. You see progress daily.",
  },
  {
    num: 3,
    title: "Manage",
    desc: "We monitor, optimize, and handle the day-to-day so you don't have to. Monthly reports show exactly what your AI is doing for your business.",
  },
  {
    num: 4,
    title: "Scale",
    desc: "As results compound, we deploy AI across more of your operations. Each new deployment builds on what's already working.",
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
          From audit to results
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

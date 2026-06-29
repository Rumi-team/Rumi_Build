import { HOW_IT_WORKS_STEPS } from "@/lib/data";

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          How It Works
        </p>
        <h2
          id="how-heading"
          className="text-3xl font-bold tracking-tight mb-10"
        >
          From first call to a live presence in days
        </h2>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HOW_IT_WORKS_STEPS.map((step) => (
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

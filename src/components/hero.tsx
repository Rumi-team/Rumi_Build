
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative pt-28 pb-20 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="hero-glow" />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-zinc-700 bg-zinc-800/80 px-4 py-1.5 text-sm text-zinc-400 mb-6 backdrop-blur-sm">
          Audit &middot; Deploy &middot; Manage &middot; Scale
        </span>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
        >
          We Find Where Your Business{" "}
          <span className="text-amber-400">
            Leaks Money.
          </span>{" "}
          Then We Fix It.
        </h1>

        <p className="mx-auto max-w-xl text-lg text-zinc-400 mb-8 leading-relaxed">
          We map your workflows, deploy AI where it saves the most time and
          money, and manage it so you don&apos;t have to.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/audit"
            className="w-full sm:w-auto rounded-lg bg-amber-400 px-7 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.25)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Get Your AI Audit
          </a>
          <a
            href="#how-heading"
            className="w-full sm:w-auto rounded-lg border border-zinc-700 px-7 py-3.5 text-base text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800/50 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

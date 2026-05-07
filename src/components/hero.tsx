import { COPY } from "@/lib/data";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-28 pb-20 px-6 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="hero-glow" />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-zinc-700 bg-zinc-800/80 px-4 py-1.5 text-sm text-zinc-400 mb-6 backdrop-blur-sm">
          {COPY.hero.taglinePill}
        </span>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
        >
          {COPY.hero.headline}{" "}
          <span className="text-amber-400">{COPY.hero.headlineAccent}</span>
        </h1>

        <p className="mx-auto max-w-xl text-lg text-zinc-400 mb-4 leading-relaxed">
          {COPY.hero.sub}
        </p>

        <p
          lang="fa"
          dir="rtl"
          className="font-vazirmatn mx-auto max-w-xl text-base text-zinc-500 mb-8"
        >
          {COPY.hero.farsiAccent}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={COPY.hero.ctaPrimaryHref}
            className="w-full sm:w-auto rounded-lg bg-amber-400 px-7 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.25)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            {COPY.hero.ctaPrimary}
          </a>
          <a
            href={COPY.hero.ctaSecondaryHref}
            className="w-full sm:w-auto rounded-lg border border-zinc-700 px-7 py-3.5 text-base text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800/50 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            {COPY.hero.ctaSecondary}
            <span lang="fa" dir="rtl" className="font-vazirmatn ml-2 text-sm text-zinc-400">
              ({COPY.hero.ctaSecondaryFarsi})
            </span>
          </a>
        </div>

        {/* Trust ribbon */}
        <p className="mt-8 text-sm text-zinc-500">
          {COPY.trustRibbon.line}
        </p>
      </div>
    </section>
  );
}

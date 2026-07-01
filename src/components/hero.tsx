"use client";

import { useT } from "@/lib/i18n";

export function Hero() {
  const { t } = useT();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-28 pb-20 px-6 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="hero-glow" />

      <div className="relative mx-auto max-w-3xl">
        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
        >
          {t.hero.headline}{" "}
          <span className="text-amber-400">{t.hero.headlineAccent}</span>
        </h1>

        <p className="max-w-xl text-lg text-zinc-400 mb-8 leading-relaxed">
          {t.hero.sub}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href="/evaluate"
            className="w-full sm:w-auto text-center rounded-lg bg-amber-400 px-7 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.25)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            {t.hero.ctaPrimary}
          </a>
        </div>
      </div>
    </section>
  );
}

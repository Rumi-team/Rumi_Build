"use client";

import { useT } from "@/lib/i18n";

export function Hero() {
  const { t } = useT();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative bg-navy pt-28 pb-24 px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="hero-glow" />

      <div className="relative mx-auto max-w-3xl">
        <h1
          id="hero-heading"
          className="text-[36px] md:text-[56px] font-black tracking-h1 leading-[1.05] text-white text-balance mb-5"
        >
          {t.hero.headline}{" "}
          <span className="text-accent">{t.hero.headlineAccent}</span>
        </h1>

        <p className="max-w-xl text-lg text-white/70 mb-8 leading-relaxed">
          {t.hero.sub}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href="/book"
            className="btn-primary w-full sm:w-auto text-center px-7 py-3.5 text-base"
          >
            {t.hero.ctaPrimary}
          </a>
        </div>
      </div>
    </section>
  );
}

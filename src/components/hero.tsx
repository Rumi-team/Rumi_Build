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
        {/* Positioning line: Rumi is the HR department, the roles are the hires.
            `text-white/70` overrides the accent colour `.eyebrow` carries: the
            token green on navy measures 3.88:1, under the WCAG AA 4.5:1 floor
            for 11px text, and accent-hover is darker still so it is worse here.
            White/70 on navy is the treatment DESIGN.md already blesses for text
            on navy sections (the hero sub and the footer columns use it). This
            wins over the class because Tailwind's `utilities` layer is emitted
            after the `components` layer that defines `.eyebrow` — same
            specificity, later origin. globals.css is locked, so the fix is here
            rather than in the class. */}
        <p className="eyebrow text-white/70 mb-4">{t.hero.eyebrow}</p>

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

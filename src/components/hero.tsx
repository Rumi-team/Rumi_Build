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
            The colour override is deliberate and must stay. Brand v2's navy
            takes the spec's accent eyebrow to 4.52:1 against the BARE token —
            just past the 4.5:1 AA floor 11px text is held to — but that is not
            the backdrop this element is painted on: `.hero-glow` above it is an
            accent-tinted radial at 0.14 alpha, and it sits directly under the
            eyebrow (worst on mobile, where the eyebrow is entirely inside the
            glow). Compositing the glow onto the navy lifts the backdrop and
            drops the same pairing to 3.82:1 at the glow's peak — and even a
            hundredth of alpha already reads 4.47:1, so every point inside the
            glow is under the floor. white/70 composites to 8.81:1 on the same
            navy and is the treatment this brand already uses for text on navy
            (the hero sub below, the footer columns). Hexes are deliberately not
            quoted here: the design-token test bans raw hex in src/, and the
            values live in DESIGN.md's Decisions Log. */}
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

"use client";

import { useEffect, useState } from "react";
import { COPY, HERO_STRIP_LANGUAGES, type HeroLangCode } from "@/lib/data";
import { ENGLISH_HERO, loadHeroStrings, type HeroStrings } from "@/lib/hero-i18n";
import { LanguageStrip } from "@/components/language-strip";

const RTL_CODES = new Set(
  HERO_STRIP_LANGUAGES.filter((l) => l.rtl).map((l) => l.code as string),
);

export function Hero() {
  const [lang, setLang] = useState<HeroLangCode>("en");
  const [strings, setStrings] = useState<HeroStrings>(ENGLISH_HERO);

  useEffect(() => {
    let cancelled = false;
    loadHeroStrings(lang).then((next) => {
      if (!cancelled) setStrings(next);
    });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const isRtl = RTL_CODES.has(lang);
  const liveLabel =
    HERO_STRIP_LANGUAGES.find((l) => l.code === lang)?.label ?? "English";

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-28 pb-20 px-6 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="hero-glow" />

      <div className="relative mx-auto max-w-3xl">
        <LanguageStrip lang={lang} onChange={setLang} />

        <div
          lang={lang}
          dir={isRtl ? "rtl" : undefined}
          className={isRtl ? "font-vazirmatn" : undefined}
        >
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
          >
            {strings.headline}{" "}
            <span className="text-amber-400">{strings.headlineAccent}</span>
          </h1>

          <p className="max-w-xl text-lg text-zinc-400 mb-8 leading-relaxed">
            {strings.sub}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={COPY.hero.ctaPrimaryHref}
              className="w-full sm:w-auto text-center rounded-lg bg-amber-400 px-7 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.25)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              {strings.ctaPrimary}
            </a>
            <a
              href={COPY.hero.ctaSecondaryHref}
              className="w-full sm:w-auto text-center rounded-lg border border-zinc-700 px-7 py-3.5 text-base text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800/50 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              {strings.ctaSecondary}
            </a>
          </div>

          <p className="mt-8 text-sm text-zinc-500 max-w-xl">{strings.trustRibbon}</p>
        </div>

        <span aria-live="polite" className="sr-only">
          Hero translated to {liveLabel}
        </span>
      </div>
    </section>
  );
}

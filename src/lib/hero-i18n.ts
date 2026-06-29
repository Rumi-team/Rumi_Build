import { COPY } from "@/lib/data";

export type HeroStrings = {
  overline: string;
  headline: string;
  headlineAccent: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustRibbon: string;
};

export const ENGLISH_HERO: HeroStrings = {
  overline: COPY.hero.overline,
  headline: COPY.hero.headline,
  headlineAccent: COPY.hero.headlineAccent,
  sub: COPY.hero.sub,
  ctaPrimary: COPY.hero.ctaPrimary,
  ctaSecondary: COPY.hero.ctaSecondary,
  trustRibbon: COPY.trustRibbon.line,
};

const cache = new Map<string, HeroStrings>([["en", ENGLISH_HERO]]);

export async function loadHeroStrings(lang: string): Promise<HeroStrings> {
  if (cache.has(lang)) return cache.get(lang)!;
  try {
    const res = await fetch(`/locales/${lang}.json`, { cache: "force-cache" });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = (await res.json()) as Partial<HeroStrings>;
    // Merge over English so a locale missing any key falls back instead of
    // rendering blank (e.g. a newly added field not yet translated).
    const merged: HeroStrings = { ...ENGLISH_HERO, ...json };
    cache.set(lang, merged);
    return merged;
  } catch {
    return ENGLISH_HERO;
  }
}

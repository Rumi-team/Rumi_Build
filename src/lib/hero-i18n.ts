import { COPY } from "@/lib/data";

export type HeroStrings = {
  headline: string;
  headlineAccent: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustRibbon: string;
};

export const ENGLISH_HERO: HeroStrings = {
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
    const json = (await res.json()) as HeroStrings;
    cache.set(lang, json);
    return json;
  } catch {
    return ENGLISH_HERO;
  }
}

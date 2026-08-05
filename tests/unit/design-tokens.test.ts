import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import tailwindConfig from "../../tailwind.config";
import { sourceFiles } from "./helpers/source-files";

// ── Why this file exists ──────────────────────────────────────────────────────
// The brand system is locked (tailwind.config.ts + globals.css, both off-limits
// to edits). Drift happens one component at a time: a stray `amber-500`, a
// `zinc-` grey where `muted` belongs, a `text-red-500` where `danger` is the
// token, or a raw colour pasted from a mock. The allowed palette is READ OUT OF
// tailwind.config.ts here rather than restated, so this test tracks the locked
// system instead of duplicating it.

// Vitest runs from the project root. process.cwd() rather than import.meta.url
// because this file used to run under jsdom, which rewrites import.meta.url to
// an http URL and takes fileURLToPath off the table; it runs under `node` now
// (it never touches a DOM), but cwd is correct either way and does not depend
// on which environment the file happens to be in.
const ROOT = process.cwd();
const SRC = join(ROOT, "src");

// `.css` as well as the two TypeScript extensions: globals.css is where the
// locked component classes live, and it is scanned for off-palette colour the
// same way a component is. brand-assets.test.ts walks the same tree for `.ts`
// and `.tsx` only — the walker is shared, the extension list is not.
const FILES = sourceFiles(SRC, [".ts", ".tsx", ".css"]);

/** Hex literals, ignoring HTML numeric entities like `&#10003;`. */
const HEX = /(?<![&\w])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;

/**
 * The locked palette, walked out of the config's declared colour tokens rather
 * than regexed out of the file text. Scraping the text swept up hexes mentioned
 * in comments — tailwind.config.ts says "No #000000 anywhere", which put pure
 * black into the allowlist of the very colour that comment forbids.
 */
function declaredHexes(node: unknown): string[] {
  if (typeof node === "string") {
    return node.startsWith("#") ? [node.toLowerCase()] : [];
  }
  if (node !== null && typeof node === "object") {
    return Object.values(node as Record<string, unknown>).flatMap(declaredHexes);
  }
  return [];
}

const PALETTE = new Set(declaredHexes(tailwindConfig.theme?.extend?.colors));

// Plain white shorthands used in globals.css for the page base. The Cal.com
// embed's #059669 needs no exception: it is the accent token, passed to a
// third-party widget that only accepts a literal.
const ALLOWED_HEX = new Set([...PALETTE, "#ffffff", "#fff"]);

/** `#059669` -> `5,150,105`, so an rgb() literal can be matched to a token. */
function toRgb(hex: string): string | undefined {
  const body = hex.slice(1);
  if (body.length === 6) {
    return [0, 2, 4].map((i) => parseInt(body.slice(i, i + 2), 16)).join(",");
  }
  if (body.length === 3) {
    return [...body].map((c) => parseInt(c + c, 16)).join(",");
  }
  return undefined;
}

const PALETTE_RGB = new Set(
  [...ALLOWED_HEX].map(toRgb).filter((v): v is string => !!v)
);

/**
 * Stock Tailwind colour scales. The locked config exposes NAMED tokens only
 * (navy, accent, ink, muted, surface, line, danger, field), so any numbered
 * scale reaching a class name is drift — `text-red-500` instead of the `danger`
 * token is easier to type than a hex and just as off-palette.
 */
const STOCK_SCALES =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|" +
  "teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const COLOUR_UTILITIES =
  "text|bg|border|ring|offset|from|via|to|fill|stroke|divide|outline|shadow|" +
  "decoration|accent|caret|placeholder";

const STOCK_CLASS = new RegExp(
  `\\b(?:${COLOUR_UTILITIES})-(?:${STOCK_SCALES})-(?:\\d{2,3}|DEFAULT)\\b`
);
/** Bare `amber-500` / `zinc-DEFAULT`, with no utility prefix in front of it. */
const BARE_OFF_PALETTE = /\b(?:amber|zinc)-(?:\d{2,3}|DEFAULT)\b/;

/** rgb()/hsl()/oklch() and friends — a colour a hex scan walks straight past. */
const COLOUR_FN = /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(([^)]*)\)/gi;

describe("design tokens", () => {
  it("found the source tree and the locked palette", () => {
    // Guards the walker: every assertion below would pass vacuously if the
    // scan came up empty because the cwd moved.
    expect(existsSync(join(ROOT, "tailwind.config.ts"))).toBe(true);
    expect(FILES.length).toBeGreaterThan(20);
    expect(PALETTE.has("#059669")).toBe(true); // accent
    expect(PALETTE.has("#0b1c36")).toBe(true); // navy
    expect(PALETTE.has("#dc2626")).toBe(true); // danger — the only red allowed
    expect(PALETTE.size).toBeGreaterThanOrEqual(8);
    // The config's own comment mentions #000000 to forbid it. Walking declared
    // tokens (not file text) is what keeps that mention out of the allowlist.
    expect(ALLOWED_HEX.has("#000000")).toBe(false);
    expect(PALETTE_RGB.has("5,150,105")).toBe(true);
  });

  it("uses no stock Tailwind colour scale anywhere in src/", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const text = readFileSync(file, "utf8");
      text.split("\n").forEach((line, i) => {
        const hit = line.match(STOCK_CLASS) ?? line.match(BARE_OFF_PALETTE);
        if (hit) offenders.push(`${relative(ROOT, file)}:${i + 1} ${hit[0]}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it("recognises the classes it is supposed to be rejecting", () => {
    // The regex above is the whole test; a typo in it would silently allow
    // everything. These are the exact mutations that got through the old
    // amber-/zinc-only denylist.
    expect("text-red-500").toMatch(STOCK_CLASS);
    expect("hover:bg-blue-50").toMatch(STOCK_CLASS);
    expect("ring-offset-slate-200").toMatch(STOCK_CLASS);
    expect("amber-500").toMatch(BARE_OFF_PALETTE);
    // ...and the locked tokens must keep passing.
    for (const ok of [
      "text-ink",
      "bg-surface",
      "border-line",
      "text-danger",
      "bg-accent-hover",
      "ring-accent",
      "text-muted",
      "bg-navy",
      "text-[11px]",
      "to-transparent",
    ]) {
      expect(ok, `${ok} is a locked token, not drift`).not.toMatch(STOCK_CLASS);
      expect(ok).not.toMatch(BARE_OFF_PALETTE);
    }
  });

  it("uses no raw hex colour outside the locked palette", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const text = readFileSync(file, "utf8");
      text.split("\n").forEach((line, i) => {
        for (const match of line.matchAll(HEX)) {
          const hex = `#${match[1]}`.toLowerCase();
          if (!ALLOWED_HEX.has(hex)) {
            offenders.push(`${relative(ROOT, file)}:${i + 1} ${match[0]}`);
          }
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  it("uses no rgb()/hsl()/oklch() colour outside the locked palette", () => {
    const offenders: string[] = [];
    let scanned = 0;
    for (const file of FILES) {
      const text = readFileSync(file, "utf8");
      text.split("\n").forEach((line, i) => {
        for (const match of line.matchAll(COLOUR_FN)) {
          scanned += 1;
          const where = `${relative(ROOT, file)}:${i + 1} ${match[0]}`;
          const fn = match[1].toLowerCase();
          const parts = match[2].split(/[,/\s]+/).filter(Boolean);
          if (fn !== "rgb" && fn !== "rgba") {
            // No token is expressed in any other colour space, so any of these
            // is a colour that bypassed the palette.
            offenders.push(where);
            continue;
          }
          const [r, g, b, a] = parts;
          const alpha =
            a === undefined
              ? 1
              : a.endsWith("%")
                ? Number(a.slice(0, -1)) / 100
                : Number(a);
          // Black is banned as a colour but legitimate as a shadow tint, which
          // is the only way globals.css uses it.
          if (`${r},${g},${b}` === "0,0,0" && alpha < 1) continue;
          if (PALETTE_RGB.has(`${r},${g},${b}`)) continue;
          offenders.push(where);
        }
      });
    }
    // globals.css states the accent in rgba() five times over; if this drops to
    // zero the scan has stopped looking rather than found nothing to flag.
    expect(scanned, "no colour function found at all — the scan is broken")
      .toBeGreaterThan(3);
    expect(offenders).toEqual([]);
  });

  it("keeps the Cal.com embed on the accent token, not an arbitrary green", () => {
    const embed = readFileSync(join(SRC, "components", "cal-embed.tsx"), "utf8");
    const hexes = [...embed.matchAll(HEX)].map((m) => `#${m[1]}`.toLowerCase());
    expect(hexes.length).toBeGreaterThan(0);
    for (const hex of hexes) expect(hex).toBe("#059669");
  });

  it("does not reintroduce pure black, which is reserved for the Rumi app", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const text = readFileSync(file, "utf8");
      if (/(?<![&\w])#(000|000000)\b/.test(text)) {
        offenders.push(relative(ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});

// ── Contrast, where the tokens are paired ────────────────────────────────────
// Everything above asks WHICH colours may be used. This asks whether the pairs
// the brand system actually puts on top of each other are readable, and it is
// here because a token relock moves that answer without touching a single
// component: `navy` went #1E293B -> #0B1C36 and `surface` #FEFCF7 -> #F9FAFB,
// and both changes shifted a ratio the site depends on.
//
// The hero eyebrow is the case with history, and the history now has a second
// turn in it. It shipped as the spec's accent green, measured 3.88:1 on the old
// navy — under the 4.5:1 WCAG AA floor that 11px text is held to — and was
// overridden to `text-white/70` in hero.tsx. Brand v2's darker navy takes that
// same pairing to 4.52:1, so the override was deleted and the accent restored.
//
// That measurement was against the BARE token, and it is not the backdrop the
// element is painted on: `.hero-glow` is an accent-tinted radial sitting
// directly under the eyebrow, and compositing it onto the navy lifts the
// backdrop toward the text colour. The override is back, and this section is
// what holds it there — the two cases below assert BOTH halves, because "accent
// clears AA on navy" is true and irrelevant on its own.
//
// Nothing here restates a hex, an alpha or a ratio. The pairing comes out of the
// locked `.eyebrow` rule, the glow's colour and alpha out of the locked
// `.hero-glow` rule, the override's alpha out of the class hero.tsx actually
// renders, and the values out of the config — so a repalette, a re-tuned glow or
// a changed override recomputes rather than agreeing with itself.

/** One channel of the sRGB -> linear transform WCAG 2.x relative luminance uses. */
function channel(srgb: number): number {
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

/** `#059669` -> [5, 150, 105]. Ratios are computed on triples, because the
 *  colours that matter here are composites and have no hex. */
function rgbOf(hex: string): number[] {
  const body = hex.slice(1);
  return [0, 2, 4].map((i) => parseInt(body.slice(i, i + 2), 16));
}

function luminance(colour: number[]): number {
  const [r, g, b] = colour.map((c) => channel(c / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, 1:1 to 21:1. */
function contrast(a: number[], b: number[]): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Source-over compositing: what `fg` at `alpha` looks like on top of `bg`. */
function over(fg: number[], alpha: number, bg: number[]): number[] {
  return fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));
}

const WHITE = [255, 255, 255];

/**
 * A Tailwind colour name as the config holds it: `navy` -> the string,
 * `accent` -> accent.DEFAULT, `accent-hover` -> accent.hover. The dashed form
 * matters — it is what a class name looks like, and `.eyebrow` switched to
 * `text-accent-hover` is the mutation this whole section exists to catch, so it
 * has to resolve to a hex rather than blow up as an unknown token.
 */
function token(name: string): string {
  const colours = tailwindConfig.theme?.extend?.colors as Record<string, unknown>;
  const [head, ...rest] = name.split("-");
  const value = colours[head];
  const hex =
    typeof value === "string"
      ? value
      : ((value as Record<string, string> | undefined)?.[
          rest.length ? rest.join("-") : "DEFAULT"
        ] ?? undefined);
  if (typeof hex !== "string") throw new Error(`no such colour token: ${name}`);
  return hex.toLowerCase();
}

/**
 * Every token name in the dashed form a class name spells it — `navy`,
 * `accent`, `accent-hover`, … — walked out of the config beside the hexes, so a
 * scan for "which token is this component wearing" cannot go stale against a
 * palette that gains one.
 */
const PALETTE_TOKENS = Object.entries(
  (tailwindConfig.theme?.extend?.colors ?? {}) as Record<string, unknown>
).flatMap(([name, value]) =>
  typeof value === "string"
    ? [name]
    : Object.keys(value as Record<string, string>).map((sub) =>
        sub === "DEFAULT" ? name : `${name}-${sub}`
      )
);

const GLOBALS = readFileSync(join(SRC, "app", "globals.css"), "utf8");

/** The colour utility a locked component class applies, e.g. `.eyebrow` -> "accent". */
function classColour(rule: string): string {
  const body = GLOBALS.match(new RegExp(`\\.${rule}\\s*\\{([^}]*)\\}`))?.[1];
  expect(body, `globals.css no longer defines .${rule}`).toBeTypeOf("string");
  // `text-[11px]` has a bracket where a token name would be, so the arbitrary
  // size utility cannot be mistaken for a colour.
  const colours = [...body!.matchAll(/\btext-([a-z][a-z-]*)\b/g)].map((m) => m[1]);
  expect(colours, `.${rule} applies no colour utility at all`).toHaveLength(1);
  return colours[0];
}

/**
 * The colour and alpha `.hero-glow` paints, out of the locked rule itself —
 * `background: radial-gradient(ellipse, rgba(…) 0%, transparent 70%)`, so the
 * alpha parsed here is the gradient's PEAK, at its centre. That is the worst
 * case for anything sitting inside the glow, which is what the eyebrow does.
 */
function heroGlow(): { colour: number[]; alpha: number } {
  const body = GLOBALS.match(/\.hero-glow\s*\{([^}]*)\}/)?.[1];
  expect(body, "globals.css no longer defines .hero-glow").toBeTypeOf("string");
  const paint = body!.match(
    /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)\s*(?:[,/]\s*([\d.]+))?\s*\)/
  );
  expect(paint, ".hero-glow no longer paints a colour — re-anchor this test").not.toBeNull();
  return {
    colour: [Number(paint![1]), Number(paint![2]), Number(paint![3])],
    alpha: paint![4] === undefined ? 1 : Number(paint![4]),
  };
}

/** AA floor for body-sized text. The eyebrow is 11px, so large-text 3:1 never applies. */
const AA = 4.5;

describe("contrast of the pairings the brand system ships", () => {
  it("computes a ratio it could fail, on the tokens it is supposed to be reading", () => {
    // Guards the maths and the config read together. Both anchors are facts
    // about the formula rather than about the palette: white on any dark fill
    // clears AA, and a colour against itself is 1:1 — so a `contrast` that had
    // been broken into returning a constant fails here rather than blessing
    // every pairing below.
    expect(contrast(WHITE, rgbOf(token("navy")))).toBeGreaterThan(AA);
    expect(
      contrast(rgbOf(token("accent")), rgbOf(token("accent")))
    ).toBeCloseTo(1, 5);
    expect(token("navy")).toMatch(/^#[0-9a-f]{6}$/);
    expect(token("accent")).toMatch(/^#[0-9a-f]{6}$/);
    // accent-hover is the darker of the two greens and is the mistake this
    // pairing invites: same family, same token file, 3.10:1 on the navy. If it
    // ever passes, the floor below has stopped meaning anything. Read through
    // the same `token()` the rest of this section uses, so the dashed-name
    // resolution is exercised rather than reached around with a cast.
    expect(
      contrast(rgbOf(token("accent-hover")), rgbOf(token("navy"))),
      "accent-hover now clears AA on navy — check the floor, not the palette"
    ).toBeLessThan(AA);
    // Compositing has to move a colour, or every "on the glow" measurement
    // below silently becomes an "on the bare navy" one.
    expect(over(WHITE, 0, rgbOf(token("navy")))).toEqual(rgbOf(token("navy")));
    expect(over(WHITE, 1, rgbOf(token("navy")))).toEqual(WHITE);
  });

  it("measures the eyebrow's accent on the glow, not on the bare navy under it", () => {
    // DOCUMENTATION FIRST, then the correction. Against the bare token the
    // spec's accent eyebrow clears AA on brand v2's navy — that measurement is
    // real, and it is the one the 2026-08-04 revert was made on.
    const eyebrow = rgbOf(token(classColour("eyebrow")));
    const navy = rgbOf(token("navy"));
    expect(
      contrast(eyebrow, navy),
      "accent no longer clears AA even on the BARE navy — the eyebrow story has changed, re-read DESIGN.md"
    ).toBeGreaterThanOrEqual(AA);

    // ...but bare navy is not what the eyebrow is painted on. `.hero-glow` sits
    // under it and tints the backdrop toward the text colour, and the composite
    // is what a visitor's eye actually resolves. This is the assertion that
    // makes the override in hero.tsx load-bearing rather than decorative: if a
    // retuned glow ever brought this back over the floor, THIS is the case that
    // says the override may go.
    const glow = heroGlow();
    const backdrop = over(glow.colour, glow.alpha, navy);
    expect(
      contrast(eyebrow, backdrop),
      "the glow no longer costs the accent eyebrow its AA margin — the text-white/70 override in hero.tsx may finally be dropped"
    ).toBeLessThan(AA);
  });

  it("still renders that eyebrow with the override its backdrop requires", () => {
    // Without this the case above pins a pairing the page may not use. Comments
    // are stripped for the reason tone.test.ts strips them — hero.tsx's comment
    // discusses the ratios and would otherwise be read as markup.
    const hero = readFileSync(join(SRC, "components", "hero.tsx"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    expect(hero, "the hero section is no longer navy — repoint this test").toMatch(
      /\bbg-navy\b/
    );
    expect(
      hero,
      "the hero no longer paints .hero-glow, so the composited backdrop measured above is not the one on screen"
    ).toMatch(/\bhero-glow\b/);

    const line = hero.split("\n").find((l) => /className="eyebrow/.test(l));
    expect(line, "the hero no longer renders an .eyebrow").toBeTypeOf("string");
    const override = line!.match(/\btext-white\/(\d+)\b/);
    expect(
      override,
      "the hero eyebrow lost its colour override — it falls back to the accent, which the case above measures UNDER the AA floor on the glow it is painted on"
    ).not.toBeNull();

    // The alpha comes off the class the element actually renders, so weakening
    // the override (text-white/40, say) recomputes instead of passing.
    const alpha = Number(override![1]) / 100;
    const navy = rgbOf(token("navy"));
    const glow = heroGlow();
    const backdrop = over(glow.colour, glow.alpha, navy);
    expect(
      contrast(over(WHITE, alpha, navy), navy),
      "the hero eyebrow's override is under the AA floor on the bare navy"
    ).toBeGreaterThanOrEqual(AA);
    expect(
      contrast(over(WHITE, alpha, backdrop), backdrop),
      "the hero eyebrow's override is under the AA floor on the glow it is painted on"
    ).toBeGreaterThanOrEqual(AA);
  });

  it("keeps every colour the desktop nav links wear readable on the white bar", () => {
    // Brand v2 put the nav on white and specified "links in ink with accent
    // hover/active". `accent` (#059669) on #FFFFFF is 3.77:1 at the 14px these
    // links render — the same failure the 2026-07-27 row fixed in the other
    // direction, and the reason the hover and active states are `accent-hover`
    // (5.48:1) instead. The token names are read out of the className the
    // component actually renders and resolved through the config, so a link
    // moved back to `accent`, or a repalette that darkens white, recomputes
    // here rather than agreeing with a copy of the number.
    const nav = readFileSync(join(SRC, "components", "nav.tsx"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");

    // Just the desktop cluster: the bar is white, but the mobile overlay this
    // same file opens is navy and its links are measured against a different
    // backdrop entirely.
    const desktop = nav.slice(
      nav.indexOf("hidden md:flex"),
      nav.indexOf("<LanguageDropdown")
    );
    expect(
      desktop,
      "the desktop link cluster is no longer where this test slices it"
    ).toContain("aria-current");

    // Longest name first, so `accent-hover` is not read as `accent`.
    const names = [...PALETTE_TOKENS].sort((a, b) => b.length - a.length);
    const used = [
      ...desktop.matchAll(
        new RegExp(`\\btext-(${names.join("|")})(?![\\w-])`, "g")
      ),
    ].map((m) => m[1]);

    expect(
      new Set(used).size,
      "found fewer than the resting and the hover/active colour — the scan has stopped matching"
    ).toBeGreaterThanOrEqual(2);
    for (const name of new Set(used)) {
      expect(
        contrast(rgbOf(token(name)), WHITE),
        `nav links wear ${name} on the white bar, which is under the AA floor`
      ).toBeGreaterThanOrEqual(AA);
    }
  });

  it("keeps supporting text readable on both fills a card or section can have", () => {
    // `muted` is the only text token that is not near-black, and it sits on
    // white and on `surface` in every card and alternating section. The surface
    // relock moved this one too (#FEFCF7 -> #F9FAFB), which cost it contrast
    // rather than gaining it.
    for (const fill of ["#ffffff", token("surface")]) {
      expect(
        contrast(rgbOf(token("muted")), rgbOf(fill)),
        `muted text on ${fill} is under the AA floor`
      ).toBeGreaterThanOrEqual(AA);
    }
    expect(
      contrast(rgbOf(token("ink")), rgbOf(token("surface")))
    ).toBeGreaterThanOrEqual(AA);
  });
});

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import tailwindConfig from "../../tailwind.config";

// ── Why this file exists ──────────────────────────────────────────────────────
// The brand system is locked (tailwind.config.ts + globals.css, both off-limits
// to edits). Drift happens one component at a time: a stray `amber-500`, a
// `zinc-` grey where `muted` belongs, a `text-red-500` where `danger` is the
// token, or a raw colour pasted from a mock. The allowed palette is READ OUT OF
// tailwind.config.ts here rather than restated, so this test tracks the locked
// system instead of duplicating it.

// Vitest runs from the project root (jsdom rewrites import.meta.url to an http
// URL, so the usual fileURLToPath dance is not available here).
const ROOT = process.cwd();
const SRC = join(ROOT, "src");

function sourceFiles(dir: string, exts = [".ts", ".tsx", ".css"]): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full, exts);
    return exts.some((e) => entry.name.endsWith(e)) ? [full] : [];
  });
}

const FILES = sourceFiles(SRC);

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
    expect(PALETTE.has("#1e293b")).toBe(true); // navy
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

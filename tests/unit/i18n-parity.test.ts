import { beforeAll, describe, expect, it } from "vitest";
import { LANGUAGES, type Dict, type Lang } from "@/lib/i18n";
import { loadDicts } from "./helpers/dicts";

// ── Why this file exists ──────────────────────────────────────────────────────
// FA is typed `Dict` (= typeof EN), so a MISSING key is a compile error. What
// TypeScript does NOT catch is an array that is one item short: `items: [a, b]`
// still satisfies the element type. That shipped once — a role disappeared from
// the Farsi homepage while the English one showed five. Everything below walks
// the dictionaries programmatically so it keeps working as the copy changes.

let DICTS: Record<Lang, Dict>;
let EN: Dict;
let FA: Dict;

beforeAll(() => {
  DICTS = loadDicts();
  EN = DICTS.en;
  FA = DICTS.fa;
});

type Node = unknown;

/** Every key path in the dictionary, `roles.items[0].name` style. */
function paths(node: Node, prefix = ""): string[] {
  const out: string[] = [];
  const walk = (n: Node, p: string) => {
    if (Array.isArray(n)) {
      n.forEach((child, i) => walk(child, `${p}[${i}]`));
      return;
    }
    if (n !== null && typeof n === "object") {
      for (const [k, v] of Object.entries(n as Record<string, Node>)) {
        walk(v, p ? `${p}.${k}` : k);
      }
      return;
    }
    out.push(p);
  };
  walk(node, prefix);
  return out;
}

/** Every array in the dictionary, as `path -> length`. */
function arrayLengths(node: Node): Record<string, number> {
  const out: Record<string, number> = {};
  const walk = (n: Node, p: string) => {
    if (Array.isArray(n)) {
      out[p] = n.length;
      n.forEach((child, i) => walk(child, `${p}[${i}]`));
      return;
    }
    if (n !== null && typeof n === "object") {
      for (const [k, v] of Object.entries(n as Record<string, Node>)) {
        walk(v, p ? `${p}.${k}` : k);
      }
    }
  };
  walk(node, "");
  return out;
}

/** Every leaf string in the dictionary, as `path -> value`. */
function leaves(node: Node): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (n: Node, p: string) => {
    if (Array.isArray(n)) {
      n.forEach((child, i) => walk(child, `${p}[${i}]`));
      return;
    }
    if (n !== null && typeof n === "object") {
      for (const [k, v] of Object.entries(n as Record<string, Node>)) {
        walk(v, p ? `${p}.${k}` : k);
      }
      return;
    }
    if (typeof n === "string") out[p] = n;
  };
  walk(node, "");
  return out;
}

describe("EN/FA dictionary parity", () => {
  it("serves one dictionary per language the dropdown offers", () => {
    expect(Object.keys(DICTS).sort()).toEqual(
      LANGUAGES.map((l) => l.code).sort()
    );
    expect(LANGUAGES.find((l) => l.code === "fa")?.rtl).toBe(true);
    expect(LANGUAGES.find((l) => l.code === "en")?.rtl).toBe(false);
  });

  it("has the same key paths in FA as in EN", () => {
    expect(paths(FA).sort()).toEqual(paths(EN).sort());
  });

  it("has the same array lengths at every level (the bug TS cannot see)", () => {
    expect(arrayLengths(FA)).toEqual(arrayLengths(EN));
  });

  // Pinned on top of the generic check above: these four arrays drive the
  // homepage sections, and a short one silently drops a card or a step.
  it.each([
    ["roles.items", 3],
    ["roles.bundles", 2],
    ["extras.items", 4],
    ["how.steps", 4],
  ] as const)("%s has %i entries in both languages", (path, expected) => {
    expect(arrayLengths(EN)[path]).toBe(expected);
    expect(arrayLengths(FA)[path]).toBe(expected);
  });

  it("joins role copy to canonical roles by slug, identically in both languages", () => {
    const slugs = (d: Dict) => [
      ...d.roles.items.map((r) => r.slug),
      ...d.roles.bundles.map((r) => r.slug),
    ];
    expect(slugs(FA)).toEqual(slugs(EN));
    // Five distinct slugs — a duplicate would collapse two cards into one in
    // the slug -> copy Map that ai-employees.tsx builds.
    expect(new Set(slugs(EN)).size).toBe(5);
  });

  it("leaves no leaf string empty in either language", () => {
    for (const code of LANGUAGES.map((l) => l.code)) {
      const empty = Object.entries(leaves(DICTS[code]))
        .filter(([, v]) => v.trim() === "")
        .map(([k]) => `${code}.${k}`);
      expect(empty).toEqual([]);
    }
  });

  it("has no untranslated English copy left inside FA strings", () => {
    // Slugs, brand names and product names are legitimately Latin inside FA.
    // Longest-first so "Google Play" is stripped before "Google".
    const ALLOWED_LATIN = [
      ...FA.roles.items.map((r) => r.slug),
      ...FA.roles.bundles.map((r) => r.slug),
      "Rumi, Inc.",
      "App Store",
      "Google Play",
      "Perplexity",
      "ChatGPT",
      "Claude",
      "Google",
      "Rumi",
      "CRM",
    ];

    const offenders: string[] = [];
    for (const [path, value] of Object.entries(leaves(FA))) {
      let stripped = value;
      for (const allowed of ALLOWED_LATIN) {
        stripped = stripped.split(allowed).join("");
      }
      // Any run of two or more Latin letters left over is untranslated copy.
      const latin = stripped.match(/[A-Za-z]{2,}/g);
      if (latin) offenders.push(`${path}: ${latin.join(", ")}`);
    }
    expect(offenders).toEqual([]);
  });

  it("actually translates every string — FA never reuses EN wording", () => {
    const en = leaves(EN);
    const fa = leaves(FA);
    // The arrow is a direction glyph and slugs are identifiers, not prose.
    const NOT_PROSE = (path: string) => path === "arrow" || path.endsWith(".slug");

    const identical = Object.keys(en).filter(
      (k) => !NOT_PROSE(k) && en[k] === fa[k]
    );
    expect(identical).toEqual([]);
  });

  it("writes FA in Persian script, with Persian numerals in prices", () => {
    const persian = /[؀-ۿ]/;
    for (const [path, value] of Object.entries(leaves(FA))) {
      if (path === "arrow" || path.endsWith(".slug")) continue;
      expect(persian.test(value), `FA ${path} is not in Persian script`).toBe(
        true
      );
    }
    // Prices are localised numerals: "از ۳۰۰ دلار در ماه", not "from $300/mo".
    for (const role of [...FA.roles.items, ...FA.roles.bundles]) {
      expect(role.price).toMatch(/[۰-۹]/);
      expect(role.price).not.toMatch(/[0-9]/);
    }
  });

  it("points the arrow the other way in RTL", () => {
    expect(EN.arrow).toBe("→");
    expect(FA.arrow).toBe("←");
  });
});

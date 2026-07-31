import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// ── Why this file exists ──────────────────────────────────────────────────────
// Translation on this site is client-side: LanguageProvider stamps
// `dir="rtl" lang="fa"` on <html> for a visitor who has stored Farsi, and
// globals.css swaps the body face to Vazirmatn off `html[lang="fa"] body`. Every
// server page under src/app except the homepage renders ENGLISH prose, so under
// that stored preference each one would right-align and set in the Persian face
// — English copy, mirrored, in the wrong typeface. Three pages pinned themselves
// back to LTR/en by hand and the other ten did not, which is exactly the kind of
// gap a copied-comment convention leaves: nothing failed, the three that had it
// looked deliberate, and the ten that didn't looked like pages nobody had got to.
//
// The pin now lives in one place (src/components/english-main.tsx) and this is
// what keeps every English page using it. Source-text based, like the page-file
// half of tone.test.ts: the pin is a rendering decision made in JSX, and there is
// no runtime to ask about it without booting a browser with localStorage set.

const ROOT = process.cwd();
const APP = join(ROOT, "src", "app");
const PIN = join(ROOT, "src", "components", "english-main.tsx");

/** Comments stripped — several of these files DISCUSS the pin in prose. */
function source(file: string): string {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

// The homepage is the one page that renders through the dictionary, so it MUST
// follow the global direction like the translated Nav and Footer do. Pinning it
// would break Farsi rather than fix English.
const TRANSLATED = join("src", "app", "page.tsx");

type Surface = { rel: string; code: string };

/** Every rendered surface under src/app: page.tsx plus the not-found page. */
function surfaces(): Surface[] {
  const out: Surface[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (entry.name !== "page.tsx" && entry.name !== "not-found.tsx") continue;
      out.push({ rel: full.slice(ROOT.length + 1), code: source(full) });
    }
  };
  walk(APP);
  return out;
}

const ALL = surfaces();
// A redirect stub resolves but never renders a character of copy, so it has
// nothing to pin. Matched on code with comments stripped, the same way
// routing.test.ts classifies them.
const STUBS = ALL.filter((s) => /\b(?:permanentRedirect|redirect)\(/.test(s.code));
const RENDERING = ALL.filter((s) => !STUBS.includes(s));
const ENGLISH = RENDERING.filter((s) => s.rel !== TRANSLATED);

describe("the English-page direction pin", () => {
  it("found the surfaces it is supposed to be checking", () => {
    // Guards the walk: without this the assertion below passes on an empty list,
    // which is the same silent green the missing pins already shipped as.
    expect(ALL.length).toBeGreaterThan(15);
    expect(STUBS.map((s) => s.rel).sort()).toEqual([
      join("src", "app", "audit", "page.tsx"),
      join("src", "app", "chief-of-staff", "page.tsx"),
      join("src", "app", "evaluate", "page.tsx"),
    ]);
    expect(ENGLISH.length).toBeGreaterThan(10);
    const paths = ENGLISH.map((s) => s.rel);
    // A sample of the pages the gap was actually found on, so a walk that stops
    // recursing into a subdirectory fails here rather than reading as "clean".
    for (const rel of [
      join("src", "app", "faq", "page.tsx"),
      join("src", "app", "terms", "page.tsx"),
      join("src", "app", "not-found.tsx"),
      join("src", "app", "industries", "[slug]", "page.tsx"),
      join("src", "app", "services", "[slug]", "page.tsx"),
      join("src", "app", "book", "success", "page.tsx"),
    ]) {
      expect(paths, `${rel} is not being scanned`).toContain(rel);
    }
    // And the homepage is excluded on purpose, not by accident.
    expect(RENDERING.map((s) => s.rel)).toContain(TRANSLATED);
  });

  it("keeps EnglishMain emitting all three parts of the pin", () => {
    // Every page below satisfies this test by delegating here, so a page using
    // EnglishMain proves nothing unless EnglishMain still does the work. All
    // three parts are load-bearing and one of them is easy to read as noise:
    // `font-sans` is NOT redundant with lang="en", because the Vazirmatn swap
    // matches `html[lang="fa"] body` and a lang on a descendant cannot undo a
    // rule applied to <body>.
    const code = source(PIN);
    expect(code, "EnglishMain no longer renders a <main>").toMatch(/<main\b/);
    expect(code, "EnglishMain no longer pins the direction").toContain('dir="ltr"');
    expect(code, "EnglishMain no longer pins the language").toContain('lang="en"');
    expect(
      code,
      "EnglishMain no longer re-pins Inter — lang alone does not undo the html[lang=fa] body font swap",
    ).toContain("font-sans");
  });

  it("pins every English page, through EnglishMain or by hand", () => {
    const unpinned = ENGLISH.filter((s) => {
      if (/<EnglishMain\b/.test(s.code)) return false;
      // A hand-rolled pin is still a pin, as long as it is a whole one.
      return !(
        s.code.includes('dir="ltr"') &&
        s.code.includes('lang="en"') &&
        s.code.includes("font-sans")
      );
    }).map((s) => s.rel);

    expect(
      unpinned,
      "English page renders unpinned: under a stored Farsi preference this copy right-aligns in Vazirmatn. Wrap it in <EnglishMain> (src/components/english-main.tsx).",
    ).toEqual([]);
  });

  it("leaves the translated homepage following the global direction", () => {
    const home = RENDERING.find((s) => s.rel === TRANSLATED)!;
    expect(
      home.code,
      "the homepage is pinned to LTR/en — it renders through the dictionary, so pinning it breaks Farsi instead of fixing English",
    ).not.toMatch(/<EnglishMain\b|dir="ltr"/);
  });
});

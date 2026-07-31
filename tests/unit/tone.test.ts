// @vitest-environment jsdom
// Needs a DOM: this file reads the dictionaries through helpers/dicts.tsx,
// which mounts LanguageProvider. The suite defaults to `node`
// (vitest.config.ts); only the files that render opt in.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import * as data from "@/lib/data";
// The two server-only detail modules. They hold the LONGEST user-facing copy on
// the site — the five role pitches, their feature lists and use cases, and the
// five industry write-ups — which used to live on the AI_EMPLOYEES and VERTICALS
// entries and was therefore walked as part of `data`. Moving it out of the
// client bundle must not move it out of the tone rule: without these two
// imports every string in them silently stopped being checked while this file
// stayed green, which is a worse outcome than the bundle bloat that motivated
// the split.
import * as aiEmployeeDetails from "@/lib/ai-employee-details";
import * as verticalDetails from "@/lib/vertical-details";
import { LLMS_FULL_TXT, LLMS_TXT } from "@/lib/llms-content";
import { loadDicts } from "./helpers/dicts";
import { collectStrings } from "./helpers/strings";

// ── Why this file exists ──────────────────────────────────────────────────────
// The offer prices the WORK, never the person: a role covers "~$3,000/mo of
// front-desk work" and it never "replaces" anyone or "cuts your payroll". Copy
// that breaks the rule has shipped before. These assertions walk the DATA
// VALUES, not the file text, so the tone-rule reminders written in the source
// comments (which contain the banned words on purpose) are exempt.

const BANNED = [
  { label: "replac*", pattern: /replac/i },
  { label: "cut your payroll", pattern: /cut your payroll/i },
];

let copy: [string, string][];

beforeAll(() => {
  const dicts = loadDicts();
  copy = [
    ...collectStrings(data, "data.ts"),
    ...collectStrings(aiEmployeeDetails, "ai-employee-details.ts"),
    ...collectStrings(verticalDetails, "vertical-details.ts"),
    ...collectStrings(dicts.en, "i18n EN"),
    ...collectStrings(dicts.fa, "i18n FA"),
    ["llms-content.ts LLMS_TXT", LLMS_TXT],
    ["llms-content.ts LLMS_FULL_TXT", LLMS_FULL_TXT],
  ];
});

describe("tone rule — price the work, never the person", () => {
  it("collected the copy it is supposed to be checking", () => {
    // Guards the walker itself: if collectStrings ever returns nothing, every
    // assertion below would pass vacuously.
    expect(copy.length).toBeGreaterThan(200);
    const values = copy.map(([, v]) => v);
    expect(values).toContain("~$3,000/mo of front-desk work");
    expect(values.some((v) => v.includes("AI Receptionist"))).toBe(true);
    expect(values.some((v) => v.includes("کارمندان هوش مصنوعی"))).toBe(true);
    // And that BOTH split-out modules really arrived. `collectStrings` walking a
    // module namespace object that resolved to nothing returns [], which would
    // leave the longest copy on the site exempt while every assertion below
    // still passed on the remaining strings.
    const from = (prefix: string) =>
      copy.filter(([path]) => path.startsWith(prefix));
    expect(
      from("ai-employee-details.ts"),
      "the role prose is no longer being tone-checked"
    ).not.toEqual([]);
    expect(
      from("vertical-details.ts"),
      "the industry prose is no longer being tone-checked"
    ).not.toEqual([]);
  });

  it.each(BANNED)("has no user-facing copy matching $label", ({ pattern }) => {
    const offenders = copy
      .filter(([, value]) => pattern.test(value))
      .map(([path, value]) => `${path}: ${value.slice(0, 120)}`);
    expect(offenders).toEqual([]);
  });

  it("never names a human job as the thing being removed", () => {
    const offenders = copy
      .filter(([, v]) =>
        /(\bfires?\b|\bfiring\b|\blay(s)? off\b|\blaid off\b|\bpayroll\b|\bheadcount\b|\bsalar(y|ies)\b)/i.test(
          v
        )
      )
      .map(([path, value]) => `${path}: ${value.slice(0, 120)}`);
    expect(offenders).toEqual([]);
  });

  it("prices the workload as work, not as a person", () => {
    // "~$3,000/mo of front-desk work" is the shape; "a ~$3,000/mo receptionist"
    // is the defect. Every workload figure must be followed by "of <something>
    // work".
    for (const role of data.AI_EMPLOYEES) {
      expect(role.workload, `${role.slug} workload`).toMatch(
        /^~\$[\d,]+\+?\/mo of .*\bwork\b/
      );
    }
  });

  it("keeps the 90% claim attached to the work, not to a salary", () => {
    const ninety = copy.filter(([, v]) => /90%/.test(v));
    expect(ninety.length).toBeGreaterThan(0);
    for (const [path, value] of ninety) {
      expect(
        /(salary|salaries|wage|wages|payroll|headcount)/i.test(value),
        `${path} ties the 90% claim to pay rather than to the work`
      ).toBe(false);
    }
  });
});

// ── Source-file copy ─────────────────────────────────────────────────────────
// Everything above walks DATA VALUES: data.ts, the two dictionaries, and
// llms-content. That leaves the largest body of copy on the site — the prose
// typed straight into the components — completely exempt. It carries the offer
// (/services), the five role pitches, the FAQ answers and the hiring page, and a
// "replaces your receptionist" written into any of them would ship green. This
// scans their source text instead.
//
// Rooted at src/, not src/app: the pages are only half of it. Untranslated copy
// is written directly into src/components too (SectionCTA's default title and
// description, ServiceCard's footer label, the workplace/team prose blocks), and
// a scan that stopped at the route folder left every one of those exempt for the
// same reason the pages were.
describe("tone rule — the copy written directly into the source files", () => {
  const SRC = join(process.cwd(), "src");

  /** Every .tsx under src/, as [relative path, comment-stripped source]. */
  function pageSources(): [string, string][] {
    const out: [string, string][] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!entry.name.endsWith(".tsx")) continue;
        const source = readFileSync(full, "utf8")
          // Comments are stripped for the same reason the walk above reads
          // values rather than file text: this repo writes the tone rule down
          // in its own source comments ("never 'replaces' anyone"), and those
          // reminders contain the banned words on purpose.
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*$/gm, "")
          // `.replace(` / `.replaceAll(` are the JS string methods, not the
          // word. src/app/team/page.tsx renders `p.href.replace("https://www.",
          // "")` to trim a display URL. Dropping the member-access spelling is
          // narrower than loosening /replac/i: prose still fails, because
          // "replaces your receptionist" is not preceded by a dot.
          .replace(/\.replace(All)?\(/g, ".«strmethod»(");
        out.push([full.slice(process.cwd().length + 1), source]);
      }
    };
    walk(SRC);
    return out;
  }

  const SOURCES = pageSources();

  it("found the source files it is supposed to be scanning", () => {
    // Guards the walk: without this every assertion below passes on an empty
    // list, which is the same silent-green failure collectStrings has above.
    expect(SOURCES.length).toBeGreaterThan(30);
    const paths = SOURCES.map(([p]) => p);
    for (const page of [
      "services/page.tsx",
      "faq/page.tsx",
      "workplace/page.tsx",
      // The component half, which the src/app-rooted walk never reached.
      "components/section-cta.tsx",
      "components/service-card.tsx",
      "components/ai-employees.tsx",
    ]) {
      expect(paths.some((p) => p.endsWith(page)), `${page} not scanned`).toBe(true);
    }
    // And that the text really arrived, not just the filenames.
    expect(
      SOURCES.some(([, s]) => s.includes("AI employee") || s.includes("AI Employee"))
    ).toBe(true);
  });

  it.each(BANNED)("has no source-file copy matching $label", ({ pattern }) => {
    const offenders: string[] = [];
    for (const [path, source] of SOURCES) {
      source.split("\n").forEach((line, i) => {
        if (pattern.test(line)) {
          offenders.push(`${path}:${i + 1}: ${line.trim().slice(0, 120)}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});

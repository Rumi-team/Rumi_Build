import { beforeAll, describe, expect, it } from "vitest";
import * as data from "@/lib/data";
import {
  ONBOARDING_NOTE,
  PRICING_NOTE,
  WHITE_LABEL_NOTE,
} from "@/lib/data";
import type { Dict } from "@/lib/i18n";
import { LLMS_FULL_TXT, LLMS_TXT } from "@/lib/llms-content";
import { loadDicts } from "./helpers/dicts";
import { collectStrings } from "./helpers/strings";

// ── Why this file exists ──────────────────────────────────────────────────────
// The same promise is written out in three independent places: data.ts (which
// /services and all five role pages render), the EN/FA dictionaries (the
// homepage), and llms-content.ts (what AI engines cite verbatim). Nothing in the
// type system ties them together, so one copy edit silently contradicts the
// other two — src/lib/i18n.tsx even carries the comment "Facts here must match
// ONBOARDING_NOTE in src/lib/data.ts" with nothing behind it.
//
// The role prices are already cross-checked this way in ai-employees.test.ts.
// These are the prose claims that sit beside them: the go-live timeline, the
// white-label promise, and the 10%/90% explanation.

let EN: Dict;
let FA: Dict;

beforeAll(() => {
  const dicts = loadDicts();
  EN = dicts.en;
  FA = dicts.fa;
});

// ── Timeline parsing ─────────────────────────────────────────────────────────
// Both languages spell the range out in words ("one to three weeks",
// "یک تا سه هفته"), so each match is normalised to `1-3 weeks` and the
// normalised forms are compared. Nothing here restates the timeline itself —
// the sources are compared against each other, so a test can never agree with
// a typo just because the same number was pasted twice.

const EN_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12,
};

const FA_WORDS: Record<string, number> = {
  یک: 1, دو: 2, سه: 3, چهار: 4, پنج: 5,
  شش: 6, هفت: 7, هشت: 8, نه: 9, ده: 10,
};

const FA_UNITS: Record<string, string> = {
  روز: "days",
  هفته: "weeks",
  ماه: "months",
};

const EN_RANGE = new RegExp(
  `\\b(${Object.keys(EN_WORDS).join("|")}|\\d+)\\s+to\\s+` +
    `(${Object.keys(EN_WORDS).join("|")}|\\d+)\\s+(day|week|month)s?\\b`,
  "gi"
);

const FA_RANGE = new RegExp(
  `(${Object.keys(FA_WORDS).join("|")}|[۰-۹]+)\\s+تا\\s+` +
    `(${Object.keys(FA_WORDS).join("|")}|[۰-۹]+)\\s+(${Object.keys(FA_UNITS).join("|")})`,
  "g"
);

const fromPersianDigits = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

function enRanges(text: string): string[] {
  return [...text.matchAll(EN_RANGE)].map((m) => {
    const lo = EN_WORDS[m[1].toLowerCase()] ?? Number(m[1]);
    const hi = EN_WORDS[m[2].toLowerCase()] ?? Number(m[2]);
    return `${lo}-${hi} ${m[3].toLowerCase()}s`;
  });
}

function faRanges(text: string): string[] {
  return [...text.matchAll(FA_RANGE)].map((m) => {
    const lo = FA_WORDS[m[1]] ?? Number(fromPersianDigits(m[1]));
    const hi = FA_WORDS[m[2]] ?? Number(fromPersianDigits(m[2]));
    return `${lo}-${hi} ${FA_UNITS[m[3]]}`;
  });
}

describe("go-live timeline says the same thing on every surface", () => {
  it("parses a range out of a sentence, in either script", () => {
    // Guards the two parsers: every assertion below reads "no disagreement"
    // when they silently stop matching anything.
    expect(enRanges("Live in one to three weeks. We train the role")).toEqual([
      "1-3 weeks",
    ]);
    expect(enRanges("goes live in 2 to 4 months, managed by us")).toEqual([
      "2-4 months",
    ]);
    expect(enRanges("no range in this sentence at all")).toEqual([]);
    expect(faRanges("در یک تا سه هفته فعال می‌شود")).toEqual(["1-3 weeks"]);
    expect(faRanges("در ۲ تا ۴ ماه فعال می‌شود")).toEqual(["2-4 months"]);
    expect(faRanges("هیچ بازه‌ای در این جمله نیست")).toEqual([]);
  });

  it("states one and the same timeline in data.ts, the EN copy and /llms.txt", () => {
    const stated = [
      ...collectStrings(data, "data.ts"),
      ...collectStrings(EN, "i18n EN"),
      ["llms-content.ts LLMS_TXT", LLMS_TXT] as [string, string],
      ["llms-content.ts LLMS_FULL_TXT", LLMS_FULL_TXT] as [string, string],
    ].flatMap(([path, value]) =>
      enRanges(value).map((range) => [path, range] as const)
    );

    // Each of these renders the promise to a buyer on a different page, so each
    // one has to keep making it — a silently deleted timeline is the other half
    // of this defect.
    const paths = stated.map(([path]) => path);
    expect(paths, "ONBOARDING_NOTE no longer states a go-live timeline").toContain(
      "data.ts.ONBOARDING_NOTE"
    );
    expect(
      paths.filter((p) => p.startsWith("i18n EN.how.steps")),
      "the homepage 'how it works' step no longer states a go-live timeline"
    ).not.toEqual([]);
    expect(paths, "llms.txt no longer states a go-live timeline").toContain(
      "llms-content.ts LLMS_TXT"
    );
    expect(
      paths,
      "llms-full.txt no longer states a go-live timeline"
    ).toContain("llms-content.ts LLMS_FULL_TXT");

    const distinct = [...new Set(stated.map(([, range]) => range))];
    expect(
      distinct,
      `the go-live timeline disagrees between surfaces: ${stated
        .map(([path, range]) => `${path}=${range}`)
        .join("; ")}`
    ).toHaveLength(1);
  });

  it("states that same timeline in Farsi, in Persian words or numerals", () => {
    const canonical = enRanges(ONBOARDING_NOTE);
    expect(canonical).toHaveLength(1);

    const stated = collectStrings(FA, "i18n FA").flatMap(([path, value]) =>
      faRanges(value).map((range) => [path, range] as const)
    );
    expect(
      stated.map(([path]) => path),
      "no Farsi string states a go-live timeline any more"
    ).not.toEqual([]);
    for (const [path, range] of stated) {
      expect(range, `FA ${path} contradicts ONBOARDING_NOTE`).toBe(canonical[0]);
    }
  });
});

describe("data.ts prose the /services pages render", () => {
  it("keeps the three claims ONBOARDING_NOTE is on the page to make", () => {
    // Timeline is cross-checked above; these are the rest of the promise.
    expect(ONBOARDING_NOTE, "no longer says the role is trained on your own business")
      .toMatch(/\btrain/i);
    expect(ONBOARDING_NOTE, "no longer says our team keeps managing it").toMatch(
      /\bmanag/i
    );
    expect(ONBOARDING_NOTE, "no longer says it waits for your approval").toMatch(
      /\bapprov/i
    );
  });

  it("keeps the white-label promise, which is otherwise unrendered prose", () => {
    // The homepage says this through the dictionary (t.roles.whiteLabel); the
    // /services and role pages say it through WHITE_LABEL_NOTE. Both, or the
    // page ships an empty paragraph where the promise used to be.
    expect(WHITE_LABEL_NOTE).toMatch(/under your own brand/i);
    expect(WHITE_LABEL_NOTE).toMatch(/your customers only ever see you/i);
    expect(EN.roles.whiteLabel).toMatch(/under your own brand/i);
    expect(EN.roles.whiteLabel).toMatch(/your customers only ever see you/i);
  });

  it("keeps PRICING_NOTE explaining how the price is set, not just what it is", () => {
    // The arithmetic (price === 10% of workload) and the badge wording are
    // pinned in ai-employees.test.ts. This is the sentence that tells a buyer
    // why the number is what it is, on six pages.
    expect(PRICING_NOTE, "no longer explains the price as a tenth").toMatch(
      /\btenth\b|\b10%/
    );
    expect(PRICING_NOTE, "no longer says the listed number is a starting point")
      .toMatch(/where a role starts|starting|from \$/i);
    expect(PRICING_NOTE, "no longer says the commitment is month to month")
      .toMatch(/month to month/i);
  });

  it("leaves no exported copy string in data.ts empty", () => {
    // i18n-parity.test.ts does exactly this for the two dictionaries. data.ts
    // needs it too: an emptied export renders an empty <p> rather than failing
    // the build, which is how WHITE_LABEL_NOTE could have gone missing unseen.
    const ALLOWED_EMPTY = [
      // Legacy field. The rendered team section (src/components/team.tsx)
      // carries its own school strings; these three are deliberately blank.
      "data.ts.TEAM[0].school",
      "data.ts.TEAM[1].school",
      "data.ts.TEAM[2].school",
    ];

    const strings = collectStrings(data, "data.ts");
    expect(strings.length, "the export walk came up short").toBeGreaterThan(150);
    const paths = strings.map(([path]) => path);
    for (const allowed of ALLOWED_EMPTY) {
      expect(paths, `${allowed} is gone — prune the allowlist`).toContain(allowed);
    }

    const empty = strings
      .filter(([, value]) => value.trim() === "")
      .map(([path]) => path)
      .filter((path) => !ALLOWED_EMPTY.includes(path));
    expect(empty).toEqual([]);
  });

  it("never sells reception as an unpriced extra in llms-content", () => {
    // llms-content.ts declares itself "the source of truth" for AI crawlers, and
    // it shipped a self-contradiction: one paragraph states reception and
    // multilingual answering are deliberately NOT extras (that work is the AI
    // Receptionist, priced as a role), while the crawler-directed paragraph
    // listed "a multilingual AI front desk" among what Rumi "also builds and
    // runs" — i.e. as an unpriced extra. An engine quoting this file verbatim
    // would tell a buyer they can get reception without paying for the role.
    for (const [name, text] of [
      ["LLMS_TXT", LLMS_TXT],
      ["LLMS_FULL_TXT", LLMS_FULL_TXT],
    ] as const) {
      // Anchor on the sentence that enumerates the extras, not the whole file:
      // the exclusion statement itself legitimately says these words.
      const alsoBuilds = text.match(/also builds and runs[^.]*/gi) ?? [];
      expect(
        alsoBuilds.length,
        `${name} no longer describes the extra services — re-anchor this test`,
      ).toBeGreaterThan(0);

      for (const sentence of alsoBuilds) {
        expect(
          sentence,
          `${name} sells reception/answering as an unpriced extra: "${sentence}"`,
        ).not.toMatch(/front desk|reception|answering/i);
      }
    }
  });
});

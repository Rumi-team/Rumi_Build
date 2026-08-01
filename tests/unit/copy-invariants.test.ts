// @vitest-environment jsdom
// Needs a DOM: this file reads the dictionaries through helpers/dicts.tsx,
// which mounts LanguageProvider. The suite defaults to `node`
// (vitest.config.ts); only the files that render opt in.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import * as data from "@/lib/data";
import {
  ONBOARDING_NOTE,
  PRICING_NOTE,
  WHITE_LABEL_NOTE,
} from "@/lib/data";
// The two server-only detail modules the role and industry prose moved into,
// so it stopped shipping in the client bundle through the footer. Walked here
// for the same reason tone.test.ts walks them: the empty-string check below is
// about copy that renders, and most of the copy that renders now lives there.
import * as aiEmployeeDetails from "@/lib/ai-employee-details";
import * as verticalDetails from "@/lib/vertical-details";
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

// The same range written as a hyphenated numeral pair — "live in 1-3 weeks".
// data.ts and the dictionaries spell it out; the page files below write it this
// way, and matching only the spelled-out form is exactly why those three
// surfaces were unpinned. Digits only, and a plain hyphen only: this copy is
// full of em-dashes ("trained on your business — live in ...") and an
// em-dash alternative here would start reading two unrelated numbers as a range.
const EN_HYPHEN_RANGE = /\b(\d+)\s*-\s*(\d+)\s+(day|week|month)s?\b/gi;

const FA_RANGE = new RegExp(
  `(${Object.keys(FA_WORDS).join("|")}|[۰-۹]+)\\s+تا\\s+` +
    `(${Object.keys(FA_WORDS).join("|")}|[۰-۹]+)\\s+(${Object.keys(FA_UNITS).join("|")})`,
  "g"
);

const fromPersianDigits = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

function enRanges(text: string): string[] {
  return [
    ...[...text.matchAll(EN_RANGE)],
    ...[...text.matchAll(EN_HYPHEN_RANGE)],
  ].map((m) => {
    const lo = EN_WORDS[m[1].toLowerCase()] ?? Number(m[1]);
    const hi = EN_WORDS[m[2].toLowerCase()] ?? Number(m[2]);
    return `${lo}-${hi} ${m[3].toLowerCase()}s`;
  });
}

// ── Page-file surfaces ───────────────────────────────────────────────────────
// These four write the timeline into metadata and JSX as a literal rather than
// importing ONBOARDING_NOTE, so nothing tied them to it: each could be edited to
// a different number and every assertion in this file would still pass. They are
// read as SOURCE TEXT (comments stripped, so a comment discussing the timeline
// is not mistaken for a claim made to a buyer) and folded into the same
// agreement check as the data and dictionary surfaces.
//
// /faq is the one a buyer is most likely to read the answer on ("we get it live
// in one to three weeks", the first answer on the page) and was the one left
// out — it spells the range in words where the other page files hyphenate it,
// so the surface that phrases the promise differently was also the surface
// nothing compared.
const PAGE_SURFACES = [
  join("src", "app", "layout.tsx"),
  join("src", "app", "services", "page.tsx"),
  join("src", "app", "services", "[slug]", "page.tsx"),
  join("src", "app", "faq", "page.tsx"),
];

function pageText(relative: string): string {
  return readFileSync(join(process.cwd(), relative), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
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
    // The hyphenated spelling the page files use, normalising to the same form.
    expect(enRanges("trained on your business, live in 1-3 weeks, managed")).toEqual([
      "1-3 weeks",
    ]);
    expect(enRanges("live in 2 - 4 months")).toEqual(["2-4 months"]);
    // An em-dash between two numbers is punctuation, not a range: "5 — three
    // weeks" and "$1,200 — 630 days later" must not parse.
    expect(enRanges("about 90% less — 3 weeks in")).toEqual([]);
    expect(enRanges("no range in this sentence at all")).toEqual([]);
    expect(faRanges("در یک تا سه هفته فعال می‌شود")).toEqual(["1-3 weeks"]);
    expect(faRanges("در ۲ تا ۴ ماه فعال می‌شود")).toEqual(["2-4 months"]);
    expect(faRanges("هیچ بازه‌ای در این جمله نیست")).toEqual([]);
  });

  it("states one and the same timeline in data.ts, the EN copy and /llms.txt", () => {
    const stated = [
      ...collectStrings(data, "data.ts"),
      ...collectStrings(aiEmployeeDetails, "ai-employee-details.ts"),
      ...collectStrings(verticalDetails, "vertical-details.ts"),
      ...collectStrings(EN, "i18n EN"),
      ["llms-content.ts LLMS_TXT", LLMS_TXT] as [string, string],
      ["llms-content.ts LLMS_FULL_TXT", LLMS_FULL_TXT] as [string, string],
      ...PAGE_SURFACES.map((rel) => [rel, pageText(rel)] as [string, string]),
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
    // Each page file writes the timeline as its own literal rather than
    // importing ONBOARDING_NOTE, so each has to keep stating one — a silently
    // deleted claim is the other half of this defect, exactly as above.
    for (const rel of PAGE_SURFACES) {
      expect(paths, `${rel} no longer states a go-live timeline`).toContain(rel);
    }

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

  it("leaves no exported copy string in data.ts or the detail modules empty", () => {
    // i18n-parity.test.ts does exactly this for the two dictionaries. data.ts
    // needs it too: an emptied export renders an empty <p> rather than failing
    // the build, which is how WHITE_LABEL_NOTE could have gone missing unseen.
    // No allowlist. `TEAM[*].school` used to be exempted here on the grounds
    // that src/components/team.tsx carried its own school strings — which was
    // never true of the page that renders (/team reads TEAM from this module and
    // never showed a school), and stopped being true of anything at all when
    // that unimported component was deleted. The field went with it, so every
    // exported string in data.ts is now genuinely required to be non-empty.
    const byModule = {
      "data.ts": collectStrings(data, "data.ts"),
      "ai-employee-details.ts": collectStrings(
        aiEmployeeDetails,
        "ai-employee-details.ts"
      ),
      "vertical-details.ts": collectStrings(verticalDetails, "vertical-details.ts"),
    };
    const strings = Object.values(byModule).flat();

    // WALKER GUARD, not a content target. Retuned twice now, and the second
    // retune is the reason each module is counted separately below rather than
    // one number for the lot:
    //   - It was >250 against a data.ts that walked to 310, back when the role
    //     and industry prose still lived on the AI_EMPLOYEES and VERTICALS
    //     entries.
    //   - That prose has since moved to the two detail modules (it was shipping
    //     in the client bundle on every route through the footer). Measured
    //     today: data.ts 119, ai-employee-details.ts 60, vertical-details.ts 51
    //     — 230 in total, against the 310 data.ts alone used to walk to. A
    //     single combined bound would have kept passing if one of the two new
    //     modules silently stopped being walked, which is exactly the failure
    //     this split introduced the risk of.
    // Each bound keeps roughly 20% slack under its measured count, so ordinary
    // copy edits never trip it while a collectStrings that stops recursing, or
    // an import that resolves to an empty namespace, fails here rather than
    // letting the empty check below pass vacuously.
    const FLOOR: Record<keyof typeof byModule, number> = {
      "data.ts": 95,
      "ai-employee-details.ts": 48,
      "vertical-details.ts": 40,
    };
    for (const [module, floor] of Object.entries(FLOOR)) {
      expect(
        byModule[module as keyof typeof byModule].length,
        `the export walk came up short on ${module}`
      ).toBeGreaterThan(floor);
    }

    // CONFIG, NOT COPY — the only exemption, and it is a category difference
    // rather than a "this one is fine" allowlist. These two are read from
    // NEXT_PUBLIC_CAL_LINK_60MIN, and "" is their correct value until someone
    // creates the 60-minute Cal.com event type: /book/success reads that empty
    // string as "no calendar of the right length exists" and renders its
    // email-you-times fallback instead of handing a 60-minute buyer the
    // 30-minute calendar. Nothing renders them as text, so an empty one cannot
    // produce the empty <p> this assertion exists to catch. Every exported
    // COPY string is still required to be non-empty, including any new one.
    const ENV_SOURCED = new Set([
      "data.ts.CAL_LINK_60MIN",
      "data.ts.CALENDLY_URL_60MIN",
    ]);
    const empty = strings
      .filter(([path, value]) => value.trim() === "" && !ENV_SOURCED.has(path))
      .map(([path]) => path);
    expect(empty).toEqual([]);

    // And the exemption cannot quietly outlive what it exempts: if one of these
    // is deleted or renamed, the stale entry above must fail rather than sit
    // there widening the rule for whatever takes the name next.
    const paths = new Set(strings.map(([path]) => path));
    for (const path of ENV_SOURCED) {
      expect(paths.has(path), `${path} no longer exists — drop its exemption`).toBe(
        true
      );
    }
  });

  it("never sells reception as an unpriced extra in llms-content", () => {
    // llms-content.ts declares itself "the source of truth" for AI crawlers, and
    // it shipped a self-contradiction: one paragraph states reception and
    // multilingual answering are deliberately NOT extras (that work is the AI
    // Receptionist, priced as a role), while the crawler-directed paragraph
    // listed "a multilingual AI front desk" among what Rumi "also builds and
    // runs" — i.e. as an unpriced extra. An engine quoting this file verbatim
    // would tell a buyer they can get reception without paying for the role.
    // Anchoring on "also builds and runs" alone only ever read the
    // one-sentence summaries. The place a new extra actually gets added is the
    // bullet list under the "Extra services" heading, which went unread — so
    // both are scanned here. The exclusion statement lives inside that same
    // block and legitimately says these words, so it is separated out first,
    // and required: deleting it is the other half of this defect.
    const EXTRAS_HEADING = /^#{2,4} Extra services\s*$/m;
    const EXCLUSION = /\bnot extras\b|\bNOT on this list\b/;
    const AS_AN_EXTRA = /front desk|reception|answering/i;

    for (const [name, text] of [
      ["LLMS_TXT", LLMS_TXT],
      ["LLMS_FULL_TXT", LLMS_FULL_TXT],
    ] as const) {
      const start = text.search(EXTRAS_HEADING);
      expect(
        start,
        `${name} has no "Extra services" heading — re-anchor this test`,
      ).toBeGreaterThan(-1);

      // The heading down to the next heading of any level: the intro prose and
      // the bullets under it.
      const rest = text.slice(start);
      const nextHeading = rest.search(/\n#{1,6} \S/);
      const block = nextHeading === -1 ? rest : rest.slice(0, nextHeading);

      // Bullets come out FIRST, and are only ever sentence-split within their
      // own line. Sentence-splitting the whole block on /(?<=\.)\s+/ needs a
      // period to break on, and `\s+` crosses newlines — so a bullet with no
      // trailing period (the normal way a short list item gets written) merges
      // with whatever follows it. When what follows is the exclusion statement,
      // the merged chunk tests as an exclusion, drops out of `enumerated`, and
      // the new bullet is never scanned at all. That is the exact escape hatch
      // this block exists to close: "- A multilingual AI front desk" added
      // above the exclusion sentence would have shipped green.
      const IS_BULLET = /^\s*[-*]\s+/;
      const lines = block.split("\n");
      const bulletLines = lines.filter((line) => IS_BULLET.test(line));
      expect(
        bulletLines,
        `${name} lists no extras under "Extra services" — re-anchor this test`,
      ).not.toEqual([]);

      const split = (s: string) =>
        s.split(/(?<=\.)\s+/).filter((part) => part.trim() !== "");

      const sentences = [
        // Per line, so no newline can join two bullets — or a bullet and the
        // prose under it — into one chunk. A bullet long enough to carry the
        // exclusion in its own last sentence (LLMS_TXT writes it that way)
        // still splits correctly, because this splits inside the line too.
        ...bulletLines.flatMap(split),
        ...split(lines.filter((line) => !IS_BULLET.test(line)).join("\n")),
      ];

      const exclusions = sentences.filter((s) => EXCLUSION.test(s));
      expect(
        exclusions,
        `${name} no longer says reception is a priced role rather than an extra`,
      ).not.toEqual([]);
      for (const sentence of exclusions) {
        expect(
          sentence,
          `${name}'s exclusion sentence no longer names the work it excludes`,
        ).toMatch(AS_AN_EXTRA);
      }

      // The summaries still get read too — that is where the original defect
      // ("a multilingual AI front desk" among what Rumi also builds) shipped.
      const alsoBuilds = text.match(/also builds and runs[^.]*/gi) ?? [];
      expect(
        alsoBuilds.length,
        `${name} no longer describes the extra services — re-anchor this test`,
      ).toBeGreaterThan(0);

      const enumerated = [
        ...sentences.filter((s) => !EXCLUSION.test(s)),
        ...alsoBuilds,
      ];
      for (const sentence of enumerated) {
        expect(
          sentence,
          `${name} sells reception/answering as an unpriced extra: "${sentence}"`,
        ).not.toMatch(AS_AN_EXTRA);
      }
    }
  });
});

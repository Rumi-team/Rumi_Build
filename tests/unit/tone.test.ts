import { beforeAll, describe, expect, it } from "vitest";
import * as data from "@/lib/data";
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

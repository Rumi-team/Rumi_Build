import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  AI_EMPLOYEES,
  BUNDLE_ROLES,
  getAIEmployeeBySlug,
} from "@/lib/data";

// ── Why this file exists ──────────────────────────────────────────────────────
// ai-employees.test.ts cross-checks the role prices against data.ts, the two
// dictionaries and llms-content.ts. Three more surfaces restate the same five
// numbers and none of them is reachable from those walks, because the copy is
// module-private inside a page file:
//   - src/app/layout.tsx — the site title, description and both social cards.
//   - src/app/services/page.tsx — TITLE/DESCRIPTION, which list all five prices.
//   - src/app/faq/page.tsx — the FAQS array, which lists all five and a range.
// A price change touches data.ts and the dictionaries (both tested) and leaves
// these three quoting the old figure in the <title>, the search snippet and the
// social preview. Everything below is parsed out of the source rather than
// restated, so a test can never agree with a typo.

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

/** `$3,000/mo` and `~$12,000/mo` -> 3000 / 12000. Requires the /mo unit, so the
 *  $100 call fee and the founders' "$1B+" credentials are out of scope. The
 *  optional `+` is kept for the "~$9,000+/mo" spelling the Chief of Staff used
 *  to carry: no figure is written that way today, but the regex must keep
 *  parsing one if it comes back rather than skipping it as unquoted. */
const PER_MONTH = /\$\s?([\d,]+)\+?\/mo/g;
const figure = (raw: string) => Number(raw.replace(/,/g, ""));

/** Every figure the offer actually holds: a price, a workload, or a bundle sum. */
const CANONICAL = new Set([
  ...AI_EMPLOYEES.map((r) => figure(r.priceFrom.match(PER_MONTH.source)![1])),
  ...AI_EMPLOYEES.map((r) => figure(r.workload.match(/\$\s?([\d,]+)/)![1])),
  ...BUNDLE_ROLES.map((bundle) =>
    bundle
      .includes!.map((slug) =>
        figure(getAIEmployeeBySlug(slug)!.priceFrom.match(/\$\s?([\d,]+)/)![1])
      )
      .reduce((a, b) => a + b, 0)
  ),
]);

const PRICES = AI_EMPLOYEES.map((r) =>
  figure(r.priceFrom.match(/\$\s?([\d,]+)/)![1])
);

function quoted(text: string): number[] {
  return [...text.matchAll(PER_MONTH)].map((m) => figure(m[1]));
}

describe("monthly figures quoted anywhere in src/", () => {
  it("quotes no monthly figure the role data does not hold", () => {
    const files = sourceFiles(SRC);
    // Guards the scan: it would pass vacuously if the walk or the regex broke.
    expect(files.length).toBeGreaterThan(20);
    expect(CANONICAL.size).toBeGreaterThanOrEqual(8);

    let seen = 0;
    const offenders: string[] = [];
    for (const file of files) {
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const amount of quoted(line)) {
            seen += 1;
            if (!CANONICAL.has(amount)) {
              offenders.push(`${relative(ROOT, file)}:${i + 1} $${amount}/mo`);
            }
          }
        });
    }
    expect(seen, "no monthly figure found at all — the scan is broken")
      .toBeGreaterThan(30);
    expect(
      offenders,
      "figure quoted that is not a role price, a workload, or a bundle total"
    ).toEqual([]);
  });

  it("leads the site title and the hub title with the cheapest role", () => {
    // Both titles hook on one number ("from $300/mo"), and it has to be the
    // lowest price on the site or the <title> undersells or oversells the offer.
    const cheapest = Math.min(...PRICES);
    for (const file of ["app/layout.tsx", "app/services/page.tsx"]) {
      const text = readFileSync(join(SRC, file), "utf8");
      const titles = [...text.matchAll(/title:\s*(?:TITLE|"([^"]+)")/g)]
        .map((m) => m[1])
        .filter((t): t is string => !!t);
      const hub = text.match(/^const TITLE =\s*\n?\s*"([^"]+)"/m);
      const all = hub ? [...titles, hub[1]] : titles;
      expect(all.length, `${file} exposes no title to check`).toBeGreaterThan(0);
      for (const title of all) {
        expect(quoted(title), `${file} title "${title}"`).toEqual([cheapest]);
      }
    }
  });
});

describe("the FAQ's pricing answers", () => {
  const FAQ = readFileSync(join(SRC, "app", "faq", "page.tsx"), "utf8");

  it("names every role at its real price and bounds the range correctly", () => {
    expect(FAQ.length, "the FAQ source came back empty").toBeGreaterThan(1000);

    for (const role of AI_EMPLOYEES) {
      expect(FAQ, `the FAQ never names the ${role.name}`).toContain(role.name);
      expect(
        FAQ,
        `the FAQ never quotes the ${role.name}'s price (${role.priceFrom})`
      ).toContain(`from ${role.priceFrom}`);
    }

    // Exactly the five role prices, nothing invented and nothing stale — the
    // "how much does this cost" answer states a range, and its endpoints have to
    // be the cheapest and priciest roles the site actually sells.
    const stated = [...new Set(quoted(FAQ))].sort((a, b) => a - b);
    expect(stated, "the FAQ's prices are not the five role prices").toEqual(
      [...new Set(PRICES)].sort((a, b) => a - b)
    );
    expect(Math.min(...stated)).toBe(Math.min(...PRICES));
    expect(Math.max(...stated)).toBe(Math.max(...PRICES));
  });
});

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  AI_EMPLOYEES,
  BUNDLE_ROLES,
  getAIEmployeeBySlug,
} from "@/lib/data";
import {
  CALL_OPTIONS,
  DEFAULT_CALL_OPTION_ID,
  getCallOption,
} from "@/lib/stripe";

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
 *  one-off strategy-call fees and the founders' "$1B+" credentials are out of
 *  scope here — the call prices get their own guard at the bottom of this file,
 *  read out of CALL_OPTIONS. The optional `+` is kept for the "~$9,000+/mo"
 *  spelling the Chief of Staff used to carry: no figure is written that way
 *  today, but the regex must keep parsing one if it comes back rather than
 *  skipping it as unquoted. */
const PER_MONTH = /\$\s?([\d,]+)\+?\/mo/g;
const figure = (raw: string) => Number(raw.replace(/,/g, ""));

/** Every `$N`, tagged with whether it carried the `/mo` unit. Matching both and
 *  filtering afterwards rather than writing a negative lookahead: `[\d,]+` is
 *  greedy, so `(?!\/mo)` on `$300/mo` backtracks to "$30" and reports a figure
 *  the copy never wrote. */
const ANY_DOLLARS = /\$\s?([\d,]+)(\+?)(\/mo)?/g;
const oneOffFigures = (text: string): number[] =>
  [...text.matchAll(ANY_DOLLARS)]
    .filter((m) => !m[3])
    .map((m) => figure(m[1]));

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

// ── The one-off call ─────────────────────────────────────────────────────────
// The roles are billed monthly and every figure above carries `/mo`. The
// strategy call is a one-off and does not, which is why it fell outside the
// scan above and — until this block — had no unit guard at all: its price lived
// as a literal in the <title>, the H1 and the submit button, and only the
// button was covered, by one e2e assertion. Three copies of a number with one
// test on it is how a price change ships half-applied.
//
// Everything here derives from CALL_OPTIONS, the catalog /api/checkout charges
// from. Writing 75 or 125 into this file would make it a fourth copy.
describe("the one-off strategy call price", () => {
  it("keeps the option catalog internally consistent", () => {
    expect(CALL_OPTIONS.length, "the call is no longer offered in two lengths")
      .toBeGreaterThan(1);

    for (const option of CALL_OPTIONS) {
      // The display string and the number are two spellings of one price, and
      // the display string is the one every page renders.
      expect(option.price, `${option.id}: display price disagrees with amountUsd`)
        .toBe(`$${option.amountUsd}`);
      expect(option.label, `${option.id}: the label hides its own length`)
        .toContain(String(option.minutes));
      expect(option.minutes).toBeGreaterThan(0);
      expect(option.blurb.trim(), `${option.id} has no blurb to render`).not.toBe("");
      expect(option.envVar).toMatch(/^STRIPE_PRICE_ID_/);
    }

    const ids = CALL_OPTIONS.map((o) => o.id);
    expect(new Set(ids).size, "two options share an id").toBe(ids.length);
    const minutes = CALL_OPTIONS.map((o) => o.minutes);
    expect(new Set(minutes).size, "two options are the same length").toBe(
      minutes.length
    );

    // The default has to resolve, or /book pre-selects a card that /api/checkout
    // will refuse; and junk has to not resolve, which is what makes an unknown
    // duration a 400 rather than a charge at whichever price sorted first.
    expect(getCallOption(DEFAULT_CALL_OPTION_ID)?.id).toBe(DEFAULT_CALL_OPTION_ID);
    expect(getCallOption("45min")).toBeUndefined();
    expect(getCallOption(undefined)).toBeUndefined();

    // Longer must cost more. A cheaper long call is not a typo anyone spots in
    // review — it is two independent numbers that happen to have crossed.
    const byLength = [...CALL_OPTIONS].sort((a, b) => a.minutes - b.minutes);
    for (let i = 1; i < byLength.length; i += 1) {
      expect(
        byLength[i].amountUsd,
        `${byLength[i].label} costs no more than ${byLength[i - 1].label}`
      ).toBeGreaterThan(byLength[i - 1].amountUsd);
    }

    // A Cal.com event belongs to exactly one length. An empty calLink is
    // legitimate — it means that event type does not exist yet and the success
    // page owes the buyer an email instead — but two options sharing one
    // non-empty slug hands one of them a booking of the wrong length that
    // looks like it worked, and is discovered by the customer on the call.
    // (The e2e suite cannot see this: NEXT_PUBLIC_CAL_LINK_60MIN is unset
    // there, so the comparison it used to make was "" against a literal.)
    const links = CALL_OPTIONS.map((o) => o.calLink).filter(Boolean);
    expect(new Set(links).size, "two lengths book the same Cal.com event").toBe(
      links.length
    );
    for (const option of CALL_OPTIONS) {
      expect(
        Boolean(option.calUrl),
        `${option.id}: calLink and calUrl disagree about whether a calendar exists`
      ).toBe(Boolean(option.calLink));
      if (option.calLink) {
        expect(
          option.calUrl,
          `${option.id}: the new-tab link opens a different event than the embed`
        ).toContain(option.calLink);
      }
    }
  });

  it("reads each price id from the environment variable its own envVar names", async () => {
    // THE line this whole change turns on, and the one thing no other test in
    // the suite can see: checkout-route.test.ts and checkout-verification.tsx
    // both replace @/lib/stripe with a fixture, and the source check below is a
    // substring scan that a SWAPPED pair still satisfies — both reads are still
    // present, just attached to the wrong options. Swapped in production it
    // charges the short price for the hour and the long price for the half and
    // looks completely normal on every page. So this case loads the real module
    // against known values.
    const before = {
      STRIPE_PRICE_ID_30MIN: process.env.STRIPE_PRICE_ID_30MIN,
      STRIPE_PRICE_ID_60MIN: process.env.STRIPE_PRICE_ID_60MIN,
    };
    process.env.STRIPE_PRICE_ID_30MIN = "sentinel_thirty";
    process.env.STRIPE_PRICE_ID_60MIN = "sentinel_sixty";
    try {
      vi.resetModules();
      const fresh = await import("@/lib/stripe");

      // Ties each option to the variable its own `envVar` names, so the string
      // an operator is told to go and set is the string that was read.
      for (const option of fresh.CALL_OPTIONS) {
        expect(
          option.priceId,
          `${option.id} does not read ${option.envVar}`
        ).toBe(process.env[option.envVar]);
      }
      // …and the pair is not swapped, which the walk above alone would miss if
      // the envVar labels were swapped with the reads.
      expect(
        fresh.getCallOption("30min")!.priceId,
        "the 30-minute option is charging the 60-minute price id"
      ).toBe("sentinel_thirty");
      expect(
        fresh.getCallOption("60min")!.priceId,
        "the 60-minute option is charging the 30-minute price id"
      ).toBe("sentinel_sixty");
    } finally {
      for (const [key, value] of Object.entries(before)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
      vi.resetModules();
    }
  });

  it("reads both Stripe price ids from the environment and hardcodes neither", () => {
    // Live and test price ids differ. One pasted into the source charges the
    // wrong account, and it is the kind of literal that survives review because
    // it looks like configuration.
    const source = readFileSync(join(SRC, "lib", "stripe.ts"), "utf8");
    for (const option of CALL_OPTIONS) {
      expect(
        source,
        `${option.envVar} is not read from the environment with an empty default`
      ).toContain(`process.env.${option.envVar} || ""`);
    }
    expect(source, "a Stripe price id is written into the source").not.toMatch(
      /price_[A-Za-z0-9]{6,}/
    );
    expect(source, "a Stripe secret key is written into the source").not.toMatch(
      /sk_(live|test)_/
    );
  });

  it("quotes no one-off figure the call catalog does not hold", () => {
    // Same rule as the monthly scan, over the surfaces that actually sell or
    // describe the call. `/mo` figures are excluded — those are role prices and
    // the scan at the top of this file owns them.
    const allowed = new Set(CALL_OPTIONS.map((o) => o.amountUsd));
    const SURFACES = [
      "app/book/page.tsx",
      "app/book/book-form.tsx",
      "app/book/success/page.tsx",
      "app/faq/page.tsx",
      "app/schedule/page.tsx",
      // /workplace pitches the same call in prose and was outside every scan.
      // Its duration claims ("30 or 60 minutes") are hand-written by design —
      // see the note in that file — but its dollar figures are checked here.
      "app/workplace/page.tsx",
      "lib/llms-content.ts",
    ];

    let seen = 0;
    const offenders: string[] = [];
    for (const file of SURFACES) {
      readFileSync(join(SRC, file), "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const amount of oneOffFigures(line)) {
            seen += 1;
            if (!allowed.has(amount)) offenders.push(`${file}:${i + 1} $${amount}`);
          }
        });
    }
    expect(seen, "no one-off figure found at all — the scan is broken")
      .toBeGreaterThan(3);
    expect(
      offenders,
      "a one-off dollar figure quoted that is not one of the call prices"
    ).toEqual([]);
  });

  it("states both lengths and both prices wherever it describes the call", () => {
    // One option quoted and the other left out is worse than neither: it reads
    // as the price, and /faq plus llms-content are the two surfaces AI engines
    // and search snippets lift verbatim.
    for (const file of ["app/faq/page.tsx", "lib/llms-content.ts"]) {
      const text = readFileSync(join(SRC, file), "utf8");
      for (const option of CALL_OPTIONS) {
        expect(
          text,
          `${file} never quotes the ${option.label} call at ${option.price}`
        ).toContain(option.price);
        expect(
          text,
          `${file} never states the ${option.label} length`
        ).toContain(String(option.minutes));
      }
    }
  });

  it("never restates a call price on the two pages that take the money", () => {
    // /book and its form render the price four times between them — title,
    // search snippet, social card, H1, option cards, submit button. Every one
    // has to come from CALL_OPTIONS, so a repricing is one edit in one file and
    // cannot leave a stale figure behind on the page that charges the card.
    for (const file of ["app/book/page.tsx", "app/book/book-form.tsx"]) {
      const text = readFileSync(join(SRC, file), "utf8");
      expect(
        oneOffFigures(text),
        `${file} writes a price out instead of reading the catalog`
      ).toEqual([]);
      expect(
        /CALL_OPTIONS|options\b/.test(text),
        `${file} no longer reads the call catalog at all`
      ).toBe(true);
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

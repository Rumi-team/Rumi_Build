// @vitest-environment jsdom
// Needs a DOM: this file reads the dictionaries through helpers/dicts.tsx,
// which mounts LanguageProvider. The suite defaults to `node`
// (vitest.config.ts); only the files that render opt in.
import { beforeAll, describe, expect, it } from "vitest";
import {
  AI_EMPLOYEES,
  BUNDLE_ROLES,
  CORE_ROLES,
  PRICING_NOTE,
  SAVING_LABEL,
  VERTICALS,
  getAIEmployeeBySlug,
  getVerticalBySlug,
  type AIEmployee,
} from "@/lib/data";
// The role prose moved out of data.ts and into a server-only module so it stops
// shipping in the client bundle through the footer — see the header of either
// file. The assertions that used to read `role.features` read it here now.
import { AI_EMPLOYEE_DETAILS } from "@/lib/ai-employee-details";
import { VERTICAL_DETAILS } from "@/lib/vertical-details";
import { LLMS_FULL_TXT, LLMS_TXT } from "@/lib/llms-content";
// The paid call's two prices. llms-content quotes them alongside the role
// prices, and the scan below refuses any figure the data does not hold — so the
// catalog is imported rather than 75 and 125 being written in here, which is
// what would let the file agree with a typo.
import { CALL_OPTIONS } from "@/lib/stripe";
import { loadDicts } from "./helpers/dicts";

// ── Why this file exists ──────────────────────────────────────────────────────
// Two defect classes, both of which have happened here:
//  1. A dangling slug. `includes` and `relatedVerticals` are plain strings, so
//     a renamed role or vertical leaves a reference pointing at nothing — the
//     bundle page silently drops a card instead of failing to build.
//  2. Pricing drift. The three core roles are priced at exactly 10% of the
//     workload they cover; that is the whole offer ("90% off"). A bundle covers
//     the SUM of its roles' workloads and may beat the rule but never fall
//     short of it. The numbers below are parsed out of the strings rather than
//     restated, so this test cannot agree with a typo just because someone
//     updated a duplicate table.
//  3. A bundle whose headline workload is not the sum of its parts. The Chief
//     of Staff advertised ~$9,000+/mo while the three roles inside it listed
//     3,000 + 5,000 + 4,000 — two numbers a screen apart that did not add up,
//     and the copy had to work around it rather than fix it. The sum is now an
//     invariant, so that class cannot come back for either bundle.

/** First dollar figure in a string: "~$3,000+/mo of work" -> 3000. */
function dollars(text: string): number {
  const match = text.match(/\$\s?([\d,]+)/);
  if (!match) throw new Error(`no dollar figure in: ${text}`);
  return Number(match[1].replace(/,/g, ""));
}

/** Persian-numeral aware: "از ۳۰۰ دلار در ماه" -> 300, "$300/mo" -> 300. */
function anyDigits(text: string): number {
  const ascii = text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  const match = ascii.match(/([\d,٬]+)/);
  if (!match) throw new Error(`no numerals in: ${text}`);
  return Number(match[1].replace(/[,٬]/g, ""));
}

describe("AI employee data shape", () => {
  it("has exactly five roles: three core and two bundles", () => {
    expect(AI_EMPLOYEES).toHaveLength(5);
    expect(CORE_ROLES.map((r) => r.slug)).toEqual([
      "ai-receptionist",
      "ai-executive-assistant",
      "ai-social-media-manager",
    ]);
    expect(BUNDLE_ROLES.map((r) => r.slug)).toEqual([
      "ai-office-manager",
      "ai-chief-of-staff",
    ]);
  });

  it("partitions the roles: core has no includes, every bundle has 2+", () => {
    expect([...CORE_ROLES, ...BUNDLE_ROLES].map((r) => r.slug).sort()).toEqual(
      AI_EMPLOYEES.map((r) => r.slug).sort()
    );
    for (const role of CORE_ROLES) {
      expect(role.includes, `${role.slug} must not be a bundle`).toBeUndefined();
    }
    for (const role of BUNDLE_ROLES) {
      expect(
        role.includes!.length,
        `${role.slug} is a bundle of fewer than two roles`
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("gives every role a unique slug and a non-empty name, icon and tagline", () => {
    expect(new Set(AI_EMPLOYEES.map((r) => r.slug)).size).toBe(
      AI_EMPLOYEES.length
    );
    for (const role of AI_EMPLOYEES) {
      expect(role.slug).toMatch(/^[a-z0-9-]+$/);
      expect(role.name.length).toBeGreaterThan(0);
      expect(role.icon.length).toBeGreaterThan(0);
      expect(role.tagline.length).toBeGreaterThan(0);
    }
  });
});

describe("the split-out detail modules stay joined to the light data", () => {
  // `description`, `features` and `useCases` moved OFF the AIEmployee entries
  // into src/lib/ai-employee-details.ts (and the four heavy Vertical fields into
  // src/lib/vertical-details.ts) so the footer — a client component importing
  // both arrays — stops shipping 7.9 KB gzip of unrendered prose on every route.
  // The join is now by slug through a Record, which the type system does not
  // check: a renamed role leaves `AI_EMPLOYEE_DETAILS[slug]` undefined and the
  // page renders an empty body. Both modules throw at import time when a slug is
  // missing, and this is what proves that guard is wired to the real data rather
  // than passing vacuously.
  it("has a detail record for every role, with real content", () => {
    expect(Object.keys(AI_EMPLOYEE_DETAILS).sort()).toEqual(
      AI_EMPLOYEES.map((r) => r.slug).sort()
    );
    for (const role of AI_EMPLOYEES) {
      const detail = AI_EMPLOYEE_DETAILS[role.slug];
      expect(detail.description.length).toBeGreaterThan(0);
      expect(detail.features.length).toBeGreaterThanOrEqual(3);
      expect(detail.useCases.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("has a detail record for every vertical, with real content", () => {
    expect(Object.keys(VERTICAL_DETAILS).sort()).toEqual(
      VERTICALS.map((v) => v.slug).sort()
    );
    for (const vertical of VERTICALS) {
      const detail = VERTICAL_DETAILS[vertical.slug];
      expect(detail.description.length).toBeGreaterThan(0);
      expect(detail.painPoints.length).toBeGreaterThanOrEqual(3);
      expect(detail.solutions.length).toBeGreaterThanOrEqual(3);
      expect(detail.roiData.length).toBeGreaterThan(0);
    }
  });

  it("keeps the heavy fields OFF the arrays the client bundle reaches", () => {
    // The whole point of the split. A field put back on AI_EMPLOYEES or
    // VERTICALS "just for convenience" silently re-inflates every page on the
    // site, and nothing else in the suite would notice — the pages would keep
    // rendering perfectly.
    for (const role of AI_EMPLOYEES) {
      for (const heavy of ["description", "features", "useCases"]) {
        expect(
          heavy in role,
          `${role.slug}.${heavy} is back on AI_EMPLOYEES — the footer imports it, so it ships to every page`
        ).toBe(false);
      }
    }
    for (const vertical of VERTICALS) {
      for (const heavy of ["description", "painPoints", "solutions", "roiData"]) {
        expect(
          heavy in vertical,
          `${vertical.slug}.${heavy} is back on VERTICALS — the footer imports it, so it ships to every page`
        ).toBe(false);
      }
    }
  });
});

describe("referential integrity", () => {
  it("resolves every bundle's includes to a real core role", () => {
    for (const bundle of BUNDLE_ROLES) {
      for (const slug of bundle.includes!) {
        const target = getAIEmployeeBySlug(slug);
        expect(target, `${bundle.slug} includes unknown role "${slug}"`)
          .not.toBeUndefined();
        // A bundle of bundles would recurse on the detail page.
        expect(
          (target as AIEmployee).includes,
          `${bundle.slug} includes another bundle (${slug})`
        ).toBeUndefined();
      }
      // No duplicates inside one bundle.
      expect(new Set(bundle.includes!).size).toBe(bundle.includes!.length);
      // A bundle never includes itself.
      expect(bundle.includes).not.toContain(bundle.slug);
    }
  });

  it("has the AI Chief of Staff cover all three core roles", () => {
    const chief = getAIEmployeeBySlug("ai-chief-of-staff");
    expect(chief!.includes!.slice().sort()).toEqual(
      CORE_ROLES.map((r) => r.slug).sort()
    );
  });

  it("looks up all five roles by slug and returns undefined for junk", () => {
    for (const role of AI_EMPLOYEES) {
      expect(getAIEmployeeBySlug(role.slug)!.name).toBe(role.name);
    }
    for (const junk of [
      "not-a-real-role",
      "",
      "AI-Receptionist",
      "ai-receptionist ",
      "persian-leads",
    ]) {
      expect(
        getAIEmployeeBySlug(junk),
        `"${junk}" must not resolve to a role`
      ).toBeUndefined();
    }
  });

  // `SERVICES` / `Service` / `getServiceBySlug` are gone. They were the retired
  // productized offer, kept "so nothing that still imports them breaks" — but by
  // then the only consumer left was the related-services block on
  // /industries/[slug], which never rendered (all five verticals carried
  // `relatedServices: []`) and would have linked /services/persian-leads if it
  // ever had: a 308 on Vercel and a hard 404 locally. The three cases that used
  // to live here (relatedVerticals resolution, relatedServices resolution, and
  // the service/industry namespace split) went with them. What the namespace
  // case was actually protecting — a slug off the URL resolving in the wrong
  // namespace and rendering the wrong record instead of 404ing — is still live
  // below, between the two lookups that remain.
  it("keeps the role and industry namespaces apart", () => {
    for (const role of AI_EMPLOYEES) {
      expect(getAIEmployeeBySlug(role.slug)!.name).toBe(role.name);
      expect(
        getVerticalBySlug(role.slug),
        `${role.slug} is a role, not an industry`
      ).toBeUndefined();
    }
    for (const vertical of VERTICALS) {
      expect(
        getAIEmployeeBySlug(vertical.slug),
        `${vertical.slug} is an industry, not a role`
      ).toBeUndefined();
    }
  });

  it("gives every vertical a unique slug and looks it up, rejecting junk", () => {
    expect(new Set(VERTICALS.map((v) => v.slug)).size).toBe(VERTICALS.length);
    for (const vertical of VERTICALS) {
      expect(getVerticalBySlug(vertical.slug)!.name).toBe(vertical.name);
    }
    expect(getVerticalBySlug("not-a-real-industry")).toBeUndefined();
  });
});

describe("pricing arithmetic — 10% is the rule, and a bundle may beat it", () => {
  /** The saving a role delivers, as a whole percentage: 300/3,000 -> 90. */
  const saving = (role: AIEmployee) =>
    Math.round((1 - dollars(role.priceFrom) / dollars(role.workload)) * 100);

  it.each(CORE_ROLES.map((r) => [r.slug, r] as const))(
    "%s charges exactly a tenth of its workload",
    (_slug, role) => {
      const price = dollars(role.priceFrom);
      const workload = dollars(role.workload);
      expect(price * 10).toBe(workload);
      // 90% off is the claim the badge makes; keep the rounding honest.
      expect(saving(role)).toBe(90);
    }
  );

  it.each(BUNDLE_ROLES.map((r) => [r.slug, r] as const))(
    "%s charges a tenth of its workload or less, never more",
    (_slug, role) => {
      // Bundles are the one place the rule is a CEILING rather than an
      // equality. A bundle's workload is the sum of its parts (asserted below)
      // while its price is discounted off the sum of their prices, so the rate
      // can only improve: the Chief of Staff is $900 against $12,000 = 7.5%.
      // What must never happen is the other direction — a bundle quietly
      // costing MORE than a tenth of the work it claims to cover, while the
      // same "90% off" badge renders on its card.
      const price = dollars(role.priceFrom);
      const workload = dollars(role.workload);
      expect(price * 10, `${role.slug} costs more than a tenth of its workload`)
        .toBeLessThanOrEqual(workload);
      expect(saving(role)).toBeGreaterThanOrEqual(90);
    }
  );

  it("keeps the AI Office Manager exactly on the rule", () => {
    // 800 / 8,000 holds exactly, so the ceiling above must not be allowed to
    // hide this one drifting: without this case the Office Manager could be
    // repriced to anything at or under a tenth and nothing would notice.
    const office = getAIEmployeeBySlug("ai-office-manager")!;
    expect(dollars(office.priceFrom) * 10).toBe(dollars(office.workload));
    expect(saving(office)).toBe(90);
  });

  it("makes every bundle's workload the sum of the workloads it includes", () => {
    // THE invariant this file gained. A bundle covers exactly the work its
    // roles cover — nothing more, nothing less — so its headline figure is
    // arithmetic, not a copywriting choice. The Chief of Staff shipped
    // ~$9,000+/mo against three roles listing 3,000 + 5,000 + 4,000, and the
    // only thing that noticed was a comment in the role page explaining why the
    // per-role pills had to be hidden.
    for (const bundle of BUNDLE_ROLES) {
      const parts = bundle.includes!.map((slug) =>
        dollars(getAIEmployeeBySlug(slug)!.workload)
      );
      expect(
        dollars(bundle.workload),
        `${bundle.slug} claims to cover $${dollars(bundle.workload)} of work, but the roles inside it list ${parts.join(" + ")}`
      ).toBe(parts.reduce((a, b) => a + b, 0));
    }
  });

  it("labels the badge and the pricing note with the saving the data delivers", () => {
    // The five badges say "90% off" and PRICING_NOTE is the one sentence that
    // explains them. Both numbers are derived from the role data here, so the
    // badge cannot outlive a price change and the note cannot quietly drop the
    // claim it exists to make.
    //
    // Derived from the CORE roles, not all five: the bundles beat the rule
    // (7.5% for the Chief of Staff), so a single shared percentage across all
    // five stopped being the right invariant the moment a bundle's workload
    // became the honest sum of its parts. The badge is now a FLOOR — it must be
    // exactly what the core roles deliver, and no role may deliver less.
    const core = CORE_ROLES.map(saving);
    expect(
      [...new Set(core)],
      "the core roles no longer share one saving percentage, so one badge lies"
    ).toHaveLength(1);

    const claim = `${core[0]}%`;
    expect(SAVING_LABEL, "the badge disagrees with the arithmetic").toContain(
      claim
    );
    expect(
      PRICING_NOTE,
      "the pricing note no longer states the saving the badges claim"
    ).toContain(claim);

    // The same badge renders on all five cards, so understating is fine and
    // overstating is not.
    for (const bundle of BUNDLE_ROLES) {
      expect(
        saving(bundle),
        `${bundle.slug} saves less than the "${SAVING_LABEL}" badge on its own card claims`
      ).toBeGreaterThanOrEqual(core[0]);
    }
  });

  it("quotes every price per month as a 'from' figure, never a bare number", () => {
    for (const role of AI_EMPLOYEES) {
      expect(role.priceFrom).toMatch(/^\$[\d,]+\/mo$/);
      expect(role.workload).toMatch(/^~\$[\d,]+\+?\/mo of .+/);
    }
  });

  it("never prices a bundle above the sum of the roles inside it", () => {
    for (const bundle of BUNDLE_ROLES) {
      const parts = bundle.includes!.map((s) =>
        dollars(getAIEmployeeBySlug(s)!.priceFrom)
      );
      const separately = parts.reduce((a, b) => a + b, 0);
      expect(dollars(bundle.priceFrom)).toBeLessThanOrEqual(separately);
    }
  });

  it("states the real hire-separately total in the Chief of Staff copy", () => {
    const chief = getAIEmployeeBySlug("ai-chief-of-staff")!;
    const separately = chief.includes!
      .map((s) => dollars(getAIEmployeeBySlug(s)!.priceFrom))
      .reduce((a, b) => a + b, 0);
    const line = AI_EMPLOYEE_DETAILS[chief.slug].features.find((f) =>
      /separately/.test(f)
    );
    expect(line, "no 'hire separately' comparison in the bundle copy").toBeTypeOf(
      "string"
    );
    // "From $900/mo for all three — against $1,200/mo if you hire the three
    // roles separately": both figures must be the ones the data actually holds.
    const figures = line!.match(/\$[\d,]+/g)!.map((f) => dollars(f));
    expect(figures).toContain(dollars(chief.priceFrom));
    expect(figures).toContain(separately);
  });
});

describe("/llms.txt agrees with the role data", () => {
  // llms-content.ts is hand-written prose that AI engines cite verbatim, so it
  // drifts from data.ts silently. Every role's price, workload and URL has to
  // still be the one the site actually charges.
  const FILES = [
    ["llms.txt", LLMS_TXT],
    ["llms-full.txt", LLMS_FULL_TXT],
  ] as const;

  it.each(AI_EMPLOYEES.map((r) => [r.slug, r] as const))(
    "quotes %s's price and workload on the same line as its name",
    (slug, role) => {
      for (const [file, text] of FILES) {
        const stated = text
          .split("\n")
          .filter(
            (line) =>
              line.includes(`from ${role.priceFrom}`) &&
              line.includes(`Covers ${role.workload}`)
          );
        expect(
          stated.length,
          `${file} never states "${role.name} — from ${role.priceFrom}. Covers ${role.workload}"`
        ).toBeGreaterThan(0);
        expect(stated.some((line) => line.includes(role.name))).toBe(true);
      }
      // The role's own bullet in llms.txt links to its page, and that same line
      // is the one carrying its price — a stale figure there is what AI engines
      // would cite.
      const bullet = LLMS_TXT.split("\n").filter((line) =>
        line.includes(`/services/${slug}`)
      );
      expect(bullet.length, `llms.txt does not link /services/${slug}`).toBe(1);
      expect(bullet[0]).toContain(`from ${role.priceFrom}`);
      expect(bullet[0]).toContain(`Covers ${role.workload}`);
    }
  );

  it.each(FILES)("never quotes a price the data does not hold in %s", (_f, text) => {
    const prices = AI_EMPLOYEES.map((r) => dollars(r.priceFrom));
    const workloads = AI_EMPLOYEES.map((r) => dollars(r.workload));
    const bundleSums = BUNDLE_ROLES.map((b) =>
      b.includes!
        .map((s) => dollars(getAIEmployeeBySlug(s)!.priceFrom))
        .reduce((a, c) => a + c, 0)
    );
    // Plus the one-off call, which is the only non-monthly figure these files
    // quote. Read out of CALL_OPTIONS so a repriced call turns this red here
    // rather than leaving llms.txt telling AI engines the old number.
    const callPrices = CALL_OPTIONS.map((o) => o.amountUsd);
    const allowed = new Set([
      ...prices,
      ...workloads,
      ...bundleSums,
      ...callPrices,
    ]);

    const quoted = [...text.matchAll(/\$\s?([\d,]+)/g)].map((m) =>
      Number(m[1].replace(/,/g, ""))
    );
    expect(quoted.length).toBeGreaterThan(5);
    // Both call prices must actually appear: the offer is two lengths, and a
    // file that quotes only one of them misinforms every engine citing it.
    for (const option of CALL_OPTIONS) {
      expect(
        quoted,
        `${_f} never quotes the ${option.label} call at ${option.price}`
      ).toContain(option.amountUsd);
    }
    const unknown = [...new Set(quoted.filter((f) => !allowed.has(f)))];
    expect(
      unknown,
      "figures quoted that are not a role price, a workload, a bundle total, or a call price"
    ).toEqual([]);
  });
});

describe("every percentage in the copy is one the pricing data delivers", () => {
  // The dollar figures above are pinned; the PERCENTAGES that explain them were
  // not. "7.5%" is hand-typed into four production strings — three in
  // llms-content.ts, one in the Chief of Staff description — and derived by
  // nothing, so repricing that bundle left four strings quoting a stale rate
  // with the whole suite green. Same drift class as a stale price, one field
  // over, and it lands in the file AI engines cite verbatim.
  //
  // Every quoted percentage has to be one of two things the data actually
  // computes: the saving the core roles deliver (the "90% off" claim), or the
  // rate some role charges against the work it covers (10% for the four roles
  // on the rule, 7.5% for the Chief of Staff). Both are derived below, so a
  // price change turns the stale strings red instead of leaving them quoted.

  /** What a role charges as a share of the work it covers: 900/12,000 -> 7.5. */
  const rate = (role: AIEmployee) =>
    Math.round((dollars(role.priceFrom) / dollars(role.workload)) * 1000) / 10;

  /** The other side of the same figure, whole percent: 300/3,000 -> 90. */
  const saving = (role: AIEmployee) =>
    Math.round((1 - dollars(role.priceFrom) / dollars(role.workload)) * 100);

  const ALLOWED = new Set([
    ...CORE_ROLES.map(saving),
    ...AI_EMPLOYEES.map(rate),
  ]);

  /** Every string a visitor or an AI engine reads, with where it came from. */
  const SOURCES: [string, string][] = [
    ["llms.txt", LLMS_TXT],
    ["llms-full.txt", LLMS_FULL_TXT],
    ...Object.entries(AI_EMPLOYEE_DETAILS).flatMap<[string, string]>(
      ([slug, detail]) => [
        [`${slug}.description`, detail.description],
        ...detail.features.map(
          (f, i): [string, string] => [`${slug}.features[${i}]`, f]
        ),
        ...detail.useCases.map(
          (u, i): [string, string] => [`${slug}.useCases[${i}]`, u]
        ),
      ]
    ),
  ];

  /** "…which is 7.5%." -> ["ai-chief-of-staff.description", 7.5] */
  const QUOTED: [string, number][] = SOURCES.flatMap(([where, text]) =>
    [...text.matchAll(/(\d+(?:\.\d+)?)\s?%/g)].map(
      (m): [string, number] => [where, Number(m[1])]
    )
  );

  it("found the percentages, and more than one rate to check them against", () => {
    // Guards both halves. An empty QUOTED passes the assertion below vacuously,
    // and so does an ALLOWED set that has collapsed to the single 90 every core
    // role shares — the bundle rate is the figure with no other test on it, so
    // "there is more than one distinct rate" is what stops this from becoming a
    // check that only 90% is spelled correctly.
    expect(QUOTED.length).toBeGreaterThan(5);
    for (const file of ["llms.txt", "llms-full.txt"]) {
      expect(
        QUOTED.some(([where]) => where === file),
        `${file} quotes no percentage — the reader stopped matching`
      ).toBe(true);
    }
    expect(
      QUOTED.some(([where]) => where.startsWith("ai-chief-of-staff")),
      "the bundle prose quotes no percentage, so its rate is unpinned again"
    ).toBe(true);
    expect(ALLOWED.size).toBeGreaterThan(1);
  });

  it("quotes no percentage that is not a role's rate or the core saving", () => {
    const stale = QUOTED.filter(([, pct]) => !ALLOWED.has(pct)).map(
      ([where, pct]) => `${where}: ${pct}%`
    );
    expect(
      stale,
      `percentage quoted that no role delivers (rates: ${[...ALLOWED]
        .sort((a, b) => a - b)
        .join(", ")})`
    ).toEqual([]);
  });
});

describe("displayed prices match the canonical role data", () => {
  let DICTS: ReturnType<typeof loadDicts>;

  beforeAll(() => {
    DICTS = loadDicts();
  });

  it("renders the English dictionary price as 'from $N/mo' for each role", () => {
    const copy = [...DICTS.en.roles.items, ...DICTS.en.roles.bundles];
    for (const entry of copy) {
      const role = getAIEmployeeBySlug(entry.slug)!;
      expect(entry.price).toBe(`from ${role.priceFrom}`);
      expect(entry.workload).toBe(role.workload);
      expect(entry.name).toBe(role.name);
    }
  });

  it("keeps the Farsi numerals equal to the canonical figures", () => {
    const copy = [...DICTS.fa.roles.items, ...DICTS.fa.roles.bundles];
    for (const entry of copy) {
      const role = getAIEmployeeBySlug(entry.slug)!;
      expect(anyDigits(entry.price)).toBe(dollars(role.priceFrom));
      expect(anyDigits(entry.workload)).toBe(dollars(role.workload));
    }
  });
});

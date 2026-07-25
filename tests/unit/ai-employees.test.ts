import { beforeAll, describe, expect, it } from "vitest";
import {
  AI_EMPLOYEES,
  BUNDLE_ROLES,
  CORE_ROLES,
  PRICING_NOTE,
  SAVING_LABEL,
  SERVICES,
  VERTICALS,
  getAIEmployeeBySlug,
  getServiceBySlug,
  getVerticalBySlug,
  type AIEmployee,
} from "@/lib/data";
import { LLMS_FULL_TXT, LLMS_TXT } from "@/lib/llms-content";
import { loadDicts } from "./helpers/dicts";

// ── Why this file exists ──────────────────────────────────────────────────────
// Two defect classes, both of which have happened here:
//  1. A dangling slug. `includes` and `relatedVerticals` are plain strings, so
//     a renamed role or vertical leaves a reference pointing at nothing — the
//     bundle page silently drops a card instead of failing to build.
//  2. Pricing drift. Every role is priced at exactly 10% of the workload it
//     covers; that is the whole offer ("90% off"). The numbers below are parsed
//     out of the strings rather than restated, so this test cannot agree with a
//     typo just because someone updated a duplicate table.

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
      expect(role.description.length).toBeGreaterThan(0);
      expect(role.features.length).toBeGreaterThanOrEqual(3);
      expect(role.useCases.length).toBeGreaterThanOrEqual(3);
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

  it("resolves every service's relatedVerticals to a real vertical", () => {
    const verticalSlugs = VERTICALS.map((v) => v.slug);
    for (const service of SERVICES) {
      expect(service.relatedVerticals.length).toBeGreaterThan(0);
      for (const slug of service.relatedVerticals) {
        expect(
          verticalSlugs,
          `${service.slug} points at unknown vertical "${slug}"`
        ).toContain(slug);
        expect(getVerticalBySlug(slug)!.slug).toBe(slug);
      }
    }
  });

  it("resolves every vertical's relatedServices to a real service", () => {
    const links = VERTICALS.flatMap((vertical) =>
      vertical.relatedServices.map((slug) => `${vertical.slug} -> ${slug}`)
    );
    // The productized SERVICES offer is retired, so every vertical links zero
    // services today and the resolution check below has nothing to walk. Pinned
    // explicitly rather than left to pass vacuously: the day a vertical links a
    // service again, this line fails and says so instead of the guard silently
    // going live untested.
    expect(
      links,
      "a vertical links a service again — drop this pin, the check below is live"
    ).toEqual([]);

    const dangling = VERTICALS.flatMap((vertical) =>
      vertical.relatedServices
        .filter((slug) => getServiceBySlug(slug)?.slug !== slug)
        .map((slug) => `${vertical.slug} -> ${slug}`)
    );
    expect(dangling, "vertical points at an unknown service").toEqual([]);
  });

  it("keeps the service and industry namespaces apart", () => {
    // Both lookups take a bare slug off the URL, so a slug that resolves in the
    // wrong namespace renders the wrong record on a page instead of 404ing.
    for (const service of SERVICES) {
      expect(getServiceBySlug(service.slug)!.name).toBe(service.name);
      expect(
        getVerticalBySlug(service.slug),
        `${service.slug} is a service, not an industry`
      ).toBeUndefined();
    }
    for (const vertical of VERTICALS) {
      expect(
        getServiceBySlug(vertical.slug),
        `${vertical.slug} is an industry, not a service`
      ).toBeUndefined();
    }
    expect(getServiceBySlug("not-a-real-service")).toBeUndefined();
  });

  it("gives every vertical a unique slug and looks it up, rejecting junk", () => {
    expect(new Set(VERTICALS.map((v) => v.slug)).size).toBe(VERTICALS.length);
    for (const vertical of VERTICALS) {
      expect(getVerticalBySlug(vertical.slug)!.name).toBe(vertical.name);
    }
    expect(getVerticalBySlug("not-a-real-industry")).toBeUndefined();
  });
});

describe("pricing arithmetic — every role is 10% of the work it covers", () => {
  it.each(AI_EMPLOYEES.map((r) => [r.slug, r] as const))(
    "%s charges exactly a tenth of its workload",
    (_slug, role) => {
      const price = dollars(role.priceFrom);
      const workload = dollars(role.workload);
      expect(price * 10).toBe(workload);
      // 90% off is the claim the badge makes; keep the rounding honest.
      expect(Math.round((1 - price / workload) * 100)).toBe(90);
    }
  );

  it("labels the badge and the pricing note with the saving the data delivers", () => {
    // The five badges say "90% off" and PRICING_NOTE is the one sentence that
    // explains them. Both numbers are derived from the role data here, so the
    // badge cannot outlive a price change and the note cannot quietly drop the
    // claim it exists to make.
    const savings = AI_EMPLOYEES.map((role) =>
      Math.round((1 - dollars(role.priceFrom) / dollars(role.workload)) * 100)
    );
    expect(
      [...new Set(savings)],
      "the roles no longer share one saving percentage, so one badge lies"
    ).toHaveLength(1);

    const claim = `${savings[0]}%`;
    expect(SAVING_LABEL, "the badge disagrees with the arithmetic").toContain(
      claim
    );
    expect(
      PRICING_NOTE,
      "the pricing note no longer states the saving the badges claim"
    ).toContain(claim);
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
    const line = chief.features.find((f) => /separately/.test(f));
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
    const allowed = new Set([...prices, ...workloads, ...bundleSums]);

    const quoted = [...text.matchAll(/\$\s?([\d,]+)/g)].map((m) =>
      Number(m[1].replace(/,/g, ""))
    );
    expect(quoted.length).toBeGreaterThan(5);
    const unknown = [...new Set(quoted.filter((f) => !allowed.has(f)))];
    expect(
      unknown,
      "figures quoted that are not a role price, a workload, or a bundle total"
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

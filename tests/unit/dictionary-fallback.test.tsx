import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AI_EMPLOYEES, SAVING_LABEL } from "@/lib/data";

// ── Why this file exists ──────────────────────────────────────────────────────
// ai-employees.tsx joins translated copy to the canonical roles BY SLUG and
// falls back per field (`copy?.name ?? role.name`) when a slug has no entry.
// That fallback is the whole reason the join is not by array position: the bug
// it replaced pointed a card at the wrong role page, and a position join with a
// short array emits `/services/undefined`.
//
// i18n-parity.test.ts pins the two dictionaries at five entries each, so the
// fallback never fires in production and nothing else reaches it. Here the
// dictionary is stripped of its role entries at the module boundary, which is
// the only way to see what the component does when a translation is missing:
// five cards, canonical hrefs, English copy — never a dropped or mislinked card.
vi.mock("@/lib/i18n", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/i18n")>();
  return {
    ...actual,
    useT: () => {
      const ctx = actual.useT();
      return {
        ...ctx,
        t: { ...ctx.t, roles: { ...ctx.t.roles, items: [], bundles: [] } },
      };
    },
  };
});

const { AIEmployees } = await import("@/components/ai-employees");
const { LanguageProvider, useT } = await import("@/lib/i18n");

afterEach(() => {
  localStorage.clear();
});

describe("homepage roles section with no translation for any role", () => {
  it("falls back to the canonical English copy without losing or mislinking a card", () => {
    let seen!: ReturnType<typeof useT>;
    let setLang!: (l: "en" | "fa") => void;
    function Probe() {
      seen = useT();
      setLang = seen.setLang;
      return null;
    }

    const { container } = render(
      <LanguageProvider>
        <Probe />
        <AIEmployees />
      </LanguageProvider>
    );

    // Guards the mock: if the stub above stops taking effect the dictionary is
    // intact, the fallback never fires, and every assertion below passes anyway
    // because the English dictionary already agrees with the canonical data.
    expect(
      [...seen.t.roles.items, ...seen.t.roles.bundles],
      "the dictionary was not stubbed — this test would pass vacuously"
    ).toEqual([]);
    expect(seen.t.roles.eyebrow.length, "the rest of the dictionary is gone too")
      .toBeGreaterThan(0);

    const cards = () =>
      Array.from(
        container.querySelectorAll<HTMLAnchorElement>('a[href^="/services/"]')
      );

    function expectCanonicalCards(badge: string) {
      // Every role still gets exactly one card, at the right URL. A
      // position-based join against an empty array would emit
      // "/services/undefined" instead, or drop cards off the end.
      expect(cards().map((a) => a.getAttribute("href"))).toEqual(
        AI_EMPLOYEES.map((r) => `/services/${r.slug}`)
      );
      expect(container.innerHTML).not.toContain("/services/undefined");

      for (const [i, card] of cards().entries()) {
        const role = AI_EMPLOYEES[i];
        const text = card.textContent!;
        expect(text, `${role.slug} lost its name`).toContain(role.name);
        expect(text, `${role.slug} lost its price`).toContain(
          `from ${role.priceFrom}`
        );
        expect(text, `${role.slug} lost its workload`).toContain(role.workload);
        expect(text, `${role.slug} lost its tagline`).toContain(role.tagline);
        // Not part of the per-role copy, so it comes from the intact remainder
        // of the dictionary and still tracks the active language.
        expect(text, `${role.slug} lost its saving badge`).toContain(badge);
      }
    }

    expectCanonicalCards(SAVING_LABEL);
    expect(seen.t.roles.savingLabel).toBe(SAVING_LABEL);

    // Farsi: an intact dictionary would put Persian names and Persian prices on
    // these cards, so seeing the canonical English copy here is what proves the
    // per-field fallback — not just that the stub happened to match.
    act(() => setLang("fa"));
    expect(seen.lang).toBe("fa");
    expect(seen.dir).toBe("rtl");
    expect(seen.t.roles.savingLabel).not.toBe(SAVING_LABEL);
    expectCanonicalCards(seen.t.roles.savingLabel);
  });
});

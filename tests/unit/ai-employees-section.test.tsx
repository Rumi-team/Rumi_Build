// @vitest-environment jsdom
// This file renders components, so it needs a DOM. The suite defaults to the
// `node` environment (vitest.config.ts); only the files that render opt in.
import { act, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AIEmployees } from "@/components/ai-employees";
import { LanguageProvider, useT } from "@/lib/i18n";
import { AI_EMPLOYEES, SAVING_LABEL } from "@/lib/data";

// ── Why this file exists ──────────────────────────────────────────────────────
// The homepage roles section is the offer. Two things have gone wrong here: the
// prices vanished from the cards (the sibling site ships them unpriced, and the
// deletion got copied across), and the translated copy was once joined to the
// canonical roles BY ARRAY POSITION, which pointed a card at the wrong role
// page. Both are asserted below.

function Switcher({ onReady }: { onReady: (set: (l: "en" | "fa") => void) => void }) {
  const { setLang } = useT();
  onReady(setLang);
  return null;
}

function renderSection() {
  let setLang!: (l: "en" | "fa") => void;
  const utils = render(
    <LanguageProvider>
      <Switcher onReady={(s) => (setLang = s)} />
      <AIEmployees />
    </LanguageProvider>
  );
  return { ...utils, setLang: (l: "en" | "fa") => act(() => setLang(l)) };
}

/** The five role cards, in DOM order, as the anchors they are. */
function roleCards(): HTMLAnchorElement[] {
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href^="/services/"]')
  );
}

afterEach(() => {
  localStorage.clear();
});

describe("homepage roles section", () => {
  it("renders one linked card per role, in canonical order", () => {
    renderSection();
    expect(roleCards().map((a) => a.getAttribute("href"))).toEqual(
      AI_EMPLOYEES.map((r) => `/services/${r.slug}`)
    );
  });

  it("shows a 'from $N/mo' price and a 90%-off badge on all five cards", () => {
    renderSection();
    const cards = roleCards();
    expect(cards).toHaveLength(5);

    cards.forEach((card, i) => {
      const role = AI_EMPLOYEES[i];
      const scope = within(card);
      // The price the sibling site omits. It must be present and prefixed.
      expect(
        scope.getByText(`from ${role.priceFrom}`),
        `${role.slug} card is missing its price`
      ).toBeInTheDocument();
      expect(scope.getByText(SAVING_LABEL)).toBeInTheDocument();
      // "90% off" only makes sense next to what it is 90% off OF.
      expect(scope.getByText(`Covers ${role.workload}`)).toBeInTheDocument();
      expect(scope.getByRole("heading", { name: role.name })).toBeInTheDocument();
    });
  });

  it("says the price and the saving in each card's ACCESSIBLE name, not just on screen", () => {
    // The card is one big link, and it used to carry
    // aria-label={`${name}: ${tagline}`}. An aria-label REPLACES the computed
    // accessible name rather than adding to it, so a screen reader heard the
    // name and the tagline and nothing else — the price, the "90% off" badge
    // and the "Covers …" pill, i.e. the three things the card exists to say,
    // were announced to sighted users only. The label is gone; this is what
    // stops it coming back, because every assertion in the tests above reads
    // the rendered text and would stay green if it did.
    //
    // `name` here is a matcher function, so RTL computes the real accessible
    // name (via dom-accessibility-api) and this is a genuine a11y assertion
    // rather than another textContent check.
    renderSection();
    for (const role of AI_EMPLOYEES) {
      const link = screen.getByRole("link", {
        name: (accessibleName: string) =>
          accessibleName.includes(role.name) &&
          accessibleName.includes(`from ${role.priceFrom}`) &&
          accessibleName.includes(SAVING_LABEL) &&
          accessibleName.includes(role.workload),
      });
      // …and it is the right card: a name assembled from another role's
      // numbers would be a worse defect than a missing one.
      expect(link, `${role.slug} card`).toHaveAttribute(
        "href",
        `/services/${role.slug}`,
      );
    }
  });

  it("separates the three hireable roles from the two bundles", () => {
    renderSection();
    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(headings).toContain("Or hire more than one");
    // The bundle sub-heading sits after the three core cards and before the two
    // bundle cards, so the bundles are the last two links in the section.
    expect(roleCards().slice(3).map((a) => a.getAttribute("href"))).toEqual([
      "/services/ai-office-manager",
      "/services/ai-chief-of-staff",
    ]);
  });

  it("links to the pricing hub and carries the white-label note", () => {
    renderSection();
    const hub = screen.getByRole("link", { name: /See all five roles and pricing/ });
    expect(hub).toHaveAttribute("href", "/services");
    expect(
      screen.getByText(/can also run under your own brand/i)
    ).toBeInTheDocument();
  });

  it("keeps every card pointing at the right role page in Farsi", () => {
    const { setLang } = renderSection();
    setLang("fa");

    // Same hrefs, in the same order, with translated names — this is what the
    // join-by-slug (rather than by array index) exists to guarantee.
    expect(roleCards().map((a) => a.getAttribute("href"))).toEqual(
      AI_EMPLOYEES.map((r) => `/services/${r.slug}`)
    );
    const first = within(roleCards()[0]);
    expect(first.getByRole("heading", { name: "پذیرشگر هوش مصنوعی" })).toBeInTheDocument();
    expect(first.getByText("از ۳۰۰ دلار در ماه")).toBeInTheDocument();
    expect(screen.queryByText("from $300/mo")).toBeNull();
  });

  it("switches the document direction to RTL for Farsi and back", () => {
    const { setLang } = renderSection();
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.documentElement.lang).toBe("en");

    setLang("fa");
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("fa");
    expect(localStorage.getItem("rumi-lang")).toBe("fa");

    setLang("en");
    expect(document.documentElement.dir).toBe("ltr");
  });
});

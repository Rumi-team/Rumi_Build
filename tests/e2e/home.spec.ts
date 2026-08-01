import { expect, test } from "@playwright/test";
import { AI_EMPLOYEES, BUNDLE_ROLES, CORE_ROLES } from "@/lib/data";

// The homepage IS the offer: hero, then the five priced roles ("What we do"),
// then everything else we build ("Extra services"). The prices on these cards
// have gone missing once already — the sibling site ships them unpriced and the
// deletion got copied across — so they are asserted explicitly.

test.describe("homepage", () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("renders the hero headline", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText(
      "Get 90% off your hiring. Hire AI employees that work 24/7."
    );
    await expect(page.getByText("Head of HR for AI Employees")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Book a Call", exact: true }).first()
    ).toBeVisible();
  });

  test("orders the sections hero -> What we do -> Extra services", async ({
    page,
  }) => {
    const marks = await page
      .locator("main > section")
      .evaluateAll((sections) =>
        sections.map((s) => s.id || s.getAttribute("aria-labelledby") || "")
      );
    expect(marks.slice(0, 3)).toEqual(["hero-heading", "ai-employees", "extras"]);

    // The eyebrows the two offer sections are known by.
    const roles = page.locator("#ai-employees");
    const extras = page.locator("#extras");
    await expect(roles.getByText("What we do")).toBeVisible();
    await expect(roles.getByRole("heading", { level: 2 })).toHaveText(
      "Five AI employees. Hire the ones you need."
    );
    await expect(extras.getByText("Extra services")).toBeVisible();
  });

  test("shows all five role cards with a from-price and a 90% off badge", async ({
    page,
  }) => {
    const section = page.locator("#ai-employees");

    for (const role of AI_EMPLOYEES) {
      const card = section.locator(`a[href="/services/${role.slug}"]`);
      await expect(card, `${role.slug} card`).toHaveCount(1);
      await expect(card).toContainText(role.name);
      // The price. Missing prices are the regression this asserts against.
      await expect(card, `${role.slug} price`).toContainText(
        `from ${role.priceFrom}`
      );
      await expect(card).toContainText(`Covers ${role.workload}`);
      await expect(card).toContainText("90% off");
    }

    // Five priced cards, no more and no fewer.
    await expect(section.locator('a[href^="/services/"]')).toHaveCount(5);
    await expect(section.getByText(/^from \$\d/)).toHaveCount(5);
  });

  test("keeps the three hireable roles above the two bundles", async ({
    page,
  }) => {
    const hrefs = await page
      .locator('#ai-employees a[href^="/services/"]')
      .evaluateAll((links) => links.map((l) => l.getAttribute("href")));
    expect(hrefs).toEqual([
      ...CORE_ROLES.map((r) => `/services/${r.slug}`),
      ...BUNDLE_ROLES.map((r) => `/services/${r.slug}`),
    ]);
    await expect(
      page.getByRole("heading", { name: "Or hire more than one" })
    ).toBeVisible();
  });

  test("links through to the pricing hub", async ({ page }) => {
    await page
      .getByRole("link", { name: /See all five roles and pricing/ })
      .click();
    await expect(page).toHaveURL(/\/services$/);
  });
});

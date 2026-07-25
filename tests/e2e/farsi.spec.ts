import { expect, test } from "@playwright/test";
import { AI_EMPLOYEES } from "@/lib/data";

// Switching the dropdown to فارسی has to do three things: flip the document to
// RTL (so the layout and the arrow glyphs turn round), translate the copy, and
// keep every role card pointing at the same role page it did in English.

const FA_HEADLINE = "۹۰٪ در هزینه استخدام صرفه‌جویی کنید.";
const FA_ROLES_HEADING = "پنج کارمند هوش مصنوعی. هر کدام را لازم دارید استخدام کنید.";

test.describe("Farsi", () => {
  test("sets dir=rtl and translates the hero", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "ltr");

    const picker = page.getByLabel("Language").first();
    await expect(picker).toBeVisible();
    await picker.selectOption("fa");

    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(html).toHaveAttribute("lang", "fa");

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText(FA_HEADLINE);
    await expect(h1).not.toContainText("Get 90% off your hiring.");
    await expect(
      page.getByRole("heading", { level: 2, name: FA_ROLES_HEADING })
    ).toBeVisible();
    // The nav translates with it.
    await expect(
      page.getByRole("link", { name: "کارمندان هوش مصنوعی" }).first()
    ).toBeVisible();
  });

  test("keeps all five role cards, with Persian prices and the same links", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("Language").first().selectOption("fa");

    const cards = page.locator('#ai-employees a[href^="/services/"]');
    await expect(cards).toHaveCount(5);
    expect(
      await cards.evaluateAll((links) => links.map((l) => l.getAttribute("href")))
    ).toEqual(AI_EMPLOYEES.map((r) => `/services/${r.slug}`));

    // Persian numerals, not "from $300/mo".
    await expect(cards.first()).toContainText("از ۳۰۰ دلار در ماه");
    await expect(page.locator("#ai-employees")).not.toContainText("from $300/mo");
  });

  test("remembers the language across a reload", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Language").first().selectOption("fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      FA_HEADLINE
    );
  });
});

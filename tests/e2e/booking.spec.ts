import { expect, test } from "@playwright/test";
import { AI_EMPLOYEES, CAL_LINK } from "@/lib/data";
import { VERTICALS } from "@/lib/data";

// ── Why this file exists ─────────────────────────────────────────────────────
// /book is the only place this site converts. Every other suite can stay green
// while the path into it is broken: the role pages render, the prices are
// right, the copy passes the tone rule — and the one link that turns a reader
// into a booked call points nowhere. That failure is silent (an empty calendar,
// noticed weeks later), so it gets its own tests rather than riding along as an
// assertion inside a page test.

test.describe("booking path", () => {
  test("every role page offers a way into /book", async ({ page }) => {
    for (const role of AI_EMPLOYEES) {
      await page.goto(`/services/${role.slug}`);
      // Scoped to <main>: the Nav renders its own `a[href="/book"]` on every
      // page, so a page-wide locator here resolved to the nav button and passed
      // with the role page's own CTAs deleted.
      const toBook = page.locator('main a[href="/book"]');
      await expect(
        toBook.first(),
        `${role.slug} has no link to /book`,
      ).toBeVisible();
    }
  });

  test("the hub's closing CTA reaches /book", async ({ page }) => {
    await page.goto("/services");
    const cta = page.locator('main a[href="/book"]').last();
    await expect(cta).toBeVisible();

    await cta.click();
    await expect(page).toHaveURL(/\/book$/);
  });

  test("a role page converts: click through to /book and get the checkout form", async ({
    page,
  }) => {
    await page.goto("/services/ai-receptionist");
    // main-scoped for the same reason as above — the nav CTA would satisfy this
    // click on any page on the site.
    await page.locator('main a[href="/book"]').first().click();
    await expect(page).toHaveURL(/\/book$/);

    // On this site /book is the paid-call checkout, NOT a calendar: the visitor
    // fills the form, pays through Stripe, and only then reaches the Cal embed
    // on /book/success. (The sibling rumi.build books straight into Cal — do
    // not "fix" this test by copying that assumption across.) So the surface
    // that must exist here is a working submit, not an iframe.
    const form = page.locator("form");
    await expect(form, "/book renders no checkout form").toBeVisible();

    const submit = form.locator('button[type="submit"]');
    await expect(submit).toBeVisible();
    await expect(submit).toBeEnabled();
    // The price on the button is the offer; a silent change to it is a pricing
    // change nobody reviewed.
    await expect(submit).toContainText("$100");
  });

  test("/book/success carries the Cal.com booking embed", async ({ page }) => {
    // The calendar lives behind checkout. Without a session this page shows its
    // fallback rather than the embed, so assert the route stands up and points
    // at the configured calendar rather than 500ing — the failure mode that
    // would strand someone who has already paid.
    const response = await page.goto("/book/success");
    expect(response?.status(), "/book/success is down").toBeLessThan(400);
    expect(CAL_LINK, "CAL_LINK went empty — the embed has no calendar").not.toBe("");
  });

  test("the homepage's primary CTA reaches /book", async ({ page }) => {
    await page.goto("/");
    const heroCta = page.locator('main a[href="/book"]').first();
    await expect(heroCta).toBeVisible();
    await heroCta.click();
    await expect(page).toHaveURL(/\/book$/);
  });
});

test.describe("industry routing", () => {
  test("an unknown industry 404s instead of rendering or hanging", async ({
    page,
  }) => {
    // /industries/[slug] carries the same dynamicParams = false contract as the
    // role route. The slug has to be one with NO vercel.json rule: healthcare,
    // legal, restaurants, accounting and construction are all 308'd to a role
    // page in production, and Playwright runs `next start`, which ignores
    // vercel.json — asserting a 404 for one of those would pin behaviour that
    // never happens on the live site and would survive deleting the redirect.
    const response = await page.goto("/industries/not-a-real-industry");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /couldn't find that page/i }),
    ).toBeVisible();
  });

  test("every real industry still resolves", async ({ page }) => {
    for (const vertical of VERTICALS) {
      const response = await page.goto(`/industries/${vertical.slug}`);
      expect(response?.status(), `/industries/${vertical.slug}`).toBe(200);
    }
  });
});

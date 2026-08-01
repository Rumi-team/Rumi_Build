import { expect, test } from "@playwright/test";
import { AI_EMPLOYEES, CAL_LINK } from "@/lib/data";
import { VERTICALS } from "@/lib/data";
import { CALL_OPTIONS, DEFAULT_CALL_OPTION_ID } from "@/lib/stripe";

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
    // change nobody reviewed. Read out of CALL_OPTIONS rather than typed in, so
    // a repricing edits one file and this keeps guarding the button.
    const preselected = CALL_OPTIONS.find((o) => o.id === DEFAULT_CALL_OPTION_ID)!;
    await expect(submit).toContainText(preselected.price);
  });

  test("the call length is chosen on /book, and the button tracks the choice", async ({
    page,
  }) => {
    // The offer is two lengths at two prices and the browser picks between
    // them. Everything here can break without breaking a build: a chooser that
    // renders but does not change the price; a default that quietly moves to
    // the dearer option; a card that a mouse can select and a keyboard cannot.
    await page.goto("/book");
    const form = page.locator("form");
    const radios = form.locator('input[type="radio"][name="duration"]');
    await expect(
      radios,
      "the two call lengths are not offered as a choice",
    ).toHaveCount(CALL_OPTIONS.length);

    const submit = form.locator('button[type="submit"]');
    const cheapest = CALL_OPTIONS.find((o) => o.id === DEFAULT_CALL_OPTION_ID)!;
    const other = CALL_OPTIONS.find((o) => o.id !== DEFAULT_CALL_OPTION_ID)!;

    // Every option states its own length and price on the card, not just in the
    // button — the choice has to be legible before it is made. Located BY ROLE
    // AND NAME so the assertion runs through the accessibility tree: a card
    // whose <label> became a <div> still contains all this text, still groups
    // and checks correctly, and announces as "radio, blank".
    for (const option of CALL_OPTIONS) {
      const radio = page.getByRole("radio", { name: option.label });
      await expect(
        radio,
        `the ${option.label} option has no accessible name`,
      ).toBeVisible();
      await expect(radio).toHaveAttribute("value", option.id);
      await expect(form).toContainText(option.price);
      await expect(form).toContainText(option.blurb);
    }

    // The default is pre-selected, and it is the shorter, cheaper call.
    const defaultRadio = page.getByRole("radio", { name: cheapest.label });
    await expect(defaultRadio, "no length is pre-selected").toBeChecked();
    await expect(submit).toContainText(cheapest.price);

    // KEYBOARD. Real radios in one name group, so Tab reaches the group and the
    // arrow keys move within it. Tabbed into rather than focused
    // programmatically: `.focus()` reaches an element with `tabIndex={-1}`
    // just as well, so a chooser the keyboard cannot get to at all would pass.
    await page.locator("h1").click();
    await page.keyboard.press("Tab");
    await expect(
      defaultRadio,
      "the length chooser is not reachable by keyboard from the top of the page",
    ).toBeFocused();
    await page.keyboard.press("ArrowDown");
    const otherRadio = page.getByRole("radio", { name: other.label });
    await expect(
      otherRadio,
      "the option cards cannot be operated from the keyboard",
    ).toBeChecked();

    // …and choosing the longer call changes what the button says it will charge.
    await expect(
      submit,
      "the submit button still quotes the price of the option that is no longer selected",
    ).toContainText(other.price);
    await expect(submit).not.toContainText(cheapest.price);
  });

  test("/book/success carries the Cal.com booking embed", async ({ page }) => {
    // The calendar lives behind checkout. Without a session this page shows its
    // fallback rather than the embed, so assert the route stands up and points
    // at the configured calendar rather than 500ing — the failure mode that
    // would strand someone who has already paid.
    const response = await page.goto("/book/success");
    expect(response?.status(), "/book/success is down").toBeLessThan(400);
    expect(CAL_LINK, "CAL_LINK went empty — the embed has no calendar").not.toBe("");
    // The 60-minute slug is the KNOWN GAP: no such Cal.com event type exists
    // yet, so NEXT_PUBLIC_CAL_LINK_60MIN is unset here and everywhere else,
    // including CI. Comparing it to CAL_LINK from this file was therefore
    // `expect("").not.toBe("rumi-app/30-min-meeting")` on every run — an
    // assertion that reads like a guard and can never fail. The real rule (no
    // two lengths share one calendar) is checked against the catalog in
    // tests/unit/price-copy.test.ts, which runs whatever the environment holds,
    // and the fallback it produces is driven in
    // tests/unit/checkout-verification.test.tsx.
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

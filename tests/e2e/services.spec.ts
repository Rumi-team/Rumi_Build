import { expect, test } from "@playwright/test";
import {
  AI_EMPLOYEES,
  ONBOARDING_NOTE,
  PRICING_NOTE,
  WHITE_LABEL_NOTE,
  getAIEmployeeBySlug,
} from "@/lib/data";
// The role prose lives here now rather than on the AIEmployee entries — it was
// shipping in the client bundle on every route through the footer.
import { AI_EMPLOYEE_DETAILS } from "@/lib/ai-employee-details";

test.describe("nav", () => {
  test('"AI Employees" leads the nav and lands on the hub', async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    const link = nav.getByRole("link", { name: "AI Employees" });
    await expect(link).toBeVisible();

    await link.click();
    await expect(page).toHaveURL(/\/services$/);

    // All five roles are listed on the hub, each linked to its own page.
    for (const role of AI_EMPLOYEES) {
      const card = page.locator(`main a[href="/services/${role.slug}"]`).first();
      await expect(card, `${role.slug} on /services`).toBeVisible();
      await expect(card).toContainText(role.name);
      await expect(card).toContainText(`from ${role.priceFrom}`);
    }
    await expect(page.locator('main a[href^="/services/ai-"]')).toHaveCount(5);
  });
});

test.describe("role detail pages", () => {
  for (const role of AI_EMPLOYEES) {
    test(`/services/${role.slug} shows the name, price and workload`, async ({
      page,
    }) => {
      const response = await page.goto(`/services/${role.slug}`);
      expect(response?.status()).toBe(200);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(role.name);
      await expect(
        page.getByText(`from ${role.priceFrom}`, { exact: true }).first()
      ).toBeVisible();
      await expect(
        page.getByText(`Covers ${role.workload}`).first()
      ).toBeVisible();
      await expect(page.getByText("90% off").first()).toBeVisible();

      // The job itself, straight out of the data.
      const detail = AI_EMPLOYEE_DETAILS[role.slug];
      await expect(page.getByText(detail.features[0])).toBeVisible();
      await expect(page.getByText(detail.useCases[0])).toBeVisible();

      // The other four roles are offered at the bottom of every role page.
      const others = AI_EMPLOYEES.filter((r) => r.slug !== role.slug);
      for (const other of others) {
        await expect(
          page.locator(`a[href="/services/${other.slug}"]`).first()
        ).toBeVisible();
      }
    });
  }

  test("the AI Chief of Staff page lists the roles it includes", async ({
    page,
  }) => {
    const chief = getAIEmployeeBySlug("ai-chief-of-staff")!;
    await page.goto("/services/ai-chief-of-staff");

    const included = page.locator("section", {
      has: page.getByRole("heading", { name: "Who you're hiring" }),
    });
    await expect(included).toBeVisible();
    await expect(included).toContainText(`${chief.includes!.length} roles in one hire`);

    for (const slug of chief.includes!) {
      const role = getAIEmployeeBySlug(slug)!;
      const card = included.locator(`a[href="/services/${slug}"]`);
      await expect(card, `${slug} inside the bundle`).toHaveCount(1);
      await expect(card).toContainText(role.name);
    }
  });

  test("a core role page has no included-roles section", async ({ page }) => {
    await page.goto("/services/ai-receptionist");
    await expect(
      page.getByRole("heading", { name: "Who you're hiring" })
    ).toHaveCount(0);
  });

  test("an unknown role 404s instead of rendering or hanging", async ({
    page,
  }) => {
    const response = await page.goto("/services/not-a-real-role");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /couldn't find that page/i })
    ).toBeVisible();
  });
});

test.describe("the three prose notes", () => {
  // PRICING_NOTE, ONBOARDING_NOTE and WHITE_LABEL_NOTE are the sentences that
  // explain the offer: why the price is what it is, what happens between signing
  // and going live, and that a role can run under the client's own brand.
  // tests/unit/copy-invariants.test.ts pins their CONTENT — that they still make
  // each claim — but nothing proved the pages still put them on screen. An
  // import dropped during a refactor takes the promise off six pages while every
  // unit test stays green, which is exactly how WHITE_LABEL_NOTE went missing
  // before.
  //
  // The fragments are sliced out of the constants rather than retyped, so this
  // cannot drift into asserting stale copy: an edit to a note moves the
  // expectation with it, and only a note that stops RENDERING fails here. The
  // slice starts past the opening clause because the first few words of a note
  // are the sort of thing a nearby heading legitimately echoes.
  const NOTES = [
    ["PRICING_NOTE", PRICING_NOTE],
    ["ONBOARDING_NOTE", ONBOARDING_NOTE],
    ["WHITE_LABEL_NOTE", WHITE_LABEL_NOTE],
  ] as const;

  const fragment = (note: string) => note.slice(40, 100);

  for (const path of ["/services", "/services/ai-receptionist"]) {
    test(`${path} renders all three`, async ({ page }) => {
      await page.goto(path);
      const main = page.locator("main");
      for (const [name, note] of NOTES) {
        const text = fragment(note);
        // Guards the slicing itself: a constant that shrank below the slice
        // window would otherwise assert the empty string, which trivially
        // passes.
        expect(text.length, `${name} is too short to fingerprint`).toBe(60);
        await expect(main, `${path} no longer renders ${name}`).toContainText(
          text
        );
      }
    });
  }
});

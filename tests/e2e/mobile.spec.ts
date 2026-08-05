import { expect, test, type Locator, type Page } from "@playwright/test";

// ── Why this file exists ──────────────────────────────────────────────────────
// Every other spec here drives the desktop viewport the chromium project ships
// with, so the whole mobile chrome — the fixed 64px bar, the full-screen navy
// overlay it opens, and how the two share one row of space on a phone — was
// asserted nowhere. Three defects live in that gap, and all three are invisible
// to the unit suite because they are questions about LAYOUT:
//
//   1. The containing-block trap. The overlay is `position: fixed` but is a
//      DESCENDANT of the fixed bar, so a transform / filter / backdrop-filter /
//      will-change on <nav> would make the bar the overlay's containing block
//      and collapse `top-16 bottom-0` to the bar's own 64px — a menu that opens
//      into a zero-height strip with nothing on screen to explain it. This bar
//      carried `backdrop-blur` until brand v2 removed it.
//   2. Two "Book a Call" buttons at once. The bar sits at z-50, the overlay at
//      z-40, so the bar's CTA floats OVER the overlay's full-width one.
//   3. A squashed logo. The bar is a flex row and the logo is a flex child, so
//      on the narrowest phones it gets compressed rather than clipped —
//      a distorted wordmark, on every page, which no assertion on text can see.
//
// `test.use` rather than a second Playwright project: these are the same
// chromium build against the same server, and a project would rerun the whole
// suite at phone width to add five cases.

/** The mobile overlay: the nav's one `fixed` descendant. That it is fixed at all
 *  is half of what defect (1) above is about, so it is what the locator keys on. */
const overlayOf = (nav: Locator) => nav.locator("div.fixed");

async function openMenu(page: Page): Promise<{ nav: Locator; overlay: Locator }> {
  const nav = page.getByRole("navigation", { name: "Main" });
  await nav.getByRole("button", { name: "Open menu" }).click();
  await expect(nav.getByRole("button", { name: "Close menu" })).toHaveAttribute(
    "aria-expanded",
    "true"
  );
  const overlay = overlayOf(nav);
  await expect(overlay, "the hamburger opened no overlay").toHaveCount(1);
  return { nav, overlay };
}

test.describe("the phone viewport", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("the homepage does not scroll sideways", async ({ page }) => {
    // A single element wider than the viewport puts a horizontal scrollbar on
    // the whole document, and every section after it reads as misaligned.
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(clientWidth, "the page measured zero wide").toBeGreaterThan(0);
    expect(
      scrollWidth,
      `the homepage is ${scrollWidth - clientWidth}px wider than the phone it is on`
    ).toBeLessThanOrEqual(clientWidth);
  });

  test("the overlay covers the viewport from under the bar to the bottom", async ({
    page,
  }) => {
    // THE containing-block guard. The expected geometry is derived from the bar
    // and the viewport rather than from the literal 64 — `top-16` and `h-16` are
    // one edit away from disagreeing, and this is what would notice.
    const { nav, overlay } = await openMenu(page);
    const viewport = page.viewportSize()!;

    const bar = await nav.boundingBox();
    expect(bar, "the nav has no box").not.toBeNull();
    expect(bar!.height, "the nav bar measured zero high").toBeGreaterThan(0);

    const box = await overlay.boundingBox();
    expect(box, "the overlay has no box at all — it collapsed").not.toBeNull();
    expect(
      box!.y,
      "the overlay does not start where the bar ends"
    ).toBeCloseTo(bar!.height, 0);
    expect(
      box!.height,
      "the overlay collapsed to the bar's own height — something on <nav> became its containing block"
    ).toBeCloseTo(viewport.height - bar!.height, 0);
    await expect(overlay.getByRole("link", { name: "AI Employees" })).toBeVisible();
  });

  test("locks the page behind it while it is open, and lets go on close", async ({
    page,
  }) => {
    const { nav } = await openMenu(page);
    expect(
      await page.evaluate(() => document.body.style.overflow),
      "the page behind the overlay still scrolls"
    ).toBe("hidden");

    await nav.getByRole("button", { name: "Close menu" }).click();
    expect(
      await page.evaluate(() => document.body.style.overflow),
      "the page is still locked after the overlay closed"
    ).not.toBe("hidden");
  });

  test("closes on Escape and hands focus back to the toggle", async ({ page }) => {
    const { nav, overlay } = await openMenu(page);
    await expect(
      overlay.getByRole("link", { name: "AI Employees" }),
      "focus did not move into the overlay when it opened"
    ).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(overlay, "Escape did not close the overlay").toHaveCount(0);
    await expect(
      nav.getByRole("button", { name: "Open menu" }),
      "focus was left nowhere after the overlay closed"
    ).toBeFocused();
  });

  test("closes when a link inside it is followed", async ({ page }) => {
    const { nav, overlay } = await openMenu(page);
    await overlay.getByRole("link", { name: "AI Employees" }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(
      overlayOf(nav),
      "the overlay is still up over the page it navigated to"
    ).toHaveCount(0);
    await expect(nav.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  test("lets go of the page when the viewport grows past the breakpoint", async ({
    page,
  }) => {
    // The overlay, its close button and the hamburger are ALL `md:hidden`. Open
    // the menu on a phone and rotate an iPad (or drag a window corner) past
    // 768px and every one of them becomes display:none while `open` is still
    // true — so `document.body.style.overflow` stays "hidden", the page cannot
    // be scrolled, and the control that would release it is not on screen. The
    // focus-return branch is aimed at that same invisible button. Nothing in
    // the unit suite can see this: it is one state and two layouts.
    const { nav } = await openMenu(page);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.setViewportSize({ width: 1024, height: 800 });

    await expect(
      overlayOf(nav),
      "the overlay outlived the layout that contains its only close button"
    ).toHaveCount(0);
    expect(
      await page.evaluate(() => document.body.style.overflow),
      "the page is scroll-locked at a width where nothing on screen can unlock it"
    ).not.toBe("hidden");
    // ...and the page really does scroll again, which is the thing a visitor
    // would notice. `overflow` is the mechanism; this is the symptom.
    await page.mouse.wheel(0, 400);
    await expect
      .poll(() => page.evaluate(() => window.scrollY), {
        message: "the page still refuses to scroll after the overlay let go",
      })
      .toBeGreaterThan(0);
  });

  test("keeps Tab inside the chrome while it is open", async ({ page }) => {
    // A full-screen overlay that does not trap focus hands the next Tab to the
    // page underneath — which is scroll-locked, so the focused element cannot
    // even be brought into view. The boundary is the whole <nav> rather than
    // the overlay, because the button that closes it lives in the bar above.
    const { nav, overlay } = await openMenu(page);

    // Start from the last thing in the overlay, which is where the trap has to
    // do its work: without it, this Tab leaves the nav entirely.
    await overlay.getByRole("link", { name: "Book a Call" }).focus();

    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const active = document.activeElement;
        const nav = document.querySelector('nav[aria-label="Main"]');
        return {
          contained: !!active && !!nav && nav.contains(active),
          escapedTo: active?.textContent?.trim().slice(0, 40) ?? "<nothing>",
        };
      });
      expect(
        inside.contained,
        `Tab ${i + 1} left the nav for the locked page behind it: "${inside.escapedTo}"`
      ).toBe(true);
    }

    // Shift+Tab off the front wraps the other way rather than escaping. The
    // front of the boundary is the logo anchor, which sits in the bar — the
    // overlay is not where the trap starts.
    await nav.locator('a[href="/"]').focus();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Shift+Tab");
      expect(
        await page.evaluate(() => {
          const nav = document.querySelector('nav[aria-label="Main"]');
          return !!document.activeElement && !!nav && nav.contains(document.activeElement);
        }),
        `Shift+Tab ${i + 1} escaped the nav backwards`
      ).toBe(true);
    }

    // The overlay says what the trap enforces, so assistive tech agrees with
    // the keyboard.
    await expect(overlay).toHaveAttribute("role", "dialog");
    await expect(overlay).toHaveAttribute("aria-modal", "true");
  });

  test("below 390px the bar yields its CTA to the overlay's", async ({ page }) => {
    // At this width the logo, the language select, a CTA and the hamburger do
    // not fit on one 64px row, so the bar's CTA is dropped on purpose. The
    // overlay's full-width one is how these visitors reach /book, so it has to
    // be there — a hidden CTA with nothing behind it is just a lost booking.
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(
      nav.getByRole("link", { name: "Book a Call" }),
      "a Book a Call button is on the bar at a width it cannot fit"
    ).toHaveCount(0);

    const { overlay } = await openMenu(page);
    await expect(
      overlay.getByRole("link", { name: "Book a Call" }),
      "the narrowest phones have no way to reach /book from the chrome"
    ).toBeVisible();
  });
});

test.describe("a phone wide enough for the bar CTA", () => {
  // 390px is where the bar's own CTA comes back, so this is the width at which
  // the duplicate-CTA defect can actually happen.
  test.use({ viewport: { width: 414, height: 896 } });

  test("never shows two Book a Call buttons at once", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });

    // Counted rather than located one-by-one, and that is the point. The bar's
    // CTA and the overlay's are BOTH inside <nav> (the overlay is a descendant
    // of the bar), so no single locator names "the bar's one" without keying on
    // a class — and `getByRole` only sees what the accessibility tree exposes,
    // which is exactly the set a user can act on. The defect this guards is
    // "two of them on screen together", so the assertion is the count itself.
    //
    // Scoped to the nav, not the page: the hero and the closing section both
    // ship their own Book a Call link on this route.
    const ctas = nav.getByRole("link", { name: "Book a Call" });
    await expect(
      ctas,
      "the bar has no CTA at this width — re-anchor this test"
    ).toHaveCount(1);

    const { overlay } = await openMenu(page);
    await expect(
      ctas,
      "both CTAs are reachable at once — the bar sits at z-50 above the overlay's z-40, so they overlap"
    ).toHaveCount(1);
    // ...and the one that survived is the overlay's, not the bar's.
    await expect(
      overlay.getByRole("link", { name: "Book a Call" }),
      "the overlay lost its CTA — the bar's is the one still showing"
    ).toBeVisible();
  });
});

test.describe("the tablet boundary, in the longer language", () => {
  // Exactly `md`. This is the narrowest width at which the desktop row exists
  // at all, and the Persian labels are the widest thing that has to fit in it:
  // "کارمندان هوش مصنوعی" measures 134px against "AI Employees" at 91px, and
  // across the four links plus the CTA the Farsi cluster needs 663px where the
  // English one needs 570.
  //
  // The failure mode is NOT a horizontal scrollbar, which is why the sideways
  // -scroll test at the top of this file never saw it: flexbox absorbs a
  // deficit by shrinking and wrapping its items, so the bar stayed 768px wide
  // while three of the four links broke onto two lines inside a 64px row and
  // the cluster ran flush into the wordmark with 0px between them. Both facts
  // are asserted below, because only the second one moves.
  test.use({ viewport: { width: 768, height: 900 } });

  test("fits the Farsi nav on one line at exactly the md breakpoint", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("Language").first().selectOption("fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    const nav = page.getByRole("navigation", { name: "Main" });
    const viewport = page.viewportSize()!;

    // 1. Still no sideways scroll — the guard that was already true.
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(clientWidth, "the page measured zero wide").toBe(viewport.width);
    expect(
      scrollWidth,
      `the Farsi homepage is ${scrollWidth - clientWidth}px wider than the tablet it is on`
    ).toBeLessThanOrEqual(clientWidth);

    // 2. The links are on one line each. Compared against each link's own
    //    line-height rather than a literal, so a type-scale change recomputes.
    const wrapped = await nav.evaluate((el) =>
      [...el.querySelectorAll<HTMLAnchorElement>('a:not([href="/book"])')]
        .filter((a) => a.getBoundingClientRect().height > 0)
        // The logo anchor holds an image, not text, and has no line-height to
        // compare against.
        .filter((a) => a.textContent!.trim() !== "")
        .filter(
          (a) =>
            a.getBoundingClientRect().height >
            parseFloat(getComputedStyle(a).lineHeight) * 1.5
        )
        .map((a) => a.textContent!.trim())
    );
    expect(
      wrapped,
      "these Farsi nav links broke onto a second line inside the 64px bar"
    ).toEqual([]);

    // 3. The cluster does not touch the wordmark. Direction-agnostic: under RTL
    //    the logo is on the right, so the separation is whichever of the two
    //    differences is positive. The floor is 2px, not a comfort margin:
    //    Vazirmatn's metrics differ by platform (this exact row measured 18px
    //    of clearance on macOS and 7.7px on the Linux CI runner), so a larger
    //    floor pins font rendering, not layout. Overlap — the defect this
    //    guards — is a NEGATIVE clearance; wrapping is asserted above.
    const clearance = await nav.evaluate((el) => {
      const cluster = el.querySelector("div.hidden")!.getBoundingClientRect();
      const logo = el.querySelector('img[alt="Rumi"]')!.getBoundingClientRect();
      return Math.max(
        cluster.x - (logo.x + logo.width),
        logo.x - (cluster.x + cluster.width)
      );
    });
    expect(
      clearance,
      "the Farsi link cluster is touching the wordmark — the row has run out of bar"
    ).toBeGreaterThan(2);

    // 4. And the CTA — the one control on this bar that takes money — is whole
    //    and inside the viewport.
    const cta = nav.getByRole("link", { name: "رزرو تماس" });
    await expect(cta).toBeVisible();
    const box = (await cta.boundingBox())!;
    expect(box.width, "the Farsi CTA collapsed").toBeGreaterThan(40);
    expect(box.x, "the Farsi CTA hangs off the left edge").toBeGreaterThanOrEqual(0);
    expect(
      box.x + box.width,
      "the Farsi CTA hangs off the right edge"
    ).toBeLessThanOrEqual(viewport.width);
  });
});

/** How far a logo's rendered aspect ratio has drifted from the bitmap's own. */
async function aspectDrift(logo: Locator): Promise<{ drift: number; shape: string }> {
  // The footer logo is `loading="lazy"`, so being scrolled into view starts the
  // fetch rather than finishing it — its naturalWidth reads 0 until the decode
  // lands, which would trip the guard below for the wrong reason.
  await expect
    .poll(
      () => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
      { message: "the logo never finished decoding" }
    )
    .toBe(true);

  const shape = await logo.evaluate((img: HTMLImageElement) => ({
    width: img.clientWidth,
    height: img.clientHeight,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
  }));

  // Guards the measurement: a logo that failed to load reports 0 naturals and
  // every ratio below becomes NaN, which compares false rather than failing for
  // the right reason.
  expect(shape.naturalWidth, "the logo did not load").toBeGreaterThan(0);
  expect(shape.height, "the logo rendered zero high").toBeGreaterThan(0);

  const rendered = shape.width / shape.height;
  const natural = shape.naturalWidth / shape.naturalHeight;
  return {
    drift: Math.abs(rendered - natural) / natural,
    shape: `${shape.width}x${shape.height} against a natural ${shape.naturalWidth}x${shape.naturalHeight}`,
  };
}

test.describe("the chrome logos keep their proportions", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  // Not a narrow-viewport defect at all — this one renders at EVERY width, and
  // it is the pre-landing pass's own doing. Both logos gained intrinsic
  // width/height attributes so the bar and the footer column reserve the box
  // before the bitmap decodes (CLS). But a `width` attribute is a presentational
  // hint that sets the used width, and Tailwind's preflight only resets `height`
  // — so on an <img> sized by `h-9` alone the attribute pins the width at the
  // file's full pixel width and the wordmark stretches to 3x. `w-auto` beside
  // the height class is what hands the width back to the aspect ratio. nav.tsx
  // carried it, footer.tsx did not, and the footer logo shipped 244x36 against
  // an 81x36 natural — measured, not inferred.
  test("renders every logo in the chrome at its natural aspect ratio", async ({
    page,
  }) => {
    await page.goto("/");
    const logos = page.locator('img[alt="Rumi"]');

    // Guards the walk: both chrome surfaces render one, and a locator that
    // stopped matching would pass this test vacuously.
    const count = await logos.count();
    expect(count, "no Rumi logo on the page at all — re-anchor this test").toBeGreaterThan(1);

    for (let i = 0; i < count; i++) {
      const logo = logos.nth(i);
      await logo.scrollIntoViewIfNeeded();
      await expect(logo).toBeVisible();
      const { drift, shape } = await aspectDrift(logo);
      expect(drift, `logo ${i + 1} of ${count} is stretched: ${shape}`).toBeLessThan(0.02);
    }
  });
});

test.describe("the narrowest phone still sold", () => {
  test.use({ viewport: { width: 320, height: 812 } });

  test("renders the nav logo undistorted", async ({ page }) => {
    // The other squash: the bar is a flex row and the logo is a flex child, so
    // without `shrink-0` it is COMPRESSED rather than stretched — measured 23px
    // wide against its 81px natural at this width.
    await page.goto("/");
    const logo = page
      .getByRole("navigation", { name: "Main" })
      .locator('img[alt="Rumi"]');
    await expect(logo).toBeVisible();

    const { drift, shape } = await aspectDrift(logo);
    expect(drift, `the wordmark is squashed: ${shape}`).toBeLessThan(0.02);
  });
});

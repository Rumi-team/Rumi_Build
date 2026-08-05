// @vitest-environment jsdom
// This file renders components, so it needs a DOM. The suite defaults to the
// `node` environment (vitest.config.ts); only the files that render opt in.
import { act, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Nav } from "@/components/nav";
import { LanguageProvider } from "@/lib/i18n";
import { setViewportWidth } from "./helpers/viewport";

// ── Why this file exists ──────────────────────────────────────────────────────
// nav-footer.test.tsx asks WHICH links the chrome offers. This one asks what
// state it puts them in, and both answers depend on things that file has no way
// to vary: the current pathname, and the width of the window.
//
//   - The active-link rule has two arms that used to be one. A section link
//     stays visually lit on its own detail pages (`/services/*`), but
//     aria-current="page" is a claim that the link points at the page being
//     displayed — and on /services/ai-receptionist it does not. Both arms fed
//     both outputs, so a screen reader announced "current page" on a link that
//     navigates somewhere else.
//   - The overlay and everything that dismisses it live under `md:hidden`. Open
//     it on a phone, rotate an iPad or drag a window corner past 768px, and the
//     menu is gone from the screen while `open` is still true — the body-scroll
//     lock stays applied and the page cannot be scrolled again, with no visible
//     control to undo it. The auto-close is pinned here as well as in the e2e
//     because only this level can put the viewport on the far side of the
//     breakpoint at the exact moment the menu is open.
//
// The link COLOURS are pinned in design-tokens.test.ts, where the contrast of
// the pair is computed rather than the class name matched.

const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

beforeEach(() => {
  route.pathname = "/";
  localStorage.clear();
});

function mountNav(pathname: string) {
  route.pathname = pathname;
  render(
    <LanguageProvider>
      <Nav />
    </LanguageProvider>
  );
  return screen.getByRole("navigation", { name: "Main" });
}

/** The desktop bar's own link to `href`. While the overlay is closed it is the
 *  only one in the tree, which is what makes the count a guard rather than a
 *  formality: the overlay renders a second anchor to the same href. */
function barLink(nav: HTMLElement, href: string): HTMLAnchorElement {
  const found = nav.querySelectorAll<HTMLAnchorElement>(`a[href="${href}"]`);
  expect(
    found,
    `expected exactly one bar link to ${href} — re-anchor this test`
  ).toHaveLength(1);
  return found[0];
}

function openMenu(): HTMLElement {
  act(() => screen.getByRole("button", { name: "Open menu" }).click());
  return screen.getByRole("dialog");
}

describe("which link says it is the current page", () => {
  it("lights the section on its detail pages without announcing it as current", () => {
    // The defect, exactly: /services/ai-receptionist is not /services, so the
    // nav link is a signpost, not the destination.
    const nav = mountNav("/services/ai-receptionist");

    const bar = barLink(nav, "/services");
    expect(
      bar.className,
      "the section link is no longer lit on its own detail page"
    ).toMatch(/\btext-accent-hover\b/);
    expect(
      bar.getAttribute("aria-current"),
      "a link pointing at /services announces itself as the current page while /services/ai-receptionist is on screen"
    ).toBeNull();

    const overlay = openMenu();
    const inMenu = within(overlay).getByRole("link", { name: "AI Employees" });
    expect(inMenu.className, "the overlay link is no longer lit").toMatch(
      /\btext-accent\b/
    );
    expect(
      inMenu.getAttribute("aria-current"),
      "the overlay repeats the same false claim the bar made"
    ).toBeNull();
  });

  it("announces it on the page itself, on both surfaces, and nowhere else", () => {
    const nav = mountNav("/services");
    expect(barLink(nav, "/services").getAttribute("aria-current")).toBe("page");
    expect(
      barLink(nav, "/team").getAttribute("aria-current"),
      "a sibling section link claims to be the current page too"
    ).toBeNull();

    const overlay = openMenu();
    expect(
      within(overlay)
        .getByRole("link", { name: "AI Employees" })
        .getAttribute("aria-current")
    ).toBe("page");

    // At most one element in the whole chrome may carry it — the attribute
    // means "this one", and two of them means none of them.
    const current = nav.querySelectorAll('[aria-current="page"]');
    expect(current.length, "the chrome names two current pages at once").toBe(2);
  });

  it("marks the active link with weight as well as colour", () => {
    // WCAG 1.4.1: colour may not be the only carrier of the distinction. The
    // two weights are written as exclusive branches in nav.tsx because listing
    // both classes would leave the winner to Tailwind's emission order.
    const nav = mountNav("/team");
    const active = barLink(nav, "/team");
    const inactive = barLink(nav, "/faq");

    expect(active.className).toMatch(/\bfont-semibold\b/);
    expect(
      active.className,
      "the active link carries both weights — which one wins is Tailwind's call, not the ternary's"
    ).not.toMatch(/\bfont-medium\b/);
    expect(inactive.className).toMatch(/\bfont-medium\b/);
    expect(inactive.className).toMatch(/\btext-ink\b/);
  });
});

describe("the overlay and the breakpoint it lives under", () => {
  it("closes itself when the viewport crosses into the desktop layout", () => {
    // An iPad rotated in landscape, or a window dragged wider. Everything this
    // component renders is `md:hidden`, so above the breakpoint the overlay AND
    // its close button are display:none while `open` is still true.
    mountNav("/");
    const overlay = openMenu();
    expect(overlay).toBeInTheDocument();
    expect(
      document.body.style.overflow,
      "the overlay did not lock the page behind it — this test cannot show the lock being released"
    ).toBe("hidden");

    act(() => setViewportWidth(768));

    expect(
      screen.queryByRole("dialog"),
      "the overlay survived the crossing into a layout that hides its own close button"
    ).toBeNull();
    expect(
      document.body.style.overflow,
      "the page is still scroll-locked at a width where nothing on screen can unlock it"
    ).not.toBe("hidden");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("refuses to stay open if it is somehow opened above the breakpoint", () => {
    // The other branch of the same conditional: the media query already
    // matches when the effect first runs, rather than changing under it. No
    // visitor can reach this through the hidden toggle, which is the point —
    // it is the state restored by anything that re-mounts the bar with the
    // menu already open.
    setViewportWidth(1024);
    mountNav("/");
    act(() => screen.getByRole("button", { name: "Open menu" }).click());

    expect(
      screen.queryByRole("dialog"),
      "the overlay opened at a width where it is display:none"
    ).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});

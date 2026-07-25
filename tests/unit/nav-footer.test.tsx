import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HomeSectionCTA } from "@/components/home-section-cta";
import { AI_EMPLOYEES } from "@/lib/data";
import { LanguageProvider, useT, type Dict } from "@/lib/i18n";
import { loadDicts } from "./helpers/dicts";

// ── Why this file exists ──────────────────────────────────────────────────────
// Three pieces of site chrome grew a dependency on the role data or on the
// active language in this change, and each carries an invariant that only a
// source comment was holding up:
//   - footer.tsx now renders a column of all five roles, labelled with the
//     TRANSLATED name looked up by slug. Get the lookup wrong and a Farsi
//     visitor sees every role named twice, two different ways, on one page.
//   - nav.tsx and mobile-menu.tsx each hold their own copy of the link list,
//     with "keep the two in sync" written in a comment above both. AI Employees
//     was added to both by hand; a desktop-only link is invisible on a phone.
//   - section-cta.tsx grew an `arrow` prop precisely because the glyph is the
//     last logical character, so under dir="rtl" it lands at the LEFT end of the
//     line and has to point left to still mean "onward".

let EN: Dict;
let FA: Dict;

beforeAll(() => {
  const dicts = loadDicts();
  EN = dicts.en;
  FA = dicts.fa;
  // loadDicts reads the dictionaries the only way they are reachable — through
  // the provider — which means it leaves the LAST language it visited in
  // localStorage. Every component mounted below restores from there on mount, so
  // without this the first render comes up in Farsi.
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

function Switcher({ onReady }: { onReady: (set: (l: "en" | "fa") => void) => void }) {
  const { setLang } = useT();
  onReady(setLang);
  return null;
}

function mount(ui: React.ReactNode) {
  let setLang!: (l: "en" | "fa") => void;
  render(
    <LanguageProvider>
      <Switcher onReady={(s) => (setLang = s)} />
      {ui}
    </LanguageProvider>
  );
  return { setLang: (l: "en" | "fa") => act(() => setLang(l)) };
}

type Link = { href: string | null; label: string };

/** Every labelled link inside a container, in DOM order. Drops the logo, whose
 *  only child is an <img> and so carries no text. */
function links(root: ParentNode): Link[] {
  return Array.from(root.querySelectorAll<HTMLAnchorElement>("a"))
    .map((a) => ({ href: a.getAttribute("href"), label: a.textContent!.trim() }))
    .filter((l) => l.label !== "");
}

/** Multiset difference, so the links a click ADDED can be read off. */
function minus(all: Link[], before: Link[]): Link[] {
  const rest = [...before];
  return all.filter((item) => {
    const i = rest.findIndex(
      (r) => r.href === item.href && r.label === item.label
    );
    if (i === -1) return true;
    rest.splice(i, 1);
    return false;
  });
}

describe("footer role column", () => {
  it("lists every role in canonical order, translated, linked to its own page", () => {
    const { setLang } = mount(<Footer />);

    const roleLinks = () =>
      links(document.body).filter((l) => l.href!.startsWith("/services/"));

    // Order and slugs come from AI_EMPLOYEES, so the column cannot drift from
    // the pages it links to.
    expect(roleLinks().map((l) => l.href)).toEqual(
      AI_EMPLOYEES.map((r) => `/services/${r.slug}`)
    );
    expect(roleLinks().map((l) => l.label)).toEqual(
      AI_EMPLOYEES.map((r) => r.name)
    );
    expect(
      screen.getByRole("heading", { name: EN.footer.roles })
    ).toBeInTheDocument();

    // The labels are the same translated names the homepage cards render, joined
    // by slug — not the canonical English ones, and not by array position.
    setLang("fa");
    const faNames = new Map(
      [...FA.roles.items, ...FA.roles.bundles].map((r) => [r.slug, r.name])
    );
    expect(roleLinks().map((l) => l.href)).toEqual(
      AI_EMPLOYEES.map((r) => `/services/${r.slug}`)
    );
    expect(
      roleLinks().map((l) => l.label),
      "the footer names the roles in English while the page is in Farsi"
    ).toEqual(AI_EMPLOYEES.map((r) => faNames.get(r.slug)));
    expect(
      screen.getByRole("heading", { name: FA.footer.roles })
    ).toBeInTheDocument();
  });
});

describe("desktop nav and mobile menu", () => {
  it("offers the same links in both, with AI Employees leading, in both languages", () => {
    const { setLang } = mount(<Nav />);
    const nav = screen.getByRole("navigation", { name: "Main" });

    const check = (t: Dict) => {
      const closed = links(nav);
      const desktop = closed.filter((l) => l.href !== "/book");
      expect(
        desktop[0],
        "AI Employees no longer leads the desktop nav"
      ).toEqual({ href: "/services", label: t.nav.aiEmployees });

      // Open the hamburger; whatever links appear are the mobile menu's.
      const toggle = screen.getByRole("button", { name: "Open menu" });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      act(() => toggle.click());
      expect(
        screen.getByRole("button", { name: "Close menu" })
      ).toHaveAttribute("aria-expanded", "true");

      const added = minus(links(nav), closed);
      expect(
        added.filter((l) => l.href !== "/book"),
        "the mobile menu and the desktop nav offer different links"
      ).toEqual(desktop);
      // Both surfaces keep the booking CTA.
      expect(added.map((l) => l.href)).toContain("/book");
      expect(closed.map((l) => l.href)).toContain("/book");

      act(() => screen.getByRole("button", { name: "Close menu" }).click());
      expect(links(nav)).toEqual(closed);
    };

    check(EN);
    setLang("fa");
    check(FA);
  });
});

describe("homepage closing CTA", () => {
  it("points its arrow the other way in Farsi", () => {
    // "Book a Call →" in English; in RTL the glyph renders at the left end of
    // the line, so it has to be "←" to still read as onward.
    const { setLang } = mount(<HomeSectionCTA />);
    const cta = () => screen.getByRole("link", { name: /./ });

    expect(cta()).toHaveAttribute("href", "/book");
    expect(cta().textContent!.trim()).toBe(`${EN.cta.button} ${EN.arrow}`);

    setLang("fa");
    expect(cta().textContent!.trim()).toBe(`${FA.cta.button} ${FA.arrow}`);
    expect(
      cta().textContent,
      "the CTA still points right while the page reads right-to-left"
    ).not.toContain(EN.arrow);
  });
});

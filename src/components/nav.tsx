"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./mobile-menu";
import { LanguageDropdown } from "./language-dropdown";
import { useT } from "@/lib/i18n";

export function Nav() {
  const { t } = useT();
  // The mobile overlay's open state lives HERE rather than inside MobileMenu:
  // the bar has to react to it (the CTA below hides while the overlay is up, so
  // the two "Book a Call" buttons are never on screen at once — the bar sits at
  // z-50, above the overlay's z-40, and would otherwise float over it).
  const [menuOpen, setMenuOpen] = useState(false);
  // Outside the App Router (the unit suite mounts this component directly)
  // there is no pathname context and this reads null.
  const pathname = usePathname() ?? "";

  // AI Employees leads — it's the offer. Keep this list in sync with
  // mobile-menu.tsx.
  const links = [
    { label: t.nav.aiEmployees, href: "/services" },
    { label: t.nav.industries, href: "/industries" },
    { label: t.nav.team, href: "/team" },
    { label: t.nav.faq, href: "/faq" },
  ];

  // v2 spec: "links in ink with accent hover/active". A role page lives under
  // /services/<slug> and an industry under /industries/<slug>, so the section
  // link stays lit on its own detail pages — hence the prefix arm.
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // The prefix arm above is a VISUAL affordance and nothing more. It must not
  // feed aria-current, which is a claim that the link points at the page
  // currently being displayed — on /services/ai-receptionist the /services link
  // announced itself as "current page" while pointing somewhere else, which is
  // how a screen-reader user is told they already are where they are not.
  const isCurrent = (href: string) => pathname === href;

  return (
    <nav
      aria-label="Main"
      // DO NOT add transform / filter / backdrop-filter / will-change to this
      // element, ever. mobile-menu.tsx renders a `fixed` overlay as a
      // DESCENDANT of this bar, and any of those properties makes this element
      // the containing block for fixed descendants — which collapses the
      // overlay's `top-16 bottom-0` to the 64px bar instead of the viewport, so
      // the menu becomes a zero-height invisible strip. This bar carried
      // `backdrop-blur` until brand v2 removed it; putting it back would break
      // the mobile menu with nothing on screen to explain why.
      // px-8 between md and lg rather than the page's own md:px-12. Measured,
      // not guessed: the Persian labels are far longer than the English ones
      // ("کارمندان هوش مصنوعی" is 134px against "AI Employees" at 91px), and at
      // exactly 768 the Farsi row needs 663px of bar against the 591px that
      // md:px-12 leaves beside the wordmark. Nothing overflows — the document
      // never scrolls sideways — because flexbox absorbs the deficit by
      // WRAPPING: three of the four links went to two lines and the cluster ran
      // flush into the logo with 0px between them. Reclaiming 32px here and
      // 60px from the gap below is what fits it, with 18px to spare; both
      // revert to the spec's values at lg, where there is room for them.
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 lg:px-12 h-16 border-b border-line bg-white"
    >
      {/* shrink-0: the bar is a flex row and the logo is a flex child, so at
          narrow widths (<=375px) it gets squeezed — measured 23px wide at 320px
          against its 81px natural width, i.e. a distorted wordmark. The
          intrinsic width/height are the file's real pixel dimensions, so the
          bar reserves the box before the image decodes (no layout shift). */}
      <a href="/" className="shrink-0">
        <img
          src="/rumi-logo-on-white.png"
          alt="Rumi"
          width={244}
          height={108}
          className="h-9 w-auto"
        />
      </a>

      {/* Desktop links. gap-3 until lg — see the padding note on <nav> above:
          the tablet range is where the Farsi row runs out of bar, and the gaps
          are 120px of the 663px it needs. gap-4 was measured too: it lands the
          cluster on exactly the width available, which still wraps. */}
      <div className="hidden md:flex items-center gap-3 lg:gap-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={isCurrent(link.href) ? "page" : undefined}
            // accent-hover (#047857), not accent: these links sit on the white
            // bar, where #059669 measures 3.77:1 at 14px — under the AA 4.5:1
            // floor. #047857 reads 5.48:1 and is already in the locked palette,
            // the same move the 2026-07-27 white-on-accent row made. The weight
            // swap is WCAG 1.4.1: colour alone may not be the only thing that
            // marks the active link. font-medium and font-semibold are written
            // as exclusive branches on purpose — listing both would leave the
            // winner to Tailwind's own emission order, not to this ternary.
            className={`text-sm transition hover:text-accent-hover ${
              isActive(link.href)
                ? "font-semibold text-accent-hover"
                : "font-medium text-ink"
            }`}
          >
            {link.label}
          </a>
        ))}
        <LanguageDropdown />
        <a href="/book" className="btn-primary px-5 py-2 text-sm whitespace-nowrap">
          {t.nav.bookCall}
        </a>
      </div>

      {/* Mobile: language + CTA + hamburger */}
      <div className="flex md:hidden items-center gap-1.5">
        <LanguageDropdown />
        {/* max-[389px]:hidden — below 390px the logo, the language select, this
            CTA and the hamburger cannot all fit on one 64px bar. Those visitors
            reach /book through the overlay's full-width CTA instead. */}
        <a
          href="/book"
          className={`btn-primary px-2.5 py-2.5 text-sm whitespace-nowrap max-[389px]:hidden ${
            menuOpen ? "hidden" : ""
          }`}
        >
          {t.nav.bookCall}
        </a>
        <MobileMenu open={menuOpen} setOpen={setMenuOpen} />
      </div>
    </nav>
  );
}

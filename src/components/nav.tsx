"use client";

import { MobileMenu } from "./mobile-menu";
import { LanguageDropdown } from "./language-dropdown";
import { useT } from "@/lib/i18n";

export function Nav() {
  const { t } = useT();
  // AI Employees leads — it's the offer. Keep this list in sync with
  // mobile-menu.tsx.
  const links = [
    { label: t.nav.aiEmployees, href: "/services" },
    { label: t.nav.industries, href: "/industries" },
    { label: t.nav.team, href: "/team" },
    { label: t.nav.faq, href: "/faq" },
  ];

  return (
    <nav
      aria-label="Main"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b border-white/10 bg-navy/95 backdrop-blur"
    >
      <a href="/">
        <img src="/rumi-logo-on-navy.png" alt="Rumi" className="h-9 w-auto" />
      </a>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-white/60 transition hover:text-accent"
          >
            {link.label}
          </a>
        ))}
        <LanguageDropdown />
        <a href="/book" className="btn-primary px-5 py-2 text-sm">
          {t.nav.bookCall}
        </a>
      </div>

      {/* Mobile: language + CTA + hamburger */}
      <div className="flex md:hidden items-center gap-2">
        <LanguageDropdown />
        <a href="/book" className="btn-primary px-3 py-1.5 text-sm">
          {t.nav.bookCall}
        </a>
        <MobileMenu />
      </div>
    </nav>
  );
}

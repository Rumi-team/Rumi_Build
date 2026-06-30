"use client";

import { MobileMenu } from "./mobile-menu";
import { LanguageDropdown } from "./language-dropdown";
import { useT } from "@/lib/i18n";

export function Nav() {
  const { t } = useT();
  const links = [{ label: t.nav.team, href: "/team" }];

  return (
    <nav
      aria-label="Main"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur"
    >
      <a href="/">
        <img src="/rumi-logo.png" alt="Rumi" className="h-10" />
      </a>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-zinc-400 transition hover:text-zinc-200"
          >
            {link.label}
          </a>
        ))}
        <LanguageDropdown />
        <a
          href="/evaluate"
          className="rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          {t.nav.freeEval}
        </a>
      </div>

      {/* Mobile: language + CTA + hamburger */}
      <div className="flex md:hidden items-center gap-2">
        <LanguageDropdown />
        <a
          href="/evaluate"
          className="rounded-lg bg-amber-400 px-3 py-1.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
        >
          {t.nav.freeEval}
        </a>
        <MobileMenu />
      </div>
    </nav>
  );
}

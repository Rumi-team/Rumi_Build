"use client";

import { MobileMenu } from "./mobile-menu";
import { LanguageDropdown } from "./language-dropdown";
import { useT } from "@/lib/i18n";

const SOCIALS = [
  {
    label: "Rumi on X",
    href: "https://x.com/rumiagent",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zm-1.293 19.494h2.039L6.486 3.24H4.298z",
  },
  {
    label: "Rumi on LinkedIn",
    href: "https://www.linkedin.com/in/rumi-ali/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

export function Nav() {
  const { t } = useT();
  const links = [
    { label: t.nav.pricing, href: "/pricing" },
    { label: t.nav.team, href: "/team" },
  ];

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
        <div className="flex items-center gap-3">
          {SOCIALS.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-zinc-400 transition hover:text-zinc-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </div>
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

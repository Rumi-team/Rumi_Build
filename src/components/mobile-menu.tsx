"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useT();

  // Mirror of nav.tsx's desktop link list — keep the two in sync.
  const links = [
    { label: t.nav.aiEmployees, href: "/services" },
    { label: t.nav.industries, href: "/industries" },
    { label: t.nav.team, href: "/team" },
    { label: t.nav.faq, href: "/faq" },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-white/60 hover:text-white transition"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? (
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 border-b border-white/10 bg-navy px-6 pb-6 pt-2 z-40">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-base text-white/80 hover:text-white transition border-b border-white/10"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="/book"
            className="btn-primary block mt-4 w-full py-3 text-center text-base"
            onClick={() => setOpen(false)}
          >
            {t.nav.bookCall}
          </a>
        </div>
      )}
    </div>
  );
}

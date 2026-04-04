"use client";

import { useState } from "react";
import { CALENDLY_URL } from "@/lib/data";

const LINKS = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Pricing", href: "/pricing" },
  { label: "Team", href: "/team" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-zinc-400 hover:text-zinc-200 transition"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? (
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 border-b border-zinc-800 bg-zinc-900/98 backdrop-blur-xl px-6 pb-6 pt-2 z-40">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-base text-zinc-300 hover:text-zinc-100 transition border-b border-zinc-800"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 w-full rounded-lg bg-amber-400 py-3 text-center text-base font-semibold text-zinc-900 transition hover:bg-amber-300"
            onClick={() => setOpen(false)}
          >
            Book Free Call
          </a>
        </div>
      )}
    </div>
  );
}

import { CALENDLY_URL } from "@/lib/data";
import { MobileMenu } from "./mobile-menu";

const LINKS = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Pricing", href: "/pricing" },
  { label: "Team", href: "/team" },
];

export function Nav() {
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
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-zinc-400 transition hover:text-zinc-200"
          >
            {link.label}
          </a>
        ))}
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          Book Free Call
        </a>
      </div>

      {/* Mobile: CTA + hamburger */}
      <div className="flex md:hidden items-center gap-3">
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
        >
          Book Call
        </a>
        <MobileMenu />
      </div>
    </nav>
  );
}

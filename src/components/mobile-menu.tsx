"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";

// The `open` state is owned by nav.tsx, not by this component: the bar has to
// react to it too (its own CTA hides while this overlay is up, so a phone never
// shows two "Book a Call" buttons at once).
export function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useT();
  // Null outside the App Router — the unit suite mounts Nav directly.
  const pathname = usePathname() ?? "";
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);

  // Mirror of nav.tsx's desktop link list — keep the two in sync.
  const links = [
    { label: t.nav.aiEmployees, href: "/services" },
    { label: t.nav.industries, href: "/industries" },
    { label: t.nav.team, href: "/team" },
    { label: t.nav.faq, href: "/faq" },
  ];

  // Same rule as nav.tsx: a section link stays lit on its own detail pages.
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // ...but only the EXACT page may announce itself as the current one. The
  // prefix arm above is a visual affordance ("you are somewhere in here");
  // aria-current="page" is a claim that this link points at the page being
  // displayed, and on /services/ai-receptionist the /services link does not.
  const isCurrent = (href: string) => pathname === href;

  // The overlay covers the viewport, so the page behind it must not scroll
  // under it — a phone otherwise scrolls the article while the menu is up and
  // lands somewhere else entirely when it closes.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes it. Without this the only way out of a full-screen overlay is
  // the toggle, which a keyboard user has to walk back to.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  // Crossing INTO the desktop breakpoint closes the menu. Everything this
  // component renders — the overlay and the toggle that dismisses it — sits
  // under `md:hidden`, so at >=768px `open` can stay true with nothing on
  // screen: the body-scroll lock above is still applied, the page cannot be
  // scrolled, and the only control that would undo it is display:none (as is
  // the button the close branch below hands focus back to). An iPad rotation
  // or a dragged window corner is enough. The 768 here MUST equal Tailwind's
  // `md`, which is the breakpoint on the wrapper <div> at the bottom of this
  // file — the two are one system with no shared constant between them.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    if (desktop.matches) {
      setOpen(false);
      return;
    }
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [open, setOpen]);

  // Tab is trapped while the overlay is up, and the boundary is the whole
  // <nav>, not the overlay: the toggle that closes it lives in the BAR above
  // the overlay, so trapping the overlay alone would lock the exit away.
  // Hidden elements are filtered out because the bar's own CTA is display:none
  // exactly while this is open, and a trap that cycled through it would park
  // focus on nothing. Hand-rolled rather than pulled in: this is the whole of
  // what the component needs.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nav = toggleRef.current?.closest("nav");
      if (!nav) return;
      const focusable = Array.from(
        nav.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        // getClientRects() rather than offsetParent: the overlay is
        // `position: fixed`, and a fixed element reports no offsetParent at
        // all even when it is plainly on screen.
      ).filter((el) => el.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      // The `!nav.contains` arm is not redundant: focus can already be outside
      // (a click on the page behind, or the browser's own address bar), and
      // without it the very next Tab walks into the locked page underneath.
      if (event.shiftKey) {
        if (active === first || !nav.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !nav.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Focus follows the overlay: into the first link when it opens, back to the
  // toggle when it closes. `wasOpen` keeps the close branch from stealing focus
  // on the initial render, when the menu was never open in the first place.
  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
    else if (wasOpen.current) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        onClick={() => setOpen(!open)}
        // `muted` is the palette's secondary-text token and matches the
        // language dropdown's icons beside it; ink/70 composited to a colour
        // the locked system does not define.
        className="p-2.5 text-muted hover:text-ink transition"
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
        // `top-16` must stay equal to the `h-16` bar in nav.tsx — this overlay
        // starts where that bar ends. See also the containing-block warning on
        // nav.tsx's <nav>: this element is `fixed` but is a DESCENDANT of the
        // bar, so a transform/filter/backdrop-filter there collapses these
        // offsets to the bar's own 64px box.
        // overscroll-contain: the content here is shorter than the viewport, so
        // on iOS Safari a touch drag inside it chains straight through to the
        // document and scrolls the page behind — `overflow: hidden` on <body>
        // does not stop touch scrolling there. `role=dialog` + `aria-modal`
        // match what the focus trap above actually enforces.
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto overscroll-contain bg-navy px-6 pb-6 pt-2"
        >
          <div className="flex flex-col gap-1">
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className={`block py-3 text-base transition border-b border-white/10 hover:text-white ${
                  isActive(link.href) ? "text-accent" : "text-white/80"
                }`}
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

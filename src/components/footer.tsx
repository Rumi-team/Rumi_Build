"use client";

import { useT } from "@/lib/i18n";

// Social links live in the footer (bottom of the page).
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

export function Footer() {
  const { t } = useT();
  return (
    <footer className="bg-navy border-t border-white/10 py-12 px-6 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <div>
            <img src="/rumi-logo-on-navy.png" alt="Rumi" className="h-9 mb-3" />
            <p className="text-sm text-white/50 mb-4">{t.footer.tagline}</p>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-3">
              {t.footer.vert}
            </h3>
            <ul className="space-y-2">
              <li><a href="/industries/real-estate" className="text-sm text-white/60 hover:text-accent transition">Real Estate</a></li>
              <li><a href="/industries/curtains" className="text-sm text-white/60 hover:text-accent transition">Curtains &amp; Drapery</a></li>
              <li><a href="/industries/rugs" className="text-sm text-white/60 hover:text-accent transition">Rugs &amp; Home Goods</a></li>
              <li><a href="/industries/beauty" className="text-sm text-white/60 hover:text-accent transition">Beauty &amp; Salon</a></li>
              <li><a href="/industries/home-services" className="text-sm text-white/60 hover:text-accent transition">Home Services</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-3">
              {t.footer.company}
            </h3>
            <ul className="space-y-2">
              <li><a href="/team" className="text-sm text-white/60 hover:text-accent transition">{t.nav.team}</a></li>
              <li><a href="/faq" className="text-sm text-white/60 hover:text-accent transition">{t.nav.faq}</a></li>
              <li><a href="/book" className="text-sm text-white/60 hover:text-accent transition">{t.footer.bookCall}</a></li>
              <li><a href="mailto:support@rumi.build" className="text-sm text-white/60 hover:text-accent transition">support@rumi.build</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">{t.footer.rights}</p>
          <div className="flex items-center gap-5">
            {/* Social links (moved here from the top nav) */}
            {SOCIALS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-white/60 transition hover:text-accent"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
            <span className="h-4 w-px bg-white/20" aria-hidden />
            <a href="/terms" className="text-sm text-white/60 hover:text-accent transition">{t.footer.terms}</a>
            <a href="/privacy" className="text-sm text-white/60 hover:text-accent transition">{t.footer.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-zinc-800 py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <div>
            <img src="/rumi-logo.png" alt="Rumi" className="h-10 mb-3" />
            <p className="text-xs text-zinc-500 mb-4">{t.footer.tagline}</p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">
              {t.footer.vert}
            </h3>
            <ul className="space-y-2">
              <li><a href="/industries/real-estate" className="text-sm text-zinc-400 hover:text-zinc-200 transition">Real Estate</a></li>
              <li><a href="/industries/curtains" className="text-sm text-zinc-400 hover:text-zinc-200 transition">Curtains &amp; Drapery</a></li>
              <li><a href="/industries/rugs" className="text-sm text-zinc-400 hover:text-zinc-200 transition">Rugs &amp; Home Goods</a></li>
              <li><a href="/industries/beauty" className="text-sm text-zinc-400 hover:text-zinc-200 transition">Beauty &amp; Salon</a></li>
              <li><a href="/industries/home-services" className="text-sm text-zinc-400 hover:text-zinc-200 transition">Home Services</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">
              {t.footer.company}
            </h3>
            <ul className="space-y-2">
              <li><a href="/team" className="text-sm text-zinc-400 hover:text-zinc-200 transition">{t.nav.team}</a></li>
              <li><a href="/pricing" className="text-sm text-zinc-400 hover:text-zinc-200 transition">{t.nav.pricing}</a></li>
              <li><a href="/schedule" className="text-sm text-zinc-400 hover:text-zinc-200 transition">{t.footer.bookCall}</a></li>
              <li><a href="mailto:support@rumi.build" className="text-sm text-zinc-400 hover:text-zinc-200 transition">support@rumi.build</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">{t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <a href="/terms" className="text-sm text-zinc-400 hover:text-zinc-200 transition">{t.footer.terms}</a>
            <a href="/privacy" className="text-sm text-zinc-400 hover:text-zinc-200 transition">{t.footer.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

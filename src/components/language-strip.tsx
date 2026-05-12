"use client";

import { HERO_STRIP_LANGUAGES, type HeroLangCode } from "@/lib/data";

export function LanguageStrip({
  lang,
  onChange,
}: {
  lang: HeroLangCode;
  onChange: (code: HeroLangCode) => void;
}) {
  return (
    <nav aria-label="Language" className="relative -mx-6 px-6 mb-8">
      <ul className="flex items-center gap-3 overflow-x-auto md:overflow-visible md:justify-start md:flex-wrap pb-2 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {HERO_STRIP_LANGUAGES.map(({ code, label, rtl }, i) => {
          const isActive = lang === code;
          return (
            <li
              key={code}
              className="flex items-center gap-3 shrink-0"
            >
              {i > 0 && (
                <span className="text-zinc-700 select-none" aria-hidden>
                  ·
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(code)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "text-sm py-2 transition border-b-2 -mb-px",
                  isActive
                    ? "text-zinc-200 border-amber-400"
                    : "text-zinc-500 border-transparent hover:text-zinc-300",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2 focus-visible:rounded-sm",
                ].join(" ")}
              >
                <span
                  lang={code}
                  dir={rtl ? "rtl" : undefined}
                  className={rtl ? "font-vazirmatn" : undefined}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {/* Right-edge fade hint on mobile */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-zinc-900 to-transparent md:hidden"
        aria-hidden
      />
    </nav>
  );
}

"use client";

import { LANGUAGES, useT, type Lang } from "@/lib/i18n";

// Site language switcher. Changing it re-renders every section + the
// evaluation form in the chosen language (and flips to RTL for Farsi).
export function LanguageDropdown({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useT();
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute left-2.5 h-4 w-4 text-zinc-500"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.5 10a9.6 9.6 0 011.2-4.6A8.3 8.3 0 019 3.2 8.3 8.3 0 0110.3 5.4 9.6 9.6 0 0111.5 10a9.6 9.6 0 01-1.2 4.6A8.3 8.3 0 019 16.8a8.3 8.3 0 01-1.3-2.2A9.6 9.6 0 016.5 10zM3.1 9h2A11 11 0 016 5.3 8 8 0 003.1 9zm0 2A8 8 0 006 14.7 11 11 0 015 11H3.1zm11.8-2A11 11 0 0014 5.3 8 8 0 0116.9 9h-2zm2 2h-2a11 11 0 01-1 3.7A8 8 0 0016.9 11z"
          clipRule="evenodd"
        />
      </svg>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label={t.langLabel}
        className="appearance-none rounded-lg border border-zinc-700 bg-zinc-800/60 py-1.5 pl-8 pr-8 text-sm text-zinc-200 transition hover:border-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="bg-zinc-900 text-zinc-200">
            {l.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute right-2 h-4 w-4 text-zinc-500"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

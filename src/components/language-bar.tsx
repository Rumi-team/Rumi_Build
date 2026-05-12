import { LANGUAGE_BAR, LA_LANGUAGES } from "@/lib/data";

export function LanguageBar() {
  return (
    <section
      aria-labelledby="language-bar-heading"
      className="py-20 px-6 border-t border-zinc-800"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          {LANGUAGE_BAR.eyebrow}
        </p>
        <h2
          id="language-bar-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-3xl"
        >
          {LANGUAGE_BAR.heading}
        </h2>
        <p className="text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed">
          {LANGUAGE_BAR.sub}
        </p>

        <ul
          aria-label={`${LA_LANGUAGES.length} languages Rumi delivers customers in`}
          className="flex flex-wrap gap-2 mb-6"
        >
          {LA_LANGUAGES.map((language) => (
            <li
              key={language}
              className="rounded-full border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-amber-400/60 hover:text-amber-200"
            >
              {language}
            </li>
          ))}
        </ul>

        <p className="text-sm text-zinc-500 max-w-2xl">
          {LANGUAGE_BAR.footnote}
        </p>
      </div>
    </section>
  );
}

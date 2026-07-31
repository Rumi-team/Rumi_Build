// The one place the English-page direction pin is written down.
//
// WHY IT EXISTS. Translation on this site is client-side: LanguageProvider
// stamps `dir="rtl" lang="fa"` on <html> for a visitor who has stored Farsi.
// Every server page under src/app except the homepage renders English prose, so
// under that stored preference they would right-align and set in Vazirmatn —
// English copy, mirrored and in the wrong typeface. Each of those pages pins
// itself back to LTR/en with this wrapper.
//
// WHY `font-sans` IS NOT REDUNDANT WITH lang="en". The Vazirmatn swap in
// globals.css is `html[lang="fa"] body { font-family: var(--font-vazirmatn) }`.
// It matches on <body> via an ancestor <html> selector, so a `lang` attribute on
// a descendant wrapper cannot undo it — the rule is not competing for the same
// element. Only re-declaring the family on this element does, and `font-sans` is
// the Inter utility that does it. Drop the class and the direction is fixed
// while the Persian face stays.
//
// Nav and Footer stay OUTSIDE this wrapper on every page on purpose: they ARE
// translated and must follow the global direction.
//
// The homepage (src/app/page.tsx) is deliberately not wrapped — it is the one
// page that renders through the dictionary, so it must follow the global
// direction like the chrome does.
export function EnglishMain({
  className,
  children,
}: {
  /** The page's own <main> classes. `font-sans` is prepended, never replaced. */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <main
      dir="ltr"
      lang="en"
      className={className ? `font-sans ${className}` : "font-sans"}
    >
      {children}
    </main>
  );
}

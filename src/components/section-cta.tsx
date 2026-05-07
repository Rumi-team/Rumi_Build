export function SectionCTA({
  title = "Ready to bring more local customers to your store?",
  description = "Free 15-min call. English or Farsi. We’ll learn your business, walk through pricing, and answer any questions. No commitment.",
  cta = "Book a free 15-min call",
  sub = "Built for Iranian-American businesses in North America.",
  href = "/schedule",
}: {
  title?: string;
  description?: string;
  cta?: string;
  sub?: string;
  href?: string;
}) {
  return (
    <section className="py-20 px-6 text-center border-t border-zinc-800">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
        {title}
      </h2>
      <p className="text-lg text-zinc-400 mb-8">{description}</p>
      <a
        href={href}
        className="inline-block rounded-lg bg-amber-400 px-8 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      >
        {cta} &rarr;
      </a>
      <p className="text-xs text-zinc-500 mt-4">{sub}</p>
    </section>
  );
}

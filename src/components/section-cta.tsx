export function SectionCTA({
  title = "Ready to bring more local customers to your store?",
  description = "Free 15-min call. English or Farsi. We’ll learn your business, walk through pricing, and answer any questions. No commitment.",
  cta = "Book a free 15-min call",
  sub = "Qualified customers — in every language they speak. We charge per booked lead, not per campaign.",
  href = "/schedule",
}: {
  title?: string;
  description?: string;
  cta?: string;
  sub?: string;
  href?: string;
}) {
  return (
    <section className="bg-navy py-20 px-6 md:px-12 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-h2 text-white mb-3">
        {title}
      </h2>
      <p className="text-lg text-white/70 mb-8">{description}</p>
      <a href={href} className="btn-primary px-8 py-3.5 text-base">
        {cta} &rarr;
      </a>
      <p className="text-xs text-white/50 mt-4">{sub}</p>
    </section>
  );
}

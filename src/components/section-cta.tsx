export function SectionCTA({
  title = "Let’s find out what’s actually holding you back.",
  description = "Book a call. We’ll ask about your business, tell you plainly where you’re losing customers, and offer exactly what would help — nothing you don’t need.",
  cta = "Book a Call",
  sub = "A real conversation, not a sales pitch. In English or Farsi.",
  href = "/book",
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

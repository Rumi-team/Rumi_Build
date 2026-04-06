import { CALENDLY_URL } from "@/lib/data";

export function SectionCTA({
  title = "Let\u2019s talk about your business",
  description = "Free 30-minute call. We\u2019ll identify where voice AI, a new website, or automation saves you the most.",
  cta = "Book a Call",
  sub = "No commitment. Voice AI starts at $250/mo.",
}: {
  title?: string;
  description?: string;
  cta?: string;
  sub?: string;
}) {
  return (
    <section className="py-20 px-6 text-center border-t border-zinc-800">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
        {title}
      </h2>
      <p className="text-lg text-zinc-400 mb-8">{description}</p>
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg bg-amber-400 px-8 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      >
        {cta} &rarr;
      </a>
      <p className="text-xs text-zinc-500 mt-4">{sub}</p>
    </section>
  );
}

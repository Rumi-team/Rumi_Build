import { VERTICALS } from "@/lib/data";
import { VerticalCard } from "./vertical-card";

// Top 3 largest markets for homepage preview
const TOP_VERTICALS = VERTICALS.slice(0, 3);

export function IndustriesPreview() {
  return (
    <section className="bg-white py-20 px-6 md:px-12 border-t border-line">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-3">Industries</p>
        <h2 className="text-3xl font-bold tracking-h2 text-ink mb-3">
          Built for industries where AI pays for itself
        </h2>
        <p className="text-muted mb-10 max-w-xl">
          Vertical solutions with clear ROI and massive addressable markets.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {TOP_VERTICALS.map((vertical) => (
            <VerticalCard key={vertical.slug} vertical={vertical} />
          ))}
        </div>
        <a
          href="/industries"
          className="inline-block text-sm text-accent hover:text-accent-hover transition"
        >
          See all 6 industries &rarr;
        </a>
      </div>
    </section>
  );
}

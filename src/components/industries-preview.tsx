import { VERTICALS } from "@/lib/data";
import { VerticalCard } from "./vertical-card";

// Top 3 largest markets for homepage preview
const TOP_VERTICALS = VERTICALS.slice(0, 3);

export function IndustriesPreview() {
  return (
    <section className="py-20 px-6 border-t border-zinc-800">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Industries
        </p>
        <h2 className="text-3xl font-bold tracking-tight mb-3">
          Built for industries where AI pays for itself
        </h2>
        <p className="text-zinc-400 mb-10 max-w-xl">
          Vertical solutions with clear ROI and massive addressable markets.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {TOP_VERTICALS.map((vertical) => (
            <VerticalCard key={vertical.slug} vertical={vertical} />
          ))}
        </div>
        <a
          href="/industries"
          className="inline-block text-sm text-amber-400 hover:text-amber-300 transition"
        >
          See all 6 industries &rarr;
        </a>
      </div>
    </section>
  );
}

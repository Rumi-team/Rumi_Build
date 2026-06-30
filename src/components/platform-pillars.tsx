"use client";

import { useT } from "@/lib/i18n";
import { ServiceCard } from "@/components/service-card";

// Icons are not translatable, so they live here and zip with the translated
// pillar copy (same order as the dictionary's pillars.items).
const ICONS = ["🌐", "📱", "📣", "🤖", "💬", "🧰"];

export function PlatformPillars() {
  const { t } = useT();
  return (
    <section
      aria-labelledby="pillars-heading"
      className="py-20 px-6 section-alt section-divider"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          {t.pillars.eyebrow}
        </p>
        <h2
          id="pillars-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
        >
          {t.pillars.heading}
        </h2>
        <p className="text-zinc-400 mb-10 max-w-xl text-lg">{t.pillars.sub}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.pillars.items.map((pillar, i) => (
            <ServiceCard
              key={pillar.name}
              service={{ icon: ICONS[i] ?? "•", name: pillar.name, tagline: pillar.tagline }}
              linked={false}
              footer={null}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

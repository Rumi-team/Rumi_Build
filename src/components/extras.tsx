"use client";

import { useT } from "@/lib/i18n";
import { ServiceCard } from "@/components/service-card";

// Secondary offer: the things Rumi builds and runs for a business beyond the
// five AI-employee roles. The AI Employees section above leads; this follows it.
//
// Icons are not translatable, so they live here and zip by index with the
// translated copy (same order as the dictionary's extras.items). Keep the
// length in step with extras.items: the front desk and the lead follow-up that
// used to sit at the end of this list are the AI Receptionist's job and are
// priced as a role, so they were removed from both.
const ICONS = ["🌐", "📱", "📣", "🤖"];

export function Extras() {
  const { t } = useT();
  return (
    <section
      id="extras"
      aria-labelledby="extras-heading"
      className="scroll-mt-20 bg-surface py-20 px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-3">
          {t.extras.eyebrow}
        </p>
        <h2
          id="extras-heading"
          className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-3"
        >
          {t.extras.heading}
        </h2>
        <p className="text-muted mb-10 max-w-xl text-lg">{t.extras.sub}</p>

        {/* Two across, not three: four items in a three-column grid leaves one
            card stranded on its own row. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {t.extras.items.map((item, i) => (
            <ServiceCard
              key={item.name}
              service={{ icon: ICONS[i] ?? "•", name: item.name, tagline: item.tagline }}
              linked={false}
              footer={null}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

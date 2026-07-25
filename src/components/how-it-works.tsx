"use client";

import { useT } from "@/lib/i18n";

export function HowItWorks() {
  const { t } = useT();
  // White so the homepage keeps alternating: extras (surface) sits above this
  // section and team-teaser (surface) below it. Bordered white cards on a white
  // section is the same treatment the .card grids use elsewhere on the site.
  return (
    <section aria-labelledby="how-heading" className="bg-white py-20 px-6 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-3">
          {t.how.eyebrow}
        </p>
        <h2 id="how-heading" className="text-3xl font-bold tracking-h2 text-ink mb-10">
          {t.how.heading}
        </h2>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.how.steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-xl border border-line bg-white p-6"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white mb-4">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

"use client";

import { useT } from "@/lib/i18n";

// Mission + Vision (implementation guide §3). Sits low on the homepage as a
// quiet "why we're here" beat between the trust section and the closing CTA.
export function MissionVision() {
  const { t } = useT();
  return (
    <section
      aria-labelledby="mission-heading"
      className="bg-white py-20 px-6 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-3">{t.mission.eyebrow}</p>
        <h2 id="mission-heading" className="sr-only">
          {t.mission.missionLabel} &amp; {t.mission.visionLabel}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-line bg-white p-8">
            <h3 className="text-lg font-semibold text-ink mb-3">
              {t.mission.missionLabel}
            </h3>
            <p className="text-muted leading-relaxed">{t.mission.mission}</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-8">
            <h3 className="text-lg font-semibold text-ink mb-3">
              {t.mission.visionLabel}
            </h3>
            <p className="text-muted leading-relaxed">{t.mission.vision}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

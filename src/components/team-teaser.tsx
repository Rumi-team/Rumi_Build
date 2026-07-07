"use client";

import { TEAM } from "@/lib/data";
import { useT } from "@/lib/i18n";

function Avatar({ name, photo }: { name: string; photo: string }) {
  return (
    <img
      src={photo}
      alt={name}
      className="h-14 w-14 rounded-full object-cover border-2 border-line"
    />
  );
}

export function TeamTeaser() {
  const { t } = useT();
  return (
    <section aria-labelledby="team-heading" className="bg-white py-20 px-6 md:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow mb-3">{t.team.eyebrow}</p>
        <h2 id="team-heading" className="text-3xl font-bold tracking-h2 text-ink mb-3">
          {t.team.heading}
        </h2>
        <p className="text-muted mb-8">{t.team.sub}</p>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          {TEAM.map((member) => (
            <div key={member.name} className="flex flex-col items-center gap-2">
              <Avatar name={member.name} photo={member.photo} />
              <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                {member.role}
              </span>
              <p className="text-sm font-medium text-ink">{member.name}</p>
            </div>
          ))}
        </div>

        <a href="/team" className="btn-secondary-white px-6 py-2.5 text-sm">
          {t.team.cta} &rarr;
        </a>
      </div>
    </section>
  );
}

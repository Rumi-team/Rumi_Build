"use client";

import { useT } from "@/lib/i18n";
import { EvaluateForm } from "./evaluate-form";

export function EvaluateContent() {
  const { t } = useT();
  return (
    <div className="min-h-screen bg-white text-ink pt-16">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="eyebrow mb-3">
          {t.evaluate.eyebrow}
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-h1 text-ink mb-4">
          {t.evaluate.h1}
        </h1>
        <p className="text-lg text-muted mb-8">{t.evaluate.intro}</p>

        <div className="rounded-xl border border-line bg-surface p-6 md:p-8 mb-8">
          <ul className="space-y-3">
            {t.evaluate.whatYouGet.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-ink leading-relaxed"
              >
                <span className="text-accent mt-0.5 shrink-0" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <EvaluateForm />
      </div>
    </div>
  );
}

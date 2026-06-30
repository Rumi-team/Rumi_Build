"use client";

import { useT } from "@/lib/i18n";
import { EvaluateForm } from "./evaluate-form";

export function EvaluateContent() {
  const { t } = useT();
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200 pt-16">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          {t.evaluate.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {t.evaluate.h1}
        </h1>
        <p className="text-lg text-zinc-400 mb-8">{t.evaluate.intro}</p>

        <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-6 md:p-8 mb-8">
          <ul className="space-y-3">
            {t.evaluate.whatYouGet.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed"
              >
                <span className="text-amber-400 mt-0.5 shrink-0" aria-hidden>
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

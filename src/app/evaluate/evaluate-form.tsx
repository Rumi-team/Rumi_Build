"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";

export function EvaluateForm() {
  const { t } = useT();
  const f = t.evaluate.form;
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    website: "",
    languages: "",
    needs: [] as string[],
    message: "",
    consentChecked: false,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleNeed(need: string) {
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.consentChecked) {
      setError(f.errConsent);
      return;
    }
    setSubmitting(true);
    try {
      const resp = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await resp.json()) as { ok?: boolean; error?: string };
      if (!resp.ok || !data.ok) {
        setError(data.error || f.errGeneric);
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError(f.errNetwork);
      setSubmitting(false);
    }
  }

  const inputCls = "field text-sm";
  const labelCls = "block text-sm font-medium text-ink mb-1.5";

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-xl border border-accent/40 bg-accent/5 p-8 text-center"
      >
        <p className="text-2xl mb-2 text-accent" aria-hidden>
          ✓
        </p>
        <h2 className="text-xl font-semibold text-ink mb-2">
          {f.successTitle}
          {form.name ? ` (${form.name.split(" ")[0]})` : ""}
        </h2>
        <p className="text-muted">
          {f.successBody}{" "}
          <a href="/schedule" className="text-accent hover:text-accent-hover underline">
            /schedule
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelCls}>{f.name} <span className="text-danger">*</span></label>
          <input id="name" type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>{f.email} <span className="text-danger">*</span></label>
          <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>{f.phone}</label>
          <input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="business" className={labelCls}>{f.business}</label>
          <input id="business" type="text" value={form.business} onChange={(e) => update("business", e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="website" className={labelCls}>{f.website}</label>
        <input id="website" type="text" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder={f.websitePlaceholder} className={inputCls} />
      </div>

      <div>
        <label htmlFor="languages" className={labelCls}>{f.languages}</label>
        <input id="languages" type="text" value={form.languages} onChange={(e) => update("languages", e.target.value)} placeholder={f.languagesPlaceholder} className={inputCls} />
      </div>

      <fieldset>
        <legend className={labelCls}>{f.needsLegend}</legend>
        <div className="grid sm:grid-cols-2 gap-2 mt-1">
          {f.needs.map((need) => {
            const checked = form.needs.includes(need);
            return (
              <label
                key={need}
                className={`flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm cursor-pointer transition ${
                  checked
                    ? "border-accent bg-accent/5 text-ink"
                    : "border-line bg-white text-muted hover:border-accent/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleNeed(need)}
                  className="mt-0.5 h-4 w-4 rounded border-line accent-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-white"
                />
                <span>{need}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className={labelCls}>{f.message}</label>
        <textarea id="message" rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder={f.messagePlaceholder} className={inputCls} />
      </div>

      <label className="flex items-start gap-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={form.consentChecked}
          onChange={(e) => update("consentChecked", e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-line accent-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-white"
        />
        <span>
          {f.consent} <span className="text-muted">{f.consentRequired}</span>
        </span>
      </label>

      {error && (
        <div className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full px-8 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? f.sending : `${f.submit} →`}
      </button>

      <p className="text-xs text-muted">{f.footnote}</p>
    </form>
  );
}

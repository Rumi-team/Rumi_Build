"use client";

import { useState } from "react";

export function BookForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    project: "",
    consentChecked: false,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.consentChecked) {
      setError("Please confirm we can save your contact info to follow up.");
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await resp.json()) as { url?: string; error?: string };
      if (!resp.ok || !data.url) {
        setError(data.error || "Could not start checkout. Try again in a moment.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  const inputCls = "field text-sm";
  const labelCls = "block text-sm font-medium text-ink mb-1.5";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelCls}>Full name <span className="text-danger">*</span></label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email <span className="text-danger">*</span></label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="company" className={labelCls}>Company</label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="project" className={labelCls}>What do you want to discuss? <span className="text-danger">*</span></label>
        <textarea
          id="project"
          required
          rows={4}
          value={form.project}
          onChange={(e) => update("project", e.target.value)}
          placeholder="Roles you're considering, time-drains on the team, tools you use..."
          className={inputCls}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={form.consentChecked}
          onChange={(e) => update("consentChecked", e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-line accent-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-white"
        />
        <span>
          We&rsquo;ll save your contact info to follow up about this call. We don&rsquo;t
          share it. <span className="text-muted">(required)</span>
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
        {submitting ? "Starting checkout..." : "Book Call → $100"}
      </button>
    </form>
  );
}

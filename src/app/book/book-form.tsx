"use client";

import { useState } from "react";
import type { CallOption, CallOptionId } from "@/lib/stripe";

// `import type` only — erased at compile time, so the Stripe SDK that
// src/lib/stripe.ts imports never reaches the browser bundle. The values come
// in as props from the server component, minus the price ids.
export type CallChoice = Pick<
  CallOption,
  "id" | "minutes" | "price" | "label" | "blurb"
>;

export function BookForm({
  options,
  defaultId,
}: {
  options: CallChoice[];
  defaultId: CallOptionId;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    project: "",
    consentChecked: false,
    // Posted to /api/checkout, which decides the Stripe price from it. The key
    // has to match the `duration` field on that route's zod schema exactly:
    // z.object() strips unknown keys rather than rejecting them, so a rename on
    // either side charges every buyer the default price and reports nothing.
    duration: defaultId,
  });

  const selected =
    options.find((o) => o.id === form.duration) ?? options[0];

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
        // The route's own messages are written for the customer and are shown
        // as-is. The one exception is the schema refusal: "Invalid request" is
        // what a browser still holding a pre-1.1.0.0 bundle gets, because that
        // bundle posts no `duration` at all — reading it as a card problem
        // sends someone to their bank over a page reload.
        setError(
          resp.status === 400 && data.error === "Invalid request"
            ? "This page is out of date — reload it and try again."
            : data.error || "Could not start checkout. Try again in a moment.",
        );
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
      {/* Real radios in one `name` group, so the arrow keys move between the
          cards and a screen reader announces "radio, 30 minutes, 1 of 2"
          without any aria- plumbing. The card is the <label>, which makes the
          whole tile the hit target. */}
      <fieldset>
        <legend className={labelCls}>
          How long? <span className="text-danger">*</span>
        </legend>
        <div className="grid sm:grid-cols-2 gap-3">
          {options.map((option) => {
            const isSelected = option.id === selected.id;
            return (
              <label
                key={option.id}
                // `hover:ring-2 hover:ring-accent` is not redundant with the
                // unprefixed pair: `.card:hover` in globals.css sets box-shadow
                // at specificity (0,2,0) and the ring IS a box-shadow at
                // (0,1,0), so the selected card lost its ring under the pointer
                // — on exactly the card the user was looking at. The hover
                // variants match that specificity and sit in the utilities
                // layer, which comes after components. globals.css is locked,
                // so the fix belongs here.
                className={`card flex cursor-pointer items-start gap-3 p-4 ${
                  isSelected
                    ? "border-accent bg-accent/5 ring-2 ring-accent hover:ring-2 hover:ring-accent"
                    : "hover:border-accent/40"
                }`}
              >
                <input
                  type="radio"
                  name="duration"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => update("duration", option.id)}
                  className="mt-1 h-4 w-4 shrink-0 border-line accent-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-white"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">
                    {option.label} — {option.price}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {option.blurb}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

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
        {submitting ? "Starting checkout..." : `Book Call → ${selected.price}`}
      </button>
    </form>
  );
}

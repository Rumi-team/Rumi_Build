// The two pills that carry the pricing story of the whole offer. They appear on
// every role card (5 on the homepage, 5 on /services, 4 in the "other roles"
// grid) and again in each role page's hero, so they live here rather than being
// re-typed at each call site — two hand-rolled copies had already drifted to
// different paddings and font sizes on the same page.
//
// The hero sits beside a text-3xl price and the cards beside a text-xl one, so
// the two sizes are deliberate: pass size="md" in a hero, size="sm" (default)
// on a card. Colours are the locked accent tokens; no raw hex, no new classes.

const SAVING_SIZES = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
} as const;

/**
 * The "90% less than hiring" pill. Only ever render this next to a price AND a
 * WorkloadPill — on its own beside a price it reads as a discount off Rumi's
 * own list price ("was $5,000, now $500"), which is not the claim. The referent
 * is the workload.
 */
export function SavingBadge({
  label,
  size = "sm",
}: {
  label: string;
  size?: keyof typeof SAVING_SIZES;
}) {
  return (
    // `[html[lang=fa]_&]:tracking-normal` — Persian script is JOINED, so the
    // 0.2em eyebrow tracking prises the ligatures of `۹۰٪ کمتر از استخدام`
    // apart into loose glyphs. The Latin badge keeps the brand's eyebrow
    // treatment; the Farsi one drops the letter-spacing only. (`uppercase` is
    // a no-op on Persian and is left alone rather than branched on.) The
    // arbitrary variant is scoped to the <html lang> the LanguageProvider
    // stamps, so no prop has to be threaded through every call site.
    <span
      className={`rounded-md bg-accent-hover font-semibold uppercase tracking-eyebrow [html[lang=fa]_&]:tracking-normal text-white ${SAVING_SIZES[size]}`}
    >
      {label}
    </span>
  );
}

/**
 * "Covers ~$3,000/mo of front-desk work" — the volume of WORK a role takes on,
 * which is what the price and the saving are measured against. Never a person.
 */
export function WorkloadPill({
  label = "Covers",
  workload,
}: {
  /** Translatable prefix, e.g. "Covers". */
  label?: string;
  workload: string;
}) {
  return (
    <span className="inline-flex w-fit items-center rounded-md bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-hover">
      {label} {workload}
    </span>
  );
}

import {
  ONBOARDING_NOTE,
  PRICING_NOTE,
  WHITE_LABEL_NOTE,
} from "@/lib/data";

// The three prose notes that explain the offer — what you pay, what happens
// between signing and going live, and that a role can run under your own brand.
// /services and every /services/<slug> page render the same three in the same
// three-card grid, and they were two hand-copied copies of that markup: the hub
// listing them pricing-first under its own headings, the role pages
// onboarding-first under theirs, on a card background that flips with whether
// the role is a bundle. The markup was identical and the variance was not, which
// is why this takes the headings, their order, and the card fill as props rather
// than hardcoding a single arrangement.
//
// The BODIES are not props. Which sentence goes under which heading is the
// thing that must not drift between the two pages — tests/e2e/services.spec.ts
// asserts all three still reach the screen on both, and copy-invariants.test.ts
// pins what each one says.
const BODY = {
  onboarding: ONBOARDING_NOTE,
  pricing: PRICING_NOTE,
  whiteLabel: WHITE_LABEL_NOTE,
} as const;

export type PolicyNote = keyof typeof BODY;

type Card = {
  note: PolicyNote;
  /** The page's own heading for this note — the two pages word them differently. */
  heading: string;
};

export function PolicyNotes({
  notes,
  cardBg,
}: {
  /** Exactly three, in render order: a page that shows two has lost a promise. */
  notes: readonly [Card, Card, Card];
  /** Card fill token, e.g. "bg-white" — the section it sits in decides. */
  cardBg: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {notes.map(({ note, heading }) => (
        <div
          key={note}
          className={`rounded-xl border border-line ${cardBg} p-6`}
        >
          <h3 className="text-base font-semibold text-ink mb-2">{heading}</h3>
          <p className="text-sm text-muted leading-relaxed">{BODY[note]}</p>
        </div>
      ))}
    </div>
  );
}

# Frontend_Rumi_Build — Next.js 15 marketing site (lead offer: hire AI employees — five roles priced at ~10% of the workload they cover)

## It has a near-clone twin: `../Frontend_Rumi_AIEmployees`

Same design system — and since v1.0.0.0 this repo ALSO leads with AI Employees, so
the offer no longer tells the two repos apart. Identical `"name": "rumi-build"` in package.json,
byte-identical `tailwind.config.ts` and `pnpm-lock.yaml`, same route and component names
(`services/[slug]`, `nav.tsx`, `hero.tsx`, `llms.txt`). Different GitHub org, too:
`Rumi-team/…` here, `rumiai-ai/…` there. **Never port a change between them** — matching
filenames belong to separate sites.

## Nothing local says which domain this deploys to

Every canonical URL here hardcodes `https://rumi.build` (`layout.tsx` metadataBase,
`sitemap.ts` BASE, `robots.ts`, `lib/llms-content.ts`) — but the twin's README claims
`rumi.build` is *its* domain and that this repo serves `rumiai.ai`. There is no `.vercel/`
here to settle it; the twin's `.vercel/project.json` owns the Vercel project named
`rumi-build`. Confirm before changing a canonical URL, and never link this checkout to
that project.

## The offer, as shipped (v1.1.0.0)

The homepage leads with five hireable AI-employee roles — AI Receptionist (from
$300/mo), AI Executive Assistant (from $500/mo), AI Social Media Manager (from
$400/mo), AI Office Manager (from $800/mo) and AI Chief of Staff (from $900/mo).
Core roles are priced at exactly 10% of the monthly workload they cover (the
"90% off" badge); for the two bundles that rule is a ceiling, and a bundle's
workload must equal the sum of its parts. The agency work (website, app, content,
visibility) sells below as "Extra services". Canonical role data lives in
`src/lib/data.ts`; the long-form prose only the detail pages render lives in
`src/lib/ai-employee-details.ts` and `src/lib/vertical-details.ts` — never import
those back into `data.ts` (`footer.tsx` puts everything reachable from `data.ts`
into every page's client bundle).

The one paid call is sold on `/book` in two lengths — 30 minutes at $75 (the
default) or 60 at $125 — chosen with a radio group on the form. `CALL_OPTIONS`
in `src/lib/stripe.ts` is where both prices are **authored**, along with both
Stripe price-id env vars (`STRIPE_PRICE_ID_30MIN`, `STRIPE_PRICE_ID_60MIN`),
each option's `minutes`, and the Cal.com event it books. `/book` and its form
contain no dollar literal at all and read the catalog live; `/faq` and
`src/lib/llms-content.ts` do restate the figures for prose reasons, and are
pinned to the catalog by the "states both lengths and both prices" test in
`tests/unit/price-copy.test.ts` — so a reprice is `src/lib/stripe.ts` plus
whatever that test then turns red. Price ids are read from the environment and
must never be hardcoded. An option whose price id is unset is not offered on
`/book` at all. There is still no 60-minute Cal.com event type, so that
option's `calLink` is empty and `/book/success` falls back to emailing the
buyer times — see TODOS.md.

Languages are English + Farsi, translated client-side in `src/lib/i18n.tsx`
(homepage only; every other page is English, pinned LTR via
`src/components/english-main.tsx`). `/evaluate`, `/audit`, `/chief-of-staff` and
`/pricing` are permanent redirects — do not resurrect them; `/api/evaluate` is
gone entirely.

Releases carry a 4-digit version: `VERSION`, `package.json` and the newest
CHANGELOG.md heading must agree (currently 1.1.0.0). The other docs: DESIGN.md
(locked brand system — Saba owns it), TESTING.md (the test contract), TODOS.md
(deferred work), CHANGELOG.md (release history).

## Testing

```bash
pnpm test        # vitest run  — unit + component, ~2s
pnpm test:e2e    # playwright  — builds the site, serves :3311, drives chromium
pnpm test:all    # both
```

Tests live in `tests/unit/` (Vitest + Testing Library, jsdom) and `tests/e2e/`
(Playwright, chromium only). Read **TESTING.md** before adding to either — it explains the
six invariants the suite exists to pin down (EN/FA parity including array lengths,
slug referential integrity, the pricing arithmetic — 10% of workload, a ceiling for
bundles — the tone rule, the locked design tokens, and the routing/canonical rules)
and the conventions (walk the data, never restate it; guard the walkers;
`toBeDefined()` is banned).

Expectations for any change here:

- Write a test with each new function or data helper.
- Write a regression test with each bug fix — the failing case first.
- Cover both branches of every new conditional.
- Never commit code that breaks existing tests. If a test fails because the production code
  has a real bug, leave the test red and say so; do not edit `src/` to make it pass, and
  never edit `tailwind.config.ts` or `src/app/globals.css` (locked design system).

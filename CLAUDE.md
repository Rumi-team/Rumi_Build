# Frontend_Rumi_Build — Next.js 15 marketing site (agency offer: "we handle the digital work")

## It has a near-clone twin: `../Frontend_Rumi_AIEmployees`

Same design system, different offer. Identical `"name": "rumi-build"` in package.json,
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

## Testing

```bash
pnpm test        # vitest run  — unit + component, ~2s
pnpm test:e2e    # playwright  — builds the site, serves :3311, drives chromium
pnpm test:all    # both
```

Tests live in `tests/unit/` (Vitest + Testing Library, jsdom) and `tests/e2e/`
(Playwright, chromium only). Read **TESTING.md** before adding to either — it explains the
five invariants the suite exists to pin down (EN/FA parity including array lengths,
slug referential integrity, the 10%-of-workload pricing rule, the tone rule, the locked
design tokens) and the conventions (walk the data, never restate it; guard the walkers;
`toBeDefined()` is banned).

Expectations for any change here:

- Write a test with each new function or data helper.
- Write a regression test with each bug fix — the failing case first.
- Cover both branches of every new conditional.
- Never commit code that breaks existing tests. If a test fails because the production code
  has a real bug, leave the test red and say so; do not edit `src/` to make it pass, and
  never edit `tailwind.config.ts` or `src/app/globals.css` (locked design system).

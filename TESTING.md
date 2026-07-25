# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your
instincts, and ship with confidence — without them, vibe coding is just yolo coding. With
tests, it's a superpower.

This is a marketing site, so almost nothing here is an algorithm — it is **data and copy**.
That is exactly what the tests pin down: the offer (five roles, their prices, the slugs that
join them together), the two-language dictionaries, the tone rule, and the locked design
tokens. Every defect these tests cover is one that actually shipped here at least once.

## Stack

| Layer | Tool | Version |
| --- | --- | --- |
| Unit + component | [Vitest](https://vitest.dev) | 4.1.10 |
| React rendering | @testing-library/react | 16.3.2 |
| DOM matchers | @testing-library/jest-dom | 7.0.0 |
| DOM environment | jsdom | 29.1.1 |
| React transform | @vitejs/plugin-react | 6.0.4 |
| End-to-end | [@playwright/test](https://playwright.dev) (chromium only) | 1.62.0 |

Runs on Node 22 with pnpm. Next.js 15 App Router, React 19.

## Commands

```bash
pnpm test          # vitest run          — unit + component (~2s)
pnpm test:watch    # vitest              — watch mode while editing
pnpm test:e2e      # playwright test     — builds the site, serves it on :3311, drives chromium
pnpm test:all      # both, in that order
```

First-time setup for the E2E layer (once per machine / CI runner):

```bash
pnpm install
pnpm exec playwright install --with-deps chromium
```

`pnpm test:e2e` owns its own server: the Playwright `webServer` block runs
`pnpm build && pnpm start --port 3311` and waits for `http://localhost:3311`. It always
rebuilds — reuse of an already-listening server is opt-in via `PW_REUSE_SERVER=1`, because
this suite asserts what the production build actually serves and a forgotten `next start`
from an earlier session would otherwise report green against stale HTML. Free the port
(`lsof -ti:3311 | xargs kill`) if a run cannot start.

## Layout

```
tests/
  setup.ts                     jest-dom matchers + RTL cleanup after every test
  unit/
    helpers/dicts.tsx          reaches the EN/FA dictionaries the way the site does
    helpers/strings.ts         collects every string in a module, with its key path
    i18n-parity.test.ts        EN/FA shape, array lengths, no untranslated English
    ai-employees.test.ts       referential integrity, pricing arithmetic, /llms.txt drift
    ai-employees-section.test.tsx  the homepage roles section, rendered, in both languages
    copy-invariants.test.ts    the same claim in data.ts, both dictionaries and /llms.txt
    tone.test.ts               "price the work, never the person"
    design-tokens.test.ts      no stock Tailwind scale, no off-palette hex or rgb()
  e2e/
    home.spec.ts               section order, hero, five priced role cards
    services.spec.ts           nav, the five role pages, bundle contents, 404
    farsi.spec.ts              dir=rtl, translated hero, persisted language
```

Vitest collects `tests/**` and `src/**` (`*.test.ts(x)` and `*.spec.ts(x)`) and **excludes
`tests/e2e/**`**. The exclusion is load-bearing: if Vitest ever collects a Playwright spec it
dies on the `@playwright/test` import, the single most common way this setup breaks. It is an
exclusion rather than a narrow include so that a misnamed or misplaced unit test runs instead
of silently vanishing.

## The five invariants

1. **EN/FA parity.** `FA` is typed `Dict` (= `typeof EN`), so a *missing key* is a compile
   error — but an **array that is one item short is not**, and that has silently dropped a
   role card from the Farsi homepage. `i18n-parity.test.ts` walks both dictionaries
   recursively and compares key paths, array lengths at every level, and per-leaf content
   (no leftover English, no FA string identical to its EN counterpart, Persian numerals in
   the prices).
2. **Referential integrity.** `includes` (bundle → roles) and `relatedVerticals`
   (service → industry) are plain strings, so a rename leaves a reference pointing at
   nothing and the page quietly renders one card fewer. Every slug must resolve, and
   `getAIEmployeeBySlug` must return `undefined` for junk (that is what makes
   `/services/not-a-real-role` a 404 rather than a blank page).
3. **Pricing arithmetic.** Every role costs exactly 10% of the workload it covers
   (300/3000, 500/5000, 400/4000, 800/8000, 900/9000) — that is the "90% off" claim. The
   numbers are **parsed out of the strings**, never restated in the test, so the suite
   cannot agree with a typo. The same figures are cross-checked against the dictionary
   display strings (both languages) and against `/llms.txt`, which AI engines cite verbatim.
4. **Tone rule.** No user-facing copy in `data.ts`, `i18n.tsx` or `llms-content.ts` may match
   `/replac/i` or `/cut your payroll/i`, or name a human job as the thing being removed. The
   test walks the **data values**, not the file text — the source comments state the rule and
   contain the banned words on purpose.
5. **Design tokens.** No numbered stock Tailwind scale (`text-red-500`, `bg-blue-50`,
   `amber-`, `zinc-` …), no raw hex and no `rgb()`/`hsl()`/`oklch()` colour outside the
   locked palette — the config exposes **named** tokens only (`navy`, `accent`, `ink`,
   `muted`, `surface`, `line`, `danger`, `field`). The palette is walked out of
   `tailwind.config.ts`'s declared colours at test time rather than copied or regexed out of
   the file text, so it tracks the locked system and a hex mentioned in a config *comment*
   cannot widen the allowlist. (`#059669` in the Cal.com embed is the accent token being
   handed to a third-party widget that only accepts a literal; `rgba(0,0,0,α)` is allowed as
   a shadow tint, which is the only way `globals.css` uses black.)

Sitting on top of those: **copy consistency** (`copy-invariants.test.ts`). The go-live
timeline, the white-label promise and the 10%/90% explanation are each written out
independently in `data.ts` (what `/services` and the role pages render), the EN/FA
dictionaries (the homepage) and `llms-content.ts` (what AI engines cite). Nothing in the type
system ties them together, so the test parses the claim out of every source and asserts they
agree — `src/lib/i18n.tsx` even carries the comment *"Facts here must match ONBOARDING_NOTE
in src/lib/data.ts"*, and this is what stands behind it. The same test forbids an empty string
export in `data.ts`, which would render an empty `<p>` instead of failing the build.

## Conventions

- **Assert behaviour.** `expect(x).toBeDefined()` is banned. Every test must be able to fail
  for a real reason — the suite is validated by breaking the source on purpose and checking
  it goes red.
- **Walk the data, don't restate it.** Tests iterate `AI_EMPLOYEES` and recurse the
  dictionaries so they keep working as copy changes. A test that hardcodes a duplicate table
  of prices just agrees with itself.
- **Guard the walkers.** Any test that filters a collected list also asserts the list is
  non-empty, so a broken walker cannot pass vacuously.
- **No production code exists for the tests.** The EN/FA dictionaries are module-private;
  `tests/unit/helpers/dicts.tsx` reaches them through `LanguageProvider` the way the site
  does rather than adding a test-only export.
- **E2E runs against `pnpm build`, not `next dev`** — the assertions are about what Vercel
  actually serves (prerendered role pages, real 404 routing).
- **Never import secrets or API keys in a test.**
- If a test fails because the production code has a real bug, **leave it failing** and report
  the bug. Do not edit `src/` to make a test pass. `tailwind.config.ts` and
  `src/app/globals.css` are locked and must not be edited at all.

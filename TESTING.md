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
    dictionary-fallback.test.tsx  a missing FA key falls back to EN, never to a blank
    ai-employees.test.ts       referential integrity, pricing arithmetic, /llms.txt drift,
                               and the slug join to the two detail modules
    ai-employees-section.test.tsx  the homepage roles section, rendered, in both languages
    extras-section.test.tsx    the homepage "extra services" grid, and what is NOT in it
    how-it-works-numerals.test.tsx  the four step numerals follow the language (Persian digits in FA)
    nav-footer.test.tsx        the chrome: nav links, footer columns, both languages
    service-card.test.tsx      the card's optional price/saving/workload branches and its href
    price-copy.test.ts         every rendered price is a "from …", never a bare number
    role-routes.test.ts        the five role slugs, their params, and what 404s
    routing.test.ts            vercel.json redirects, canonical + og:url, sitemap coverage
    crawler-surfaces.test.ts   robots.txt, the llms.txt links, and the 404's recovery links
    checkout-verification.test.tsx  /book/success refuses an unverified Stripe session
    rate-limit.test.ts         the shared IP derivation and the per-IP window behind it
    english-pin.test.ts        every English page pins dir/lang/font against stored Farsi
    english-main.test.tsx      …and the wrapper they all delegate that pin to, rendered
    copy-invariants.test.ts    the same claim in data.ts, both dictionaries and /llms.txt
    tone.test.ts               "price the work, never the person"
    design-tokens.test.ts      no stock Tailwind scale, no off-palette hex or rgb()
  e2e/
    home.spec.ts               section order, hero, five priced role cards
    services.spec.ts           nav, the five role pages, bundle contents, 404
    booking.spec.ts            the path into /book from every page that sells
    farsi.spec.ts              dir=rtl, translated hero, persisted language
```

Vitest collects `tests/**` and `src/**` (`*.test.ts(x)` and `*.spec.ts(x)`) and **excludes
`tests/e2e/**`**. The exclusion is load-bearing: if Vitest ever collects a Playwright spec it
dies on the `@playwright/test` import, the single most common way this setup breaks. It is an
exclusion rather than a narrow include so that a misnamed or misplaced unit test runs instead
of silently vanishing.

**Test environment.** The default is `node`, not `jsdom` — most of this suite reads `data.ts`,
walks `src/` off the filesystem, or parses `vercel.json`, and paying for a DOM per file was the
largest single line in the timing breakdown. The files that need one declare it themselves with
a `// @vitest-environment jsdom` docblock on line 1: the four component tests, plus the four
that reach the dictionaries through `helpers/dicts.tsx` (which mounts `LanguageProvider`).
`tests/setup.ts` no-ops when there is no `document`. A docblock rather than a config glob
because `environmentMatchGlobs` was removed in Vitest 4, and because a `*.tsx` glob would miss
the four `.ts` files that render.

## The six invariants

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
3. **Pricing arithmetic.** Every core role costs exactly 10% of the workload it covers
   (300/3000, 500/5000, 400/4000) — that is the "90% off" claim. For the two bundles the
   rule is a **ceiling, not an equality**: a bundle's workload must be the sum of the
   workloads of the roles inside it, and its price may never exceed a tenth of that sum —
   the AI Office Manager sits exactly on the rule (800/8000), the AI Chief of Staff beats
   it (900/12000 = 7.5%), and the "90% off" badge is therefore a floor no role may deliver
   less than. The numbers are **parsed out of the strings**, never restated in the test, so
   the suite cannot agree with a typo. The same figures are cross-checked against the
   dictionary display strings (both languages) and against `/llms.txt`, which AI engines
   cite verbatim.
4. **Tone rule.** No user-facing copy in `data.ts`, **`ai-employee-details.ts`,
   `vertical-details.ts`**, `i18n.tsx` or `llms-content.ts` may match `/replac/i` or
   `/cut your payroll/i`, or name a human job as the thing being removed. The test walks the
   **data values**, not the file text — the source comments state the rule and contain the
   banned words on purpose. The two detail modules are where the longest copy on the site
   lives (the five role pitches and the five industry write-ups); they used to be fields on
   `AI_EMPLOYEES` / `VERTICALS` and were therefore covered for free, so `tone.test.ts` now
   asserts that **both namespaces actually arrived** before it checks them — a split that
   quietly took the biggest body of copy out of the rule would otherwise stay green.
5. **Design tokens.** No numbered stock Tailwind scale (`text-red-500`, `bg-blue-50`,
   `amber-`, `zinc-` …), no raw hex and no `rgb()`/`hsl()`/`oklch()` colour outside the
   locked palette — the config exposes **named** tokens only (`navy`, `accent`, `ink`,
   `muted`, `surface`, `line`, `danger`, `field`). The palette is walked out of
   `tailwind.config.ts`'s declared colours at test time rather than copied or regexed out of
   the file text, so it tracks the locked system and a hex mentioned in a config *comment*
   cannot widen the allowlist. (`#059669` in the Cal.com embed is the accent token being
   handed to a third-party widget that only accepts a literal; `rgba(0,0,0,α)` is allowed as
   a shadow tint, which is the only way `globals.css` uses black.)
6. **Routing and canonicals.** `/services` and `/services/<slug>` used to be `redirect()`
   stubs that swallowed everything under them; they are real pages now, and
   `dynamicParams = false` means anything outside the five role slugs 404s at the routing
   layer. That put three failure modes one edit away, and none of them breaks a build:
   a `vercel.json` redirect pointing at a page that no longer renders (or at another
   redirect — a 308 chain or a loop); a redirect *source* that shadows a real page, so the
   edge answers first and the page is unreachable in production while `next start` serves
   it happily; and a sitemap advertising a URL that redirects, 404s, or was never meant to
   be indexed. On top of that, `alternates` **and `openGraph`** are inherited from the root
   layout wholesale exactly like `title`, which is three separate defects:
   a page without its own canonical declares itself the homepage and gets consolidated away;
   a page that fixes only the canonical still emits the homepage's `og:url` and `og:title`
   beside it, so every share attributes to `/` (verified in the built HTML — `faq.html` had
   `canonical: /faq` next to `og:url: https://rumi.build`); and a page that restates
   `openGraph` without re-stating `images`/`siteName` silently loses its social preview card,
   because Next replaces the object rather than merging into it. `routing.test.ts` requires
   every indexable route to declare a canonical **and an `og:url` equal to it**, keeps both
   relative (a sibling repo ships the same slugs under the same hardcoded host), and checks
   the image and site name survive. A fourth rule covers the pages that ask *not* to be
   indexed: a noindex page may not canonicalise to a **different** URL (Google can carry the
   noindex across to that target — `/schedule` shipped `noindex` + `canonical: /book`, one
   heuristic away from deindexing the only page that takes money), and may not *delete*
   `alternates` either, because that just inherits `/` — the supported suppression is
   `alternates: { canonical: null }`, which `not-found.tsx` also uses so that the 404 served
   for every unmatched URL on the site stops claiming to be the homepage.
   `routing.test.ts` walks the route table out of the filesystem, the redirects out of
   `vercel.json` and the anchors out of each destination page's own import graph, so a new
   page or a renamed role keeps it honest; `role-routes.test.ts` covers the five slugs, their
   params and their generated `openGraph`. Every live route must be either in the sitemap or
   on an explicit exclusion list that also records the crawl stance the page has to declare —
   omission from a sitemap deindexes nothing.

Sitting on top of those: **copy consistency** (`copy-invariants.test.ts`). The go-live
timeline, the white-label promise and the 10%/90% explanation are each written out
independently in `data.ts` (what `/services` and the role pages render), the EN/FA
dictionaries (the homepage) and `llms-content.ts` (what AI engines cite). Nothing in the type
system ties them together, so the test parses the claim out of every source and asserts they
agree — `src/lib/i18n.tsx` even carries the comment *"Facts here must match ONBOARDING_NOTE
in src/lib/data.ts"*, and this is what stands behind it. The same test forbids an empty string
export in `data.ts` **and in the two detail modules**, which would render an empty `<p>`
instead of failing the build.

**The two detail modules, and why the walkers count each one separately.**
`src/components/footer.tsx` is a client component that imports `AI_EMPLOYEES` and `VERTICALS`
to build its link columns, so everything reachable from those two arrays is compiled into the
browser bundle **on every route**. The long-form prose only the detail pages render — role
`description`/`features`/`useCases`, and vertical
`description`/`painPoints`/`solutions`/`roiData` — was costing ~4 KB gzip on every page and
was rendered by six of them. It now lives in `src/lib/ai-employee-details.ts` and
`src/lib/vertical-details.ts`, imported by `services/[slug]/page.tsx` and the industries pages
only; `data.ts` must never import them back, or the split silently undoes itself. Two things
guard the seam: the modules throw at import time if a slug has no record (the join is by
string through a `Record`, which the type system does not check), and
`ai-employees.test.ts` asserts the heavy fields are **not** back on the two arrays — a field
put back "for convenience" re-inflates every page while every page still renders perfectly.
The `collectStrings` floors in `copy-invariants.test.ts` are per-module for the same reason:
one combined bound would keep passing if a single module stopped being walked. Measured today:
`data.ts` 119, `ai-employee-details.ts` 60, `vertical-details.ts` 51.

And beside it: the **English direction pin** (`english-pin.test.ts`). Translation here is
client-side, so `LanguageProvider` stamps `dir="rtl" lang="fa"` on `<html>` for a visitor who
stored Farsi — and every server page except the homepage renders English prose, which would
then right-align in Vazirmatn. The pin lives in one place, `src/components/english-main.tsx`,
and this test requires every English page to use it (and the homepage not to). It also asserts
`EnglishMain` still emits all three parts, because `font-sans` is not redundant with
`lang="en"`: the font swap matches `html[lang="fa"] body`, which a `lang` on a descendant
cannot undo.

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

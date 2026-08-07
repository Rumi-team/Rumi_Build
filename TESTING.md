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
    helpers/source-files.ts    the recursive src/ walk design-tokens and brand-assets share
    helpers/viewport.ts        the window.matchMedia jsdom does not ship, plus the resize
                               that drives it — installed for every jsdom file by setup.ts
    i18n-parity.test.ts        EN/FA shape, array lengths, no untranslated English
    dictionary-fallback.test.tsx  a missing FA key falls back to EN, never to a blank
    ai-employees.test.ts       referential integrity, pricing arithmetic, /llms.txt drift,
                               and the slug join to the two detail modules
    ai-employees-section.test.tsx  the homepage roles section, rendered, in both languages
    extras-section.test.tsx    the homepage "extra services" grid, and what is NOT in it
    how-it-works-numerals.test.tsx  the four step numerals follow the language (Persian digits in FA)
    nav-footer.test.tsx        the chrome: nav links, footer columns, both languages
    nav-chrome.test.tsx        …and the STATE it puts them in: which link may say
                               aria-current, and the overlay closing itself at `md`
    service-card.test.tsx      the card's optional price/saving/workload branches and its href
    price-copy.test.ts         every rendered price is a "from …", never a bare number —
                               plus the two one-off call prices, derived from CALL_OPTIONS
    role-routes.test.ts        the five role slugs, their params, and what 404s
    routing.test.ts            vercel.json redirects, canonical + og:url, sitemap coverage
    crawler-surfaces.test.ts   robots.txt, the llms.txt links, and the 404's recovery links
    checkout-verification.test.tsx  /book/success refuses an unverified Stripe session, and
                               tells the two call lengths apart without blaming the buyer
                               for a price id we never set
    checkout-route.test.ts     /api/checkout turns the chosen length into a Stripe price,
                               and what a buyer reads when it cannot
    site-url.test.ts           getSiteUrl() refuses to guess where Stripe returns a buyer:
                               no default host, no blank value, no scheme-less URL
    stripe-webhook.test.ts     the call metadata round-trip, and that a CRM that rejects it
                               still leaves the customer marked paid
    book-form.test.tsx         the duration chooser, and that the choice reaches the POST body
    rate-limit.test.ts         the shared IP derivation and the per-IP window behind it
    english-pin.test.ts        every English page pins dir/lang/font against stored Farsi
    english-main.test.tsx      …and the wrapper they all delegate that pin to, rendered
    copy-invariants.test.ts    the same claim in data.ts, both dictionaries and /llms.txt
    self-reference.test.ts     one canonical host across all of src/ — four aliases serve
                               this deployment, so naming the wrong one never fails loudly
    tone.test.ts               "price the work, never the person"
    design-tokens.test.ts      no stock Tailwind scale, no off-palette hex or rgb() —
                               and the contrast of the pairings those tokens ship in
    brand-assets.test.ts       every image path resolves in public/, each logo is the one
                               drawn for the bar it sits on — and its corner pixel proves it
  e2e/
    home.spec.ts               section order, hero, five priced role cards
    services.spec.ts           nav, the five role pages, bundle contents, 404
    booking.spec.ts            the path into /book from every page that sells, the call-length
                               chooser (keyboard included), and the price on the submit button
    farsi.spec.ts              dir=rtl, translated hero, persisted language
    mobile.spec.ts             the phone chrome: no sideways scroll, the overlay's geometry,
                               one CTA at a time, an undistorted logo at 320px, the overlay
                               releasing the page when the viewport crosses `md`, Tab trapped
                               inside the nav, and the Farsi row fitting at exactly 768px
```

Vitest collects `tests/**` and `src/**` (`*.test.ts(x)` and `*.spec.ts(x)`) and **excludes
`tests/e2e/**`**. The exclusion is load-bearing: if Vitest ever collects a Playwright spec it
dies on the `@playwright/test` import, the single most common way this setup breaks. It is an
exclusion rather than a narrow include so that a misnamed or misplaced unit test runs instead
of silently vanishing.

**Test environment.** The default is `node`, not `jsdom` — most of this suite reads `data.ts`,
walks `src/` off the filesystem, or parses `vercel.json`, and paying for a DOM per file was the
largest single line in the timing breakdown. The files that need one declare it themselves with
a `// @vitest-environment jsdom` docblock on line 1: the eleven component tests, plus the four
`.ts` files that reach the dictionaries through `helpers/dicts.tsx` (which mounts `LanguageProvider`).
`tests/setup.ts` no-ops when there is no `document`. It also installs the one browser API
jsdom 29 does not ship at all: **`window.matchMedia` is absent**, not stubbed, so the moment
`mobile-menu.tsx` asks how wide the window is, every jsdom file that mounts `Nav` dies on
"is not a function". The shim in `helpers/viewport.ts` answers off `window.innerWidth`,
`setViewportWidth()` is how a test resizes, and it **throws on a query it does not
understand** rather than answering `false` — a shim that quietly said "no" to
`(min-width: 768px)` would make the auto-close case pass while testing nothing.
A docblock rather than a config glob
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
   (300/3000, 500/5000, 400/4000) — that is the claim `SAVING_LABEL` makes ("90% less than
   hiring"; the label names its comparator on purpose, because a bare "90% off" would read
   as a discount off a former Rumi price). For the two bundles the
   rule is a **ceiling, not an equality**: a bundle's workload must be the sum of the
   workloads of the roles inside it, and its price may never exceed a tenth of that sum —
   the AI Office Manager sits exactly on the rule (800/8000), the AI Chief of Staff beats
   it (900/12000 = 7.5%), and the `SAVING_LABEL` badge is therefore a floor no role may
   deliver less than. The numbers are **parsed out of the strings**, never restated in the
   test, so the suite cannot agree with a typo. The same figures are cross-checked against
   the dictionary display strings (both languages) and against `/llms.txt`, which AI engines
   cite verbatim. The badge itself is walked in **both languages**: the percentage is parsed
   out of `EN.roles.savingLabel` and `FA.roles.savingLabel` beside the prose sources, with
   Persian digits (U+06F0–U+06F9) and the Persian percent sign (U+066A) normalised first —
   the Farsi badge `۹۰٪ کمتر از استخدام` was otherwise pinned by nothing at all, and a
   mutation to ۵۰٪ passed the whole suite.
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
   a shadow tint, which is the only way `globals.css` uses black.) On top of *which* colours
   may be used: whether the pairs they are used in are **readable**. A sanctioned relock
   moves that answer without touching a component — brand v2 took `navy` to `#0B1C36` and
   `surface` to `#F9FAFB` — and the hero eyebrow is the case with history. The spec's accent
   green measured 3.88:1 on the old navy, under the 4.5:1 AA floor 11px text is held to, and
   shipped overridden to `text-white/70` in `hero.tsx`; the darker navy takes the same pair
   to **4.52:1**, and the override was briefly removed on that reading. **That reading was of
   the wrong backdrop.** `.hero-glow` is an accent-tinted radial (`rgba(5,150,105,.14)`)
   painted directly under the eyebrow — entirely under it on a phone — and compositing the
   glow onto the navy lifts the backdrop toward the text colour, taking the same pairing to
   **3.82:1** at the glow's peak. A hundredth of alpha already reads 4.47:1, so every point
   inside the glow is under the floor and there is no "outside" for this element to sit in.
   The override is therefore restored and the test now pins all three facts: the bare-token
   ratio is still computed (as documentation of *why* the revert looked right), the
   composited ratio is asserted to be the one under the floor, and a companion case asserts
   `hero.tsx` still renders both `.hero-glow` and the `text-white/70` override — which
   composites to 8.81:1 — because a ratio measured on a backdrop the page does not paint
   certifies nothing. The eyebrow's colour is read out of the locked `.eyebrow` rule, the
   glow's colour and alpha out of the locked `.hero-glow` rule, the override's alpha out of
   the class the component actually renders, and the tokens out of the config, so a
   repalette, a retuned glow or a changed override all recompute instead of agreeing with
   themselves. Beside the palette, the **binaries**:
   `brand-assets.test.ts` resolves every image path written in `src/` against `public/` —
   nothing else does, since `nav-footer.test.ts` drops the logo anchor (an `<img>` carries no
   text) and Playwright never waits on an image, so a mistyped logo is a broken image in the
   fixed bar on every page with the whole suite green — and pins each logo to the fill it is
   drawn for, because the two files differ by one word and a swap renders navy on navy. Since
   the pre-landing pass those binaries are also **resampled**, downscaled to three times their
   render size, which is how a logo goes wrong with no source edit at all: the test decodes
   each PNG's top-left pixel (IHDR guards, concatenated IDAT, `inflateSync` — the first pixel
   of the first scanline reconstructs from all-zero priors under every filter type, so no
   decoder dependency is needed) and requires the on-navy surround to equal the `navy` token
   and the on-white one to be pure white, so a resize that rings on the flat background fails
   here rather than shipping an off-brand fringe. Two more binaries nothing else can see: the
   OG card's real IHDR dimensions must equal the `width`/`height` the layout's own metadata
   object declares (both read, neither restated — a card whose declared aspect ratio lies is
   letterboxed by every platform that trusts it), and the file-convention icons
   `src/app/icon.png` / `apple-icon.png`, which are picked up by *filename* and referenced
   from nowhere in `src/`, must exist and be square. The path regex tolerates a `?query`
   suffix and strips it before resolving, because the OG URL now carries a `?v=2` scraper
   cache bust; a case guards that the query is read as a query rather than swallowed into
   the filename.
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

Beside those six, and newer than them: **the paid call**. Invariant 3 covers the *monthly* role
prices; the strategy call is a one-off, carries no `/mo`, and therefore fell outside every scan
in this suite — for a long time the only guard on it anywhere was one e2e assertion on the
submit button, while the same figure was typed out in the page title, the `<h1>` and that
button independently. Since v1.1.0.0 it is sold in two lengths and the contract is:

- **One catalog.** `CALL_OPTIONS` in `src/lib/stripe.ts` is the only place either price is
  *authored*. `price-copy.test.ts` requires `/book` and its form to contain no dollar
  literal at all, checks every one-off figure on the booking, FAQ, workplace and crawler
  surfaces against the catalog, and pins `price` to `amountUsd`, the labels to `minutes`, and
  the longer call to cost more than the shorter one. `/faq` and `llms-content.ts` do restate
  both figures — they are prose an AI engine lifts verbatim — and the "states both lengths and
  both prices" case is what holds them to the catalog. No test may *assert* on a literal 75 or
  125; a module stub may carry the catalog's own values, and the two that do build themselves
  from the real `CALL_OPTIONS` rather than retyping it.
- **Price ids come from the environment, never the source.** `STRIPE_PRICE_ID_30MIN` and
  `STRIPE_PRICE_ID_60MIN`, each defaulting to `""`. The default is load-bearing twice over:
  CI builds and runs the e2e suite with neither set, so a module-level throw would turn a
  green pipeline red; and the empty string is what both consumers read as "not configured".
  The test asserts the source contains no `price_…` literal and no `sk_…` key — and, because
  a substring scan cannot see a *swapped* pair, one case sets both variables to sentinels,
  reloads the real module and walks `priceId === process.env[envVar]`. That walk is the only
  thing in the suite that can catch the 30-minute option charging the 60-minute price: every
  other test replaces `@/lib/stripe` with a fixture, and CI sets neither variable.
- **`30min` is the default**, and it must resolve — `/book` pre-selects it and `/api/checkout`
  refuses anything the catalog does not hold. Refuses, never defaults: a missing `duration` is
  a 400, because guessing a length charges someone for a call they did not pick.
- **The seam between the form and the schema.** `Body` in `/api/checkout` is a plain
  `z.object()`, which **strips** unknown keys rather than rejecting them. So a `duration` the
  schema does not declare, or a form that stops sending one, charges every buyer the default
  price with no error anywhere. Both halves are pinned: `checkout-route.test.ts` requires a
  body with no duration to be refused, and `book-form.test.tsx` requires the browser to put
  the selected id in the POST body.
- **Configuration is per-option, on all three surfaces.** `/book` offers only the options whose
  price id is set (all of them when none is, since there is then nothing to steer a buyer
  toward and CI builds the page that way). `/api/checkout` 503s on the price id for the option
  the buyer picked, not on a global switch. `/book/success` accepts either configured id,
  records which one matched, and fails closed when neither is set — and when only *one* is set
  and the session matches neither, it answers `unconfigured` rather than `wrong_product`,
  because the alternative tells a paying customer they bought the wrong thing when the fault is
  a variable we never set. The log names the missing variable.
- **Nothing a buyer reads is written for a developer.** Every `error` string `/api/checkout`
  returns is rendered verbatim into the danger box under the submit button, so the tests assert
  the 503 and the 400 contain no "Stripe"/"not configured"/"unknown option" jargon, name a
  length that *can* be booked, and put the operator's reason in `console.error` instead.
- **The buyer returns to the origin we serve, never one we bake in.** `success_url` and
  `cancel_url` come from `getSiteUrl()`, which has no default: `NEXT_PUBLIC_SITE_URL` unset,
  blank or scheme-less throws, and `/api/checkout` answers the same buyer-facing 503 —
  before any lead is captured or session created — while the log names the variable. The
  fallback this replaces (`|| "https://rumi.build"`) actually shipped: with the variable
  set to the empty string on the live project, every paid buyer was returned to the sibling
  repo's site, which could only answer "this session isn't marked paid yet".
  `site-url.test.ts` pins the refusals; `checkout-route.test.ts` compares the returned
  origin to the configured one and asserts the refusal creates nothing.
- **The amount is checked, not just the price id.** A price id says which product, not what it
  cost, and `STRIPE_PRICE_ID_30MIN` was reused across a reprice — so the old Price object is
  still a valid id that still charges the old figure. `/book/success` compares
  `line_items[].price.unit_amount` against `amountUsd` and fails closed as `mismatch`; the
  webhook compares `amount_subtotal` (pre-discount, so promotion codes don't trip it) and only
  logs, because by then the money has moved.
- **A purchase is never handed a calendar of the wrong length.** The Cal.com event travels on
  the option itself rather than being chosen by an `optionId === "60min"` comparison, which any
  third length would have fallen through into the 30-minute event while the sentence above the
  embed read its length off the catalog. It is `""` until that event type exists; the success
  page must render its email-you-times fallback, claim nothing beyond the payment, and both
  lengths' wording is pinned symmetrically.
- **The CRM cannot cost a customer their paid flag.** `call_duration`/`call_minutes` are new
  keys on a schema in another repo. A 4xx on the by-session upsert buys exactly one retry
  without them; only a second failure throws. `stripe-webhook.test.ts` drives both, plus the
  absent-metadata replay and a forged signature.

Sitting on top of those: **copy consistency** (`copy-invariants.test.ts`). The go-live
timeline, the white-label promise and the 10%/90% explanation are each written out
independently in `data.ts` (what `/services` and the role pages render), the EN/FA
dictionaries (the homepage) and `llms-content.ts` (what AI engines cite). Nothing in the type
system ties them together, so the test parses the claim out of every source and asserts they
agree — `src/lib/i18n.tsx` even carries the comment *"Facts here must match ONBOARDING_NOTE
in src/lib/data.ts"*, and this is what stands behind it. The same test forbids an empty string
export in `data.ts` **and in the two detail modules**, which would render an empty `<p>`
instead of failing the build. It carries exactly one exemption, and it is a category
difference rather than an allowlist: `CAL_LINK_60MIN` and `CALENDLY_URL_60MIN` are config, not
copy — nothing renders them as text, and `""` is a value the code still supports (it is what
drives `/book/success`'s email-you-times fallback for a length with no event type). Both are
**hardcoded slugs since 2026-08-05** and no longer read `NEXT_PUBLIC_CAL_LINK_60MIN`, so
neither is empty today; the exemption now guards a supported future state rather than the
current one. The same test fails if either one stops existing, so the exemption cannot outlive
what it exempts. The slugs themselves are pinned by `cal-link.test.ts` — shape, the
derivation of each `CALENDLY_URL` from its slug, that the two lengths never share an event
type, and that neither contains a handle Cal.com has already 404'd. What no offline test can
catch is a *future* rename: the slug is a string until someone requests it. The same file also pins **who the company is**:
the registered entity is written out independently in the Terms, twice in the Privacy Policy
(the prose and the metadata description), and in each dictionary's footer copyright line
that renders on every page — four hand-edits with nothing checking all four happened, and a
Terms page naming a different company than the footer beneath it is the contradiction a
customer's lawyer reads first. The name is parsed off each surface and the surfaces are
compared, so nothing here restates it; sentence-final punctuation is normalised away, because
"LLC." and "LLC" are typography rather than two companies.

Beside it, and for the same reason one directory over: **which host the site calls itself**
(`self-reference.test.ts`). This deployment answers on four hosts — `rumiai.ai`,
`www.rumiai.ai`, `rumi.build` and `www.rumi.build` are all aliases of one Vercel project — so
naming the wrong one is invisible in a way a wrong company name is not. The page loads, the
link resolves, the mail arrives, and the only symptom is the site telling Google its canonical
copy lives somewhere the sitemap never advertises. `crawler-surfaces.test.ts` already requires
the four *known* host literals to agree; this file walks all of `src/` so a host written into
somewhere nobody thought of is caught too — a meta description is exactly how it got out last
time. Each mention is classified by how it is written (behind a scheme it is a link, behind an
`@` an address, bare it is prose or an identifier) and the canonical host is read off
`metadataBase`, so moving the site stays one edit. Two things keep it from rotting: the
sibling *products* `rumi.team` and `rumiagent.com` are listed rather than pattern-matched
away, so a newly registered `rumi`-anything domain fails until somebody says which kind it
is; and its one frozen exemption — the `source: "rumi.build"` analytics key, pinned to its
file — fails if that string stops being written, so the exemption cannot outlive what it
exempts. The support mailbox is the one declared divergence, and it is derived from
`SUPPORT_EMAIL` rather than allowlisted, so changing that constant alone goes red listing
every literal still on the old domain.

Its own first case is the parser, and that is not ceremony: the walker originally stripped
line comments with `/\/\/.*$/gm`, which matches the `//` inside `https://` and deleted the
rest of the line. Every url-kind mention in `src/` vanished, including the `metadataBase` the
file compares against, and the link assertions passed over an empty set. Only the parser case
went red. This is the "guard the walkers" rule earning its place — a scan that quietly finds
nothing agrees with everything.

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

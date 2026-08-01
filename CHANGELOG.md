# Changelog

All notable changes to rumi.build are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0.0] - 2026-08-01

The strategy call is now sold in two lengths. A buyer picks 30 minutes at $75 or 60 minutes at $125 on `/book`, and the choice travels all the way through — the price Stripe charges, the metadata on the session, the length quoted back on the confirmation page, and the calendar they are handed.

### Added

- **A 60-minute strategy call at $125**, alongside the 30-minute call, which drops from $100 to **$75**. The 30-minute option stays pre-selected. Both keep the same promise: refunded in full if we can't help, credited toward the project if we can.
- **A duration chooser on `/book`** — two selectable cards built as a real radio group, so the arrow keys move between them and a screen reader announces them as a choice. The submit button quotes the price of whatever is selected.
- **`STRIPE_PRICE_ID_60MIN`**, a new environment variable holding the 60-minute Stripe Price id. Like its 30-minute sibling it is read from the environment only and defaults to empty, and an option with no price id is refused with a 503 rather than sent to Stripe.
- **`NEXT_PUBLIC_CAL_LINK_60MIN`**, for the 60-minute Cal.com event type. Until it is set, a 60-minute buyer is shown their payment confirmation and told we will email them times — never the 30-minute calendar.
- **Which call was bought is now recorded.** The Checkout Session carries `call_duration` and `call_minutes` in its metadata and the webhook passes them to the CRM, so a $75 booking and a $125 one can finally be told apart. Not inferred from the amount: promotion codes are enabled, so a discounted 60-minute call can total less than a 30-minute one.
- **An FAQ answer** on what the call costs and why there are two lengths.

### Changed

- **One source of truth for the call price.** `CALL_OPTIONS` in `src/lib/stripe.ts` holds both options; the page title, the search snippet, the social card, the headline, the option cards and the submit button all read from it. The price used to be typed out in four places with a test on only one of them.
- **`/book` presents a choice** rather than a single price: the headline is "Book a strategy call" and both lengths are stated in the copy and in the page's metadata. The refund/credit block and the consent wording are untouched.
- **The AI-crawler files (`llms.txt`, `llms-full.txt`) state both options and both prices** — they previously said "30 minutes" with no price, which is now a wrong quote about the offer.
- Duration claims on `/workplace` and the stale price in the `/schedule` and `/audit` comments follow the new offer.

### Fixed

- **Post-payment verification handles two products without a new way to fail.** `/book/success` accepts either configured price id and identifies which one was bought. If neither is configured it still fails closed with `unconfigured`. Crucially, if only *one* is configured and a session matches neither, it also answers `unconfigured` rather than `wrong_product` — the alternative tells a paying customer they bought the wrong thing when the fault is an environment variable we never set. The server log names the variable that is actually missing.
- **The checkout API's "not configured" check is per-option.** A global check would have let a 60-minute purchase through to Stripe with an empty price, surfacing as a generic "Checkout creation failed" — the wrong error, aimed at the wrong party.
- **The amount is verified, not just the price id.** This release reprices the 30-minute call while *reusing* `STRIPE_PRICE_ID_30MIN`, so the previous Price object remains a valid id that still charges the old figure — a rename would have failed closed, reusing the name cannot. `/book/success` now checks the session's `unit_amount` against the catalog and refuses if they disagree; the webhook checks `amount_subtotal` (pre-discount, so promotion codes don't trip it) and logs, because by then the money has moved.
- **`/book` offers only what can be bought.** An option whose Stripe price id is unset is no longer advertised, priced in the intro copy, or given a card — a buyer used to reach the end of a filled-in form before finding out. When *nothing* is configured the full catalog still renders, since there is then no other length to steer anyone toward.
- **Nothing on the checkout path is written for a developer any more.** `/api/checkout`'s 503 and 400 are rendered verbatim in the form's error box; they used to read "Stripe not configured" and "Unknown call option". They now name a length that *can* be booked and how to reach us, with the operator's reason in the server log instead. A stale browser bundle posting no `duration` is told to reload rather than shown "Invalid request".
- **The calendar travels on the option** instead of being chosen by `optionId === "60min"`, where every other length fell through to the 30-minute event while the sentence above the embed read its length from the catalog — a third option would have booked 30 minutes under the words "Choose a 90-minute slot", and would have compiled and passed the suite.
- **A CRM that rejects the new call fields can no longer cost a customer their paid flag.** `call_duration`/`call_minutes` are new keys on a schema in another repo; a 4xx on the by-session upsert now retries once without them instead of throwing, 500ing, and handing Stripe a retry that the event ledger may short-circuit.
- **The no-calendar confirmation claims only what is true.** It said "You're booked in" and "your 60 minutes are held" when there is no event type of that length and therefore no booking and nothing held — a buyer who read that stopped watching for the email we owe them.
- **The selected option card keeps its ring under the pointer.** `.card:hover` outranked the ring's `box-shadow`, so the card being pointed at was the one that lost its selected state.

## [1.0.0.0] - 2026-07-31

The site now leads with the AI Employees offer. Visitors land on the five roles they can hire — three core roles and two combinations — with public "from" pricing, and everything the agency also builds moves below as "Extra services". This is the identity-settling release, so it goes to 1.0 (and adopts the 4-digit version scheme).

### Added

- **The AI Employees offer, front and center.** The homepage opens on the five roles — AI Receptionist (from $300/mo), AI Executive Assistant (from $500/mo), AI Social Media Manager (from $400/mo), AI Office Manager (from $800/mo), and AI Chief of Staff (from $900/mo) — each with the volume of work it covers and a 90%-off badge. Fully translated, English and Farsi.
- **Real role pages.** `/services` is now a hub listing all five roles, and each role has its own prerendered page (price, what they handle, what it looks like on the job, onboarding, white-label) — both were bare redirects before. Bundles list the roles inside them.
- **A branded 404** with recovery links, replacing the framework default on unknown role/industry URLs.
- **A full test suite where none existed**: 152 unit tests + 26 browser tests covering content integrity (EN/FA parity, pricing arithmetic, tone rules), routing/redirect/canonical invariants, and the booking path — plus CI that runs them on every PR and every push to main.

### Changed

- **The bundle math is honest.** AI Chief of Staff now states the true sum of the work its three roles cover (~$12,000/mo) and prices at $900/mo — 7.5%, better than the 10% rule the individual roles are priced on. A test now pins every bundle's workload to the sum of its parts.
- **Every page shares as itself.** Per-page canonical URLs and OpenGraph across the site, and the shared Twitter card trimmed to card+image so X falls back to each page's own OpenGraph — previously a shared link to `/faq` or `/book` previewed as the homepage.
- **Farsi visitors get correct pages everywhere.** English-only pages now pin their direction and typeface instead of rendering right-to-left in the Persian font when Farsi is the stored language, and step numerals render as Persian digits on the Farsi homepage.
- **Readability fixes site-wide**: the pricing badges, card links, role pills, and step numbers now meet WCAG AA contrast (the accent-on-white eyebrow treatment is logged for a brand-owner decision).
- **Pages got lighter.** Role and industry prose moved out of the shared client bundle — the chunk loaded on every page halved.
- **`/schedule` is now the intro call for invited businesses** (same offer language as the rest of the site) rather than a page advertising a free version of the paid call. It stays reachable for old links, unindexed.
- Retired pages excluded from the sitemap now genuinely opt out of search indexing instead of relying on sitemap absence.

### Fixed

- The AI-crawler file (`llms.txt`) no longer contradicts itself by listing reception as an unpriced extra service — that work is the AI Receptionist's job, priced as a role.
- Checkout verification fails closed: a missing Stripe price configuration can no longer skip the product check, junk session ids never reach Stripe (shape-check + rate limit), and a Stripe outage now shows "something went wrong on our side — your payment is safe" instead of telling a paying customer their session doesn't exist.
- The FAQ's structured data escapes `<`, closing a script-injection foothold for future copy edits.
- Plain `.env` / `.env.production` files — the ones that hold `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` — are now ignored by both git and the Vercel CLI upload; the old `.env*.local` pattern left them committable and deployable from a working tree (`.env.example` stays tracked).

### Removed

- **The retired evaluation flow, fully.** `/evaluate`, `/audit`, and `/chief-of-staff` are permanent redirects at both the edge and the app layer; the orphaned `/api/evaluate` endpoint (an unauthenticated mail-sending surface) and its `resend` dependency are deleted.
- **~600 lines of dead content and components** left over from earlier positioning (old pillars, portfolio, voice-AI copy, language bars, four unmounted components), so the codebase no longer contradicts the live site.

## [0.5.0] - 2026-07-14

Implements the Rumi AI website rebuild spec (`rumi_build_implementation_guide-3.md`): brand rename, homepage copy, a new FAQ page, and information-architecture cleanup. The domain and contact email stay `rumi.build` / `support@rumi.build` — only the display name changed.

### Changed

- **Brand renamed Rumi Build → Rumi AI** across all page titles, metadata, OpenGraph/Twitter cards, and body copy (29 occurrences, 16 files). The logo wordmark image is untouched.
- **Homepage rewritten to the guide copy.** New hero ("Don't get left behind. We handle the digital work, so you can run your business."), a reworked six-card "What we do" grid (Content strategy / Found everywhere / AI front desk / Leads that don't go cold), a four-step "How it works" (was three), and a new Mission/Vision section. Single primary CTA: **Book a Call**.
- **Navigation** is now Industries · Team · FAQ · Book a Call (was Team + a Free-evaluation CTA). Every primary CTA points at `/book`.
- **Team page:** Saba Fazel's title corrected to **Chief Growth Officer** (was Chief Product Officer) with a new bio; header is now "Founded and based in Los Angeles."
- **Industries hub** reframed to "local, trust-based businesses" with a required catch-all card ("Don't see your business?").
- **Language scope is English + Farsi only.** Spanish removed from the language switcher and from all live copy (the `es` dictionary was dropped from `i18n.tsx`); the site no longer claims Spanish as a served language.
- AI-facing `llms.txt` / `llms-full.txt` rewritten to the new positioning (LA-based, Book-a-Call, EN/FA).

### Added

- **FAQ page (`/faq`)** with the 14 ready-to-use Q&As from the guide, rendered as static text (SEO/AI-engine readable) plus schema.org `FAQPage` JSON-LD.

### Removed

- **Retired `/evaluate`** — the separate evaluation intake folds into one Book-a-Call path (guide §2); the route now redirects to `/book` and the old form is deleted.
- **Retired `/services` and `/services/[slug]`** (the persian-leads offer, guide §7); both redirect to `/industries`, and the "Services for X" links were removed so nothing dead-ends.
- **Public pricing** (`$199/mo`, `was $499`) removed from all industry verticals; replaced with a book-a-call CTA. No phone number anywhere.

## [0.4.8] - 2026-07-09

### Removed

- **"Book a 15-min call" CTA** dropped from the homepage. Removed the secondary hero button (next to "Request a free evaluation") and the matching link in the footer's Company column, so the landing page no longer pushes a competing booking action alongside the primary evaluation CTA. The now-unused `ctaSecondary`/`bookCall` translation strings were removed from all three languages (EN/ES/FA) in `i18n.tsx`. The `/schedule` page itself and its other entry points (services, evaluate form, sitemap) are unchanged.

## [0.4.7] - 2026-07-01

### Removed

- Trimmed two elements from the homepage hero: the **"Southern California · Be found in the AI era" overline** and the **multilingual explainer line** ("We work in your language too — pick yours at the top…"). The hero now opens straight on the headline. The `overline`/`trust` dictionary keys were removed from all three languages (EN/ES/FA) in `i18n.tsx`; the language switcher is unaffected and the bottom CTA still notes you can answer in any language.

## [0.4.6] - 2026-07-01

### Fixed

- Removed three stale references to the deleted pricing page that v0.4.5 left behind. `llms.txt` / `llms-full.txt` no longer tell AI engines about a "Find your fit" calculator "on the pricing page" (there is no pricing page — it now describes the free-evaluation scoping instead). The Terms "Plans, billing & refunds" section no longer points to plan prices/per-lead charges "on the pricing page" (now scoped on the free evaluation and set out in the quote). The `persian-leads` services tagline dropped "Fixed price" (which contradicted its own "we charge per booked lead" copy) in favor of "Pay per booked lead."

## [0.4.5] - 2026-06-29

### Added

- The free-evaluation form now **emails each submission to support@rumi.build** (via Resend; the prospect's address is set as reply-to so support can reply directly). Retention-backend capture is kept as a best-effort secondary; if neither delivers, the form fails honestly with an "email us" message instead of a false success. Requires `RESEND_API_KEY` and a verified rumi.build sender domain in Resend (`EVALUATION_TO` / `EVALUATION_FROM` override the addresses).

### Removed

- **Pricing page.** Deleted `/pricing` and the lead-price calculator; `/pricing` now 301-redirects to `/evaluate`. Removed Pricing links from the nav, mobile menu, footer, sitemap, and AI-crawler content. Pricing is now scoped on the free evaluation call rather than a public page.

### Changed

- Moved the social links (X, LinkedIn) from the top nav to the footer.

## [0.4.4] - 2026-06-29

### Fixed

- Regenerated `public/og-image.png` (1200×630) to match the current **"Stop being invisible in the AI era"** positioning. The social/Twitter card still carried the retired v0.3.0 hero ("Qualified local customers calling your store every month. From $199/mo."), so link unfurls on iMessage, Slack, X, etc. advertised stale copy and pricing. The new card renders the live hero — "Stop being invisible in the digital world." with the amber accent "In the AI era, you can't afford it." — plus a subhead distilled from `COPY.hero.sub` / `layout.tsx` metadata (customers ask ChatGPT, Claude, and Perplexity who to hire; we make your whole presence findable). Visual system unchanged: zinc-900 background with amber radial glow, amber-400 accents, Geist font, "Rumi Build" wordmark, the multilingual strip (English · Español · فارسی · Tiếng Việt · 中文 · 한국어), and `rumi.build`. Persian hand-shaped to contextual presentation forms; rendered at 2× and downscaled with LANCZOS. No code changed — `layout.tsx` and the other pages already reference `/og-image.png`.

## [0.4.3] - 2026-06-29

### Added

- **Full-page language switcher.** A language dropdown in the nav (English, Spanish, Farsi) translates the entire landing page and the evaluation form instantly — hero, capability pillars, how-it-works, team teaser, CTA, nav, and footer. Farsi switches the page to RTL with the Vazirmatn font. Backed by a single client-side i18n dictionary (`src/lib/i18n.tsx`); adding a language = drop in one translated dictionary. Brand names (ChatGPT, Claude, Perplexity, etc.) stay in Latin script. Visitors can fill out the free-evaluation form in their own language.

### Changed

- Removed the dedicated "56% of LA County" multilingual section from the homepage; the multilingual capability is now a one-line mention in the hero plus the language dropdown itself.
- Hero now has a single CTA ("Request a free evaluation"); removed the secondary "Book a 15-min call" button.
- **Team page** rebuilt: each founder gets a richer individual profile with a personal bio, and the project write-up cards were replaced with a compact "What we build" section linking rumi.team and rumiagent.com.

### Removed

- Legacy hero-only i18n mechanism (`hero-i18n.ts`, `language-strip.tsx`, `/locales/*.json`) and the `language-bar` component, superseded by the full-page i18n dictionary.

## [0.4.2] - 2026-06-29

### Fixed

- Launch-pricing banner on `/pricing` advertised an expired deadline ("May 31, 2026", now in the past). Extended the `LAUNCH_PRICING_ENDS` constant to **August 31, 2026** so the offer reads as live. The banner remains display-only with no auto-expiry — see the v0.4.0 cleanup of dated launch copy in `llms.txt`/`llms-full.txt`; those AI-crawler files already carry no launch date, so the constant is now the page's only date reference. Stripe checkout (`/book` → `/api/checkout`) and the tier `savings()` logic are untouched.

## [0.4.1] - 2026-06-29

### Changed

- Re-topiced the homepage hero to **"Stop being invisible in the digital world. In the AI era, you can't afford it."** The subhead now leads with the shift from Google to AI: customers ask ChatGPT, Claude, and Perplexity who to hire, and we make the client's whole presence readable to those engines so they're the answer. The multilingual AI chatbot moves to the hero's supporting line.
- Reworked the capability pillars to 6 under "Everywhere your customers look — including AI.": added **a mobile app**, **managed social media**, and **Found by AI engines** (AI-engine discoverability via structured content + `llms.txt`); consolidated the customer list/email, events, and payments into a single card.
- Updated site metadata, `llms.txt` / `llms-full.txt`, and the es/fa hero translations to match. The AI-crawler content now describes website + mobile app + social + AI discoverability, so AI engines summarize Rumi Build accurately.

## [0.4.0] - 2026-06-29

### Changed

- Repositioned the homepage around **"Be found in the AI era"** — a done-for-you, multilingual-first web-presence offer. The new hero leads with the moat ("Your competitors lose the 56% who don't search in English first. You won't.") plus the visibility/AI-era frame, and presents the platform as a service Rumi builds and runs, not self-serve software. The $199/mo multilingual lead-gen offer stays available via `/pricing` and the industries/services pages.
- Primary call to action is now **"Request a free evaluation"** (new `/evaluate`); "Book a 15-min call" is secondary. Nav and mobile-menu CTAs updated to match.
- `HowItWorks` rewritten to a 3-step "from first call to a live presence in days" flow, now driven from `data.ts` (`HOW_IT_WORKS_STEPS`).
- Hero gained a translatable overline; `public/locales/es.json` + `fa.json` re-translated for the new hero. The locale loader now key-merges over English so a missing key never renders blank.
- Site metadata (`layout.tsx`) and AI-crawler content (`llms.txt` / `llms-full.txt`) rewritten for the new positioning; removed the stale launch-date and per-lead-only claims. Added `metadataBase` so OG/Twitter image URLs resolve absolutely.
- `DESIGN.md` product context and decisions log updated to the new positioning.

### Added

- **Free evaluation intake** — `/evaluate` page and form (current website, languages, needs checkboxes, contact) posting to a new `/api/evaluate` endpoint. Capture is required: zod-validated, rate-limited, and persisted to the retention backend; on failure the visitor gets an honest "email support@rumi.build" fallback instead of a false success. Requires `RETENTION_API_URL` + `RETENTION_API_KEY` in the environment.
- `PlatformPillars` — a "what we build and run" capability strip (multilingual site, in-language AI chatbot, customer list + email, events/ticketing, on-site payments + tips/contributions), service-framed and rendered through the shared `ServiceCard`.
- `/evaluate` added to the sitemap.

### Notes

- "Donations" wording dropped in favor of "tips / contributions" — the audience is for-profit small businesses, so this avoids implying nonprofit/tax-receipt handling.
- Strategic note: a CEO/Design/Eng review (via /autoplan) recommended keeping lead-gen primary and adding the platform as an upsell; the founder chose the full reposition. Lead-gen pages remain live as the entry tier.

## [0.3.0] - 2026-05-11

### Added

- Hero language strip — three native-script pills (English, Español, فارسی) above the headline. Clicking a non-English pill translates the six hero strings via lazy-loaded `/locales/<code>.json`. RTL handling for Farsi via Vazirmatn font + `dir="rtl"`.
- Southern California language list — 23 pills ordered by LA County speaker count + community visibility (Spanish, Chinese, Tagalog, Korean, Armenian, Persian, Vietnamese, Arabic, Russian, Japanese, Khmer, Thai, Hebrew, Hindi, Punjabi, Urdu, Gujarati, French, Portuguese, Indonesian, Italian). Replaces the prior 74-language generic Whisper grid.
- Fourth pricing tier — **High-Ticket**: from $1,500/mo + 5–15% success fee on closed deals, for merchants with avg customer value $5,000+ (real estate, jewelry, luxury home services). Visible minimum + consultation, no strikethrough.
- Lead-price calculator on `/pricing` — three pill-radio questions returning the matching tier with a transparent value breakdown: first-sale gross profit + repeat business / referrals / brand / multilingual community trust uplift × volume = monthly revenue lift. LTV multipliers tuned per tier (6× low-ticket, 4× mid, 2.5× premium, 2× high-ticket) so every recommendation reads as ≥2× the tier price.
- Limited-time launch pricing — strikethrough originals ($499/$799/$999), discounted prices in amber ($199/$299/$499), explicit "Save $X/mo · N% off" pill per tier through 2026-05-31. Banner above the tier grid summarizes the offer.
- Spanish and Farsi hero translations (`public/locales/es.json`, `fa.json`), translated with Southern California framing.
- `PLAN-hero-language-strip.md` — design plan from the `/plan-design-review` walkthrough.

### Changed

- Repositioned the entire site to **Southern California** focus. Hero, footer, metadata, schedule page, services preview, vertical descriptions, How-It-Works, section CTA, and `llms.txt` all updated. "1 in 5 Americans" → **"56% of LA County"**.
- Pricing tier rename: Starter → **Local**, Scale → **Premium** (Growth kept). Each tier now displays its value band (under $150 / $150–$750 / $750–$5,000 / $5,000+) below the name.
- "Most popular" badge moved from Local to **Premium** — captures the highest gross-profit cohort.
- Hero headline simplified: dropped "5–20" volume claim so it doesn't ceiling-cap perception for higher-volume merchants. Now reads: *"Qualified local customers calling your store every month. From $199/mo."*
- Hero accent price: $499/mo → **$199/mo** (matches Local launch tier). Propagated across Spanish and Farsi locale JSONs and the SEO descriptions.
- Buyer-objection block on `/pricing` rewritten — six new Q&As targeting the new pricing model: *"Why do you need to know my average sale size?"*, *"Are you charging me more just because my customers are worth more?"*, *"Do I pay for bad-fit leads?"*, *"Is this ad spend, software, or an agency fee?"*, plus the kept money-back-guarantee and Yelp-comparison answers.
- All site copy purged of *"Voice AI agent"* / *"AI agent"* / *"voice agent"* terminology — just "AI". Outcome-led language, no tech-stack name-dropping.
- Vertical `roiData` strings across all 5 industries updated to *"Launch pricing from $199/month for 5 qualified leads (was $499)."*
- Footer credential strip → *"Made in Southern California. Local growth in LA's languages."*
- Strikethrough on original prices changed from neutral gray to muted amber so the discount reads as one cohesive amber moment.
- Hero is now a client component (`"use client"`) for language-strip state. Home-page route weight grew 783B → 2.52KB First Load JS.

### Removed

- 7-day Sprint pricing option ($1,200 flat for 5 leads) — dropped from `/pricing`, `/schedule`, vertical `roiData`, and both `/llms.txt` versions. The four monthly tiers cover the full pricing surface.
- Standalone Farsi accent line under the hero headline — strip carries the multilingual signal.
- Tagline pill at top of hero ("Qualified local customers in 70+ languages") — strip replaces it.
- Body subhead inline language list ("Spanish, Mandarin, Tagalog…") — strip carries that signal.
- Farsi parenthetical on secondary hero CTA ("(تماس رایگان)") — strip handles language switching.
- *"No menus, no 'press 2 for Spanish.'"* from the LanguageBar footnote.
- Eleven orphan locale JSONs (zh/tl/vi/ar/ko/ru/ht/fr/pt/hi/it) — no longer reachable since the strip only surfaces English/Spanish/Farsi.

## [0.2.1] - 2026-05-07

### Fixed

- Booking link 404 on production. Cal.com team slug is `rumi.build`, not `rumi.team` — corrected `CALENDLY_URL` and `CAL_LINK` in `data.ts` plus the fallback link in `/schedule`.

### Changed

- Broadened positioning from "Iranian-American businesses" to "small businesses." The marketing surface (hero tagline, sub, trust ribbon, layout metadata, footer credential strip, schedule subtitle, section-CTA default, llms.txt) no longer leads with "Iranian-American team" or "Iranian-American businesses."
- Persian/Farsi multilingual angle stays — the Farsi accent line on the hero, the trilingual delivery (Persian, English, Spanish), the Farsi greeting in the footer, and the EN/Farsi/Spanish booking copy are all preserved.
- Vertical descriptions broadened: curtains, rugs, beauty, home services no longer lead with "Iranian-diaspora community" framing. Multilingual delivery is the differentiator instead.
- Team page case-study copy updated: "marketing for our clients' Iranian-American businesses" → "marketing for our clients' small businesses."
- HowItWorks step 3 broadened: targeted ads in Persian/English/Spanish + community-channel outreach (Telegram/Instagram/neighborhood groups) instead of "Iranian-diaspora Telegram channels."
- Founder bios in `data.ts` no longer lead with "Iranian-American" as the primary identifier.

## [0.2.0] - 2026-05-07

### Changed

- Pivoted positioning from "Head of HR for AI Employees" to "Local growth for Iranian-American businesses." We now sell productized local lead generation for Iranian-American SMB retailers in North America, not generic AI consulting.
- Hero: new outcome-led headline (`5–20 qualified local customers calling your store every month. From $499/mo.`) with Farsi accent line and money-back framing in the sub.
- Trust ribbon: Iranian-American team, multilingual delivery (Persian, English, Spanish), per-lead pricing.
- Pricing: tier-based subscription (`$499` / `$799` / `$999` per month) plus 7-day sprint at `$1,200`, with refund policy, qualified-lead definition, and 5 buyer-objection answers.
- Industries: replaced 6 generic SMB verticals with 5 Iranian-diaspora retail verticals (Real Estate, Curtains & Drapery, Rugs & Home Goods, Beauty & Salon, Home Services).
- Schedule: free 15-min call (English or Farsi), replacing paid 30-min strategy call. Cal.com link updated to `/15min`.
- Team page: founder bios rewritten for new positioning; case studies refocused on customer acquisition outcomes ("Rumi Customer Management Platform" and "Multi-Lingual Conversational AI").
- Navigation: streamlined to `/pricing`, `/team`, `/schedule`. Removed `/services` and `/industries` from main nav.
- SEO: site title, description, Open Graph, Twitter cards, and `llms.txt` all updated to new positioning. Sitemap trimmed to current routes only.

### Added

- Vazirmatn font for Farsi accent text (via `next/font/google`, Arabic subset only).
- `font-vazirmatn` Tailwind utility class.
- Multilingual landing-page concept: Persian-, English-, and Spanish-speaking customer delivery.
- Refund policy displayed prominently on `/pricing`.
- Real Estate as the primary vertical (lead position in services preview, footer, sitemap, `llms.txt`).
- `CHANGELOG.md` (this file).

### Removed

- "Head of HR for AI Employees" positioning across hero, services preview, metadata, and `llms.txt`.
- 3-Chief services grid (Chief of Staff, Chief of Marketing, Chief of Customer Service) replaced by single product card.
- Generic SMB industries (restaurants, legal, construction, accounting, healthcare) replaced by Iranian-diaspora retail focus.

### Notes

- Legacy pages (`/chief-of-staff`, `/workplace`, `/audit`, `/services/[slug]`, `/book/*`) still exist as files but are unlinked from nav and dropped from sitemap. Recommend deletion in v0.3.
- Farsi placeholder copy in hero, footer, and CTAs is awaiting Saba's Farsi-first review before launch.
- Source artifacts for this pivot live at `~/.gstack/projects/elated-vaughan-55c750/`: the office-hours design doc and the autoplan-reviewed website plan.

# Changelog

All notable changes to rumi.build are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

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

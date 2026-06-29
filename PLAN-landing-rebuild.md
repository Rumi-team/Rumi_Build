<!-- /autoplan restore point: ~/.gstack/projects/Rumi-team-Rumi_Build/claude-nervous-pascal-3bc55c-autoplan-restore-20260628-205218.md -->
# PLAN — rumi.build Landing Page Rebuild: "One Platform for Your Whole Business"

## Premise (LOCKED via autoplan premise gate)
- **Deliverable:** Reposition rumi.build's **own marketing landing page** to sell a new flagship offering: an all-in-one business platform. This is **marketing copy + design + page structure only**. No working admin/events/payments backend is built on rumi.build itself — those are presented as *capabilities rumi.build builds for clients*.
- **Client archetype in the pitch:** for-profit small business. "Events" = paid workshops / classes / ticketed gatherings. "Donations" = tips / voluntary contributions. Standard Stripe, no 501(c)(3) tax-receipt logic.
- **Effort class:** days, not weeks. No database, no auth, no email infra, no file storage added to this repo.

## The two client goals (north star)
1. **Manage everything in one place** — one platform instead of a pile of disconnected tools.
2. **Save money** — stop paying overlapping SaaS fees (EventBrite ticket fees, Mailchimp/email tool, website builder, chatbot widget, scheduling tool).

## Positioning shift
- **From (current v0.3.0):** "Qualified local customers calling your store every month — multilingual lead-gen, from $199/mo, Southern California."
- **To:** "One platform for your whole business — a modern website, an AI chatbot that answers every visitor like your best front-desk rep, a built-in admin to manage customers and send email, an events page that sells tickets, and on-site payments + donations. One login. One bill. Stop renting five tools."
- **What carries over (do not discard):** the multilingual differentiator folds *into* the chatbot pillar ("answers every visitor in their own language — 56% of LA County speaks a non-English language at home"). The existing booking/call CTA and Stripe checkout stay.

## Offering pillars (the "one banner" — 5 cards)
1. **Modern website** — fast, mobile, SEO-ready. The foundation everything plugs into.
2. **AI chatbot (multilingual)** — answers incoming visitors interactively, like customer service, in their own language. Captures leads 24/7.
3. **Admin / CRM + email** — client manages their customer list; sends email individually or in bulk. (Replaces a standalone email tool.)
4. **Events** — client uploads an event (title, description, image, date); it renders in the site's Events section. (Replaces a separate event page builder.)
5. **Payments + donations** — visitors pay for tickets and give donations directly on the site, with minimal fees. (Replaces EventBrite's per-ticket cut.)

## "Save money" proof section
Side-by-side: "What you pay now" (EventBrite fees + Mailchimp + Squarespace + chatbot widget + scheduler ≈ $X/mo + % of every ticket) vs "Rumi: one platform, one bill." Anchor on EventBrite's per-ticket fee specifically (the client's named pain).

## New landing page section order (home `/`)
1. Nav (reuse)
2. Hero — new headline + sub + dual CTA (see pricing / book a call)
3. "Under one banner" — the 5 pillars grid (the core new section)
4. AI chatbot spotlight (folds in multilingual reach)
5. Events + payments spotlight (the EventBrite-replacement story)
6. "Stop renting five tools" — cost-consolidation comparison
7. How it works (reuse/adapt — 3 steps to launch)
8. Pricing teaser / bundle CTA
9. Section CTA + Footer (reuse)

## Code changes (this repo)
- `src/lib/data.ts` — replace/extend `COPY`, add a `PILLARS` array, add cost-comparison data. Keep `VERTICALS`/`SERVICES` available for sub-pages.
- `src/app/page.tsx` — new section composition.
- New components: `pillars-grid.tsx`, `chatbot-spotlight.tsx`, `events-payments-spotlight.tsx`, `cost-comparison.tsx`. Reuse `Nav`, `Footer`, `Hero` (re-skin), `HowItWorks`, `SectionCTA`, `service-card`/`vertical-card` patterns.
- `DESIGN.md` — log the positioning decision. Reuse existing zinc/amber dark system (no new design system).
- Keep Stripe checkout + booking flow intact.

## Pricing
- Move from per-lead lead-gen pricing to an all-in-one platform bundle (monthly). Exact tiers TBD; reuse the existing pricing page + calculator scaffolding.

## Out of scope (separate engagement, not this plan)
- Actually building functional admin/CRM, email-sending, events CMS, or live payments/donations *on rumi.build*. Those are the product rumi.build sells; this plan only markets them.
- Multi-tenant productization.
- Backend infra (DB, auth, email provider, file storage).

## Open questions / decisions to resolve in review
- Does the all-in-one platform **replace** the multilingual lead-gen positioning, or run **alongside** it? (Lead-gen has live pricing + verticals pages.)
- How concrete should the feature claims be, given the backend isn't built yet? (Avoid promising live software that doesn't exist — credibility / legal risk.)
- Bundle pricing shape.

---

# AUTOPLAN REVIEW

## Phase 1 — CEO Review (Strategy & Scope)

### What already exists (leverage map)
- Full conversion funnel already live: hero, 4-tier pricing + calculator, 5 verticals, money-back guarantee, Stripe checkout (`api/checkout`, `api/stripe/webhook`), booking flow. PORTFOLIO shows **zero closed customers** ("pilot launching Q2").
- Multilingual moat: census-backed "56% of LA County" stat, `LA_LANGUAGES` (23), Farsi-native founding team. This is the hard-to-copy wedge.
- Two version cycles of deliberate positioning convergence (v0.2.0 Persian → v0.2.1 broaden → v0.3.0 SoCal + pricing).

### NOT in scope (confirmed)
- Building functional admin/CRM, email, events CMS, payments/donations on rumi.build. Marketing only.
- Multi-tenant productization, backend infra.

### CEO Dual Voices — Consensus Table
| Dimension | Claude | Codex | Consensus |
|---|---|---|---|
| 1. Premises valid? | No | No | CONFIRMED weak |
| 2. Right problem to solve? | No | No | CONFIRMED |
| 3. Scope calibration correct? | No | No | CONFIRMED |
| 4. Alternatives sufficiently explored? | No | No | CONFIRMED |
| 5. Competitive/market risks covered? | No | No | CONFIRMED |
| 6. 6-month trajectory sound? | No | No | CONFIRMED |

Source: codex+subagent. 6/6 confirmed the plan-as-written carries critical strategic risk.

### Findings
- **[CRITICAL] Undifferentiated category.** "All-in-one + save money" is owned by Wix/Squarespace/GoDaddy/GoHighLevel at $16–49/mo with working software. A 3-person agency with no built product loses on price, trust, feature-completeness, support. "Save money" is a discount position that invites a price war it loses.
- **[CRITICAL] Advertising software that doesn't exist.** Pillars sell "built-in admin / send email / events page / payments + donations" but the plan builds none of it. Credibility + deceptive-advertising / compliance risk (team just added Terms/Privacy for 10DLC).
- **[CRITICAL] Abandons the only moat.** Demoting multilingual ("56% of LA County") from hero to card #2 of 5 trades the defensible wedge for commodity framing.
- **[CRITICAL/HIGH] Wrong leverage + unvalidated premise.** The bottleneck is demand (zero closed customers), not homepage copy. "SMBs want one bundle over best-of-breed" and "save money vs EventBrite" are assumed; EventBrite pain is event-coupled and non-universal (a curtain retailer/contractor runs ~zero events).
- **[HIGH] "Donations" wording.** Invites nonprofit / tax-receipt / refund / donor-data questions the plan explicitly disclaims.
- **[MEDIUM] Overpromised chatbot + "one bill."** "Answers every visitor like your best front-desk rep" and "one bill" become false if delivery wraps Stripe/email/calendar tools.

### Auto-decisions (6 principles)
| # | Decision | Classification | Principle | Rationale |
|---|----------|----------------|-----------|-----------|
| 1 | Run both dual voices (Codex + Claude) every phase | Mechanical | P6 | Independent signal; both available |
| 2 | Keep Stripe checkout + booking flow intact (DRY) | Mechanical | P4 | Already works; reuse |
| 3 | Cost-comparison must NOT anchor solely on EventBrite | Taste | P1/P3 | Non-universal pain; broaden or drop |
| 4 | Chatbot copy narrowed: "answers common questions, captures leads, routes complex to a human" + handoff language | Taste | P5 | Explicit/accurate beats overpromise; avoids churn |
| 5 | "One bill/one login" → "one managed system, one team accountable" unless truly reselling | Taste | P5 | Avoids a claim that becomes false |

### USER CHALLENGES (both models agree your direction should change — NOT auto-decided)
- **UC-1 (framing & scope):** Do NOT replace the homepage. Keep multilingual lead-gen as the primary promise; add the all-in-one platform as a **done-for-you service** upsell section ("we build and run this for you"), not self-serve software. Lead with the multilingual moat. → surfaced at final gate.
- **UC-2 ("donations"):** Drop/rename "donations" → "tips / contributions / support payments". → surfaced at final gate (strong recommend).
- **UC-3 (sequencing):** Validate demand (≈5 merchant conversations / 1 signed client) before a full rebuild; ship the platform as one upsell section now rather than a wholesale homepage replacement. → surfaced at final gate.

### Dream-state delta
12-month ideal: rumi.build has ≥1 paying client, a real case study, and (if validated) a multilingual-first done-for-you platform offering layered on the proven lead-gen funnel. This plan, as written, moves *away* from that (replaces the proven funnel before validation). The augment-framing (UC-1) moves *toward* it.

### Founder messaging input (hero direction)
Seed line from founder: **"Stop being invisible in the digital world — in the AI world, you can't afford it."**
- Strategic value: shifts the emotional driver from **cost** ("save money", which both review models flagged as a losing commodity/price-war frame) to **fear of irrelevance / being un-findable in the AI era**. This frame sits directly on rumi.build's moat: getting found, multilingual reach, an AI chatbot that captures every visitor. Recommended as the **leading hero direction** regardless of UC-1 outcome.
- A headline tournament (5 angles → independent judge panel → synthesis) is running to harden the exact overline/headline/subhead/CTA for both the augment and replace structures.

## Phase 2 — Design Review

Design completeness of plan-as-written: **~2/10** — it lists components but specifies no UI (no card anatomy, table format, spotlight layout, states, responsive, a11y, or real copy). A developer would invent everything.

### Design Dual Voices — Consensus Table (litmus scorecard)
| Dimension | Claude | Codex | Consensus |
|---|---|---|---|
| 1. Information hierarchy | 4/10 — offer buried under 5-up grid | Critical — serves the offer, not the visitor | CONFIRMED weak |
| 2. Missing states | 1/10 — none specified | Medium — unspecified | CONFIRMED gap |
| 3. User journey / arc | 4/10 — split CTA, no trust beat | High — dual CTA splits attention | CONFIRMED weak |
| 4. Specificity | 2/10 — components named, nothing spec'd | Medium/High — generic, not specific UI | CONFIRMED weak |
| 5. Design-system alignment | 5/10 — clutter + amber overuse risk | High — cost table risky, generic rhythm | CONFIRMED at-risk |
| 6. Responsive | 1/10 — 5-grid + side-by-side table unplanned | High — mobile failure cases | CONFIRMED gap |
| 7. Accessibility | 1/10 — contrast/targets/keyboard unaddressed | Medium — aspirational only | CONFIRMED gap |

Source: codex+subagent. 7/7 confirmed the design layer is underspecified and the structure needs to change.

### Auto-decisions (Design — P5 explicit + P1 completeness dominate)
| # | Decision | Classification | Principle | Rationale |
|---|----------|----------------|-----------|-----------|
| 6 | Cut to ≤6 sections; one dominant claim (multilingual/visibility moat) + ≤3-4 supporting capabilities, not a flat 5-up grid | Mechanical | P1/P5 | Both voices; 9 sections won't scan, 5 equal cards = no hierarchy |
| 7 | "Book a call" = single primary CTA (amber, solid); "See pricing" = secondary text link | Mechanical | P5 | Both voices; co-equal CTAs split a cold visitor |
| 8 | Insert an earned-trust beat (founder/team credibility + census 56% stat as proof-of-need + money-back guarantee) — no customer logos needed | Mechanical | P1 | Zero closed customers; arc jumps understand→buy |
| 9 | Cost section: drop side-by-side table → mobile-first **stacked** "now vs Rumi" cards OR a 3-4 point "tool sprawl" pain list; no squished side-by-side at 320px | Taste | P1/P5 | Both voices; classic mobile failure + invites price benchmarking |
| 10 | Specify states: equal-height cards w/ line-clamp; all new sections static server components (no loading); interim "from $X / talk to us" pricing; illustrative mocks for chatbot/event visuals (software not built) | Mechanical | P1 | Boil-the-ocean completeness |
| 11 | A11y baseline: 44px touch targets, visible focus rings, WCAG AA contrast check on every amber/zinc pairing, semantic `<table>` for any comparison, `aria-hidden` decorative icons | Mechanical | P1 | Both voices; current spec = aspirational |
| 12 | Budget amber: reserve for the single primary CTA + one "Rumi" winning column; pillar icons stay zinc | Taste | P5 | DESIGN.md says amber is "rare and meaningful" |
| 13 | Update stale `DESIGN.md` product context ("AI consulting agency, 9 services/6 verticals") in the SAME change | Mechanical | P4/P5 | Both voices; otherwise next builder inherits two conflicting briefs |
| 14 | Real hero copy comes from the headline tournament + UC-1 outcome (deferred to synthesis) | — | P3 | Don't write final copy before framing is chosen |

### Note
Design phase produced no new User Challenge — its structural verdict (fewer sections, moat-first, service-framing, real trust beat) reinforces **UC-1** from the CEO phase.

## Phase 3 — Eng Review (Architecture & Implementation)

### Eng Dual Voices — Consensus Table
| Dimension | Claude | Codex | Consensus |
|---|---|---|---|
| 1. Architecture sound? | Overfit — 4 components, ~1 justified | Overfit — collapse to generic primitives | CONFIRMED trim needed |
| 2. Test/guard coverage? | Add content-audit for stale strings | precheck too narrow | CONFIRMED gap (light) |
| 3. Performance risks? | images.unoptimized; keep server components | server-first; compress mocks | CONFIRMED at-risk |
| 4. Security threats? | No new attack surface | No new attack surface | CONFIRMED fine |
| 5. Error/consistency paths? | i18n + metadata silently desync | metadata/OG/crawler contradict | CONFIRMED gap |
| 6. Deployment risk? | Low if home-only, ship deps together | Low, but pricing/CTA must stay consistent | CONFIRMED with conditions |

Source: codex+subagent. Strong overlap.

### Findings
- **[HIGH] Component plan overfit.** Of 4 proposed: `pillars-grid` is redundant (render via existing `service-card.tsx` / `services-preview` chrome); the two spotlights are the same layout twice (collapse to one generic `Spotlight` with a `reverse` prop); **only `cost-comparison` is genuinely net-new.**
- **[HIGH] `data.ts` typing + hero-i18n coupling.** Type `PILLARS` and cost data with explicit interfaces + `as const`. **Preserve the 6 `COPY.hero.*` keys + `trustRibbon.line`** — `hero-i18n.ts` reads them by exact key; renaming silently breaks the language strip.
- **[HIGH] Repositioning silently breaks 3 things absent from the plan's change list:** `layout.tsx` metadata (title/desc/OG/Twitter still sell "$199/mo lead-gen"); `public/locales/es.json` + `fa.json` (hero strip will serve stale Spanish/Farsi copy — "must stay translatable" violated); `llms-content.ts` (`/llms.txt` AI-crawler content describes the old business). All become launch blockers.
- **[MEDIUM] Cost comparison has legal/freshness complexity.** Numeric competitor fees invite apples-to-oranges objections + go stale. Use qualitative "tool sprawl" copy OR structured data with `sourceLabel` / `lastChecked` / `assumptions`.
- **[MEDIUM] "Days not weeks" only true for a restrained upsell.** Long pole is not React — it's translation (Farsi-first, Saba dependency), the OG asset, metadata + crawler rewrite, and illustrative mocks.
- **[MEDIUM] Stay server-first.** `images.unoptimized: true` → hand-optimize/SVG mocks. New sections must be server components (only Hero/calculator are client).

### Pre-existing bugs surfaced (REPO_MODE=collaborative → flagged, not auto-fixed)
- `og-image.png` **404**: `layout.tsx` references `/og-image.png` ×3 but the file is not in `public/` — social unfurls serve a broken image today.
- **Expired launch banner**: `/pricing` shows a launch date of **May 31, 2026** (stale as of the 2026-06-28 session date).
- `/book` still sells a `$100` "AI employee" strategy call via live Stripe `/api/checkout` — disconnected from the current free `/schedule` funnel.
- Stale comments in `sitemap.ts` / `robots.ts` claim `output: "export"`; repo is actually in server mode.

### Auto-decisions (Eng — P5 explicit + P3 pragmatic + P4 DRY)
| # | Decision | Classification | Principle | Rationale |
|---|----------|----------------|-----------|-----------|
| 15 | Build only `Spotlight` (generic, both spotlights) + `cost-comparison`; render pillars via existing `service-card` (no `pillars-grid`) | Mechanical | P4/P5 | Both voices; avoids DRY violation |
| 16 | Type `PILLARS` + cost data (interfaces + `as const`); preserve hero-i18n keys | Mechanical | P5 | Both voices; prevents silent breakage |
| 17 | Add to change set as launch blockers: `layout.tsx` metadata, `es.json`+`fa.json`, `llms-content.ts` | Mechanical | P1 | Completeness; absent from original plan |
| 18 | All new sections = server components; mocks = SVG/compressed (images.unoptimized) | Mechanical | P5 | Perf; both voices |
| 19 | Add a content-audit precheck (forbidden/stale strings: old hero, expired dates, `donations`, `one bill`) | Taste | P1 | Cheap guard; Codex |
| 20 | Do NOT touch `api/`, `/pricing` Stripe IDs, `/book` in this change; preserve CTA hrefs (`/schedule`, `/pricing`) | Mechanical | P4 | Protect live revenue path |

Eng produced no new User Challenge — it reinforces **UC-1** ("safer shape: lead-gen refresh + one upsell section").

---

## Headline Tournament Result (founder tagline → vetted hero)
5 angles generated → 3 independent judges (conversion-clarity, brand-emotion, strategic-fit) → blended synthesis. Winner blends the two top scorers (multilingual-moat 26/30 + visibility-ai-era 24/30): keeps the census moat in the H1, injects your tagline via the overline + transition band.

**Recommended hero (compliant with all locked constraints — moat-first, service-framed, no vaporware, no "save money", no "donations"):**
- Overline: `SOUTHERN CALIFORNIA · BE FOUND IN THE AI ERA`
- Headline: **"Your competitors lose the 56% who don't search in English first."**
- Subhead: "Nearly 5 million people in LA County speak a language other than English at home — and now they search and ask AI in that language too. Most local businesses never show up for them. We build and run your whole web presence, with an AI chatbot that answers every visitor in their own language and captures the lead, so the customers your competitors lose end up calling you."
- Primary CTA: **Book a free 15-min visibility call** · Secondary: See what we build and run for you

**Refined tagline (your line, sharpened):** "Stop being invisible. In the AI era, the customers your competitors can't speak to are the ones you win."

**Runner-up A (fear-first, purest version of your line):** "Stop being invisible online. In the AI era, you can't afford it." + multilingual subhead.
**Runner-up B (revenue-led, conservative):** "More booked local customers every week — in every language they speak."

**Augment placement:** demote the hero to an upsell-band header (don't repeat the 56% stat the top hero already owns): overline "ALREADY GETTING LEADS? GIVE THEM SOMEWHERE TO LAND." → "We don't just find your multilingual customers — we build and run the whole presence that converts them." → 4-5 "we build and run" capability lines → one CTA.
**Replace placement:** promote the recommended block to sole H1; demote "$199/mo" to one entry-tier line in a packages section; single site-wide CTA (the 15-min call).

---

## Cross-Phase Themes (flagged independently in 2+ phases)
- **Moat-first or lose:** CEO + Design + messaging all say lead with multilingual/visibility, never bury it. High-confidence.
- **Service, not software:** CEO + Design + Eng all flag "advertising unbuilt product" as the top credibility/legal risk → use "we build and run" language. High-confidence.
- **Augment, don't replace:** CEO + Design + Eng independently converged on lead-gen-primary + one compact upsell. This IS UC-1.

## Deferred to TODOS / separate scope
- Bundle pricing model + `/pricing` migration (decoupled from this home change).
- Demand validation (≈5 merchant conversations / 1 signed client) before a full replace.
- Pre-existing bug fixes (og-image, expired banner, `/book`, stale comments) — separate cleanup.

## Implementation Tasks (aggregated, post-gate)
- [ ] **T1 (P1) — hero.tsx + COPY** — apply recommended hero (overline/headline/subhead/CTAs); keep the 6 `COPY.hero.*` keys + `trustRibbon.line` intact.
- [ ] **T2 (P1) — i18n** — re-translate `public/locales/es.json` + `fa.json` for the new hero (Farsi-first, Saba). Launch blocker.
- [ ] **T3 (P1) — metadata** — rewrite `layout.tsx` title/description/OG/Twitter to new positioning. Launch blocker.
- [ ] **T4 (P2) — Spotlight + capability strip** — one generic `Spotlight` component; "what we build and run" capability lines (service-framed). Server components.
- [ ] **T5 (P2) — pillars via service-card** — render capabilities through existing `service-card` (no new grid); budget amber.
- [ ] **T6 (P2) — cost/visibility section** — replace side-by-side cost table with mobile-first stacked "one team, not five logins" OR sourced/dated estimator. Drop "save money" framing.
- [ ] **T7 (P2) — llms-content.ts** — update `/llms.txt` + `/llms-full.txt` to new positioning.
- [ ] **T8 (P2) — trust beat** — founder/team credibility + 56% stat as proof-of-need + money-back guarantee.
- [ ] **T9 (P3) — a11y + states** — 44px targets, focus rings, AA contrast, semantic table, equal-height cards, interim "Talk to us" pricing state.
- [ ] **T10 (P3) — DESIGN.md** — update stale product context + decisions log in the same change.
- [ ] **T11 (P3) — content-audit precheck** — fail build on stale strings.

## GATE DECISIONS (locked by founder)
- **UC-1 → REPLACE.** Platform becomes the homepage. Recommended hero = sole H1; $199/mo lead-gen demoted to an entry tier below. Founder override of the unanimous "augment" recommendation — they hold demand context the models lack. (Logged as a decision; risk noted in CEO phase stands.)
- **NEW REQUIREMENT (founder):** primary hero CTA = **"Request a free evaluation"** → a real intake form asking about the visitor's current website, features they need, languages they serve, and contact. This becomes the main conversion path; "Book a 15-min call" is secondary. (Supersedes Design auto-decision #7's "book a call = primary" — evaluation is now the single dominant CTA, booking secondary.)
- **UC-2 → RENAME** "donations" → "tips / contributions."
- **UC-3 → proceed now** (no validate-first gate).
- **Next → implement now.**

### STATUS: IMPLEMENTED + VERIFIED (REPLACE mode)
Build: `pnpm build` green — 28/28 routes, type-check passes, precheck passes, no warnings (metadataBase added).
Verified at runtime (next dev): new hero renders (overline + 56% headline + "You won't." amber kicker + /evaluate primary CTA); 5 service-framed pillars; LanguageBar; 3-step "live presence in days"; team trust beat; evaluation CTA. DOM checks: 0 "donations", 0 "save money/one bill/stop renting". `/api/evaluate` end-to-end: valid → 200 {ok:true}; missing consent → 400; bad email → 400.

Files changed/created:
- `src/lib/data.ts` — new hero COPY (+overline), refined tagline, `PILLARS`, `HOW_IT_WORKS_STEPS`
- `src/lib/hero-i18n.ts` — overline key + locale key-merge fallback
- `src/components/hero.tsx` — render overline
- `src/components/service-card.tsx` — optional `footer` + widened type (pillar reuse)
- `src/components/how-it-works.tsx` — data-driven, 3 steps, 3-col grid
- `src/components/platform-pillars.tsx` — NEW capability strip
- `src/components/nav.tsx` + `mobile-menu.tsx` — CTA → /evaluate
- `src/app/page.tsx` — replace-mode composition
- `src/app/layout.tsx` — new metadata + metadataBase
- `src/app/evaluate/page.tsx` + `evaluate-form.tsx` — NEW free-evaluation intake
- `src/app/api/evaluate/route.ts` — NEW endpoint (zod + rate-limit + retention upsert)
- `public/locales/es.json` + `fa.json` — re-translated hero (+overline)
- `src/lib/llms-content.ts` — rewritten for new positioning (stale date/claims removed)
- `src/app/sitemap.ts` — +/evaluate
- `DESIGN.md` — product context + decisions log
- `.claude/launch.json` — dev preview config

`/api/evaluate` lead capture is **required** (no Stripe fallback like checkout has): on retention success → 200; on failure → 502 with an honest "email support@rumi.build" message (full payload logged server-side, recoverable) so no lead is silently lost. **Deploy requirement:** `RETENTION_API_URL` + `RETENTION_API_KEY` must be set in the Vercel project (same envs checkout's lead-capture uses) for the form to capture. Pre-existing bugs (og-image 404, expired pricing banner) left as flagged background tasks.

### Build structure (REPLACE mode, ≤6 content sections)
1. Nav (reuse)
2. Hero — recommended hero (overline/H1/subhead); primary CTA "Request a free evaluation" → `/evaluate` (or `/audit` if reusable); secondary "Book a 15-min call" → `/schedule`
3. Visibility band — refined tagline transition
4. "What we build and run" capability strip — service-framed pillars via existing `service-card` (multilingual site, 24/7 in-language AI chatbot, customer list + email, events/ticketing, on-site payments + tips/contributions)
5. How it works (3 steps) + trust beat (founder/team + 56% stat + money-back guarantee)
6. Section CTA (→ evaluation) + Footer (reuse)
Launch blockers shipped same change: `layout.tsx` metadata, `es/fa` locales, `llms-content.ts`, `DESIGN.md`.

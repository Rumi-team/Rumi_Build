# Design System — rumi.build

> **Locked brand system.** Every value here was decided and pixel-verified by
> Saba (`~/Downloads/rumi_build_website_rebuild_spec.md`). No color, font, radius,
> or spacing value is a suggestion. Do not approximate a hex, do not add a color,
> do not swap the font. If something isn't covered here, stop and ask Saba before
> improvising — an unapproved amber accent is exactly what this system replaces.
> No change goes live without Saba's review and sign-off (spec §11).

This is also the reference for the two sibling Rumi web properties
(rumiagent.com, rumi.marketing) as they move onto the same brand.

## Product context
- **What this is:** Marketing site for a done-for-you, multilingual-first web-presence agency.
- **Who it's for:** small-business owners (studios, salons, instructors, retailers, contractors) losing customers to weak online presence and language barriers.
- **Positioning (kept):** "Be found in the AI era." We build and run your website, app, and social — and make all of it findable by the AI engines.
- **Languages:** English (working language), Spanish, Farsi. Copy lives in `src/lib/i18n.tsx`; the whole page + evaluation form translate from there.

## Color (exact hex — no approximation, no #000000)

| Role | Hex | Token | Usage |
|---|---|---|---|
| Primary background | `#FFFFFF` | `white` | default background for all pages/sections |
| Secondary background | `#1E293B` | `navy` | nav, hero, CTA, footer — dark sections only |
| Accent | `#059669` | `accent` | buttons, links, icons, headline accent words, logo |
| Accent hover | `#047857` | `accent-hover` | hover on buttons + interactive accent elements |
| Primary text | `#111827` | `ink` | headings + body on white |
| Muted text | `#6B7280` | `muted` | secondary/supporting text on white |
| Website surface | `#FEFCF7` | `surface` | card fills, secondary "why us" section (website only) |
| Card border | `#E5E7EB` | `line` | borders on cards, inputs, dividers |
| Error | `#DC2626` | `danger` | form validation errors only |
| Input background | `#F9FAFB` | `field` | form input fill |

Tokens are defined in `tailwind.config.ts` and consumed as `bg-navy`,
`text-accent`, `bg-surface`, `border-line`, etc. On navy sections, white text
uses `text-white` / `text-white/60` (links) / `text-white/40` (footer labels).

**Hard rules:** never `#000000` (reserved for Rumi App). No amber. No other
color without Saba's sign-off.

## Typography — Inter only

- Load: Inter weights `300;400;500;600;700;900` (`src/app/layout.tsx`, next/font).
- Farsi renders in Vazirmatn via `html[lang="fa"] body` (Inter can't do Persian
  script). This is the one sanctioned exception to "Inter only".
- The logo wordmark is an image, never typed text — never recreate it in Inter.

| Element | Weight | Size (desktop / mobile) | Tracking | Color |
|---|---|---|---|---|
| H1 / Hero | 900 (`font-black`) | 56 / 36px | `-0.03em` (`tracking-h1`) | ink on white, white on navy |
| H2 / Section | 700 (`font-bold`) | 40 / 28px | `-0.02em` (`tracking-h2`) | ink |
| H3 / Card | 600 (`font-semibold`) | 20px | `-0.01em` (`tracking-h3`) | ink |
| Body large | 400 | 18px | normal | muted |
| Body | 400 | 16px | normal | muted |
| Eyebrow | 600 | 11px uppercase | `0.2em` (`tracking-eyebrow`) | accent |
| Button | 600 | 14px | normal | white on accent |

## Layout
- Max content width: 1200px, centered (homepage sections use `max-w-5xl`/`max-w-3xl` where tighter reads better).
- Page padding: 60px desktop / 24px mobile (`px-6 md:px-12`).
- Section padding: 80px top/bottom desktop, 48px mobile (`py-20`).
- Radius: **8px** cards/inputs (`rounded-lg`), **6px** buttons (`rounded-md`), **12px** large feature cards (`rounded-xl`). Never `0` or full pill.

## Page structure (Saba §6 — dark → light → dark bookend)
1. **Nav** — navy, sticky, 64px (`h-16`).
2. **Hero** — navy, tall, headline + sub + CTA (single).
3. **Content / services** — white, card grid (`PlatformPillars`).
4. **Secondary "why us"** — `surface` (#FEFCF7) (`HowItWorks`).
5. **Social proof** — white (`TeamTeaser`, founders as credibility — never fabricated testimonials).
6. **CTA** — navy, centered, single strong CTA (`HomeSectionCTA`).
7. **Footer** — navy, three-column (logo+desc, verticals, company) + copyright bar.

## Components (helper classes in `globals.css`)
- `.eyebrow` — 11px accent label.
- `.btn-primary` — accent fill, white text, 6px radius, `accent-hover` on hover.
- `.btn-secondary-white` — white fill, 1.5px accent border, accent text (on white sections).
- `.btn-secondary-navy` — transparent, 1.5px `white/40` border, white text (on navy sections).
- `.card` — white fill, 1px `line` border, 8px radius, `0 4px 16px rgba(0,0,0,.08)` hover shadow.
- `.icon-badge` — 40×40, `rgba(5,150,105,.1)` fill, accent icon.
- `.field` — `#F9FAFB` fill, `line` border, green focus ring `0 0 0 3px rgba(5,150,105,.1)`.

## Logo
- `public/rumi-logo-on-navy.png` — green wordmark on navy → **navy sections** (nav, footer). Baked navy is exactly `#1E293B`, so it blends.
- `public/rumi-logo-on-white.png` — green wordmark on white → **white sections**.
- Nav height 32–40px (`h-9`/`h-10`). Never stretch, recolor, rotate, or add effects.
- Source files were 1254² avatar crops; trimmed to a horizontal wordmark lockup (crop only — pixels/color untouched) so they read at nav size. A purpose-made horizontal lockup from Saba can drop-in replace these.

## Messaging (Saba §10)
- Plain language, as if explaining to a small-business owner. No jargon.
- **Banned words:** leverage, ecosystem, enterprise-grade, unlock, seamless, cutting-edge, premium, revolutionize, synergy, scalable.

## Motion
- Minimal: hover states + transitions. Optional `.fade-in` on scroll-in sections.

## Rebuild status (branch `saba-brand-rebrand`)
- ✅ Foundation: tokens, Inter, logos, globals, this doc.
- ✅ Pilot: global chrome (nav, footer) + homepage.
- ⏳ Pending Saba sign-off on the homepage before rebuilding: team, evaluate, schedule, industries, services, terms, privacy, book. Interior pages render transitionally until then; nothing merges to prod until the full rebuild is signed off.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-31 | Initial site — Next.js 15 + Tailwind + Geist, amber-400 on zinc-900 | Original premium-dark direction |
| 2026-06-29 | Homepage "be found in the AI era" positioning | Founder direction; multilingual moat + AI-discovery frame |
| 2026-07-06 | **Replace zinc/amber/Geist with Saba's locked white/navy/green/Inter system** | Saba brand spec; kills the unapproved amber accent. Homepage pilot on `saba-brand-rebrand`, gated on Saba sign-off before other pages. Same system rolls to rumiagent.com + rumi.marketing next. |
| 2026-07-09 | Drop secondary "Book a 15-min call" hero/footer CTA; hero is single-CTA | One dominant ask ("Request a free evaluation") instead of two competing CTAs. `/schedule` page and other entry points unchanged. |

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
- **What this is:** Marketing site for hiring AI employees — five roles with public "from" pricing, each priced at about a tenth of the workload it covers. The done-for-you agency work (website, app, content, visibility) sells below as "Extra services".
- **Who it's for:** small-business owners (studios, salons, instructors, retailers, contractors) paying full price for repetitive front-office work.
- **Positioning (v1.0.0.0):** "Get 90% off your hiring. Hire AI employees that work 24/7." The earlier "Be found in the AI era" agency framing now lives inside the Extras section, not the hero.
- **Languages:** English (working language) + Farsi. Copy lives in `src/lib/i18n.tsx`; the homepage translates from there, and every other page renders English pinned LTR (`english-main.tsx`).

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

The homepage as it renders today, in `src/app/page.tsx` order. The dark → light →
dark bookend and the white/`surface` alternation are Saba's; the section list and
the specific background assignments below changed on `feat/ai-employees-lead` and
are **awaiting Saba's sign-off** (see the Decisions Log).

1. **Nav** — navy, sticky, 64px (`h-16`) — `nav.tsx`.
2. **Hero** — navy, tall, headline + sub + CTA (single) — `hero.tsx`.
3. **AI Employees** — white, the five priced role cards. This is the offer and it
   leads — `ai-employees.tsx`.
4. **Extra services** — `surface` (#FEFCF7), the website / app / content /
   visibility grid — `extras.tsx`.
5. **How it works** — white, four numbered steps — `how-it-works.tsx`.
6. **Team teaser** — `surface`, founders as credibility — never fabricated
   testimonials — `team-teaser.tsx`.
7. **Mission & vision** — white — `mission-vision.tsx`.
8. **CTA** — navy, centered, single strong CTA — `home-section-cta.tsx`
   (a translated wrapper around `section-cta.tsx`, which is what renders navy).
9. **Footer** — navy, three-column (logo+desc, verticals, company) + copyright bar.

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
| 2026-07-27 | **Homepage section order and background assignment changed — AWAITING SABA SIGN-OFF.** `PlatformPillars` is gone; the page is now Nav navy → Hero navy → AIEmployees white → Extras `surface` → HowItWorks white → TeamTeaser `surface` → MissionVision white → HomeSectionCTA navy → Footer navy (see Page structure above). | The offer changed: the five hireable AI-employee roles lead, and everything Rumi also builds and runs follows as "extra services". The white/`surface` alternation was re-dealt so the rhythm survives the two new sections. No token, font, radius or spacing value moved — this is section order and which locked fill each section gets. |
| 2026-07-27 | White-on-`accent` micro-text moved to `bg-accent-hover` (#047857). **Buttons unchanged.** Sites: `team-teaser.tsx` role pill, `how-it-works.tsx` step number, `team/page.tsx` role pill, `workplace/page.tsx` week numeral. | White on #059669 measures 3.77:1 — below the WCAG AA 4.5:1 floor for text at these sizes (11–14px). #047857 is already in the locked palette, so this stays inside the system rather than adding a colour. `.btn-primary` keeps white on accent: this doc blesses it (Typography table, "Button … white on accent") and buttons carry their own affordances. Accent-on-white hover states were left alone and are Saba's call. |
| 2026-07-27 | **Same WCAG row, the other direction: `.eyebrow` ON NAVY moved to `text-white/70`.** One site today — the hero eyebrow, `hero.tsx:27` (`className="eyebrow text-white/70"`). **`.eyebrow` on white is UNCHANGED and remains an OPEN AA FAILURE — see the row below.** | `.eyebrow` carries `text-accent`, and accent (#059669) on navy (#1E293B) measures **3.88:1** — under the 4.5:1 floor for 11px text. `accent-hover` (#047857) is darker and therefore worse against navy, so the fix that worked for white-on-accent inverts here. `white/70` composites to #B9C0C4 on navy = **7.94:1**, passes AA and AAA, and is the treatment this doc already uses for text on navy (hero sub, footer columns) rather than a new value. Applied as a utility class beside `.eyebrow` because `globals.css` is LOCKED: Tailwind emits `utilities` after `components`, same specificity, so the later origin wins — verified in the compiled CSS (`.eyebrow` at byte 4694, `.text-white\/70` at 16483) and in the served HTML. |
| 2026-07-27 | **OPEN, UNRESOLVED — needs Saba. `.eyebrow` on white/`surface` sections fails WCAG AA.** accent (#059669) on white measures **3.77:1** against a 4.5:1 floor, at 11px — 29 of the 30 `.eyebrow` sites in `src/` (all but the hero, fixed above). **Not fixed in this pass.** | Fixing it properly means changing what `.eyebrow` *is*, and `src/app/globals.css` is locked (so is `tailwind.config.ts`). The two in-palette options both cost something Saba owns: `accent-hover` (#047857) on white measures 5.49:1 and passes, but darkens the brand's most-repeated accent moment on every page; `muted` passes but gives up the green entirely. Papering over it per-site with utility classes — the escape hatch used for the hero above, where there was exactly one site and no in-palette alternative — would mean ~30 overrides of a class whose whole purpose is to be one decision. Left visible and unfixed on purpose rather than half-fixed: it is a brand-system call, not a code call. |

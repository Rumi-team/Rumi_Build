# Design System — rumi.build

> **Locked brand system.** Every value here was decided and pixel-verified by
> Saba — **Brand Identity & Design System v2.0 (July 2026)**, delivered as
> `~/Downloads/rumi_ai_agency_brand_identity.html`, which supersedes the earlier
> `rumi_build_website_rebuild_spec.md`. No color, font, radius,
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
| Secondary background | `#0B1C36` | `navy` | hero, CTA, footer, mobile menu — dark sections only |
| Accent | `#059669` | `accent` | buttons, links, icons, headline accent words, logo |
| Accent hover | `#047857` | `accent-hover` | hover on buttons + interactive accent elements |
| Primary text | `#111827` | `ink` | headings + body on white |
| Muted text | `#6B7280` | `muted` | secondary/supporting text on white |
| Website surface | `#F9FAFB` | `surface` | card fills, secondary sections, form inputs (website only — never Instagram) |
| Card border | `#E5E7EB` | `line` | borders on cards, inputs, dividers |
| Error | `#DC2626` | `danger` | form validation errors only |
| Input background | `#F9FAFB` | `field` | form input fill — coincides with `surface` by design (v2 defines one Surface value) |

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
- Page padding: 60px desktop / 24px mobile (`px-6 md:px-12`). **One exception,
  measured:** the nav bar runs `px-6 md:px-8 lg:px-12`, because the Farsi link
  row does not fit beside the wordmark at 768px on the full 48px inset (see the
  2026-08-04 adversarial row). Sections are unchanged, so the bar sits 16px
  wider than the content below it between 768 and 1023px.
- Section padding: 80px top/bottom desktop, 48px mobile (`py-20`).
- Radius: **8px** cards/inputs (`rounded-lg`), **6px** buttons (`rounded-md`), **12px** large feature cards (`rounded-xl`). Never `0` or full pill.

## Page structure (Saba §6 — dark → light → dark bookend)

The homepage as it renders today, in `src/app/page.tsx` order. The dark → light →
dark bookend and the white/`surface` alternation are Saba's; the section list and
the specific background assignments below changed on `feat/ai-employees-lead` and
are **awaiting Saba's sign-off** (see the Decisions Log).

1. **Nav** — **white per v2**, sticky/fixed, 64px (`h-16`): `#FFFFFF` fill, 1px
   bottom border `#E5E7EB` (`line`), links in `ink` with **`accent-hover`**
   hover/active (see the 2026-08-04 adversarial row — plain `accent` on white is
   3.77:1) plus `font-semibold` on the active one, and a `.btn-primary` CTA. The
   mobile menu it opens is a full-screen navy overlay — `nav.tsx`,
   `mobile-menu.tsx`.
2. **Hero** — navy, tall, headline + sub + CTA (single) — `hero.tsx`.
3. **AI Employees** — white, the five priced role cards. This is the offer and it
   leads — `ai-employees.tsx`.
4. **Extra services** — `surface` (#F9FAFB), the website / app / content /
   visibility grid — `extras.tsx`.
5. **How it works** — white, four numbered steps — `how-it-works.tsx`.
6. **Team teaser** — `surface`, founders as credibility — never fabricated
   testimonials — `team-teaser.tsx`.
7. **Mission & vision** — white — `mission-vision.tsx`.
8. **CTA** — navy, centered, single strong CTA — `home-section-cta.tsx`
   (a translated wrapper around `section-cta.tsx`, which is what renders navy).
9. **Footer** — navy, four-column (logo+desc, roles, verticals, company) + copyright bar.

## Components (helper classes in `globals.css`)
- `.eyebrow` — 11px accent label.
- `.btn-primary` — accent fill, white text, 6px radius, `accent-hover` on hover.
- `.btn-secondary-white` — white fill, 1.5px accent border, accent text (on white sections).
- `.btn-secondary-navy` — transparent, 1.5px `white/40` border, white text (on navy sections).
- `.card` — white fill, 1px `line` border, 8px radius, `0 4px 16px rgba(0,0,0,.08)` hover shadow.
- `.icon-badge` — 40×40, `rgba(5,150,105,.1)` fill, accent icon.
- `.field` — `#F9FAFB` fill, `line` border, green focus ring `0 0 0 3px rgba(5,150,105,.1)`.

## Logo
- `public/rumi-logo-on-navy.png` — green wordmark on navy → **navy sections** (the footer). Baked navy is exactly `#0B1C36`, so it blends.
- `public/rumi-logo-on-white.png` — green wordmark on white → **white sections**, which since v2 includes the **nav**. Baked white is exactly `#FFFFFF`.
- Nav height 32–40px (`h-9`/`h-10`). Never stretch, recolor, rotate, or add effects.
- Both files were re-exported from the pixel-verified squares embedded in the v2
  brand doc (navy 3135², white 1254²) and cropped to a horizontal wordmark lockup
  so they read at nav size — **crop only, colors untouched** — then downscaled to
  **244×108**, three times the 36px (`h-9`) box they render in. A purpose-made
  horizontal lockup from Saba can drop-in replace these.
- Both are shipped with intrinsic `width`/`height` attributes so the bar and the
  footer column reserve the box before the bitmap decodes. **Any `<img>` carrying
  those attributes must also carry `w-auto` beside its height class** — the
  `width` attribute is a presentational hint that sets the used width, and
  Tailwind's preflight resets only `height`, so `h-9` on its own stretches the
  wordmark to the file's full pixel width. Pinned by `tests/e2e/mobile.spec.ts`.
- Favicons `src/app/icon.png` (192²) + `src/app/apple-icon.png` (180²) are the sun
  mark lifted untouched out of the navy file and centered on a `#0B1C36` square.
- `public/og-image.png` was regenerated on-brand — navy background, Inter, emerald
  accent — replacing the old amber-on-black card left over from the pre-Saba system.

## Messaging (Saba §10)
- Plain language, as if explaining to a small-business owner. No jargon.
- **Banned words:** leverage, ecosystem, enterprise-grade, unlock, seamless, cutting-edge, premium, revolutionize, synergy, scalable.

## Motion
- Minimal: hover states + transitions. Optional `.fade-in` on scroll-in sections.

## Rebuild status (branch `saba-brand-rebrand`)
- ✅ Foundation: tokens, Inter, logos, globals, this doc.
- ✅ Pilot: global chrome (nav, footer) + homepage.
- ⏳ Pending Saba sign-off on the homepage before rebuilding: team, schedule, industries, terms, privacy, book. (`/evaluate` has since been retired to a redirect, and `/services` was rebuilt on `feat/ai-employees-lead` — awaiting the same sign-off; see the Decisions Log.) Interior pages render transitionally until then; nothing merges to prod until the full rebuild is signed off.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-31 | Initial site — Next.js 15 + Tailwind + Geist, amber-400 on zinc-900 | Original premium-dark direction |
| 2026-06-29 | Homepage "be found in the AI era" positioning | Founder direction; multilingual moat + AI-discovery frame |
| 2026-07-06 | **Replace zinc/amber/Geist with Saba's locked white/navy/green/Inter system** | Saba brand spec; kills the unapproved amber accent. Homepage pilot on `saba-brand-rebrand`, gated on Saba sign-off before other pages. Same system rolls to rumiagent.com + rumi.marketing next. |
| 2026-07-09 | Drop secondary "Book a 15-min call" hero/footer CTA; hero is single-CTA | One dominant ask ("Request a free evaluation") instead of two competing CTAs. `/schedule` page and other entry points unchanged. |
| 2026-07-27 | **Homepage section order and background assignment changed — AWAITING SABA SIGN-OFF.** `PlatformPillars` is gone; the page is now Nav navy → Hero navy → AIEmployees white → Extras `surface` → HowItWorks white → TeamTeaser `surface` → MissionVision white → HomeSectionCTA navy → Footer navy (see Page structure above). | The offer changed: the five hireable AI-employee roles lead, and everything Rumi also builds and runs follows as "extra services". The white/`surface` alternation was re-dealt so the rhythm survives the two new sections. No token, font, radius or spacing value moved — this is section order and which locked fill each section gets. |
| 2026-07-27 | White-on-`accent` micro-text moved to `bg-accent-hover` (#047857). **Buttons unchanged.** Sites: `team-teaser.tsx` role pill, `how-it-works.tsx` step number, `team/page.tsx` role pill, `workplace/page.tsx` week numeral. | White on #059669 measures 3.77:1 — below the WCAG AA 4.5:1 floor for text at these sizes (11–14px). #047857 is already in the locked palette, so this stays inside the system rather than adding a colour. `.btn-primary` keeps white on accent: this doc blesses it (Typography table, "Button … white on accent") and buttons carry their own affordances. Accent-on-white hover states were left alone and are Saba's call. |
| 2026-07-27 | **Same WCAG row, the other direction: `.eyebrow` ON NAVY moved to `text-white/70`.** One site today — the hero eyebrow, `hero.tsx:27` (`className="eyebrow text-white/70"`). **(Superseded for the hero on 2026-08-04 — see below: the new navy makes plain `.eyebrow` pass, and the override was removed.)** **`.eyebrow` on white is UNCHANGED and remains an OPEN AA FAILURE — see the row below.** | `.eyebrow` carries `text-accent`, and accent (#059669) on navy (#1E293B) measures **3.88:1** — under the 4.5:1 floor for 11px text. `accent-hover` (#047857) is darker and therefore worse against navy, so the fix that worked for white-on-accent inverts here. `white/70` composites to #B9C0C4 on navy = **7.94:1**, passes AA and AAA, and is the treatment this doc already uses for text on navy (hero sub, footer columns) rather than a new value. Applied as a utility class beside `.eyebrow` because `globals.css` is LOCKED: Tailwind emits `utilities` after `components`, same specificity, so the later origin wins — verified in the compiled CSS (`.eyebrow` at byte 4694, `.text-white\/70` at 16483) and in the served HTML. |
| 2026-07-27 | **OPEN, UNRESOLVED — needs Saba. `.eyebrow` on white/`surface` sections fails WCAG AA.** accent (#059669) on white measures **3.77:1** against a 4.5:1 floor, at 11px — 29 of the 30 `.eyebrow` sites in `src/` (all but the hero, fixed above). **Not fixed in this pass.** **(Still open after brand v2.0 on 2026-08-04 — the hero row was superseded, this one was not; see below.)** | Fixing it properly means changing what `.eyebrow` *is*, and `src/app/globals.css` is locked (so is `tailwind.config.ts`). The two in-palette options both cost something Saba owns: `accent-hover` (#047857) on white measures 5.49:1 and passes, but darkens the brand's most-repeated accent moment on every page; `muted` passes but gives up the green entirely. Papering over it per-site with utility classes — the escape hatch used for the hero above, where there was exactly one site and no in-palette alternative — would mean ~30 overrides of a class whose whole purpose is to be one decision. Left visible and unfixed on purpose rather than half-fixed: it is a brand-system call, not a code call. |
| 2026-08-04 | **Brand Identity v2.0 adopted — the locked system is re-locked on new values.** navy `#1E293B` → **`#0B1C36`**; surface `#FEFCF7` → **`#F9FAFB`**. The nav is now **white** (white fill, `line` bottom border, `ink` links, accent hover — **since the adversarial row below, `accent-hover`** — and a `.btn-primary` CTA) with a full-screen navy mobile overlay. Logos re-exported from the v2 doc's embedded squares, favicons rebuilt from the sun mark on `#0B1C36`, and `og-image.png` regenerated on-brand. | Saba's v2.0 (July 2026, `rumi_ai_agency_brand_identity.html`) supersedes the original rebuild spec. v2 deepens the navy and kills the warm white: `surface` now shares its hex with `field` **on purpose** — v2 defines a single Surface value (`#F9FAFB`) covering card fills, form inputs and secondary sections. Editing `tailwind.config.ts` is normally forbidden; this is the sanctioned relock, not drive-by drift. `PALETTE` in `tests/unit/design-tokens.test.ts` is a Set, so the two identical values dedupe and its size drops 9 → 8 — the existing `>= 8` assertion still holds and was **not** weakened. |
| 2026-08-04 | **Hero eyebrow reverted from `text-white/70` back to plain `.eyebrow` (accent).** Undoes the 2026-07-27 hero override; `hero.tsx` now carries `className="eyebrow mb-4"` and no utility patch. **→ SUPERSEDED the same day by the post-review row below: this revert measured the accent against the BARE navy token, which is not the backdrop the hero paints. The override is back.** | The override existed only because accent (#059669) measured **3.88:1** on the old navy `#1E293B`. On the v2 navy `#0B1C36` the same accent measures **4.52:1** — over the 4.5:1 AA floor for 11px text. The workaround's whole justification was the failing ratio, so with the ratio fixed the spec's own accent eyebrow is restored rather than kept behind a patch. |
| 2026-08-04 | **STILL OPEN — `.eyebrow` on white remains a WCAG AA failure at 3.77:1.** Unchanged by v2 and still waiting on Saba. | The v2 navy fixed the eyebrow-on-navy case only; white did not move, so accent-on-white is still **3.77:1** against the 4.5:1 floor at 11px, across ~29 sites. v2 re-specifies emerald eyebrows on white, which means the ratio is a deliberate brand position rather than an oversight — so it stays open and stays Saba's call, exactly as the 2026-07-27 row left it. |
| 2026-08-04 | **Post-review fixes to the v2 chrome (pre-landing pass). No token, font, radius or spacing value moved.** (a) **Hero eyebrow override RESTORED** — `hero.tsx` is back to `className="eyebrow text-white/70 mb-4"`, superseding the revert row above. (b) **Logo and icon assets downscaled** to three times their render size — both wordmarks to h108 (nav/footer render at `h-9` = 36px), `icon.png` to 192², `apple-icon.png` to 180² — and `public/rumi-logo.png` (440 KB, zero references) deleted. (c) **OG URL versioned** to `/og-image.png?v=2` in `layout.tsx` and in all 12 pages that restate an openGraph/twitter images block; the file on disk is unchanged. (d) **Mobile bar:** the logo anchor is `shrink-0`; the bar's CTA is hidden below 390px **and** while the overlay is open (**user-approved** — the overlay's full-width CTA is how those visitors reach `/book`); both logos carry intrinsic `width`/`height`, and both therefore carry `w-auto` (see the Logo section — adding the attributes stretched the footer wordmark to 148×36 against its 81×36 natural until `w-auto` went in beside `h-9`). (e) **Active-link state** per the v2 spec's "links in `ink` with accent hover/active" — `usePathname()`, `text-accent` + `aria-current="page"`, with a prefix arm so a section stays lit on its own `/services/*` and `/industries/*` detail pages. **(Both halves revised by the adversarial row below: the colour is now `accent-hover` for AA, and the prefix arm no longer feeds `aria-current`.)** (f) **Overlay behaviours:** body-scroll lock, Escape to close, focus into the first link on open and back to the toggle on close, and the hamburger recoloured to the `muted` token. | (a) is the review's one real regression: the revert measured accent against the **bare** `navy` token (4.52:1), but `.hero-glow` — `rgba(5,150,105,.14)` — is painted directly under the eyebrow, and compositing it onto the navy takes the same pairing to **3.82:1** at the glow's peak, under the 4.5:1 AA floor. Even α=0.01 reads 4.47:1, so there is no point inside the glow that passes; `white/70` composites to **8.81:1** and is the treatment this doc already uses for text on navy. `design-tokens.test.ts` now computes the composite and asserts the override is present, so the bare-token reading cannot look right again. (b) the two wordmarks were shipping at ~10× their render size (81 KB + 86 KB) for a 36px box; corner pixels are now **pixel-pinned by test** against the `navy` token and pure white, because a resample that rings on the flat surround bakes a permanent off-brand fringe into the one image on every page. (c) scrapers key their preview cache on the image URL and hold it for months, and v2 replaced the card **in place** — without the bust, every link already shared keeps serving the old amber-on-black card. (d) the `<img>` is a flex child in a flex row and measured 23px wide against its 81px natural width at 320px, i.e. a visibly squashed wordmark; and below 390px the logo, language select, CTA and hamburger cannot share one 64px row. The bar sits at `z-50` above the overlay's `z-40`, so an un-hidden bar CTA floats **over** the overlay's own — two identical buttons on screen at once. A `mobile.spec.ts` at 375/414/320px now covers all of it, including the containing-block trap that any `transform`/`filter`/`backdrop-filter` on `<nav>` would re-open (this bar carried `backdrop-blur` until v2). |
| 2026-08-04 | **Adversarial-review round on the v2 chrome. No token, font, radius or type-size value moved.** (a) **Desktop nav links moved from `accent` to `accent-hover`** on both hover and active, and the active link additionally carries `font-semibold` where the rest carry `font-medium`. (b) **`aria-current="page"` is now exact-match only** (`pathname === href`) in both `nav.tsx` and `mobile-menu.tsx`; the `/services/*` prefix arm still drives the colour. (c) **The mobile overlay is hardened**: it closes itself when a `matchMedia("(min-width: 768px)")` listener reports the viewport has crossed into the `md` layout; Tab is trapped inside the whole `<nav>`; it declares `role="dialog"` + `aria-modal="true"`; and it carries `overscroll-contain`. (d) **`ServiceCard` now refuses to render the saving badge without a workload** beside it. (e) **The Farsi saving badge drops `tracking-eyebrow`** under `html[lang=fa]`. (f) **The nav bar's inset is `px-6 md:px-8 lg:px-12`** and the desktop link cluster's gap is `gap-3 lg:gap-6` — see the Layout note above. | (a) accent (#059669) on white is **3.77:1** at the links' 14px, under the 4.5:1 AA floor; `accent-hover` (#047857) is **5.48:1** and already in the locked palette — the same in-system move as the 2026-07-27 white-on-`accent` row, applied to the hover/active states that row explicitly left for Saba. (This is a state colour on the white nav, not `.eyebrow`, which stays open.) The weight is WCAG 1.4.1: colour may not be the sole carrier of "you are here". (b) both arms fed both outputs, so on `/services/ai-receptionist` the `/services` link *announced itself as the current page* while pointing elsewhere. (c) every element this component renders is `md:hidden`, so an iPad rotated past 768px with the menu open left the body-scroll lock applied, the page frozen, and both the close button and the element the focus-return branch targets `display:none`; an untrapped full-screen overlay hands the next Tab to the page underneath, which is the page it just froze; and `overflow:hidden` on `<body>` does not stop **touch** scroll-chaining on iOS Safari, which the overlay invites because its content is shorter than the viewport. (d) the badge and the "Covers …" pill rendered on independent conditions, and `??` does not fall back on `""` — one translation gap and "90% LESS THAN HIRING" ships with no comparator on the card, the exact discount-off-our-own-price reading the label was renamed to prevent. (e) Persian script is joined; 0.2em letter-spacing prises `۹۰٪ کمتر از استخدام` into loose glyphs (`uppercase` is a no-op there and was left alone). (f) **measured, not inferred**: at exactly 768 the Farsi row needs **663px** of bar against the **591px** `md:px-12` leaves beside the wordmark. It never overflowed — the document scroll width stayed 768 — because flexbox absorbs the deficit by wrapping, so three of the four links broke onto two lines inside the 64px bar and the cluster ran flush into the logo (0px clearance) from 768 up to ~855px. `gap-4` alone, and `md:px-8` alone, both still wrap; `md:px-8` + `gap-3` fits with **18px** to spare, and both revert to the spec's values at `lg`. English fits either way (570px needed, 21px clearance as shipped). Pinned by a 768px Farsi block in `mobile.spec.ts`. |

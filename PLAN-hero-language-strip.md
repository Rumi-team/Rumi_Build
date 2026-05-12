# Plan — Hero Language Strip

**Date:** 2026-05-10
**Branch:** `main`
**Approved mockup:** `~/.gstack/projects/intelligent-spence-7f3f71/designs/hero-language-strip-20260509/variant-A.png`
**Source:** /plan-design-review walkthrough

## Goal

Replace the standalone Farsi accent line in the rumi.build hero with a horizontal language strip of 14 native-script pills. The strip itself proves the "we speak 70+ languages" capability — body copy can stop listing languages. Clicking a non-English pill translates only the hero strings (headline + subhead + CTAs + trust ribbon) to that language. The existing LanguageBar section below the hero stays, retitled to lead with the U.S. Census stat instead of the capability claim.

## The strip — exact spec

**14 pills, in this order, separated by mid-dot (`·`):**

```
English · Español · 中文 · Tagalog · Tiếng Việt · العربية · 한국어 · Русский · Kreyòl · Français · Português · हिन्दी · فارسی · Italiano
```

Order is U.S. Census ACS 2022 most-spoken languages (English-first, then 13 most-spoken non-English at-home languages). Persian/Farsi is included as the founder language even though it ranks lower in ACS — kept for cultural fit.

**Pill states:**

| State | Spec |
|---|---|
| Active | `text-zinc-200 border-b border-amber-400 pb-0.5` |
| Inactive default | `text-zinc-500 border-b border-transparent pb-0.5` |
| Hover | `text-zinc-300` |
| Focus (keyboard) | `outline outline-2 outline-amber-400 outline-offset-2 rounded-sm` |
| Active + Hover | `text-zinc-100` (active state overrides) |

**Typography:**
- Default pills: Geist Sans, 14px regular
- Arabic (`العربية`) and Farsi (`فارسی`) pills: `font-vazirmatn` + `dir="rtl"` on the inner span — required for correct script rendering. Vazirmatn is already loaded in `src/app/layout.tsx`.
- Mid-dot separator: `text-zinc-700` (subtler than pills)

**Markup shape** (informative, not prescriptive):

```tsx
<nav aria-label="Language" className="relative">
  <ul className="flex items-center gap-3 overflow-x-auto md:overflow-visible scroll-snap-type-x snap-mandatory pb-2 md:pb-0">
    {LANGUAGES.map(({ code, label, rtl }, i) => (
      <li key={code} className="flex items-center gap-3 shrink-0 snap-start">
        {i > 0 && <span className="text-zinc-700" aria-hidden>·</span>}
        <button
          type="button"
          onClick={() => setLang(code)}
          aria-current={lang === code ? "true" : undefined}
          className={cn(
            "text-sm py-2 transition border-b pb-0.5",
            lang === code
              ? "text-zinc-200 border-amber-400"
              : "text-zinc-500 border-transparent hover:text-zinc-300",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2 rounded-sm"
          )}
        >
          <span lang={code} dir={rtl ? "rtl" : undefined} className={rtl ? "font-vazirmatn" : undefined}>
            {label}
          </span>
        </button>
      </li>
    ))}
  </ul>
  {/* Right-edge fade on mobile */}
  <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-zinc-900 md:hidden" aria-hidden />
</nav>
```

## Click behavior

Clicking a non-English pill translates only the **hero strings** (6 strings):

1. Headline
2. Headline accent ("From $499/mo.")
3. Subhead
4. Primary CTA label ("See pricing")
5. Secondary CTA label ("Book a free 15-min call")
6. Trust ribbon

74 languages × 6 strings = 444 translation strings. Lazy-load per-language JSON on click. Initial bundle ships English only.

**On click:**
1. Lazy-fetch `/locales/<lang>.json`
2. Update React state
3. `aria-live="polite"` region announces *"Hero translated to <native language name>."*
4. URL adds `?lang=<code>` so users can share localized links
5. If fetch fails → silent fallback to English

**Translation source:** seed with LLM translation, hand-review the top 12 (Spanish, Mandarin, Tagalog, Vietnamese, Arabic, Korean, Russian, Haitian Creole, French, Portuguese, Hindi, Persian) before launch. The other 62 can ship LLM-only with a known-quality caveat in the data file.

## What changes in the hero

**Removed:**
- Standalone Farsi accent line (`COPY.hero.farsiAccent`)
- The tagline pill (`COPY.hero.taglinePill` — "Qualified local customers in 70+ languages")
- Inline language list inside the subhead ("Spanish, Mandarin, Tagalog, Vietnamese...")
- Farsi parenthetical on the secondary CTA (`(تماس رایگان)`)

**Added:**
- Language strip above the headline (the spec above)

**Kept:**
- Big headline ("5–20 qualified local customers calling your store every month.")
- Amber price phrase ("From $499/mo.")
- Two CTAs
- Trust ribbon, with copy updated (see below)

**Updated copy:**

| Field | Before | After |
|---|---|---|
| `hero.sub` | "We deliver qualified local customers in any of 70+ languages — Spanish, Mandarin, Tagalog, Vietnamese, Arabic, Korean, Russian, Haitian Creole, French, Persian, Hindi, and 60+ more. The 68M U.S. residents your competitors lose to language barriers become your customers. Money-back guarantee if we under-deliver." | "We deliver qualified local customers from communities your competitors lose to language barriers. Money-back guarantee if we under-deliver." |
| `trustRibbon.line` | "Qualified local customers in 70+ languages, delivered straight to your phone. We charge per booked lead, not per campaign." | "Qualified local customers, delivered straight to your phone. We charge per booked lead, not per campaign." |

## LanguageBar section (below hero)

**Keep, retitle.** Heading shifts from a capability claim to a Census-stat anchor.

| Field | Before | After |
|---|---|---|
| eyebrow | "70+ languages, more customers" | "1 in 5 Americans" |
| heading | "We reach every customer in America — in their own language." | "1 in 5 Americans speak a language other than English at home." |
| sub | (current copy) | "That's 68 million customers most local businesses lose the moment a caller hits an English-only menu. We don't. Here are all 74 languages we deliver in." |
| footnote | (current copy) | unchanged |

The 74-pill grid becomes evidence behind the stat — "here are all of them" — rather than a redundant capability claim. The strip in the hero proves the message in 2 seconds; this section proves it exhaustively for people who scrolled.

## Files to change

| File | Change |
|---|---|
| `src/lib/data.ts` | Delete `COPY.hero.taglinePill`, `COPY.hero.farsiAccent`, `COPY.hero.ctaSecondaryFarsi`. Update `hero.sub` and `trustRibbon.line`. Update `LANGUAGE_BAR` (eyebrow/heading/sub). Add a new `HERO_STRIP_LANGUAGES` array (the 14 ordered codes + native labels). |
| `src/components/hero.tsx` | Remove Farsi accent JSX and CTA Farsi parenthetical. Mount `<LanguageStrip />` at top of the hero (above the headline). Wire `useTranslatedHero(lang)` hook to swap strings. |
| `src/components/language-strip.tsx` | **NEW.** The pill nav described above. |
| `src/components/language-bar.tsx` | Pull eyebrow/heading/sub from updated `LANGUAGE_BAR` constants — no structural change. |
| `src/lib/hero-i18n.ts` | **NEW.** Lazy loader for `/locales/<lang>.json`. Returns the 6 hero strings with English fallback. |
| `public/locales/<lang>.json` × 74 | **NEW.** Translation files. Seed via LLM; hand-review the top-12. |
| `src/app/page.tsx` | No change — `<Hero />` and `<LanguageBar />` already mounted. |
| `src/app/layout.tsx` | No change — Vazirmatn already loaded. |

## Mobile pattern (375px)

Horizontal scroll with `overflow-x-auto` + `scroll-snap-type: x mandatory`. Right-edge `bg-gradient-to-l from-zinc-900` fade hints at more pills. Touch target ≥44px via `py-2` (8px top + 8px bottom + ~28px line-height = 44px). Tested viewports: 375×667 (iPhone SE), 390×844 (iPhone 13), 768×1024 (iPad).

## Interaction states (full table)

| Element | Default | Hover | Focus | Active | Disabled |
|---|---|---|---|---|---|
| Strip pill | zinc-500 | zinc-300 | amber-400 ring | zinc-200 + amber underline | n/a (always enabled) |
| Hero text | English | n/a | n/a | switches to clicked lang | n/a |
| Page chrome (nav, footer) | English | n/a | n/a | **stays English** | n/a |

## Accessibility checklist

- [ ] `<nav aria-label="Language">` wraps the strip
- [ ] Each pill is `<button type="button">` with `aria-current="true"` when active
- [ ] `aria-live="polite"` announces translation switch
- [ ] Tab order: nav → language strip → hero CTAs (logical reading order)
- [ ] Arrow Left/Right traverses pills (roving tabindex)
- [ ] Enter and Space activate
- [ ] Focus ring: `outline outline-2 outline-amber-400 outline-offset-2` — visible on dark background
- [ ] Color contrast: zinc-500 (#71717A) on zinc-900 = 4.6:1 → passes WCAG AA for ≥18px text. Pills at 14px need bump to **zinc-400** (#A1A1AA, 5.6:1) → spec calls for zinc-500 but contrast-bump to zinc-400 if we keep 14px
- [ ] RTL: Arabic and Farsi pills use `dir="rtl"` on the inner span; surrounding flex stays LTR
- [ ] No motion preference: respect `prefers-reduced-motion` for the translation crossfade (instant swap if reduced)

## AI Slop guardrails (do not violate)

- ❌ No flag emojis (🇺🇸 🇪🇸 🇨🇳)
- ❌ No icons or globe glyphs next to pills
- ❌ No solid pill backgrounds or borders
- ❌ No `text-align: center` on the strip
- ❌ No purple/violet gradient
- ❌ No "Translate" button — pills are the action
- ✅ Native scripts only
- ✅ Mid-dot separators (text, not SVG)
- ✅ Amber-400 used once (underline only)
- ✅ Geist Sans + Vazirmatn for RTL

## NOT in scope

| Deferred | Why |
|---|---|
| Full-page translation of /pricing, /team, /industries, etc. | Hero-only ships in 1 day; full i18n is 3–5 days. Revisit after we see CTR on the strip. |
| Auto-rotating headline | Adds gimmick risk and a11y complexity. Static translation on click is sturdier. |
| Browser language auto-detection on first visit | Slight risk of guessing wrong (Mandarin speakers reading English fine). Make user choose. Maybe add later with `?lang=auto` opt-in. |
| URL-localized routes (`/es/pricing`) | Out of scope until full-page i18n. The `?lang=` query param is enough for hero-only. |
| Translation QA tooling | Manual review of top-12 is enough for v1. |
| `hreflang` meta tags | Needed once /pricing translates; not needed for hero-only. |

## What already exists

- [src/components/language-bar.tsx](src/components/language-bar.tsx) — 74-pill grid, retitle only
- [src/lib/data.ts](src/lib/data.ts) — `REALTIME_LANGUAGES` array (74 entries) is the source for the LanguageBar; the hero strip subsets the first 14 entries (after reordering to put Italian last)
- `font-vazirmatn` already configured in [src/app/layout.tsx](src/app/layout.tsx) for RTL scripts
- DESIGN.md tokens: `zinc-900` bg, `amber-400` accent, Geist Sans, generous spacing — all reused

## Build sequence (when implementing)

1. Update `src/lib/data.ts` — copy changes + new `HERO_STRIP_LANGUAGES` constant
2. Write `src/lib/hero-i18n.ts` — translation loader
3. Generate `public/locales/<lang>.json` files (LLM batch + top-12 hand review)
4. Build `src/components/language-strip.tsx`
5. Wire into `src/components/hero.tsx` (rip out Farsi line + CTA Farsi paren, mount strip, hook translations)
6. Update LanguageBar copy via constants (no component change)
7. Test on 375 / 768 / 1280 viewports
8. Test keyboard nav + screen reader (VoiceOver: Cmd+F5)
9. `pnpm build` + `pnpm dev` smoke test

## Decisions log

| # | Decision | Choice |
|---|---|---|
| D1 | Review scope | All 7 passes |
| D2 | Mockup variant | A — faithful, left-aligned |
| D3 | Tagline pill vs strip | Drop the pill, strip leads |
| D4 | Pill click behavior | Translate hero only |
| D5 | Trust ribbon language mention | Drop "in 70+ languages" |
| D6 | Mobile pattern | Horizontal scroll + edge fade |
| D7 | Strip language set/order | ACS most-spoken in U.S. |
| D8 | LanguageBar section | Keep, retitle to Census-stat anchor |

## Completion summary

| Dimension | Score before | Score after |
|---|---|---|
| Information Architecture | 4 | 9 |
| Interaction State Coverage | 3 | 9 |
| User Journey & Emotional Arc | 5 | 9 |
| AI Slop Risk | 8 | 9 |
| Design System Alignment | 8 | 10 |
| Responsive & A11y | 2 | 9 |
| Unresolved Decisions | 5 open | 0 open |
| **Overall** | **4/10** | **9/10** |

## Approved Mockups

| Screen | Mockup path | Direction |
|---|---|---|
| Hero with language strip | `~/.gstack/projects/intelligent-spence-7f3f71/designs/hero-language-strip-20260509/variant-A.png` | Faithful to reference: 14 native-script pills above headline, mid-dot separators, English underlined in amber, left-aligned hero |

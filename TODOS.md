# TODOS

## Booking / Cal.com

### Split the free intro call from the paid strategy call
**Priority:** P1
`/schedule` and the post-payment `/book/success` both book the same Cal.com event (`rumi-app/30-min-meeting`), so the calendar cannot tell a paid booking from a free one and `/schedule` remains a guessable no-payment path to the paid call. Fix: create a second Cal.com event type for the intro call (requires Cal.com dashboard access), add an `INTRO_CAL_LINK` constant, and point `/schedule` at it. Noted on branch `feat/ai-employees-lead`; copy already de-emphasizes "free".

## Deploy / Vercel

### Clean up project env vars
**Priority:** P1
`RESEND_API_KEY`, `EVALUATION_TO`, `EVALUATION_FROM` are dead since `/api/evaluate` was deleted (v1.0.0.0) — remove them from the Vercel project. Also confirm `NEXT_PUBLIC_SITE_URL` is set: `src/lib/stripe.ts` falls back to a hardcoded `https://rumi.build` for the Stripe `success_url`, and the domain split between this site and the sibling repo is still unresolved.

### Smoke-test the edge redirects after deploy
**Priority:** P2
The 26 `vercel.json` redirects run only at the Vercel edge — `next start`/Playwright never exercise them. After the next production deploy, run a `curl -sI` matrix over the legacy URLs (`/pricing`, `/sprint`, `/deposit`, `/automation`, `/evaluate`, `/audit`, `/chief-of-staff`, old `/services/*` slugs) and confirm one-hop 308s to live pages.

## Design (awaiting Saba — DESIGN.md Decisions Log has details)

### Rule on the open WCAG item and deferred visual calls
**Priority:** P2
Open set from the v1.0.0.0 review, all logged in DESIGN.md: `.eyebrow` accent-on-white contrast (3.77:1 at 11px, ~29 sites — globals.css is locked); hover-state contrast dip on navy links; FA badge letter-spacing on joined Persian script; emoji icons vs accent-colored icon set on the role cards; sign-off on the new homepage section order and background assignments.

## i18n

### Decide whether Farsi extends beyond the homepage
**Priority:** P3
The homepage is fully translated EN/FA; `/services` and the role pages are English pinned LTR (deliberate, documented in `services/page.tsx`). The real fix, if Farsi is a supported locale for the offer pages, is locale-routed pages (`/fa/...`) with per-locale dictionaries — also resolves the first-paint language flash (language restore is a post-hydration effect).

## Completed

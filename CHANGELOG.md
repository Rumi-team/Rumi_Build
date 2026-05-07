# Changelog

All notable changes to rumi.build are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

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

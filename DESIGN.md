# Design System — rumi.build

## Product Context
- **What this is:** Marketing site for a done-for-you, multilingual-first web-presence agency
- **Who it's for:** Southern California small-business owners (studios, salons, instructors, retailers, contractors) losing customers to language barriers and weak online presence
- **Space/industry:** Done-for-you local marketing + web presence (website + AI chatbot + customer list/email + events + on-site payments), built multilingual-first
- **Project type:** Marketing site with a free-evaluation intake, pricing, and booking flow
- **Positioning:** "Be found in the AI era." We build and run your whole web presence so the customers your competitors lose to language barriers find you — and get answered — in their own language. Entry multilingual lead-gen plans remain available.

## Aesthetic Direction
- **Direction:** Premium dark, developer-tool-meets-consulting-firm
- **Decoration level:** Minimal — typography and spacing do the work, no decorative elements
- **Mood:** Confident and technical without being cold. Approachable to non-technical SMB owners.
- **Reference sites:** Vercel (dark premium), Linear (clean utility), The Gradient (agency authority)

## Typography
- **Display/Hero:** Geist Sans Bold/Black — geometric, modern, reads 'technical' without being cold
- **Body:** Geist Sans Regular/Medium — clean, readable at all sizes
- **UI/Labels:** Geist Sans Medium, uppercase tracking-widest for overline labels
- **Data/Pricing:** Geist Mono — crisp numeric alignment, pricing tags, stats
- **Code:** Geist Mono
- **Loading:** `geist` npm package (self-hosted via next/font)
- **Scale:** xs(12px) sm(14px) base(16px) lg(18px) xl(20px) 2xl(24px) 3xl(30px) 4xl(36px) 5xl(48px) 6xl(60px)

## Color
- **Approach:** Restrained — amber accent is rare and meaningful, everything else is zinc
- **Accent — Amber:** amber-400 (#FBBF24) — CTAs, badges, highlights, overline labels
- **Background:** zinc-900 (#18181B) — primary dark surface
- **Surface:** zinc-800/30 — cards, elevated surfaces
- **Border:** zinc-700 (#3F3F46) — card borders, dividers
- **Text Primary:** zinc-200 (#E4E4E7)
- **Text Secondary:** zinc-400 (#A1A1AA)
- **Text Muted:** zinc-500 (#71717A)
- **Dark mode:** Always dark. No light mode toggle needed.

## Spacing
- **Base unit:** 4px (Tailwind default)
- **Density:** Generous — consulting pages need breathing room to feel premium
- **Section padding:** py-20 (80px) standard, py-28 (112px) for hero
- **Card padding:** p-6 (24px) standard
- **Content max-width:** max-w-4xl (896px) for text sections, max-w-6xl (1152px) for grids

## Layout
- **Approach:** Single-column centered content with grid breakouts for cards
- **Grid:** Single column mobile, 2-column tablet, 3-column desktop for service/vertical cards
- **Max content width:** 896px (text), 1152px (grids)
- **Border radius:** rounded-lg (8px) for buttons/inputs, rounded-xl (12px) for cards, rounded-full for badges/avatars

## Motion
- **Approach:** Minimal-functional — hover states and transitions only
- **Easing:** transition (Tailwind default ease)
- **Duration:** Standard Tailwind transition duration
- **Hover patterns:** bg color shift on buttons, border-color shift on cards

## Service Categories
Based on market research (April 2026), ordered by margin and demand:
1. **Workflow Automation** — 75-85% margins, $2.5K-$15K setup + retainer
2. **RAG Knowledge Systems** — 70-85% margins, $8K-$45K implementation
3. **Voice AI Agents** — 60-75% margins, $250-$2K/mo recurring
4. **Agentic AI Implementation** — emerging mega-category, $5K-$50K projects
5. **Web & Mobile Apps** — AI-native applications, custom scope
6. **Document Processing** — 70-85% margins, extremely sticky
7. **AI Analytics Dashboards** — $8K-$30K implementation
8. **AI Strategy & Compliance** — EU AI Act deadline Aug 2026
9. **AI Marketing & SEO** — 20-50% premium over traditional

## Target Verticals
1. **Home Services** — 500K+ businesses, 78% hire first responder
2. **Healthcare Clinics** — 250K+ practices, $150B lost to no-shows
3. **Restaurants** — 660K+ businesses, 86% AI-comfortable
4. **Legal** — 450K firms, AI client intake + contracts
5. **Accounting** — AI adoption 9% to 41% in one year
6. **Construction** — 750K firms, 10x faster estimating

## Key URLs
- **Booking:** https://cal.com/rumi.team/30min
- **Domain:** https://rumi.build
- **Vercel project:** linked via .vercel directory

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-31 | Initial site created | Next.js 15 + Tailwind + Geist font |
| 2026-03-31 | Geist Sans + Geist Mono | Modern, geometric, self-hosted via npm — perfect for technical agency |
| 2026-03-31 | Amber-400 accent on zinc-900 | Premium dark theme standard for AI/dev tools, amber adds warmth |
| 2026-04-03 | Team page expanded to full subpage | Design consultation: services, verticals, stats, proof-of-work added |
| 2026-04-03 | 9 service categories defined | Based on SMB AI market research — margin, demand, lean-team fit |
| 2026-04-03 | 6 industry verticals selected | Largest addressable markets with clearest ROI narratives |
| 2026-06-28 | Homepage repositioned to "be found in the AI era" done-for-you presence | Founder decision (overrode unanimous autoplan "augment" rec); new hero leads with the multilingual moat + visibility frame, platform shown as done-for-you service (not self-serve software) |
| 2026-06-28 | Primary CTA → free evaluation (`/evaluate`) | Founder requirement; intake captures current site + needs, posts to retention backend; "Book a 15-min call" is now secondary |
| 2026-06-28 | "donations" → "tips / contributions" | For-profit audience; avoids nonprofit/tax-receipt implication (autoplan UC-2) |
| 2026-06-28 | Amber kept rare | Reused zinc/amber system; reserved amber for CTAs + accents, pillar icons stay zinc-toned tiles |
| 2026-06-29 | Hero re-topiced to "Stop being invisible in the digital world" + AI-discovery lead | Founder direction; emotional driver = fear of being un-findable as customers shift to asking ChatGPT/Claude/Perplexity who to hire. Multilingual moat kept as supporting trust line + chatbot pillar |
| 2026-06-29 | Pillars expanded to website + mobile app + social media + "Found by AI engines" | Founder added mobile app, social management, and AI-engine discoverability (real capability — site already ships llms.txt). Original CRM/events/payments consolidated into one card to keep the grid tight (6 pillars) |

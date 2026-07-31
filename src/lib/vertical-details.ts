// ── The long-form copy for the five industry pages ──
//
// WHY THIS IS ITS OWN MODULE. src/components/footer.tsx is a client component
// and it imports VERTICALS to build the industries column, which means every
// byte reachable from that array is compiled into the client bundle — on every
// route, because the footer renders on every page. The four fields below are
// rendered ONLY by the server-rendered /industries/[slug] page, and they were
// costing several KB of gzip on the homepage, the booking page, and every other
// route that never shows a word of them.
//
// Splitting the record out is what actually removes them: a derived projection
// (`VERTICALS.map(v => ({ slug, name }))`) still imports the fat array, so the
// bundler keeps it. The data has to physically live somewhere the client graph
// does not reach.
//
// KEEP THIS IMPORTED ONLY BY THE INDUSTRIES PAGES. src/lib/data.ts must not
// import it back, or the split is undone silently — the footer would pull it in
// through the same edge it pulls VERTICALS through.
//
// Every string here is user-facing copy and is walked by the tone rule
// (tests/unit/tone.test.ts) and the empty-string check
// (tests/unit/copy-invariants.test.ts), the same as data.ts.

import { VERTICALS } from "./data";

// The ROI box says the same thing on all five industry pages, because the answer
// does not vary by industry: the roles are priced off volume, and everything
// else is scoped on the call. It was pasted verbatim into five `roiData` fields,
// which is five places for a pricing edit to land and four places for it to be
// forgotten — the "$300/mo" in it is the site's headline number.
export const ROI_NOTE =
  "AI employee roles start from $300/mo — about a tenth of what that work costs today. We set the exact number on the call, once we have seen your volume. A website, an app, or a content plan is scoped there too, because what it costs depends on what you need built.";

export interface VerticalDetail {
  description: string;
  painPoints: string[];
  solutions: string[];
  roiData: string;
}

export const VERTICAL_DETAILS: Record<string, VerticalDetail> = {
  "real-estate": {
    description:
      "LA's real estate buyers speak more than English — a lot of qualified buyers only trust an agent who can talk to them in their own language. We give any agent access to Persian- and English-speaking buyers, pre-qualified, with budget and photos captured before they walk in. Every lead lands directly on your phone with the context you need to close.",
    painPoints: [
      "Zillow and Redfin leads go to whoever responds first, not who fits the buyer best",
      "Community referrals are uneven and slow to compound into pipeline",
      "Generic agencies do not know Persian-American clients' priorities (commute, schools, neighborhoods)",
      "Lead quality varies wildly: many tire-kickers, few qualified buyers ready to tour",
    ],
    solutions: [
      "Multilingual landing page with your active listings and neighborhood expertise",
      "Targeted local ads to Persian- and English-speaking buyers in your service area",
      "Lead form pre-qualifies budget range, timeline, bedrooms, and preferred neighborhoods",
      "Instant phone notification with full lead context, plus a weekly pipeline report",
    ],
    roiData: ROI_NOTE,
  },
  curtains: {
    description:
      "Curtain and drapery retail runs on word of mouth, in-home consultations, and trust. We bring you local neighbors — Persian- or English-speaking — who want a free measurement at your store, with photos and budget range captured up front.",
    painPoints: [
      "Family member runs Instagram sporadically with no analytics",
      "Word of mouth is slow and uneven across the community",
      "Local agencies do not speak Farsi or know the diaspora",
      "No system to know which leads showed up and which didn't",
    ],
    solutions: [
      "Bilingual landing page with photos of your inventory and storefront",
      "Targeted Instagram and Telegram campaigns to your local Persian community",
      "Lead form captures name, phone, city, curtain type, budget — instant phone notification",
      "Weekly status report: how many leads, who booked, who closed",
    ],
    roiData: ROI_NOTE,
  },
  rugs: {
    description:
      "Persian rug and home goods retail is high-trust, in-person, often family-run. We bring you Persian-speaking buyers actively shopping for rugs in your area, with quote requests and showroom visits booked through your phone.",
    painPoints: [
      "Browsers rarely become buyers without a relationship",
      "Online competitors with no inventory undercut your prices",
      "Walk-ins are concentrated on weekends only",
      "Hard to track which marketing actually delivers customers",
    ],
    solutions: [
      "Showroom-visit booking flow with photo previews of your inventory",
      "Persian-language Instagram reels showing real pieces and prices",
      "Targeted local ads to multilingual buyers shopping for home goods",
      "Lead routing direct to your phone within minutes",
    ],
    roiData: ROI_NOTE,
  },
  beauty: {
    description:
      "Persian-speaking beauty and salon clients want a stylist who understands their hair, their language, and their style. We bring local Persian-speaking neighbors directly to your booking calendar.",
    painPoints: [
      "Slow weeks because no one knows you exist outside your block",
      "Generic agencies do not understand Persian beauty culture",
      "No-shows hurt revenue and you have no follow-up system",
      "Repeat customers are everything but you have no retention engine",
    ],
    solutions: [
      "Booking-first landing page in English with Farsi accent",
      "Local Persian community Instagram and Telegram outreach",
      "Lead form pre-qualifies service type and time-of-day preference",
      "Weekly report on bookings, no-shows, and follow-up touchpoints",
    ],
    roiData: ROI_NOTE,
  },
  "home-services": {
    description:
      "Plumbers, HVAC techs, contractors, and handyman services know their local communities. We help you reach more of them, faster, with quote requests routed straight to your phone — in Persian or English.",
    painPoints: [
      "Phone rings unevenly; you miss calls during jobs",
      "Word-of-mouth pipeline can't scale without a system",
      "Generic local agencies don't get Persian-diaspora trust signals",
      "Every missed call is hundreds of dollars walking to a competitor",
    ],
    solutions: [
      "Quote-request landing page in English with Farsi accent",
      "Targeted local ads to Persian-speaking homeowners by service type",
      "Lead form captures address, service type, urgency, and photos",
      "Instant phone notification with full lead context, plus weekly status report",
    ],
    roiData: ROI_NOTE,
  },
};

// A vertical without a detail record renders an industry page with an empty
// body, and the type above (`Record<string, …>`) will not catch it — the slugs
// live in the other module. This is a build-time check, not a test-time one:
// `VERTICALS` is imported here anyway (type-only would not run it), and an
// industry page that resolves to `undefined` should fail loudly at the first
// request rather than render three empty <ul>s.
for (const vertical of VERTICALS) {
  if (!VERTICAL_DETAILS[vertical.slug]) {
    throw new Error(
      `VERTICAL_DETAILS is missing "${vertical.slug}" — /industries/${vertical.slug} would render an empty page.`
    );
  }
}

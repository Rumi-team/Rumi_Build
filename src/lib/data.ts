// ── Single source of truth for all site content ──

export const CALENDLY_URL = "https://cal.com/rumi.team/15min";

// Slug used by the inline Cal.com embed (https://cal.com/<CAL_LINK>)
export const CAL_LINK = "rumi.team/15min";

export const SUPPORT_EMAIL = "support@rumi.build";

// ── Customer-facing copy (English-primary, Farsi accent layer) ──
// Saba reviews and rewrites every Farsi line Farsi-first before launch.
// English is the working language for the site; Farsi accents signal cultural fit only.

export const COPY = {
  hero: {
    taglinePill: "Local growth for Iranian-American businesses",
    headline: "5–20 qualified local customers calling your store every month.",
    headlineAccent: "From $499/mo.",
    sub: "We're an Iranian-American team running targeted local campaigns in Persian, English, and Spanish. Every interested customer goes straight to your phone with photos, contact, and budget. Money-back guarantee if we under-deliver.",
    farsiAccent: "هر ماه ۵ تا ۲۰ مشتری به فروشگاه شما زنگ می‌زنند.",
    ctaPrimary: "See pricing",
    ctaPrimaryHref: "/pricing",
    ctaSecondary: "Book a free 15-min call",
    ctaSecondaryHref: "/schedule",
    ctaSecondaryFarsi: "تماس رایگان",
  },
  trustRibbon: {
    line: "Iranian-American team. Persian, English, and Spanish. We charge per lead, not per campaign.",
  },
  footer: {
    farsiGreeting: "ما فارسی صحبت می‌کنیم. درخواست تماس به فارسی.",
    farsiGreetingTranslation: "We speak Farsi. Request your call in Farsi if you prefer.",
  },
} as const;

// ── Team ──

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  school: string;
  experience: string[];
}

export const TEAM: TeamMember[] = [
  {
    name: "Dr. Ali Naeini",
    role: "Chief Executive Officer",
    photo: "/team-ali.jpeg",
    school: "",
    experience: [
      "Iranian-American. Led products serving 100M+ users at Business Insider and Spotter.",
      "Now focused on local Iranian-diaspora businesses across North America.",
      "PhD @ UC Berkeley & Merced.",
    ],
  },
  {
    name: "Saba Fazel",
    role: "Chief Product Officer",
    photo: "/team-saba.jpeg",
    school: "",
    experience: [
      "Talks to merchants in Farsi every week. Builds the offer that actually closes.",
      "Owns customer development, sales conversations, and weekly check-ins with active customers.",
      "Data Science @ UCLA.",
    ],
  },
  {
    name: "Parnian Fazel",
    role: "Chief Technology Officer",
    photo: "/team-parnian.jpeg",
    school: "",
    experience: [
      "Builds the lead-routing systems that get every customer to your phone in under a minute.",
      "Native Farsi speaker. Ships end-to-end: architecture, backend, infrastructure, deployment.",
      "MSc Machine Learning @ Imperial College London.",
    ],
  },
];

// ── Product (single productized offer; replaces the legacy 3-Chief services menu) ──

export interface Service {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
  useCases: string[];
  relatedVerticals: string[];
  href?: string;
}

// Internal name for this offer is "Persian Lead Engine" (see design doc).
// Buyer-facing copy stays plain and outcome-led; no internal-product naming on the site.
// We lead on the Persian-speaking wedge and deliver English- and Spanish-speaking
// customers too — the Iranian-American team gives us community access generic
// agencies cannot replicate, and that same team can run multilingual campaigns
// across the languages real local customers actually use.
export const SERVICES: Service[] = [
  {
    slug: "persian-leads",
    name: "Qualified local customers, delivered",
    icon: "📞",
    tagline:
      "5–20 qualified local customers calling your store every month — Persian, English, or Spanish. Fixed price, money-back guarantee.",
    description:
      "We're an Iranian-American team that runs targeted local campaigns in Persian, English, and Spanish. We build a multilingual landing page for your business, run Instagram and Persian Telegram-channel outreach, and route every interested customer directly to your phone with photos, contact, and budget. You close. We charge per lead, not per campaign.",
    features: [
      "Multilingual landing page (Persian, English, Spanish) for your business",
      "Targeted Instagram campaigns plus Persian Telegram-channel outreach",
      "Every interested customer routed straight to your phone within minutes",
      "Lead status tracker (new, contacted, appointment, won, lost) shared with you weekly",
      "Money-back guarantee if we deliver fewer than 60% of promised leads in month one",
    ],
    useCases: [
      "Real estate agent: pre-qualified buyer and seller leads with budget, timeline, and neighborhood preferences",
      "Curtain & drapery retailer: free in-home measurement appointments booked at your store",
      "Rug and home goods shop: showroom visits and quote requests from local buyers",
      "Beauty salon and spa: appointment bookings from your local community",
      "Home services contractor: quote requests with photos, address, and budget range",
    ],
    relatedVerticals: ["real-estate", "curtains", "rugs", "beauty", "home-services"],
  },
];

// ── Voice AI Multilingual (legacy — kept for backward compatibility on existing pages) ──

export const VOICE_AI_LANGUAGES = [
  "Arabic",
  "Armenian",
  "Chinese (Mandarin)",
  "Chinese (Cantonese)",
  "English",
  "Farsi/Persian",
  "Filipino/Tagalog",
  "French",
  "German",
  "Greek",
  "Gujarati",
  "Hebrew",
  "Hindi",
  "Indonesian",
  "Italian",
  "Japanese",
  "Korean",
  "Malay",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Spanish",
  "Swahili",
  "Tamil",
  "Telugu",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Vietnamese",
];

export const VOICE_AI_MULTILINGUAL = {
  heading: "Speak Your Customer’s Language",
  autoDetect:
    "Our AI detects the caller’s language within the first 2–3 seconds and switches seamlessly. No menu prompts, no ‘press 2 for Spanish.’ The caller hears their language from the first word.",
  stat: "55%+",
  statLabel: "of LA County residents speak a non-English language at home",
  source: "U.S. Census Bureau, QuickFacts",
  supporting:
    "Research shows language barriers reduce appointment access and patient adherence. A caller who hears their own language is more likely to book, show up, and come back.",
};

// ── Industry Verticals (Iranian-diaspora retail focus) ──

export interface Vertical {
  slug: string;
  name: string;
  stat: string;
  tagline: string;
  description: string;
  painPoints: string[];
  solutions: string[];
  roiData: string;
  relatedServices: string[];
}

export const VERTICALS: Vertical[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    stat: "Trust-driven, community-led local market",
    tagline: "More qualified buyer and seller leads from your community",
    description:
      "Persian-American real estate runs on trust, language, and community referrals. We bring you qualified Persian-, English-, and Spanish-speaking buyers and sellers, pre-screened by neighborhood, budget, and timeline. Every lead lands directly on your phone with the context you need to close.",
    painPoints: [
      "Zillow and Redfin leads go to whoever responds first, not who fits the buyer best",
      "Community referrals are uneven and slow to compound into pipeline",
      "Generic agencies do not know Persian-American clients' priorities (commute, schools, neighborhoods)",
      "Lead quality varies wildly: many tire-kickers, few qualified buyers ready to tour",
    ],
    solutions: [
      "Multilingual landing page with your active listings and neighborhood expertise",
      "Targeted local ads to Persian-, English-, and Spanish-speaking buyers in your service area",
      "Lead form pre-qualifies budget range, timeline, bedrooms, and preferred neighborhoods",
      "Instant phone notification with full lead context, plus a weekly pipeline report",
    ],
    roiData:
      "Subscription tiers from $499/month for 5 qualified leads. Book a free 15-min call to start.",
    relatedServices: ["persian-leads"],
  },
  {
    slug: "curtains",
    name: "Curtains & Drapery",
    stat: "Local appointment-driven retail",
    tagline: "More in-home measurement bookings, in your language",
    description:
      "Curtain and drapery retail in the Iranian-diaspora community runs on word of mouth, in-home consultations, and trust. We bring you Persian-speaking neighbors who want a free measurement at your store, with photos and budget range captured up front.",
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
    roiData:
      "Sprint pricing: $750 setup plus $750 after the first 5 qualified leads, or $1,200 flat upfront. Book a free 15-min call to start.",
    relatedServices: ["persian-leads"],
  },
  {
    slug: "rugs",
    name: "Rugs & Home Goods",
    stat: "Local showroom-driven retail",
    tagline: "More showroom visits and quote requests from your community",
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
      "Targeted local ads to Iranian-diaspora buyers shopping for home goods",
      "Lead routing direct to your phone within minutes",
    ],
    roiData:
      "Subscription tiers from $499/month for 5 qualified leads. Book a free 15-min call to start.",
    relatedServices: ["persian-leads"],
  },
  {
    slug: "beauty",
    name: "Beauty & Salon",
    stat: "Appointment-driven service retail",
    tagline: "More Persian-speaking clients in your chair every week",
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
    roiData:
      "Subscription from $499/month or one-time sprint at $1,200. Book a free 15-min call to start.",
    relatedServices: ["persian-leads"],
  },
  {
    slug: "home-services",
    name: "Home Services",
    stat: "Quote-driven local service",
    tagline: "More quote requests from Persian-speaking homeowners in your area",
    description:
      "Persian-owned plumbers, HVAC techs, contractors, and handyman services already know the community. We help you reach more of them, faster, with quote requests routed straight to your phone.",
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
    roiData:
      "Subscription from $499/month or one-time sprint at $1,200. Book a free 15-min call to start.",
    relatedServices: ["persian-leads"],
  },
];

// ── Portfolio ──

export interface PortfolioItem {
  label: string;
  title: string;
  description: string;
  url: string;
  stat: string;
  statLabel: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    label: "Local lead generation",
    title: "Persian curtain retailer — pilot in progress",
    description:
      "Founding-customer pilot launching Q2. Bilingual landing page, targeted local campaigns, and a weekly lead report. We'll publish the numbers as they land.",
    url: "/pricing",
    stat: "Pilot",
    statLabel: "founding-customer story",
  },
  {
    label: "Voice AI + Web + iOS",
    title: "Rumi — AI Coaching Platform",
    description:
      "Full-stack AI coaching platform with voice agent, real-time sessions, and personalized progress tracking. Deployed across web and iOS.",
    url: "https://www.rumi.team",
    stat: "iOS + Web",
    statLabel: "platforms deployed",
  },
];

// ── Helpers ──

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getVerticalBySlug(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}

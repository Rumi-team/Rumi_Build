// ── Single source of truth for all site content ──

export const CALENDLY_URL = "https://cal.com/rumi.build/15min";

// Slug used by the inline Cal.com embed (https://cal.com/<CAL_LINK>)
export const CAL_LINK = "rumi.build/15min";

export const SUPPORT_EMAIL = "support@rumi.build";

// ── Customer-facing copy (English-primary, Farsi accent layer) ──
// Saba reviews and rewrites every Farsi line Farsi-first before launch.
// English is the working language for the site; Farsi accents signal cultural fit only.

export const COPY = {
  hero: {
    overline: "Southern California · Be found in the AI era",
    headline: "Stop being invisible in the digital world.",
    headlineAccent: "In the AI era, you can't afford it.",
    sub: "More and more customers don't just Google anymore — they ask ChatGPT, Claude, and Perplexity who to hire. If AI doesn't know your business exists, you're invisible to them. We build your website, mobile app, and social media, then make all of it readable to the AI engines — so when someone asks AI for your service, you're the answer.",
    ctaPrimary: "Request a free evaluation",
    ctaPrimaryHref: "/evaluate",
    ctaSecondary: "Book a 15-min call",
    ctaSecondaryHref: "/schedule",
  },
  trustRibbon: {
    line: "Plus an AI chatbot that answers every visitor in their own language and captures the lead — 56% of LA County speaks one other than English.",
  },
  footer: {
    farsiGreeting: "ما فارسی صحبت می‌کنیم. درخواست تماس به فارسی.",
    farsiGreetingTranslation: "We speak Farsi. Request your call in Farsi if you prefer.",
  },
} as const;

// ── Platform pillars (what we build and run — done-for-you service framing) ──
// These are capabilities Rumi builds and operates FOR a client. Copy is
// deliberately service-framed ("we build / we run / we set up"), never
// "log in and use" — the software is delivered as an agency service, not a
// self-serve SaaS product the visitor signs up for.

export interface Pillar {
  icon: string;
  name: string;
  tagline: string;
}

export const PILLARS: Pillar[] = [
  {
    icon: "🌐",
    name: "A modern website",
    tagline:
      "Fast, mobile, built to convert — and structured so search engines and AI engines can read it.",
  },
  {
    icon: "📱",
    name: "A mobile app",
    tagline:
      "Your business in your customers' pocket. We design, build, and ship it to the App Store and Google Play.",
  },
  {
    icon: "📣",
    name: "Social media, managed",
    tagline:
      "We run your Instagram, TikTok, and the rest — content, posting, and replies — so you stay visible without the daily grind.",
  },
  {
    icon: "🤖",
    name: "Found by AI engines",
    tagline:
      "We make your site and content readable and citable by ChatGPT, Claude, and Perplexity — so when customers ask AI who to hire, your business comes up.",
  },
  {
    icon: "💬",
    name: "An AI chatbot in every language",
    tagline:
      "A 24/7 front desk that answers visitors in their own language, captures the lead, and hands complex requests to you.",
  },
  {
    icon: "🧰",
    name: "Customers, events & payments",
    tagline:
      "Manage your customer list and email, sell event tickets, and take payments, tips, and contributions on your own site.",
  },
];

// ── How it works (3 steps — lifted out of the component so copy lives here) ──

export interface HowItWorksStep {
  num: number;
  title: string;
  desc: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    num: 1,
    title: "Free evaluation",
    desc: "Tell us about your business, your current site, and the customers you want more of — English, Farsi, or Spanish. We map where customers are slipping past you today.",
  },
  {
    num: 2,
    title: "We build and launch",
    desc: "We build your multilingual site and AI front desk, wire up your customer list, events, and on-site payments, and get it live. You review and approve before anything ships.",
  },
  {
    num: 3,
    title: "We keep it running",
    desc: "One team stays accountable — answering visitors in every language, capturing leads, and keeping the whole presence working while you run your business.",
  },
];

// ── Hero language strip ──
// 3 pills above the hero headline: English, the dominant non-English language
// in LA (Spanish), and the founder's language (Persian/Farsi — Westwood is
// "Tehrangeles"). Clicking a pill translates the hero's 6 strings via
// /locales/<code>.json. Other languages remain available in the full Southern
// California language list below the hero.

export const HERO_STRIP_LANGUAGES = [
  { code: "en", label: "English", rtl: false },
  { code: "es", label: "Español", rtl: false },
  { code: "fa", label: "فارسی", rtl: true },
] as const;

export type HeroLangCode = (typeof HERO_STRIP_LANGUAGES)[number]["code"];

// ── Supported languages (Southern California focus) ──
// Ordered by approximate LA County speaker count + community visibility.
// Source: U.S. Census ACS 2022, LA Almanac. The underlying AI handles 70+
// languages; this list is what we actually deploy and translate for
// Southern California merchants.

export const LA_LANGUAGES = [
  "English",
  "Spanish",
  "Chinese (Mandarin)",
  "Chinese (Cantonese)",
  "Tagalog/Filipino",
  "Korean",
  "Armenian",
  "Persian/Farsi",
  "Vietnamese",
  "Arabic",
  "Russian",
  "Japanese",
  "Khmer (Cambodian)",
  "Thai",
  "Hebrew",
  "Hindi",
  "Punjabi",
  "Urdu",
  "Gujarati",
  "French",
  "Portuguese",
  "Indonesian",
  "Italian",
] as const;

export const LANGUAGE_BAR = {
  eyebrow: "56% of LA County",
  heading: "56% of LA County speaks a language other than English at home.",
  sub: "That's nearly 5 million customers most Southern California businesses lose the moment a caller hits an English-only menu. We don't. Here are the languages we deliver in across LA, OC, and the Inland Empire.",
  footnote: "Rumi answers every caller in their own language from the first word. Just qualified customers, delivered to your phone.",
};

// ── Team ──

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  school: string;
  bio: string;
  experience: string[];
}

export const TEAM: TeamMember[] = [
  {
    name: "Dr. Ali Naeini",
    role: "Chief Executive Officer",
    photo: "/team-ali.jpeg",
    school: "",
    bio: "Builds products people actually use — and now puts that behind Southern California's small businesses, so they get found in the AI era.",
    experience: [
      "Led products serving 100M+ users at Business Insider and Spotter.",
      "Now focused on local growth for small businesses across North America.",
      "PhD @ UC Berkeley & Merced.",
    ],
  },
  {
    name: "Saba Fazel",
    role: "Chief Product Officer",
    photo: "/team-saba.jpeg",
    school: "",
    bio: "The voice on the other end of the call. Turns what merchants actually need into the offer that closes — in their own language.",
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
    bio: "Ships the whole stack — website, app, infrastructure. If it touches a customer, she's made sure it works.",
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

// Internal name for this offer is "Multilingual Lead Engine" (see design doc).
// Buyer-facing copy stays plain and outcome-led; no internal-product naming on the site.
// Southern California language reach is the differentiator: we capture the
// customers your competitors lose to language barriers — 56% of LA County
// speaks a non-English language at home and hangs up on English-only menus.
export const SERVICES: Service[] = [
  {
    slug: "persian-leads",
    name: "Qualified local customers, delivered — in every language spoken in LA",
    icon: "📞",
    tagline:
      "Qualified local customers calling your store every month — in every language spoken in Southern California. Fixed price, money-back guarantee.",
    description:
      "We deliver qualified local customers in every language Southern California speaks — Spanish, Mandarin, Cantonese, Tagalog, Korean, Armenian, Persian, Vietnamese, Arabic, Russian, Khmer, Thai, Hebrew, Hindi, and more. We run targeted local campaigns, build a multilingual landing page, and route every interested customer directly to your phone with photos, contact, and budget. Calls that used to end in a hang-up turn into bookings. You close. We charge per booked lead, not per campaign.",
    features: [
      "Local customers in every Southern California language — every caller hears their own language from the first word",
      "Multilingual landing page tailored to the languages your customers actually speak",
      "Targeted Instagram campaigns plus local-community outreach in those same languages",
      "Every booked lead routed straight to your phone within minutes",
      "Weekly lead status tracker (new, contacted, appointment, won, lost)",
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

// ── Multilingual (legacy — kept for backward compatibility on existing pages) ──

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

// ── Industry Verticals (local retail focus) ──

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
      "Launch pricing from $199/month for 5 qualified leads (was $499). Book a free 15-min call to start.",
    relatedServices: ["persian-leads"],
  },
  {
    slug: "curtains",
    name: "Curtains & Drapery",
    stat: "Local appointment-driven retail",
    tagline: "More in-home measurement bookings, in your language",
    description:
      "Curtain and drapery retail runs on word of mouth, in-home consultations, and trust. We bring you local neighbors — Persian, English, or Spanish-speaking — who want a free measurement at your store, with photos and budget range captured up front.",
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
      "Launch pricing from $199/month for 5 qualified leads (was $499). Book a free 15-min call to start.",
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
      "Targeted local ads to multilingual buyers shopping for home goods",
      "Lead routing direct to your phone within minutes",
    ],
    roiData:
      "Launch pricing from $199/month for 5 qualified leads (was $499). Book a free 15-min call to start.",
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
      "Launch pricing from $199/month for 5 qualified leads (was $499). Book a free 15-min call to start.",
    relatedServices: ["persian-leads"],
  },
  {
    slug: "home-services",
    name: "Home Services",
    stat: "Quote-driven local service",
    tagline: "More quote requests from Persian-speaking homeowners in your area",
    description:
      "Plumbers, HVAC techs, contractors, and handyman services know their local communities. We help you reach more of them, faster, with quote requests routed straight to your phone — in Persian, English, or Spanish.",
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
      "Launch pricing from $199/month for 5 qualified leads (was $499). Book a free 15-min call to start.",
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
    label: "AI + Web + iOS",
    title: "Rumi — AI Coaching Platform",
    description:
      "Full-stack AI coaching platform with real-time conversations and personalized progress tracking. Deployed across web and iOS.",
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

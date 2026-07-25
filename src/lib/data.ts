// ── Single source of truth for all site content ──

export const CALENDLY_URL = "https://cal.com/rumi-app/30-min-meeting";

// Slug used by the inline Cal.com embed (https://cal.com/<CAL_LINK>).
// 30-min meeting — matches the $100 strategy call booked on /book.
export const CAL_LINK = "rumi-app/30-min-meeting";

export const SUPPORT_EMAIL = "support@rumi.build";

// ═══════════════════════════════════════════════════════════════════════════
// AI EMPLOYEES — the lead offer
// ═══════════════════════════════════════════════════════════════════════════
//
// TONE RULE (non-negotiable, applies to every string below):
// price the WORK, never the person. "~$3,000/mo of front-desk work" is correct;
// "a ~$3,000/mo receptionist" is not. No role ever "replaces" anyone and no
// human job title is ever named as the thing being cut. These roles absorb the
// repetitive work so the people stay on the work that needs a person.
//
// Pricing is always "from"/"starting at" — never a bare fixed number.

/** Short pill shown beside a price. The headline number of the whole offer. */
export const SAVING_LABEL = "90% off";

/** How pricing works. Shown on the /services pages, not the homepage cards. */
export const PRICING_NOTE =
  "Every role is priced at roughly a tenth of what that work costs a business today — the same work handled, about 90% less spent handling it. The listed number is where a role starts; we set the actual figure once we have seen your call volume, your inbox, and the tools you already run on. Month to month, no setup fee, and you can add or drop a role as the workload moves.";

/** Every role can also run under the client's own brand. */
export const WHITE_LABEL_NOTE =
  "Any of these roles can run under your own brand instead of ours — your name on it, your logo, a voice you choose. Your customers only ever see you. We walk through what that looks like on the call.";

/** What happens between signing and going live. */
export const ONBOARDING_NOTE =
  "Live in one to three weeks. We train the role on your own calls, your inbox, your calendar, your tone of voice, and the systems you already use — then our team keeps managing it after launch: tuning it, fixing it, and reporting back. It asks for your approval before anything important goes out.";

export interface AIEmployee {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  /**
   * Volume of WORK this role covers, priced as work — never as a person.
   * e.g. "~$3,000/mo of front-desk work". Never "a ~$3,000/mo receptionist".
   */
  workload: string;
  /** Starting price. Always rendered as "from {priceFrom}", never bare. */
  priceFrom: string;
  /** Bundles only: slugs of the roles included in this hire. */
  includes?: string[];
  description: string;
  features: string[];
  useCases: string[];
}

export const AI_EMPLOYEES: AIEmployee[] = [
  {
    slug: "ai-receptionist",
    name: "AI Receptionist",
    icon: "📞",
    tagline:
      "Answers every call, day or night, and turns it into a booked appointment.",
    workload: "~$3,000/mo of front-desk work",
    priceFrom: "$300/mo",
    description:
      "A phone line that always gets picked up. The AI Receptionist answers in a natural voice around the clock, works out what the caller actually needs, and puts the appointment straight onto your calendar. Every inquiry is written down with the caller's details, so the 7pm question and the Sunday-morning quote request are both waiting for you on Monday instead of sitting in voicemail. When a call genuinely needs a person, it hands over with the context already gathered.",
    features: [
      "Picks up 24/7 in a natural voice — no phone tree, no hold music",
      "Books, moves, and confirms appointments on your live calendar",
      "Writes down every inquiry with the caller's name, number, and question",
      "Knows when to escalate, and hands the call over with the context attached",
      "Chases missed calls, open quotes, and reminders without being asked",
      "Talks to each caller in the language they called in",
    ],
    useCases: [
      "Dental and medical offices: bookings, reminders, and far fewer empty chairs",
      "Plumbing and HVAC: the 2am emergency gets answered and triaged",
      "Law practices: intake screened before it reaches anyone's desk",
      "Restaurants: reservations taken while the floor is slammed",
      "Salons and studios: the phone still gets answered mid-appointment",
    ],
  },
  {
    slug: "ai-executive-assistant",
    name: "AI Executive Assistant",
    // U+1F5D3 is text-default in Unicode (no Emoji_Presentation), so the
    // trailing U+FE0F is required to force the colour glyph — without it this
    // one tile renders monochrome next to four colour emoji.
    icon: "🗓️",
    tagline:
      "Works inside your inbox, calendar, and CRM — and briefs you at 9am.",
    workload: "~$5,000/mo of executive-support work",
    priceFrom: "$500/mo",
    description:
      "An assistant that lives in the tools you already have open. It reads the inbox, holds the calendar, keeps the CRM tidy, and at 9am sends one short brief on the handful of things that genuinely need you today. Ask for what you want in plain English — move everything on Thursday, chase the three people who never replied — and it does the work, drafting in your own voice and waiting for your yes before anything leaves the building.",
    features: [
      "Sits inside your email, calendar, and CRM — nothing new to log into",
      "One 9am brief: what needs you today, and what it already took care of",
      "Takes instructions in plain language, not menus or macros",
      "Drafts replies that sound like you, then holds them for your approval",
      "Books, moves, and defends blocks of focus time",
      "Keeps CRM records current so your pipeline view stays honest",
    ],
    useCases: [
      "Founders: a day of inbound triaged down to four real decisions",
      "Partners and principals: the calendar stops being a second job",
      "Sales teams: no lead sits unanswered past the afternoon",
      "Accounting practices: client requests and filing dates tracked to the day",
      "Contractors: change orders, estimates, and site updates all logged",
    ],
  },
  {
    slug: "ai-social-media-manager",
    name: "AI Social Media Manager",
    icon: "📣",
    // The DMs go to EXISTING clients only. Keep that scope in the tagline —
    // without it this reads as general DM outreach, which is not the offer.
    tagline:
      "Twelve posts, four shorts, and personal DMs to the clients you already have, in your own voice.",
    workload: "~$4,000/mo of social media work",
    priceFrom: "$400/mo",
    description:
      "A social presence that keeps moving while you work. Every month it produces twelve posts and four short-form videos for your accounts, planned around what your customers actually respond to. It also handles the personal touch: announcements to the clients you already have, sent as Instagram DMs written in a clone of the owner's own voice — up to 100 a month, each one shown to you first so you approve it with a tap.",
    features: [
      "12 posts and 4 short videos every month, written and produced for you",
      "Announcements to your existing clients as Instagram DMs, up to 100 a month",
      "DMs written in a clone of the owner's own voice, not agency boilerplate",
      "Tap to approve — nothing goes out before you have seen it",
      "A content plan built from what is already working in your market",
      "Captions and replies in the language your customers use",
    ],
    useCases: [
      "Realtors: a new listing announced to past buyers the day it goes live",
      "Salons and clinics: a quiet week filled from your own client list",
      "Showrooms: new stock in front of the people who already bought once",
      "Restaurants: a specials calendar that posts itself",
      "Trades: finished-job photos turned into a steady feed",
    ],
  },
  {
    slug: "ai-office-manager",
    name: "AI Office Manager",
    icon: "🏢",
    tagline: "The Receptionist and the Executive Assistant, hired together.",
    workload: "~$8,000/mo of front-office work",
    priceFrom: "$800/mo",
    includes: ["ai-receptionist", "ai-executive-assistant"],
    description:
      "The front of the house and the desk behind it, hired as one. The Receptionist takes every call and fills the calendar; the Executive Assistant works the inbox behind it, keeps the CRM straight, and sends the 9am brief. Because both share one calendar and one customer record, a call at 8pm and the follow-up email the next morning are the same conversation rather than two loose ends nobody ties together.",
    features: [
      "Everything the AI Receptionist does, 24/7 on the phone",
      "Everything the AI Executive Assistant does, in your inbox and CRM",
      "One shared calendar and one customer record across both roles",
      "A single 9am brief that covers the calls and the email together",
      "Approvals land in one place instead of two",
      "One monthly number for the whole front office",
    ],
    useCases: [
      "Clinics: phones answered, schedule full, patient email kept current",
      "Law practices: intake, scheduling, and client correspondence in one hire",
      "Home-services companies: dispatch calls and the paperwork behind them",
      "Small firms with no office manager on staff and no plan to add one",
      "Owners who are the switchboard and the inbox at the same time",
    ],
  },
  {
    slug: "ai-chief-of-staff",
    name: "AI Chief of Staff",
    icon: "👔",
    tagline: "Phone, inbox, and social — the whole front office in one hire.",
    workload: "~$9,000+/mo of front-office, admin and marketing work",
    priceFrom: "$900/mo",
    includes: [
      "ai-receptionist",
      "ai-executive-assistant",
      "ai-social-media-manager",
    ],
    description:
      "All three roles at once, for owners who would rather hire one thing than three. Calls answered around the clock, the inbox and calendar run, the CRM kept honest, and the social accounts posting and messaging on schedule — all sharing the same context, so what a customer said on the phone in March shows up when they get a message in April. You still approve anything that matters before it goes out.",
    features: [
      "The AI Receptionist, Executive Assistant, and Social Media Manager together",
      "One shared context across phone, inbox, calendar, CRM, and social",
      "A single daily brief covering everything the three roles handled",
      "One approval queue for calls, drafts, posts, and DMs",
      "Our team manages all three and reports on them monthly",
      // Every role is priced at 10% of its workload, so no role saves a larger
      // percentage than any other — a superlative here contradicts the five
      // identical "90% off" badges. The true bundle benefit is the arithmetic:
      // $900/mo against $300 + $500 + $400 = $1,200/mo hired separately.
      "From $900/mo for all three — against $1,200/mo if you hire the three roles separately",
    ],
    useCases: [
      "Owner-operators doing reception, admin, and marketing after hours",
      "Practices growing faster than they can hire administrators",
      "Multi-location businesses that need one consistent front office",
      "Firms whose social account has been quiet since the last person left",
      "Anyone who wants one accountable hire instead of three vendors",
    ],
  },
];

/** The three roles you can hire on their own. */
export const CORE_ROLES: AIEmployee[] = AI_EMPLOYEES.filter((r) => !r.includes);

/** The two bundles (a bundle is two or more core roles hired together). */
export const BUNDLE_ROLES: AIEmployee[] = AI_EMPLOYEES.filter(
  (r) => !!r.includes
);

export function getAIEmployeeBySlug(slug: string): AIEmployee | undefined {
  return AI_EMPLOYEES.find((r) => r.slug === slug);
}

// ── Customer-facing copy (English-primary, Farsi accent layer) ──
// Saba reviews and rewrites every Farsi line Farsi-first before launch.
// English is the working language for the site; Farsi accents signal cultural fit only.

export const COPY = {
  hero: {
    overline: "Be found in the AI era",
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
// /locales/<code>.json. Other languages remain available in the full
// language list below the hero.

export const HERO_STRIP_LANGUAGES = [
  { code: "en", label: "English", rtl: false },
  { code: "es", label: "Español", rtl: false },
  { code: "fa", label: "فارسی", rtl: true },
] as const;

export type HeroLangCode = (typeof HERO_STRIP_LANGUAGES)[number]["code"];

// ── Supported languages ──
// Ordered by approximate LA County speaker count + community visibility.
// Source: U.S. Census ACS 2022, LA Almanac. The underlying AI handles 70+
// languages; this list is what we actually deploy and translate for
// merchants.

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
  sub: "That's nearly 5 million customers most businesses lose the moment a caller hits an English-only menu. We don't. Here are the languages we deliver in.",
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
    bio: "Builds products people actually use — and now puts that behind small businesses, so they get found in the AI era.",
    experience: [
      "Led products serving 100M+ users at Business Insider and Spotter.",
      "Now focused on local growth for small businesses across North America.",
      "PhD @ UC Berkeley & Merced.",
    ],
  },
  {
    name: "Saba Fazel",
    role: "Chief Growth Officer",
    photo: "/team-saba.jpeg",
    school: "",
    bio: "The person on the other end of the first call. Saba talks to merchants directly, in English or Farsi, turns what they actually need into the offer that closes, and runs growth, partnerships, and go-to-market for Rumi AI.",
    experience: [
      "Talks to merchants directly, in English or Farsi.",
      "Turns what a merchant actually needs into the offer that closes.",
      "Runs growth, partnerships, and go-to-market.",
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

// ── Legacy productized offer (retired) ──
// Kept only so nothing that still imports `Service` / `SERVICES` breaks. No page
// renders it any more: /services is now the AI Employees hub (see AI_EMPLOYEES
// above) and the language-reach story lives on the industry pages.

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
// Multilingual reach is the differentiator: we capture the
// customers your competitors lose to language barriers — 56% of LA County
// speaks a non-English language at home and hangs up on English-only menus.
export const SERVICES: Service[] = [
  {
    slug: "persian-leads",
    name: "Qualified local customers, delivered — in every language spoken in LA",
    icon: "📞",
    tagline:
      "Qualified local customers calling your store every month — in every language your customers speak. Pay per booked lead, money-back guarantee.",
    description:
      "We deliver qualified local customers in every language your customers speak — Spanish, Mandarin, Cantonese, Tagalog, Korean, Armenian, Persian, Vietnamese, Arabic, Russian, Khmer, Thai, Hebrew, Hindi, and more. We run targeted local campaigns, build a multilingual landing page, and route every interested customer directly to your phone with photos, contact, and budget. Calls that used to end in a hang-up turn into bookings. You close. We charge per booked lead, not per campaign.",
    features: [
      "Local customers in every language — every caller hears their own language from the first word",
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
    "Our AI detects the caller’s language within the first 2–3 seconds and switches over without a pause. No menu prompts, no ‘press 2 for Spanish.’ The caller hears their language from the first word.",
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
    roiData:
      "AI employee roles start from $300/mo — about a tenth of what that work costs today. We set the exact number on the call, once we have seen your volume. A website, an app, or a content plan is scoped there too, because what it costs depends on what you need built.",
    relatedServices: [],
  },
  {
    slug: "curtains",
    name: "Curtains & Drapery",
    stat: "Local appointment-driven retail",
    tagline: "More in-home measurement bookings, in your language",
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
    roiData:
      "AI employee roles start from $300/mo — about a tenth of what that work costs today. We set the exact number on the call, once we have seen your volume. A website, an app, or a content plan is scoped there too, because what it costs depends on what you need built.",
    relatedServices: [],
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
      "AI employee roles start from $300/mo — about a tenth of what that work costs today. We set the exact number on the call, once we have seen your volume. A website, an app, or a content plan is scoped there too, because what it costs depends on what you need built.",
    relatedServices: [],
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
      "AI employee roles start from $300/mo — about a tenth of what that work costs today. We set the exact number on the call, once we have seen your volume. A website, an app, or a content plan is scoped there too, because what it costs depends on what you need built.",
    relatedServices: [],
  },
  {
    slug: "home-services",
    name: "Home Services",
    stat: "Quote-driven local service",
    tagline: "More quote requests from Persian-speaking homeowners in your area",
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
    roiData:
      "AI employee roles start from $300/mo — about a tenth of what that work costs today. We set the exact number on the call, once we have seen your volume. A website, an app, or a content plan is scoped there too, because what it costs depends on what you need built.",
    relatedServices: [],
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
    url: "/evaluate",
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

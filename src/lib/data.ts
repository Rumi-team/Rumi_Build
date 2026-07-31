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

// ── THIS MODULE IS IN THE CLIENT BUNDLE ──
// src/components/footer.tsx is a client component and imports AI_EMPLOYEES and
// VERTICALS to build its link columns, so everything reachable from those two
// arrays is compiled into the browser bundle on EVERY route — the footer renders
// on every page. Keep both arrays down to what a card, a nav link or a piece of
// metadata renders.
//
// The long-form prose that only the detail pages render lives in two server-only
// modules — src/lib/ai-employee-details.ts and src/lib/vertical-details.ts —
// imported by src/app/services/[slug]/page.tsx and the industries pages
// respectively. NEVER import either of them from this file: the footer reaches
// this module, so an import here puts all of that prose straight back on every
// page. A derived projection would not help either; the split works because the
// data physically lives elsewhere.

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
  },
  {
    slug: "ai-office-manager",
    name: "AI Office Manager",
    icon: "🏢",
    tagline: "The Receptionist and the Executive Assistant, hired together.",
    workload: "~$8,000/mo of front-office work",
    priceFrom: "$800/mo",
    includes: ["ai-receptionist", "ai-executive-assistant"],
  },
  {
    slug: "ai-chief-of-staff",
    name: "AI Chief of Staff",
    icon: "👔",
    tagline: "Phone, inbox, and social — the whole front office in one hire.",
    // 3,000 + 5,000 + 4,000. A bundle's workload is the SUM of the workloads of
    // the roles inside it — this said ~$9,000+ while its own three roles listed
    // 12,000 between them, so the two figures contradicted each other a screen
    // apart. Pinned as an invariant in tests/unit/ai-employees.test.ts.
    workload: "~$12,000/mo of front-office, admin and marketing work",
    priceFrom: "$900/mo",
    includes: [
      "ai-receptionist",
      "ai-executive-assistant",
      "ai-social-media-manager",
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

// ── Team ──

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
  experience: string[];
}

export const TEAM: TeamMember[] = [
  {
    name: "Dr. Ali Naeini",
    role: "Chief Executive Officer",
    photo: "/team-ali.jpeg",
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
    bio: "Ships the whole stack — website, app, infrastructure. If it touches a customer, she's made sure it works.",
    experience: [
      "Builds the lead-routing systems that get every customer to your phone in under a minute.",
      "Native Farsi speaker. Ships end-to-end: architecture, backend, infrastructure, deployment.",
      "MSc Machine Learning @ Imperial College London.",
    ],
  },
];

// ── Industry Verticals (local retail focus) ──
//
// Light fields only, for the same reason AI_EMPLOYEES is light: the footer
// column is a client component. VerticalCard (/industries) renders name, stat
// and tagline; the body copy the /industries/[slug] page renders is in
// src/lib/vertical-details.ts.

export interface Vertical {
  slug: string;
  name: string;
  stat: string;
  tagline: string;
}

export const VERTICALS: Vertical[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    stat: "Trust-driven, community-led local market",
    tagline: "More qualified buyer and seller leads from your community",
  },
  {
    slug: "curtains",
    name: "Curtains & Drapery",
    stat: "Local appointment-driven retail",
    tagline: "More in-home measurement bookings, in your language",
  },
  {
    slug: "rugs",
    name: "Rugs & Home Goods",
    stat: "Local showroom-driven retail",
    tagline: "More showroom visits and quote requests from your community",
  },
  {
    slug: "beauty",
    name: "Beauty & Salon",
    stat: "Appointment-driven service retail",
    tagline: "More Persian-speaking clients in your chair every week",
  },
  {
    slug: "home-services",
    name: "Home Services",
    stat: "Quote-driven local service",
    tagline: "More quote requests from Persian-speaking homeowners in your area",
  },
];

// ── Helpers ──

export function getVerticalBySlug(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}

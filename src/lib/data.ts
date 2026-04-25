// ── Single source of truth for all site content ──

export const CALENDLY_URL = "https://cal.com/rumi.team/30min";

export const STRIPE_URLS = {
  sprint: "https://buy.stripe.com/aFa5kwgeR8ae5AL7KA0RG00",
  automation: "https://buy.stripe.com/14AaEQ6EhgGK6EP0i80RG01",
  deposit: "https://buy.stripe.com/cNi6oAe6J8ae4wHaWM0RG02",
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
    name: "Ali Naeini, Ph.D",
    role: "Chief Executive Officer",
    photo: "/team-ali.jpeg",
    school: "",
    experience: [
      "Led AI at Business Insider & Spotter ($1B+ startups)",
      "Shipped products to millions of users, $100M+ revenue impact",
      "PhD @ UC Berkeley & Merced",
    ],
  },
  {
    name: "Saba Fazel",
    role: "Chief Product Officer",
    photo: "/team-saba.jpeg",
    school: "",
    experience: [
      "Turns complex business problems into clear product roadmaps",
      "Bridges the gap between what AI can do and what your team needs",
      "Data Science @ UCLA",
    ],
  },
  {
    name: "Parnian Fazel",
    role: "Chief Technology Officer",
    photo: "/team-parnian.jpeg",
    school: "",
    experience: [
      "Built personalization systems processing millions of daily predictions",
      "Ships end-to-end: architecture, backend, infrastructure, deployment",
      "MSc Machine Learning @ Imperial College London",
    ],
  },
];

// ── Stats ──

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: "10+ hrs/wk", label: "Freed from repetitive tasks" },
  { value: "3 weeks", label: "From audit to first results" },
  { value: "30+", label: "Languages supported by voice AI" },
  { value: "24/7", label: "Your AI never calls in sick" },
];

// ── Services ──

export interface Service {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  priceRange: string;
  features: string[];
  useCases: string[];
  relatedVerticals: string[];
  /**
   * Optional override for the card link. Defaults to `/services/{slug}`.
   * Use this when a service has a dedicated landing page outside the
   * dynamic /services/[slug] route (e.g. /chief-of-staff).
   */
  href?: string;
}

export const SERVICES: Service[] = [
  {
    slug: "chief-of-staff",
    name: "Chief of Staff",
    icon: "✍️",
    tagline:
      "Your AI manager. On your phone. Approvals via Telegram, WhatsApp, or iMessage.",
    description:
      "Reads your inbox, answers your phone, runs your calendar, organizes your documents — all from your phone. Reports through your preferred channel: Telegram, WhatsApp, or iMessage. Asks for approval before anything important goes out, then handles the rest on its own.",
    priceRange: "Included in Launch or Managed plans",
    features: [
      "Email triage and reply drafting in your voice",
      "Phone answering with smart escalation when it matters",
      "Calendar booking, conflict resolution, focus-time defense",
      "Document organization and quick retrieval on the go",
      "Reports through Telegram, WhatsApp, or iMessage",
      "One-tap approval before anything goes out",
    ],
    useCases: [
      "Founder: 121 inbound emails a day handled, the 5% that matter surface to you",
      "Executive: every call answered, meetings booked, focus time defended",
      "Operator: documents and contracts organized, retrievable from your phone",
      "Sales lead: approve outbound replies via WhatsApp before they send",
    ],
    relatedVerticals: ["legal", "accounting", "healthcare"],
    href: "/chief-of-staff",
  },
  {
    slug: "chief-of-operations",
    name: "Chief of Operations",
    icon: "⚙️",
    tagline:
      "Your back office, automated. The repetitive work, gone.",
    description:
      "AI-driven workflow automation that learns your business. Handles bookkeeping, invoicing, intake forms, scheduling, project portals, and the dozens of small workflows that quietly eat your team's day. Connects to your existing tools, runs in the background, escalates only when judgment is needed.",
    priceRange: "Included in Launch or Managed plans",
    features: [
      "Bookkeeping and transaction categorization",
      "Invoice processing from inbox to accounting system",
      "Client and project portals with real-time updates",
      "Intake forms, scheduling, and follow-up automation",
      "Estimating, change-order tracking, and bid management",
      "Connects to QuickBooks, Notion, Slack, your CRM",
    ],
    useCases: [
      "Accounting firm: automate bookkeeping and client communication, focus on advisory",
      "Construction: estimating, change orders, and a project portal clients actually use",
      "Restaurant: inventory alerts, scheduling, and order-confirmation automation",
      "Law firm: intake forms, client portals, and matter management",
    ],
    relatedVerticals: ["accounting", "construction", "restaurants", "legal"],
  },
  {
    slug: "chief-of-marketing",
    name: "Chief of Marketing",
    icon: "📈",
    tagline:
      "Your competitors are eating your search traffic. Take it back.",
    description:
      "AI marketing analyst that reads your product pages, audits your landing copy, compares it side-by-side against competitors, and ranks rewrites by impact. Daily search opportunities surfaced before your competitors find them.",
    priceRange: "Included in Launch or Managed plans",
    features: [
      "Side-by-side competitor analysis on the pages that matter",
      "Keyword and search-intent gaps your team is missing",
      "Rewrite suggestions ranked by traffic and conversion impact",
      "Weekly content audit reports delivered to your inbox",
    ],
    useCases: [
      "Ecommerce: PDP rewrites that close the gap with category leaders",
      "B2B SaaS: landing-page copy audits against the top three competitors",
      "Agency: scale content quality reviews across 100+ pages a week",
      "DTC brand: catch new competitor positioning the day it ships",
    ],
    relatedVerticals: ["restaurants", "healthcare", "legal", "home-services"],
  },
  {
    slug: "chief-of-customer-service",
    name: "Chief of Customer Service",
    icon: "🎙️",
    tagline: "Never miss a call. Never miss a lead. 24/7 in 30+ languages.",
    description:
      "AI phone agent that answers every call, books appointments, handles triage, and follows up — in 30+ languages, around the clock. Customers hear a real conversation, not a phone tree. Deployed in 1–3 weeks.",
    priceRange: "Included in Launch or Managed plans",
    features: [
      "24/7 phone answering with natural conversation",
      "Appointment booking integrated with your calendar",
      "Emergency triage and smart call routing",
      "Automated follow-up calls and reminders",
      "30+ languages, auto-detected on the first sentence",
    ],
    useCases: [
      "Medical office: scheduling, reminders, no-show reduction",
      "HVAC company: emergency dispatch, booking, follow-up",
      "Law firm: client intake screening and appointment scheduling",
      "Restaurant: reservation management and order inquiries",
    ],
    relatedVerticals: ["home-services", "healthcare", "legal", "restaurants"],
  },
];

// ── Voice AI Multilingual ──

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

// ── Industry Verticals ──

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
    slug: "home-services",
    name: "Home Services",
    stat: "The average contractor misses 40% of incoming calls",
    tagline: "Every missed call is $200-$500 walking to your competitor",
    description:
      "78% of homeowners hire the first company that picks up. If your phone rings while your team is on a job, that customer calls the next name on the list. We deploy AI that answers every call, books the job, and follows up, so you stop bleeding revenue.",
    painPoints: [
      "Missed calls during jobs = $200-$500 lost per call",
      "After-hours emergencies go to voicemail (and your competitor)",
      "Hours spent on dispatching instead of billable work",
      "No system to turn one-time jobs into repeat customers",
    ],
    solutions: [
      "AI answers every call, 24/7, in your customer's language (Chief of Customer Service)",
      "Automated dispatching gets the right tech to the right job (Chief of Operations)",
      "Post-job follow-up calls drive reviews and repeat bookings (Chief of Customer Service)",
      "Monthly reports show exactly how many leads you captured (Chief of Operations)",
    ],
    roiData:
      "Start with a $250 AI Opportunity Audit to see exactly where your business is leaking revenue.",
    relatedServices: ["chief-of-customer-service", "chief-of-operations"],
  },
  {
    slug: "healthcare",
    name: "Healthcare Clinics",
    stat: "250K+ practices · $150B lost to no-shows",
    tagline: "Reduce no-shows up to 90%",
    description:
      "No-shows cost US healthcare $150+ billion annually. Phone hold times drive patients to competitors. AI phone answering and automated reminders solve both.",
    painPoints: [
      "No-shows cost $150+ billion annually across US healthcare",
      "Phone hold times drive patients to competitors",
      "Manual appointment reminders are unreliable",
      "Staff spend hours on scheduling instead of patient care",
    ],
    solutions: [
      "AI phone answering and scheduling in 30+ languages (Chief of Customer Service)",
      "Automated appointment reminders via call, text, and email (Chief of Operations)",
      "No-show reduction up to 90% with smart follow-up (Chief of Customer Service)",
      "Intake forms, referrals, and chart prep automated end-to-end (Chief of Operations)",
    ],
    roiData:
      "Pricing: $200–$3,000/month per practice depending on suite breadth.",
    relatedServices: ["chief-of-customer-service", "chief-of-operations"],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    stat: "660K+ businesses · 86% AI-comfortable",
    tagline: "Never miss a reservation call again",
    description:
      "AI phone answering handles reservations, takeout orders, and inquiries 24/7. Workflow automation streamlines ordering, scheduling, and follow-up.",
    painPoints: [
      "Missed reservation calls during rush hours",
      "Staff pulled from service to answer phones",
      "Manual ordering and scheduling processes",
      "No follow-up system for repeat customers",
    ],
    solutions: [
      "24/7 AI phone answering for reservations and orders (Chief of Customer Service)",
      "Multilingual support for a diverse customer base (Chief of Customer Service)",
      "Order confirmation, scheduling, and inventory alerts on autopilot (Chief of Operations)",
      "Menu and listings audited against the top restaurants in your area (Chief of Marketing)",
    ],
    roiData:
      "Average $14,700/year savings for a 50-seat restaurant. Pricing: $150–$1,500/month per location.",
    relatedServices: ["chief-of-customer-service", "chief-of-operations", "chief-of-marketing"],
  },
  {
    slug: "legal",
    name: "Legal",
    stat: "450K firms · First response wins the client",
    tagline: "AI that answers client calls before your competitors do",
    description:
      "The first firm to respond wins the client. AI phone answering handles intake screening and appointment scheduling 24/7 while your firm website converts visitors into consultations.",
    painPoints: [
      "Missed client calls go straight to your competitor",
      "Client intake is manual and slow",
      "Matter status updates are still phone tag and email threads",
      "After-hours inquiries get no response until morning",
    ],
    solutions: [
      "24/7 AI phone answering with client intake screening (Chief of Customer Service)",
      "Automated appointment scheduling and confirmation (Chief of Customer Service)",
      "Client intake forms, document collection, and matter portal (Chief of Operations)",
      "Multilingual support for a diverse client base (Chief of Customer Service)",
    ],
    roiData:
      "First-response advantage: firms that answer within 5 minutes are 10x more likely to win the client. Pricing: $200–$1,500/month.",
    relatedServices: ["chief-of-customer-service", "chief-of-operations", "chief-of-staff"],
  },
  {
    slug: "accounting",
    name: "Accounting",
    stat: "AI adoption 9% → 41% in one year",
    tagline: "Automate the manual work, focus on advisory",
    description:
      "AI adoption in accounting jumped from 9% to 41% in one year. Workflow automation handles bookkeeping, categorization, and client communication so your team focuses on advisory.",
    painPoints: [
      "Manual bookkeeping is time-consuming and error-prone",
      "Client communication is reactive, not proactive",
      "Staff spend hours on categorization and data entry",
      "Phone calls interrupt deep work throughout the day",
    ],
    solutions: [
      "Automated bookkeeping and transaction categorization (Chief of Operations)",
      "AI phone answering for client calls and scheduling (Chief of Customer Service)",
      "Proactive client communication and approvals on your phone (Chief of Staff)",
      "Automated reporting and deadline management (Chief of Operations)",
    ],
    roiData:
      "A Coral Springs firm saw cost-per-lead drop 38% and client acquisition rise 67%. Pricing: $200–$5,000/month.",
    relatedServices: ["chief-of-operations", "chief-of-staff", "chief-of-customer-service"],
  },
  {
    slug: "construction",
    name: "Construction",
    stat: "750K firms · First to bid wins",
    tagline: "Streamline bids and keep projects on track",
    description:
      "Workflow automation streamlines estimating, change orders, and project communication. A modern project portal keeps clients informed and your team organized.",
    painPoints: [
      "Estimating takes days of manual work per bid",
      "Change order tracking is chaotic",
      "Client communication is fragmented across email and phone",
      "No centralized project portal for stakeholders",
    ],
    solutions: [
      "Workflow automation for estimating and bid management (Chief of Operations)",
      "Automated change-order tracking and notifications (Chief of Operations)",
      "Client-facing project portal with real-time updates (Chief of Operations)",
      "Centralized communication hub and approvals on your phone (Chief of Staff)",
    ],
    roiData: "Pricing: $200–$2,000/month.",
    relatedServices: ["chief-of-operations", "chief-of-staff", "chief-of-marketing"],
  },
];

// ── Pricing Tiers ──

export interface Tier {
  name: string;
  price: string;
  href: string;
  description: string;
  roi: string;
  features: string[];
  cta: string;
  featured: boolean;
}

export const TIERS: Tier[] = [
  {
    name: "Discover",
    price: "$250",
    href: "/audit",
    description:
      "AI Opportunity Audit. We analyze your business and show you exactly where you're losing time and money.",
    roi: "Credited toward your first project",
    features: [
      "30-minute deep-dive into your workflows",
      "3 specific opportunities identified",
      "Dollar value estimated for each",
      "Actionable report delivered in 48 hours",
    ],
    cta: "Get Your AI Audit",
    featured: false,
  },
  {
    name: "Launch",
    price: "From $2,500",
    href: CALENDLY_URL,
    description:
      "Your first AI employee. Chief of Staff, Operations, Marketing, or Customer Service — live in 1–3 weeks.",
    roi: "Your first AI employee, working for you",
    features: [
      "One high-impact deployment",
      "Chief of Staff, Operations, Marketing, or Customer Service",
      "Daily progress updates",
      "60 days post-launch support",
    ],
    cta: "Book a Call",
    featured: true,
  },
  {
    name: "Managed",
    price: "From $2,000/mo",
    href: CALENDLY_URL,
    description:
      "Ongoing AI operations. We manage, optimize, and expand your AI across the business.",
    roi: "We manage your AI. You manage your business.",
    features: [
      "Ongoing monitoring + optimization",
      "KPI tracking and monthly reports",
      "Additional agent deployments",
      "Dedicated Slack channel",
    ],
    cta: "Book a Call",
    featured: false,
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
    label: "Web Deployment",
    title: "IMAN — Community Website",
    description:
      "Bilingual Persian/English website with custom design system, prayer times API, and admin CMS. From first call to live site in 3 days.",
    url: "https://iman-website-seven.vercel.app/",
    stat: "3 days",
    statLabel: "from call to live",
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

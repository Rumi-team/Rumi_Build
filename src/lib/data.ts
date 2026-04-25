// ── Single source of truth for all site content ──

export const CALENDLY_URL = "https://cal.com/rumi.team/30min";

export const SUPPORT_EMAIL = "support@rumi.build";

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

// ── Services (the three Chiefs) ──

export interface Service {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
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
      "Your AI manager + back office. Approvals on Telegram, WhatsApp, or iMessage.",
    description:
      "Reads your inbox, answers your phone, runs your calendar, organizes your documents, AND automates the back office: bookkeeping, invoicing, intake forms, project portals, scheduling. One AI employee covering both executive admin and operations. Reports through your preferred channel (Telegram, WhatsApp, iMessage) and asks for approval before anything important goes out.",
    features: [
      "Email triage and reply drafting in your voice",
      "Phone answering with smart escalation when it matters",
      "Calendar booking, conflict resolution, focus-time defense",
      "Bookkeeping, invoicing, and back-office workflow automation",
      "Client and project portals with real-time updates",
      "Intake forms, scheduling, and follow-up automation",
      "Connects to QuickBooks, Notion, Slack, your CRM",
      "Reports and one-tap approval via Telegram, WhatsApp, or iMessage",
    ],
    useCases: [
      "Founder: 121 inbound emails a day handled, the 5% that matter surface to you",
      "Executive: every call answered, meetings booked, focus time defended",
      "Accounting firm: bookkeeping and client communication automated, focus on advisory",
      "Construction: estimating, change orders, and a client-facing project portal",
      "Law firm: intake forms, client portals, matter management on your phone",
    ],
    relatedVerticals: ["accounting", "construction", "legal", "healthcare"],
    href: "/chief-of-staff",
  },
  {
    slug: "chief-of-marketing",
    name: "Chief of Marketing",
    icon: "📈",
    tagline:
      "Your competitors are eating your search traffic. Take it back.",
    description:
      "AI marketing analyst that reads your product pages, audits your landing copy, compares it side-by-side against competitors, and ranks rewrites by impact. Daily search opportunities surfaced before your competitors find them.",
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
      "Automated dispatching gets the right tech to the right job (Chief of Staff)",
      "Post-job follow-up calls drive reviews and repeat bookings (Chief of Customer Service)",
      "Monthly reports show exactly how many leads you captured (Chief of Staff)",
    ],
    roiData:
      "Book a free 30-minute discovery call to see exactly where your business is leaking revenue.",
    relatedServices: ["chief-of-customer-service", "chief-of-staff"],
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
      "Automated appointment reminders via call, text, and email (Chief of Staff)",
      "No-show reduction up to 90% with smart follow-up (Chief of Customer Service)",
      "Intake forms, referrals, and chart prep automated end-to-end (Chief of Staff)",
    ],
    roiData:
      "Book a free 30-minute call to see how much we can reduce your no-show rate.",
    relatedServices: ["chief-of-customer-service", "chief-of-staff"],
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
      "Order confirmation, scheduling, and inventory alerts on autopilot (Chief of Staff)",
      "Menu and listings audited against the top restaurants in your area (Chief of Marketing)",
    ],
    roiData:
      "Book a free 30-minute discovery call to map your busiest hours and missed-call cost.",
    relatedServices: ["chief-of-customer-service", "chief-of-staff", "chief-of-marketing"],
  },
  {
    slug: "legal",
    name: "Legal",
    stat: "450K firms · First response wins the client",
    tagline: "AI that answers client calls before your competitors do",
    description:
      "The first firm to respond wins the client. AI phone answering handles intake screening and appointment scheduling 24/7 while back-office automation runs the matter portal and intake forms.",
    painPoints: [
      "Missed client calls go straight to your competitor",
      "Client intake is manual and slow",
      "Matter status updates are still phone tag and email threads",
      "After-hours inquiries get no response until morning",
    ],
    solutions: [
      "24/7 AI phone answering with client intake screening (Chief of Customer Service)",
      "Automated appointment scheduling and confirmation (Chief of Customer Service)",
      "Client intake forms, document collection, and matter portal (Chief of Staff)",
      "Multilingual support for a diverse client base (Chief of Customer Service)",
    ],
    roiData:
      "First-response advantage: firms that answer within 5 minutes are 10x more likely to win the client. Book a free discovery call to see your conversion gap.",
    relatedServices: ["chief-of-customer-service", "chief-of-staff"],
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
      "Automated bookkeeping and transaction categorization (Chief of Staff)",
      "AI phone answering for client calls and scheduling (Chief of Customer Service)",
      "Proactive client communication and approvals on your phone (Chief of Staff)",
      "Automated reporting and deadline management (Chief of Staff)",
    ],
    roiData:
      "A Coral Springs firm saw cost-per-lead drop 38% and client acquisition rise 67%. Book a free discovery call.",
    relatedServices: ["chief-of-staff", "chief-of-customer-service"],
  },
  {
    slug: "construction",
    name: "Construction",
    stat: "750K firms · First to bid wins",
    tagline: "Streamline bids and keep projects on track",
    description:
      "Workflow automation streamlines estimating, change orders, and project communication. A modern project portal keeps clients informed and your team organized — all from your phone.",
    painPoints: [
      "Estimating takes days of manual work per bid",
      "Change order tracking is chaotic",
      "Client communication is fragmented across email and phone",
      "No centralized project portal for stakeholders",
    ],
    solutions: [
      "Workflow automation for estimating and bid management (Chief of Staff)",
      "Automated change-order tracking and notifications (Chief of Staff)",
      "Client-facing project portal with real-time updates (Chief of Staff)",
      "Centralized communication hub and approvals on your phone (Chief of Staff)",
    ],
    roiData: "Book a free discovery call to see how much faster your bids could ship.",
    relatedServices: ["chief-of-staff", "chief-of-marketing"],
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

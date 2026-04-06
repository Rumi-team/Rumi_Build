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
  { value: "$250/mo", label: "vs $3\u20134K/mo for a receptionist" },
  { value: "3 days", label: "From first call to live website" },
  { value: "10+ hrs/wk", label: "Saved with workflow automation" },
  { value: "$100M+", label: "Revenue impact delivered" },
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
}

export const SERVICES: Service[] = [
  {
    slug: "voice-ai",
    name: "Voice AI Agents",
    icon: "\uD83C\uDF99\uFE0F",
    tagline: "Replace your $3\u20134K/month receptionist for $250\u2013$2K/month",
    description:
      "AI phone systems that answer calls 24/7, book appointments, handle triage, and follow up. Deployed in 1\u20133 weeks. Every business that receives phone calls is a prospect.",
    priceRange: "$250\u2013$2K/mo recurring",
    features: [
      "24/7 phone answering with natural conversation",
      "Appointment booking integrated with your calendar",
      "Emergency triage and smart call routing",
      "Automated follow-up calls and reminders",
    ],
    useCases: [
      "Medical office: scheduling, reminders, no-show reduction",
      "HVAC company: emergency dispatch, booking, follow-up",
      "Law firm: client intake screening and appointment scheduling",
      "Restaurant: reservation management and order inquiries",
    ],
    relatedVerticals: ["home-services", "healthcare", "legal", "restaurants"],
  },
  {
    slug: "web-mobile-apps",
    name: "Web & Mobile Apps",
    icon: "\uD83D\uDCF1",
    tagline: "Modern websites and apps delivered in days, not months",
    description:
      "Full-stack web and mobile development with modern design systems, bilingual support, and AI features built in. Next.js, React Native, SwiftUI, and Python.",
    priceRange: "$1,500\u2013$15K",
    features: [
      "Custom design system tailored to your brand",
      "Mobile-first responsive websites",
      "Native iOS + responsive web apps",
      "CMS, admin panels, and API integrations",
    ],
    useCases: [
      "Community website with bilingual design and CMS",
      "AI coaching platform with voice and text sessions",
      "Customer-facing app with real-time features",
      "Internal tool with admin dashboard and analytics",
    ],
    relatedVerticals: ["healthcare", "legal", "home-services", "construction"],
  },
  {
    slug: "workflow-automation",
    name: "Workflow Automation",
    icon: "\u26A1",
    tagline: "Eliminate 10\u201320 hours/week of repetitive tasks",
    description:
      "AI-enhanced automation that makes intelligent decisions. Not just rule-based triggers, but systems that reason about your data. Customer service, invoicing, reporting, onboarding.",
    priceRange: "$2.5K\u2013$15K setup + retainer",
    features: [
      "AI decision-making on your existing workflows",
      "Integration with your CRM, ERP, and support tools",
      "Daily progress updates during build sprint",
      "30\u201360 days post-launch support",
    ],
    useCases: [
      "Auto-triage customer support tickets by urgency and topic",
      "Invoice processing from inbox to accounting system",
      "Employee onboarding document generation and routing",
      "Sales lead scoring and automated follow-up sequences",
    ],
    relatedVerticals: [
      "home-services",
      "healthcare",
      "accounting",
      "restaurants",
      "construction",
    ],
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
  heading: "Speak Your Customer\u2019s Language",
  autoDetect:
    "Our AI detects the caller\u2019s language within the first 2\u20133 seconds and switches seamlessly. No menu prompts, no \u2018press 2 for Spanish.\u2019 The caller hears their language from the first word.",
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
    stat: "500K+ businesses \u00B7 78% hire first responder",
    tagline: "Never miss a call again",
    description:
      "78% of homeowners hire the first company that picks up the phone. AI phone answering means you never miss that call. 24/7 emergency triage, smart dispatching, automated follow-up.",
    painPoints: [
      "Missed calls during jobs mean lost customers",
      "After-hours emergencies go to voicemail",
      "Manual dispatching wastes technician time",
      "No follow-up system for repeat business",
    ],
    solutions: [
      "24/7 AI phone answering with emergency triage",
      "Automated dispatching and job assignment",
      "Follow-up calls and review requests after every job",
      "Appointment booking and confirmation in 30+ languages",
    ],
    roiData:
      "My Plumber Plus saw 13% revenue growth from AI voice agents. Pricing: $200\u2013$800/month.",
    relatedServices: ["voice-ai", "workflow-automation"],
  },
  {
    slug: "healthcare",
    name: "Healthcare Clinics",
    stat: "250K+ practices \u00B7 $150B lost to no-shows",
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
      "AI phone answering and scheduling in 30+ languages",
      "Automated appointment reminders via call, text, and email",
      "No-show reduction up to 90% with smart follow-up",
      "Workflow automation for intake forms and referrals",
    ],
    roiData:
      "Pricing: $200\u2013$3,000/month per practice depending on suite breadth.",
    relatedServices: ["voice-ai", "workflow-automation"],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    stat: "660K+ businesses \u00B7 86% AI-comfortable",
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
      "24/7 AI phone answering for reservations and orders",
      "Multilingual support for diverse customer base",
      "Automated order confirmation and follow-up",
      "Workflow automation for scheduling and inventory alerts",
    ],
    roiData:
      "Average $14,700/year savings for a 50-seat restaurant. Pricing: $150\u2013$1,500/month per location.",
    relatedServices: ["voice-ai", "workflow-automation"],
  },
  {
    slug: "legal",
    name: "Legal",
    stat: "450K firms \u00B7 First response wins the client",
    tagline: "AI that answers client calls before your competitors do",
    description:
      "The first firm to respond wins the client. AI phone answering handles intake screening and appointment scheduling 24/7 while your firm website converts visitors into consultations.",
    painPoints: [
      "Missed client calls go straight to your competitor",
      "Client intake is manual and slow",
      "Firm website is outdated and doesn\u2019t convert",
      "After-hours inquiries get no response until morning",
    ],
    solutions: [
      "24/7 AI phone answering with client intake screening",
      "Automated appointment scheduling and confirmation",
      "Modern firm website that converts visitors to consultations",
      "Multilingual support for diverse client base",
    ],
    roiData:
      "First-response advantage: firms that answer within 5 minutes are 10x more likely to win the client. Pricing: $200\u2013$1,500/month.",
    relatedServices: ["voice-ai", "web-mobile-apps"],
  },
  {
    slug: "accounting",
    name: "Accounting",
    stat: "AI adoption 9% \u2192 41% in one year",
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
      "Automated bookkeeping and transaction categorization",
      "AI phone answering for client calls and scheduling",
      "Proactive client communication workflows",
      "Automated reporting and deadline management",
    ],
    roiData:
      "A Coral Springs firm saw cost-per-lead drop 38% and client acquisition rise 67%. Pricing: $200\u2013$5,000/month.",
    relatedServices: ["workflow-automation", "voice-ai"],
  },
  {
    slug: "construction",
    name: "Construction",
    stat: "750K firms \u00B7 First to bid wins",
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
      "Workflow automation for estimating and bid management",
      "Automated change order tracking and notifications",
      "Client-facing project portal with real-time updates",
      "Centralized communication hub for all stakeholders",
    ],
    roiData: "Pricing: $200\u2013$2,000/month.",
    relatedServices: ["workflow-automation", "web-mobile-apps"],
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
    name: "Voice AI Agent",
    price: "$500",
    href: "/sprint",
    description:
      "AI phone agent deployed in 1 week. Answers calls 24/7, books appointments, handles triage.",
    roi: "$250/mo vs $3\u20134K/mo receptionist",
    features: [
      "24/7 AI phone answering",
      "Appointment booking + calendar sync",
      "30+ languages, auto-detected",
      "30 days post-launch support",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Website Sprint",
    price: "$1,500",
    href: "/automation",
    description:
      "Full website delivered in 5 days. Modern design, mobile-first, CMS-ready.",
    roi: "Live site in days, not months",
    features: [
      "Custom design system",
      "Mobile-first responsive",
      "CMS or admin panel",
      "60 days support",
    ],
    cta: "Start Sprint",
    featured: true,
  },
  {
    name: "Full Integration",
    price: "From $5,000",
    href: "/deposit",
    description:
      "Voice AI + Website + Workflow Automation. Custom-scoped, delivered in 4 weeks.",
    roi: "Everything working together",
    features: [
      "Voice AI + Web + Automation bundle",
      "Custom-scoped project",
      "Dedicated Slack channel",
      "90 days support + training",
    ],
    cta: "Book Discovery Call",
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
    label: "Web Development",
    title: "IMAN \u2014 Community Website",
    description:
      "Bilingual Persian/English website with custom design system, prayer times API, and admin CMS. Delivered in 3 days.",
    url: "https://iman-website-seven.vercel.app/",
    stat: "3 days",
    statLabel: "from call to live",
  },
  {
    label: "Voice AI + Web App",
    title: "Rumi \u2014 AI Coaching Platform",
    description:
      "Full-stack AI coaching app with voice agent, real-time sessions, and personalized progress tracking. Built with Next.js, SwiftUI, and LiveKit.",
    url: "https://www.rumi.team",
    stat: "iOS + Web",
    statLabel: "platforms shipped",
  },
];

// ── Helpers ──

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getVerticalBySlug(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}

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
    role: "CEO",
    photo: "/team-ali.jpeg",
    school: "UC Berkeley",
    experience: [
      "AI leader at Business Insider & Spotter ($1B+ each)",
      "Products used by millions, $100M+ revenue impact",
      "PhD in AI/ML from UC Berkeley",
    ],
  },
  {
    name: "Saba Fazel",
    role: "CPO",
    photo: "/team-saba.jpeg",
    school: "UCLA",
    experience: [
      "Converts qualitative user insight into product direction",
      "Data Science @ UCLA",
      "Product strategy for AI-native applications",
    ],
  },
  {
    name: "Parnian Fazel",
    role: "CTO",
    photo: "/team-parnian.jpeg",
    school: "Imperial College London",
    experience: [
      "Built personalization systems processing millions of daily predictions",
      "MSc Machine Learning @ Imperial College London",
      "Full-stack AI: backend, infrastructure, deployment",
    ],
  },
];

// ── Stats ──

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: "$1B+", label: "Combined company valuations led" },
  { value: "10M+", label: "Users touched by our AI systems" },
  { value: "4\u20138 wk", label: "Typical time to first value" },
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
    relatedVerticals: ["home-services", "healthcare", "accounting", "legal"],
  },
  {
    slug: "rag-knowledge-systems",
    name: "RAG Knowledge Systems",
    icon: "\uD83D\uDCDA",
    tagline: "Your company\u2019s knowledge, instantly searchable by AI",
    description:
      "Internal wikis, support docs, contracts, policies \u2014 all searchable by AI in seconds. One legal team saved 10\u201313 hours per week from a deployment that paid for itself in four months.",
    priceRange: "$8K\u2013$45K implementation",
    features: [
      "Custom knowledge base from your documents",
      "Natural language search across all your content",
      "Role-based access controls",
      "Ongoing $1K\u2013$5K/month optimization retainer",
    ],
    useCases: [
      "Legal team searching 10,000+ contracts in natural language",
      "Support agents getting instant answers from your knowledge base",
      "New employee onboarding with AI-powered Q&A",
      "Compliance teams finding relevant policy sections instantly",
    ],
    relatedVerticals: ["legal", "healthcare", "accounting"],
  },
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
    slug: "agentic-ai",
    name: "Agentic AI Implementation",
    icon: "\uD83E\uDD16",
    tagline: "AI agents that run multi-step workflows autonomously",
    description:
      "Unlike chatbots that respond to prompts, AI agents reason, plan, and execute. Managing invoices from inbox to payment, running customer service including refunds and record updates, orchestrating sales sequences across channels.",
    priceRange: "$5K\u2013$50K projects",
    features: [
      "Workflow audit to identify agent opportunities",
      "Custom agent design and deployment",
      "Multi-agent ecosystem architecture",
      "Ongoing monitoring and optimization",
    ],
    useCases: [
      "End-to-end invoice processing: inbox to payment to ledger",
      "Customer service agent: refunds, exchanges, record updates",
      "Sales agent: lead qualification, outreach, follow-up sequences",
      "Operations agent: inventory reordering, vendor communication",
    ],
    relatedVerticals: ["accounting", "restaurants", "construction"],
  },
  {
    slug: "web-mobile-apps",
    name: "Web & Mobile Apps",
    icon: "\uD83D\uDCF1",
    tagline: "AI-native applications where intelligence is the core feature",
    description:
      "We don\u2019t bolt AI onto existing apps. We design products where intelligence is the core feature. Full-stack development with Next.js, React Native, SwiftUI, and Python.",
    priceRange: "Custom scope",
    features: [
      "AI-first product architecture",
      "Native iOS + responsive web",
      "Real-time AI features (voice, chat, analysis)",
      "Full deployment to cloud infrastructure",
    ],
    useCases: [
      "AI coaching platform with voice and text sessions",
      "Customer-facing AI assistant for your product",
      "Internal tool with AI-powered insights and automation",
      "Mobile app with on-device AI features",
    ],
    relatedVerticals: ["healthcare", "legal", "home-services"],
  },
  {
    slug: "document-processing",
    name: "Document Processing",
    icon: "\uD83D\uDCC4",
    tagline: "Process documents 80% faster at 50% lower cost",
    description:
      "Extract, classify, and route documents automatically. Invoices, contracts, forms. Once integrated, switching costs make this extremely sticky. ROI payback in 4\u201313 months.",
    priceRange: "$10K\u2013$50K setup",
    features: [
      "Automated data extraction from any document format",
      "Classification and intelligent routing",
      "Integration with your existing document management system",
      "99%+ accuracy on structured documents",
    ],
    useCases: [
      "Invoice extraction: vendor, amount, line items, due date",
      "Contract analysis: key terms, obligations, expiration dates",
      "Form processing: applications, claims, registrations",
      "Receipt digitization and expense categorization",
    ],
    relatedVerticals: ["legal", "accounting", "construction"],
  },
  {
    slug: "ai-analytics",
    name: "AI Analytics Dashboards",
    icon: "\uD83D\uDCCA",
    tagline: "Real-time decision support that turns data into action",
    description:
      "Cash flow forecasting, demand prediction, customer behavior analytics. 53% of SMBs say AI-powered cash flow forecasting would solve a critical pain point.",
    priceRange: "$8K\u2013$30K implementation",
    features: [
      "Custom dashboards with AI-powered insights",
      "Predictive analytics and forecasting",
      "Automated report generation",
      "Integration with your data sources",
    ],
    useCases: [
      "Revenue forecasting with confidence intervals",
      "Customer churn prediction and early warning",
      "Demand forecasting for inventory optimization",
      "Marketing ROI attribution across channels",
    ],
    relatedVerticals: ["restaurants", "accounting", "home-services"],
  },
  {
    slug: "ai-strategy",
    name: "AI Strategy & Compliance",
    icon: "\uD83D\uDEE1\uFE0F",
    tagline: "Know where AI fits and how to stay compliant",
    description:
      "Readiness assessment, use case prioritization, and governance framework. EU AI Act takes effect August 2026 with fines up to \u20AC35M. Most SMBs have zero AI governance.",
    priceRange: "$2K\u2013$8K assessment",
    features: [
      "AI readiness assessment of your current operations",
      "Prioritized list of AI use cases with estimated ROI",
      "Governance framework for responsible AI usage",
      "Compliance roadmap for EU AI Act and local regulations",
    ],
    useCases: [
      "First-time AI adoption: where to start, what to prioritize",
      "AI governance audit for companies already using AI tools",
      "Compliance assessment ahead of EU AI Act deadline",
      "Shadow AI detection: what tools employees are already using",
    ],
    relatedVerticals: ["healthcare", "legal", "accounting"],
  },
  {
    slug: "ai-marketing",
    name: "AI Marketing & SEO",
    icon: "\uD83D\uDD0D",
    tagline: "AI-driven marketing at 20\u201350% premium over traditional",
    description:
      "AI-driven content creation, SEO optimization, and campaign automation. Commands a premium over traditional marketing with measurable lift. Average retainer $3,200 for AI SEO.",
    priceRange: "$2K\u2013$20K/mo retainer",
    features: [
      "AI-generated content optimized for search and conversion",
      "Automated campaign management across channels",
      "Performance analytics with AI-powered insights",
      "A/B testing automation and optimization",
    ],
    useCases: [
      "SEO content pipeline: research, create, optimize, publish",
      "Email marketing with AI personalization and timing",
      "Social media content generation and scheduling",
      "Ad campaign optimization with AI bidding strategies",
    ],
    relatedVerticals: ["restaurants", "home-services", "healthcare"],
  },
];

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
      "Smart dispatching integrated with ServiceTitan or Housecall Pro",
      "Automated follow-up calls and review requests",
      "Appointment booking and confirmation",
    ],
    roiData:
      "My Plumber Plus saw 13% revenue growth from AI voice agents. Pricing: $200\u2013$800/month.",
    relatedServices: ["voice-ai", "workflow-automation", "ai-marketing"],
  },
  {
    slug: "healthcare",
    name: "Healthcare Clinics",
    stat: "250K+ practices \u00B7 $150B lost to no-shows",
    tagline: "Reduce no-shows up to 90%",
    description:
      "No-shows cost US healthcare $150+ billion annually. Documentation consumes 2\u20133 hours of provider time daily. Phone hold times drive patients to competitors.",
    painPoints: [
      "No-shows cost $150+ billion annually across US healthcare",
      "Documentation consumes 2\u20133 hours of provider time daily",
      "Phone hold times drive patients to competitors",
      "Manual appointment reminders are unreliable",
    ],
    solutions: [
      "AI phone answering and scheduling (reduce no-shows up to 90%)",
      "Automated appointment reminders via call, text, and email",
      "Revenue cycle intelligence: coding suggestions, denial prediction",
      "HIPAA-compliant, integrated with Athenahealth, Epic, or DrChrono",
    ],
    roiData:
      "Pricing: $200\u2013$3,000/month per practice depending on suite breadth.",
    relatedServices: ["voice-ai", "document-processing", "ai-strategy"],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    stat: "660K+ businesses \u00B7 86% AI-comfortable",
    tagline: "Cut food waste 30\u201340% with demand forecasting",
    description:
      "AI demand forecasting reduces food waste by 30\u201340%, saving an average $14,700/year for a 50-seat restaurant. Labor scheduling AI cuts overtime 15\u201325%.",
    painPoints: [
      "Food waste eats 5\u201310% of revenue",
      "Labor scheduling is manual and imprecise",
      "No demand forecasting for ordering",
      "Menu pricing is gut-feel, not data-driven",
    ],
    solutions: [
      "POS-integrated demand forecasting (Toast, Square, Clover, Lightspeed)",
      "Inventory optimization based on predicted demand",
      "AI labor scheduling that reduces overtime 15\u201325%",
      "Menu engineering: pricing and placement optimization",
    ],
    roiData:
      "Average $14,700/year savings for a 50-seat restaurant. Pricing: $150\u2013$1,500/month per location.",
    relatedServices: ["ai-analytics", "workflow-automation", "agentic-ai"],
  },
  {
    slug: "legal",
    name: "Legal",
    stat: "450K firms \u00B7 94% accuracy on contracts",
    tagline: "AI that reads contracts faster than your associates",
    description:
      "AI client intake, contract review, and document analysis. Fine-tuned models achieve 94% accuracy on contracts. Data stays on-premises for regulated practices.",
    painPoints: [
      "Associate hours on contract review are expensive",
      "Client intake is manual and slow",
      "Document discovery takes weeks",
      "Knowledge trapped in individual lawyers' heads",
    ],
    solutions: [
      "AI contract review with 94% accuracy (outperforms GPT-5 at 87%)",
      "Automated client intake screening and scheduling",
      "Natural language search across all firm documents",
      "On-premises deployment for data sovereignty",
    ],
    roiData:
      "One legal team saved 10\u201313 hours/week from a $34K deployment. Payback in 4 months. Pricing: $200\u2013$1,500/month.",
    relatedServices: [
      "rag-knowledge-systems",
      "document-processing",
      "voice-ai",
    ],
  },
  {
    slug: "accounting",
    name: "Accounting",
    stat: "AI adoption 9% \u2192 41% in one year",
    tagline: "AI-enhanced firms command premium positioning",
    description:
      "AI adoption in accounting jumped from 9% to 41% in one year. Automated bookkeeping, advisory analytics, and client communication position your firm as forward-thinking.",
    painPoints: [
      "Manual bookkeeping is time-consuming and error-prone",
      "Advisory services are limited by time, not knowledge",
      "Client communication is reactive, not proactive",
      "Compliance monitoring is manual",
    ],
    solutions: [
      "Automated bookkeeping and categorization",
      "AI advisory analytics for proactive client insights",
      "Automated client communication and reporting",
      "Compliance monitoring and deadline management",
    ],
    roiData:
      "A Coral Springs firm saw cost-per-lead drop 38% and client acquisition rise 67%. Pricing: $200\u2013$5,000/month.",
    relatedServices: [
      "workflow-automation",
      "agentic-ai",
      "document-processing",
    ],
  },
  {
    slug: "construction",
    name: "Construction",
    stat: "750K firms \u00B7 10\u00D7 faster estimating",
    tagline: "AI estimating that cuts bid time from days to hours",
    description:
      "AI estimating, project scheduling, and document processing for bids. Reduces human error and accelerates proposal turnaround by 10\u00D7.",
    painPoints: [
      "Estimating takes days of manual work per bid",
      "Change order tracking is chaotic",
      "Document management across projects is fragmented",
      "Scheduling conflicts waste crew time",
    ],
    solutions: [
      "AI-powered estimating from plans and specs",
      "Automated change order tracking and impact analysis",
      "Document processing for permits, contracts, and submittals",
      "AI project scheduling with resource optimization",
    ],
    roiData: "Pricing: $200\u2013$2,000/month.",
    relatedServices: [
      "document-processing",
      "agentic-ai",
      "workflow-automation",
    ],
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
    name: "AI Workflow Sprint",
    price: "$500",
    href: "/sprint",
    description:
      "5-day focused build sprint. One AI automation workflow delivered as working software.",
    roi: "Most clients see payback within the first month",
    features: [
      "1 AI workflow delivered",
      "5-day build sprint",
      "Daily progress updates",
      "30 days post-launch support",
    ],
    cta: "Start Sprint",
    featured: false,
  },
  {
    name: "AI Automation Package",
    price: "$1,500",
    href: "/automation",
    description:
      "Multi-workflow automation build. Up to 3 connected AI workflows in 2 weeks.",
    roi: "Typical 3\u20135\u00D7 ROI within 90 days",
    features: [
      "Up to 3 connected workflows",
      "2-week build timeline",
      "Daily progress updates",
      "60 days support + team training",
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Full AI Integration",
    price: "From $5,000",
    href: "/deposit",
    description:
      "End-to-end AI automation for your business. Custom-scoped, delivered in 4 weeks.",
    roi: "Enterprise-grade automation at a fraction of Big 4 pricing",
    features: [
      "Custom-scoped project",
      "4-week build timeline",
      "Dedicated Slack channel",
      "90 days support + docs + training",
    ],
    cta: "Get Started",
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
    label: "iOS / Web App Development",
    title: "Rumi \u2014 AI Coaching Platform",
    description:
      "Full-stack AI coaching app with voice agent, real-time sessions, and personalized progress tracking. Built with Next.js, SwiftUI, and LiveKit.",
    url: "https://www.rumi.team",
    stat: "iOS + Web",
    statLabel: "platforms shipped",
  },
  {
    label: "B2B Dashboard Development",
    title: "Rumi Agent \u2014 Retention Analytics",
    description:
      "Data-driven retention dashboard with AI-powered decision engine, cohort analysis, and automated outreach optimization.",
    url: "https://www.rumiagent.com",
    stat: "12 pages",
    statLabel: "analytics dashboard",
  },
];

// ── Helpers ──

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getVerticalBySlug(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}

// ── The long-form copy for the five AI employee role pages ──
//
// WHY THIS IS ITS OWN MODULE. src/components/footer.tsx is a client component
// and it imports AI_EMPLOYEES to build the roles column, which means every byte
// reachable from that array is compiled into the client bundle — on every route,
// because the footer renders on every page. The three fields below are rendered
// ONLY by the server-rendered /services/[slug] page. Measured before the split:
// the shared chunk carrying this prose plus the industry prose was 7.9 KB gzip,
// downloaded on every page of the site, and no page but six of them rendered a
// word of it.
//
// Splitting the record out is what actually removes them: a derived projection
// (`AI_EMPLOYEES.map(r => ({ slug, name }))`) still imports the fat array, so the
// bundler keeps it. The data has to physically live somewhere the client graph
// does not reach.
//
// KEEP THIS IMPORTED ONLY BY src/app/services/[slug]/page.tsx. src/lib/data.ts
// must not import it back, or the split is undone silently — the footer would
// pull it in through the same edge it pulls AI_EMPLOYEES through.
//
// THE TONE RULE APPLIES HERE IN FULL: price the WORK, never the person. No role
// "replaces" anyone and no human job title is ever named as the thing being cut.
// Every string here is walked by tests/unit/tone.test.ts and by the
// empty-string check in tests/unit/copy-invariants.test.ts, the same as data.ts.

import { AI_EMPLOYEES } from "./data";

export interface AIEmployeeDetail {
  description: string;
  features: string[];
  useCases: string[];
}

export const AI_EMPLOYEE_DETAILS: Record<string, AIEmployeeDetail> = {
  "ai-receptionist": {
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
  "ai-executive-assistant": {
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
  "ai-social-media-manager": {
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
  "ai-office-manager": {
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
  "ai-chief-of-staff": {
    description:
      "All three roles at once, for owners who would rather hire one thing than three. Calls answered around the clock, the inbox and calendar run, the CRM kept honest, and the social accounts posting and messaging on schedule — all sharing the same context, so what a customer said on the phone in March shows up when they get a message in April. You still approve anything that matters before it goes out. All three roles for $900/mo against the ~$12,000/mo of work they cover — 7.5%, better than the 10% rule every role on this site is priced on.",
    features: [
      "The AI Receptionist, Executive Assistant, and Social Media Manager together",
      "One shared context across phone, inbox, calendar, CRM, and social",
      "A single daily brief covering everything the three roles handled",
      "One approval queue for calls, drafts, posts, and DMs",
      "Our team manages all three and reports on them monthly",
      // Two separate savings, and they are easy to conflate. The one below is
      // the ARITHMETIC against buying the roles one at a time: $900/mo against
      // $300 + $500 + $400 = $1,200/mo. Both figures are pinned against the
      // price data in tests/unit/ai-employees.test.ts.
      //
      // The other is the 10% rule. Each core role costs a tenth of its own
      // workload; this bundle costs $900 against the 12,000 those three
      // workloads sum to, so it lands at 7.5% — better than the rule, never
      // worse. That is stated in the description above, and the "at most 10%"
      // direction is what the bundle case in ai-employees.test.ts asserts. The
      // "90% off" badge is a floor here, not the exact figure.
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
};

// A role without a detail record renders a role page with no description, no
// feature list and no use cases, and the type above (`Record<string, …>`) will
// not catch it — the slugs live in the other module. This is a build-time check,
// not a test-time one: an unmatched slug should fail loudly at prerender rather
// than ship five empty sections.
for (const role of AI_EMPLOYEES) {
  if (!AI_EMPLOYEE_DETAILS[role.slug]) {
    throw new Error(
      `AI_EMPLOYEE_DETAILS is missing "${role.slug}" — /services/${role.slug} would render an empty page.`
    );
  }
}

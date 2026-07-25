"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ── Languages offered by the landing-page dropdown ──
// English and Farsi are fully translated, human-quality (the two languages the
// team speaks and the site claims — implementation guide §7). Add a language by
// translating the EN dictionary below and dropping it into DICT + LANGUAGES —
// every section reads from here, so the whole page translates automatically.
export const LANGUAGES = [
  { code: "en", label: "English", rtl: false },
  { code: "fa", label: "فارسی", rtl: true },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

// ── Canonical English dictionary (single source of truth for landing copy) ──
const EN = {
  nav: {
    aiEmployees: "AI Employees",
    industries: "Industries",
    team: "Team",
    faq: "FAQ",
    bookCall: "Book a Call",
  },
  hero: {
    eyebrow: "Head of HR for AI Employees",
    // Founder-chosen headline. The 90% is a discount on what the WORK costs —
    // never a cut to anyone's job. Keep it framed as a saving the buyer gains,
    // and keep the sub anchored on the work so the two read together.
    headline: "Get 90% off your hiring.",
    headlineAccent: "Hire AI employees that work 24/7.",
    sub: "Rumi recruits AI employees trained on your business, deploys them in weeks, and manages them like any other hire. They take the repetitive work off your team for about a tenth of what that work costs today — so your people stay on the work that needs a person.",
    ctaPrimary: "Book a Call",
  },
  // ── The lead offer. Prices here are the customer-facing display strings
  // (currency + numerals differ per locale); the canonical values live in
  // AI_EMPLOYEES in src/lib/data.ts. Keep the two in step. ──
  roles: {
    eyebrow: "What we do",
    heading: "Five AI employees. Hire the ones you need.",
    sub: "Each one is recruited for a specific job, trained on your business, live in one to three weeks, and managed by our team. Pricing starts at roughly a tenth of what that work costs today.",
    workloadLabel: "Covers",
    savingLabel: "90% off",
    cta: "See the role",
    bundlesLabel: "Or hire more than one",
    // "than several", not "than three" — this line introduces both bundles, and
    // the AI Office Manager is two roles. Only the Chief of Staff is three.
    bundlesSub: "Two bundles, for owners who would rather hire one thing than several. The roles inside share one calendar, one customer record, and one approval queue.",
    pricingLink: "See all five roles and pricing",
    whiteLabel: "Every role can also run under your own brand — your name on it, your logo, a voice you choose. Your customers only ever see you.",
    // `slug` joins each translated entry to its canonical role in
    // AI_EMPLOYEES (src/lib/data.ts), which owns the icon, the order, and the
    // detail-page URL. The join is by slug, never by array position, so a
    // reordered or missing translation cannot link to the wrong role page.
    items: [
      {
        slug: "ai-receptionist",
        name: "AI Receptionist",
        price: "from $300/mo",
        workload: "~$3,000/mo of front-desk work",
        tagline:
          "Answers every call, day or night, and turns it into a booked appointment.",
      },
      {
        slug: "ai-executive-assistant",
        name: "AI Executive Assistant",
        price: "from $500/mo",
        workload: "~$5,000/mo of executive-support work",
        tagline:
          "Works inside your inbox, calendar, and CRM — and briefs you at 9am.",
      },
      {
        slug: "ai-social-media-manager",
        name: "AI Social Media Manager",
        price: "from $400/mo",
        workload: "~$4,000/mo of social media work",
        // The DMs are announcements to EXISTING clients only — keep that scope
        // in the tagline; without it this reads as general DM outreach.
        tagline:
          "Twelve posts, four shorts, and personal DMs to the clients you already have, in your own voice.",
      },
    ],
    bundles: [
      {
        slug: "ai-office-manager",
        name: "AI Office Manager",
        price: "from $800/mo",
        workload: "~$8,000/mo of front-office work",
        tagline: "The Receptionist and the Executive Assistant, hired together.",
      },
      {
        slug: "ai-chief-of-staff",
        name: "AI Chief of Staff",
        price: "from $900/mo",
        workload: "~$9,000+/mo of front-office, admin and marketing work",
        tagline:
          "Phone, inbox, and social — the whole front office in one hire.",
      },
    ],
  },
  extras: {
    eyebrow: "Extra services",
    heading: "Need more than an AI employee?",
    sub: "The roles above cover the work that repeats. These are the things we also build and run for a business — the website, the app, the content, the visibility — on their own or alongside any role.",
    // Keep this list strictly complementary to the five roles above. The front
    // desk and the lead follow-up that used to sit here are the AI
    // Receptionist's job and are priced there; listing them again unpriced put
    // the same capability on the page twice.
    items: [
      {
        name: "A modern website",
        tagline:
          "Fast, mobile, built to convert, and structured so search engines and AI engines can read it.",
      },
      {
        name: "A mobile app",
        tagline:
          "Your business in your customers' pocket. We design, build, and ship it to the App Store and Google Play.",
      },
      {
        name: "A content plan you shoot and post yourself",
        tagline:
          "We tell you what to post, write the scripts, and study what's working for competitors in your space, so you're not guessing — you or your team shoot the photos and video and hit publish. Want that part handled too? That is the AI Social Media Manager, which produces and posts for you.",
      },
      {
        name: "Found, everywhere people look",
        tagline:
          "We make your site and content easy to find, by Google, and by ChatGPT, Claude, and Perplexity, the fast-growing way customers are starting to search. However someone looks for you, you show up.",
      },
    ],
  },
  // This is the only process explanation on the homepage, and it sits two
  // sections under the five role cards — so it describes hiring a role, not
  // building a website. Facts here must match ONBOARDING_NOTE in
  // src/lib/data.ts, which is what /services and the role pages render.
  how: {
    eyebrow: "How it works",
    heading: "From the first conversation to a role that's live and managed",
    steps: [
      {
        title: "Tell us where the week goes",
        desc: "We start with a real conversation, not a sales pitch. What's actually eating the hours — the calls that go to voicemail, the inbox that never empties, the posting that keeps slipping?",
      },
      {
        title: "We name the roles that earn their cost",
        desc: "Usually one or two, not five, and never a package. If a single role covers most of it, we say so. If a website or a content plan would do more for you right now than any role, we say that instead.",
      },
      {
        title: "We train it, you approve the work",
        desc: "The role learns your own calls, your inbox, your calendar, your tone of voice, and the systems you already run on. Drafts, posts, and messages wait for your yes before anything goes out.",
      },
      {
        title: "Live in one to three weeks, and we keep managing it",
        desc: "Our team tunes it, fixes it, and reports back — there's no dashboard you're expected to run. Anything else we build for you, a website or an app, runs the same way alongside it.",
      },
    ],
  },
  team: {
    eyebrow: "Team",
    heading: "Founded and based in Los Angeles",
    sub: "A small, senior team that talks to you directly — and does the work.",
    cta: "Meet the team",
  },
  mission: {
    eyebrow: "Why we're here",
    missionLabel: "Our Mission",
    mission:
      "We exist to take the work that repeats off a business owner's plate — the calls, the inbox, the follow-up, the posting, and the website behind all of it — so they can get back to running their business. We listen first, fix exactly what's missing, and stay honest about what we can actually deliver.",
    visionLabel: "Our Vision",
    vision:
      "A real estate agent, a salon owner, or a family-run shop should be as easy to find, in any language their customers speak, as a company with a marketing department ten times their size. That shouldn't require hiring an agency they can't afford or a developer they don't have. We think it just requires the right team doing the work for them.",
  },
  cta: {
    title: "Let's find out what's actually holding you back.",
    description:
      "Book a call. We'll ask about your business, tell you plainly where you're losing customers, and offer exactly what would help — nothing you don't need.",
    button: "Book a Call",
    sub: "A real conversation, not a sales pitch. In English or Farsi.",
  },
  footer: {
    tagline: "Your business, always running. Even when you're not.",
    roles: "AI Employees",
    vert: "Industries",
    company: "Company",
    bookCall: "Book a Call",
    rights: "Copyright ©2026, Rumi, Inc.",
    terms: "Terms & Conditions",
    privacy: "Privacy",
  },
  langLabel: "Language",
  // Forward-pointing arrow appended to link and button labels. It lives in the
  // dictionary because direction is language-dependent: under dir="rtl" the
  // glyph is the last logical character, so it lands at the left end of the
  // line and must point left to still mean "onward".
  arrow: "→",
};

export type Dict = typeof EN;

// FA is a human-quality translation mirroring EN's shape.
const FA: Dict = {
  nav: {
    aiEmployees: "کارمندان هوش مصنوعی",
    industries: "حوزه‌های کاری",
    team: "تیم",
    faq: "پرسش‌های متداول",
    bookCall: "رزرو تماس",
  },
  hero: {
    eyebrow: "مدیر منابع انسانی کارمندان هوش مصنوعی",
    headline: "۹۰٪ در هزینه استخدام صرفه‌جویی کنید.",
    headlineAccent: "کارمندان هوش مصنوعی که ۲۴ ساعته کار می‌کنند.",
    sub: "رومی کارمندان هوش مصنوعی را استخدام می‌کند، بر اساس کسب‌وکار شما آموزش می‌دهد، در چند هفته راه‌اندازی می‌کند و مثل هر نیروی دیگری آن‌ها را مدیریت می‌کند. آن‌ها کارهای تکراری را از دوش تیم شما برمی‌دارند، با حدود یک‌دهم هزینه‌ای که امروز برای همان کار پرداخت می‌شود — تا آدم‌های شما روی کاری بمانند که به یک انسان نیاز دارد.",
    ctaPrimary: "رزرو تماس",
  },
  roles: {
    eyebrow: "چه کاری انجام می‌دهیم",
    heading: "پنج کارمند هوش مصنوعی. هر کدام را لازم دارید استخدام کنید.",
    sub: "هر نقش برای یک کار مشخص استخدام می‌شود، بر اساس کسب‌وکار شما آموزش می‌بیند، در یک تا سه هفته فعال می‌شود و توسط تیم ما مدیریت می‌شود. قیمت‌ها از حدود یک‌دهم هزینه امروز همان کار شروع می‌شود.",
    workloadLabel: "پوشش می‌دهد",
    savingLabel: "۹۰٪ ارزان‌تر",
    cta: "دیدن این نقش",
    bundlesLabel: "یا بیش از یکی استخدام کنید",
    bundlesSub: "دو بسته، برای صاحبان کسب‌وکاری که ترجیح می‌دهند یک چیز استخدام کنند نه چند چیز. نقش‌های داخل هر بسته یک تقویم، یک پرونده مشتری و یک صف تأیید مشترک دارند.",
    pricingLink: "دیدن هر پنج نقش و قیمت‌ها",
    whiteLabel: "هر نقش می‌تواند با برند خودتان هم اجرا شود — نام شما، لوگوی شما، و صدایی که خودتان انتخاب می‌کنید. مشتری‌های شما فقط شما را می‌بینند.",
    items: [
      {
        slug: "ai-receptionist",
        name: "پذیرشگر هوش مصنوعی",
        price: "از ۳۰۰ دلار در ماه",
        workload: "حدود ۳٬۰۰۰ دلار در ماه کار پذیرش",
        tagline:
          "به هر تماسی، شبانه‌روز، پاسخ می‌دهد و آن را به یک نوبت ثبت‌شده تبدیل می‌کند.",
      },
      {
        slug: "ai-executive-assistant",
        name: "دستیار اجرایی هوش مصنوعی",
        price: "از ۵۰۰ دلار در ماه",
        workload: "حدود ۵٬۰۰۰ دلار در ماه کار پشتیبانی اجرایی",
        tagline:
          "درون ایمیل، تقویم و CRM شما کار می‌کند — و ساعت ۹ صبح خلاصه روز را می‌دهد.",
      },
      {
        slug: "ai-social-media-manager",
        name: "مدیر شبکه‌های اجتماعی هوش مصنوعی",
        price: "از ۴۰۰ دلار در ماه",
        workload: "حدود ۴٬۰۰۰ دلار در ماه کار شبکه‌های اجتماعی",
        tagline:
          "دوازده پست، چهار ویدیوی کوتاه، و پیام‌های شخصی به مشتری‌هایی که همین حالا دارید، با لحن خودتان.",
      },
    ],
    bundles: [
      {
        slug: "ai-office-manager",
        name: "مدیر دفتر هوش مصنوعی",
        price: "از ۸۰۰ دلار در ماه",
        workload: "حدود ۸٬۰۰۰ دلار در ماه کار اداری و پذیرش",
        tagline: "پذیرشگر و دستیار اجرایی، با هم استخدام می‌شوند.",
      },
      {
        slug: "ai-chief-of-staff",
        name: "رئیس دفتر هوش مصنوعی",
        price: "از ۹۰۰ دلار در ماه",
        workload: "حدود ۹٬۰۰۰+ دلار در ماه کار اداری، پذیرش و بازاریابی",
        tagline:
          "تلفن، ایمیل و شبکه‌های اجتماعی — تمام کار اداری، پذیرش و بازاریابی در یک استخدام.",
      },
    ],
  },
  extras: {
    eyebrow: "خدمات تکمیلی",
    heading: "به چیزی بیشتر از یک کارمند هوش مصنوعی نیاز دارید؟",
    sub: "نقش‌های بالا کارهای تکراری را پوشش می‌دهند. این‌ها چیزهای دیگری است که ما برای یک کسب‌وکار می‌سازیم و اداره می‌کنیم — وب‌سایت، اپلیکیشن، محتوا، و دیده‌شدن — چه به‌تنهایی و چه در کنار هر نقشی.",
    items: [
      {
        name: "یک وب‌سایت مدرن",
        tagline:
          "سریع، موبایل‌محور، طراحی‌شده برای جذب مشتری، و ساختاریافته به‌گونه‌ای که موتورهای جست‌وجو و هوش مصنوعی بتوانند آن را بخوانند.",
      },
      {
        name: "یک اپلیکیشن موبایل",
        tagline:
          "کسب‌وکار شما در جیب مشتری‌هایتان. ما آن را طراحی، ساخته و در App Store و Google Play منتشر می‌کنیم.",
      },
      {
        name: "برنامه محتوایی که خودتان تصویر می‌گیرید و منتشر می‌کنید",
        tagline:
          "به شما می‌گوییم چه چیزی منتشر کنید، متن‌ها را می‌نویسیم و بررسی می‌کنیم چه چیزی برای رقبای شما جواب می‌دهد، تا حدس نزنید — عکس و ویدیو را خودتان یا تیمتان می‌گیرید و منتشر می‌کنید. می‌خواهید این بخش هم انجام شود؟ آن مدیر شبکه‌های اجتماعی هوش مصنوعی است که تولید و انتشار را برایتان انجام می‌دهد.",
      },
      {
        name: "پیدا شدن، هر جا که مردم نگاه می‌کنند",
        tagline:
          "کاری می‌کنیم سایت و محتوای شما راحت پیدا شود، با Google و با ChatGPT، Claude و Perplexity — روش رو به رشدی که مشتری‌ها با آن جست‌وجو را شروع کرده‌اند. هر طور کسی دنبال شما بگردد، شما پیدا می‌شوید.",
      },
    ],
  },
  how: {
    eyebrow: "چطور کار می‌کند",
    heading: "از اولین گفت‌وگو تا نقشی که فعال است و ما مدیریتش می‌کنیم",
    steps: [
      {
        title: "بگویید وقت‌تان کجا می‌رود",
        desc: "ما با یک گفت‌وگوی واقعی شروع می‌کنیم، نه یک ارائه فروش. واقعاً چه چیزی ساعت‌ها را می‌خورد — تماس‌هایی که به پیام‌گیر می‌روند، ایمیلی که هرگز خالی نمی‌شود، انتشاری که مدام عقب می‌افتد؟",
      },
      {
        title: "نقش‌هایی را نام می‌بریم که هزینه‌شان را درمی‌آورند",
        desc: "معمولاً یکی یا دو نقش، نه پنج نقش، و هرگز یک بسته آماده. اگر یک نقش بیشترش را پوشش می‌دهد، همان را می‌گوییم. و اگر یک وب‌سایت یا یک برنامه محتوا الان بیشتر از هر نقشی به شما کمک می‌کند، صریح همان را می‌گوییم.",
      },
      {
        title: "آموزشش می‌دهیم، شما کار را تأیید می‌کنید",
        desc: "نقش با تماس‌های خودتان، ایمیل، تقویم، لحن صدا و سیستم‌هایی که همین حالا استفاده می‌کنید آموزش می‌بیند. پیش‌نویس‌ها، پست‌ها و پیام‌ها منتظر تأیید شما می‌مانند و پیش از آن چیزی بیرون نمی‌رود.",
      },
      {
        title: "در یک تا سه هفته فعال می‌شود و ما مدیریتش می‌کنیم",
        desc: "تیم ما آن را تنظیم می‌کند، اشکالاتش را برمی‌دارد و گزارش می‌دهد — هیچ داشبوردی نیست که انتظار داشته باشیم خودتان اداره کنید. هر چیز دیگری هم که برایتان بسازیم، وب‌سایت یا اپلیکیشن، در کنارش همین‌طور پیش می‌رود.",
      },
    ],
  },
  team: {
    eyebrow: "تیم",
    heading: "تأسیس‌شده و مستقر در لس‌آنجلس",
    sub: "یک تیم کوچک و باتجربه که مستقیم با شما صحبت می‌کند — و کار را انجام می‌دهد.",
    cta: "آشنایی با تیم",
  },
  mission: {
    eyebrow: "چرا اینجاییم",
    missionLabel: "مأموریت ما",
    mission:
      "ما هستیم تا کارهای تکراری را از دوش صاحب کسب‌وکار برداریم — تماس‌ها، ایمیل، پیگیری، انتشار در شبکه‌های اجتماعی، و وب‌سایتی که پشت همه این‌هاست — تا او بتواند به اداره کسب‌وکارش برگردد. ما اول گوش می‌دهیم، دقیقاً چیزی را که کم است درست می‌کنیم، و درباره آنچه واقعاً می‌توانیم انجام دهیم صادق می‌مانیم.",
    visionLabel: "چشم‌انداز ما",
    vision:
      "یک مشاور املاک، یک صاحب سالن زیبایی، یا یک مغازه خانوادگی باید به همان اندازه راحت پیدا شود، به هر زبانی که مشتری‌هایش صحبت می‌کنند، که یک شرکت با یک بخش بازاریابی ده برابر بزرگ‌تر. این نباید نیازمند استخدام یک آژانسی باشد که از عهده‌اش برنمی‌آیند یا یک برنامه‌نویسی که ندارند. ما فکر می‌کنیم فقط به تیم درستی نیاز دارد که کار را برایشان انجام دهد.",
  },
  cta: {
    title: "بیایید بفهمیم واقعاً چه چیزی جلوی شما را گرفته.",
    description:
      "یک تماس رزرو کنید. درباره کسب‌وکارتان می‌پرسیم، صریح می‌گوییم کجا مشتری از دست می‌دهید، و دقیقاً همان چیزی را پیشنهاد می‌دهیم که کمک می‌کند — هیچ چیز اضافه‌ای که به آن نیاز ندارید.",
    button: "رزرو تماس",
    sub: "یک گفت‌وگوی واقعی، نه یک ارائه فروش. به انگلیسی یا فارسی.",
  },
  footer: {
    tagline: "کسب‌وکار شما، همیشه در حال کار. حتی وقتی شما نیستید.",
    roles: "کارمندان هوش مصنوعی",
    vert: "حوزه‌های کاری",
    company: "شرکت",
    bookCall: "رزرو تماس",
    rights: "حق نشر ©۲۰۲۶، Rumi, Inc.",
    terms: "شرایط و قوانین",
    privacy: "حریم خصوصی",
  },
  langLabel: "زبان",
  // RTL: the arrow is the last logical character, so it renders at the left end
  // of the line — it has to point left to still read as "onward".
  arrow: "←",
};

const DICT: Record<Lang, Dict> = { en: EN, fa: FA };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict; dir: "ltr" | "rtl" };
const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: EN, dir: "ltr" });

const STORAGE_KEY = "rumi-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore saved language on mount (client-only; SSR renders English).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && LANGUAGES.some((l) => l.code === saved)) setLangState(saved);
    } catch {}
  }, []);

  const rtl = LANGUAGES.find((l) => l.code === lang)?.rtl ?? false;

  // Keep <html lang>/<dir> in sync so RTL + a11y + fonts behave correctly.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [lang, rtl]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  return (
    <LangCtx.Provider value={{ lang, setLang, t: DICT[lang], dir: rtl ? "rtl" : "ltr" }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useT(): Ctx {
  return useContext(LangCtx);
}

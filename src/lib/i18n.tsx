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
    industries: "Industries",
    team: "Team",
    faq: "FAQ",
    bookCall: "Book a Call",
  },
  hero: {
    headline: "Don't get left behind.",
    headlineAccent: "We handle the digital work, so you can run your business.",
    sub: "Your website, your social presence, and how easily customers find you — including when they ask ChatGPT, Claude, or Perplexity who to hire. One team builds it, runs it, and keeps it working, so you can get back to your business.",
    ctaPrimary: "Book a Call",
  },
  pillars: {
    eyebrow: "What we do",
    heading: "Everywhere your customers look — including AI.",
    sub: "You run your business. We build and run the digital side — your website, your visibility, your follow-up — and keep one team accountable for all of it.",
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
        name: "Content strategy, scripts, and competitor insight",
        tagline:
          "We tell you what to post and write it for you, and we study what's working for competitors in your space, so you're not guessing. You or your team handle the actual photos, video, and posting.",
      },
      {
        name: "Found, everywhere people look",
        tagline:
          "We make your site and content easy to find, by Google, and by ChatGPT, Claude, and Perplexity, the fast-growing way customers are starting to search. However someone looks for you, you show up.",
      },
      {
        name: "An AI front desk, in every language",
        tagline:
          "A 24/7 front desk, chat or phone, that answers customers in their own language, captures the lead, and hands complex requests to you.",
      },
      {
        name: "Leads that don't go cold",
        tagline:
          "We score and qualify every lead, follow up automatically in their language until they book, and manage the reviews that keep you visible.",
      },
    ],
  },
  how: {
    eyebrow: "How it works",
    heading: "From first conversation to a live presence you don't have to manage",
    steps: [
      {
        title: "Tell us what's broken",
        desc: "We start with a real conversation, not a sales pitch. We ask about your business and where you're actually losing time or customers — your website, your social presence, how easy you are to find.",
      },
      {
        title: "We find the gap, not a package",
        desc: "If your website is outdated, your social's gone quiet, or people can't find you when they search or ask AI, we tell you plainly, and offer exactly what would help. Nothing you don't need.",
      },
      {
        title: "We build it",
        desc: "For a website, that means a first draft, your feedback, a few rounds of revisions, until it's ready.",
      },
      {
        title: "We launch, and keep it running",
        desc: "Once you're live, we handle changes as you need them, so you can get back to running your business.",
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
      "We exist to take the digital work off a business owner's plate — the website, the visibility, the follow-up — so they can get back to running their business. We listen first, fix exactly what's missing, and stay honest about what we can actually deliver.",
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
    vert: "Industries",
    company: "Company",
    bookCall: "Book a Call",
    rights: "Copyright ©2026, Rumi, Inc.",
    terms: "Terms & Conditions",
    privacy: "Privacy",
  },
  langLabel: "Language",
};

export type Dict = typeof EN;

// FA is a human-quality translation mirroring EN's shape.
const FA: Dict = {
  nav: {
    industries: "حوزه‌های کاری",
    team: "تیم",
    faq: "پرسش‌های متداول",
    bookCall: "رزرو تماس",
  },
  hero: {
    headline: "عقب نمانید.",
    headlineAccent: "ما کارهای دیجیتال را انجام می‌دهیم تا شما به کسب‌وکارتان برسید.",
    sub: "وب‌سایت شما، حضورتان در شبکه‌های اجتماعی، و اینکه مشتری‌ها چقدر راحت شما را پیدا می‌کنند — از جمله وقتی از ChatGPT، Claude یا Perplexity می‌پرسند سراغ چه کسی بروند. یک تیم آن را می‌سازد، اداره می‌کند و فعال نگه می‌دارد تا شما به کسب‌وکارتان برگردید.",
    ctaPrimary: "رزرو تماس",
  },
  pillars: {
    eyebrow: "چه کاری انجام می‌دهیم",
    heading: "هر جا که مشتری‌هایتان نگاه می‌کنند — از جمله هوش مصنوعی.",
    sub: "شما کسب‌وکارتان را اداره کنید. ما بخش دیجیتال را می‌سازیم و اداره می‌کنیم — وب‌سایت، دیده‌شدن، و پیگیری مشتری — و یک تیم را پاسخگوی همه‌چیز نگه می‌داریم.",
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
        name: "استراتژی محتوا، متن، و بررسی رقبا",
        tagline:
          "به شما می‌گوییم چه چیزی منتشر کنید و متنش را برایتان می‌نویسیم، و بررسی می‌کنیم چه چیزی برای رقبای شما جواب می‌دهد، تا حدس نزنید. عکس، ویدیو و انتشار واقعی را خودتان یا تیمتان انجام می‌دهید.",
      },
      {
        name: "پیدا شدن، هر جا که مردم نگاه می‌کنند",
        tagline:
          "کاری می‌کنیم سایت و محتوای شما راحت پیدا شود، با Google و با ChatGPT، Claude و Perplexity — روش رو به رشدی که مشتری‌ها با آن جست‌وجو را شروع کرده‌اند. هر طور کسی دنبال شما بگردد، شما پیدا می‌شوید.",
      },
      {
        name: "یک پذیرش هوش مصنوعی، به هر زبان",
        tagline:
          "یک پذیرش ۲۴ ساعته، چت یا تلفن، که به مشتری‌ها به زبان خودشان پاسخ می‌دهد، اطلاعات مشتری را ثبت می‌کند و درخواست‌های پیچیده را به شما می‌سپارد.",
      },
      {
        name: "مشتری‌هایی که از دست نمی‌روند",
        tagline:
          "هر مشتری بالقوه را امتیازدهی و بررسی می‌کنیم، به‌طور خودکار به زبان خودش پیگیری می‌کنیم تا نوبت بگیرد، و نظرهایی را که شما را دیده‌شده نگه می‌دارد مدیریت می‌کنیم.",
      },
    ],
  },
  how: {
    eyebrow: "چطور کار می‌کند",
    heading: "از اولین گفت‌وگو تا حضوری آنلاین که لازم نیست خودتان اداره‌اش کنید",
    steps: [
      {
        title: "بگویید چه چیزی درست کار نمی‌کند",
        desc: "ما با یک گفت‌وگوی واقعی شروع می‌کنیم، نه یک ارائه فروش. درباره کسب‌وکارتان می‌پرسیم و اینکه واقعاً کجا وقت یا مشتری از دست می‌دهید — وب‌سایت‌تان، حضورتان در شبکه‌های اجتماعی، و اینکه چقدر راحت پیدا می‌شوید.",
      },
      {
        title: "ما شکاف را پیدا می‌کنیم، نه یک بسته آماده",
        desc: "اگر وب‌سایت‌تان قدیمی است، شبکه‌های اجتماعی‌تان ساکت شده، یا مردم وقتی جست‌وجو می‌کنند یا از هوش مصنوعی می‌پرسند شما را پیدا نمی‌کنند، صریح به شما می‌گوییم و دقیقاً همان چیزی را پیشنهاد می‌دهیم که کمک می‌کند. هیچ چیز اضافه‌ای که به آن نیاز ندارید.",
      },
      {
        title: "ما آن را می‌سازیم",
        desc: "برای یک وب‌سایت، این یعنی یک پیش‌نویس اول، بازخورد شما، چند دور اصلاح، تا وقتی آماده شود.",
      },
      {
        title: "راه‌اندازی می‌کنیم و فعال نگه می‌داریم",
        desc: "وقتی آنلاین شدید، تغییرات را هر وقت لازم داشتید انجام می‌دهیم، تا شما به اداره کسب‌وکارتان برگردید.",
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
      "ما هستیم تا کارهای دیجیتال را از دوش صاحب کسب‌وکار برداریم — وب‌سایت، دیده‌شدن، پیگیری — تا او بتواند به اداره کسب‌وکارش برگردد. ما اول گوش می‌دهیم، دقیقاً چیزی را که کم است درست می‌کنیم، و درباره آنچه واقعاً می‌توانیم انجام دهیم صادق می‌مانیم.",
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
    vert: "حوزه‌های کاری",
    company: "شرکت",
    bookCall: "رزرو تماس",
    rights: "حق نشر ©۲۰۲۶، Rumi, Inc.",
    terms: "شرایط و قوانین",
    privacy: "حریم خصوصی",
  },
  langLabel: "زبان",
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

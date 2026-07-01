"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ── Languages offered by the landing-page dropdown ──
// English, Spanish, Farsi are fully translated, human-quality (the three the
// team speaks). Add a language by translating the EN dictionary below and
// dropping it into DICT + LANGUAGES — every section reads from here, so the
// whole page (and the evaluation form) translates automatically.
export const LANGUAGES = [
  { code: "en", label: "English", rtl: false },
  { code: "es", label: "Español", rtl: false },
  { code: "fa", label: "فارسی", rtl: true },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

// ── Canonical English dictionary (single source of truth for landing copy) ──
const EN = {
  nav: { pricing: "Pricing", team: "Team", freeEval: "Free evaluation" },
  hero: {
    headline: "Stop being invisible in the digital world.",
    headlineAccent: "In the AI era, you can't afford it.",
    sub: "More and more customers don't just Google anymore — they ask ChatGPT, Claude, and Perplexity who to hire. If AI doesn't know your business exists, you're invisible to them. We build your website, mobile app, and social media, then make all of it readable to the AI engines — so when someone asks AI for your service, you're the answer.",
    ctaPrimary: "Request a free evaluation",
    ctaSecondary: "Book a 15-min call",
  },
  pillars: {
    eyebrow: "What we build and run",
    heading: "Everywhere your customers look — including AI.",
    sub: "You run your business. We build and run your website, mobile app, and social media, plus an AI chatbot that answers every visitor — and we make sure the AI engines can find and recommend you. One team accountable for all of it.",
    items: [
      { name: "A modern website", tagline: "Fast, mobile, built to convert — and structured so search engines and AI engines can read it." },
      { name: "A mobile app", tagline: "Your business in your customers' pocket. We design, build, and ship it to the App Store and Google Play." },
      { name: "Social media, managed", tagline: "We run your Instagram, TikTok, and the rest — content, posting, and replies — so you stay visible without the daily grind." },
      { name: "Found by AI engines", tagline: "We make your site and content readable and citable by ChatGPT, Claude, and Perplexity — so when customers ask AI who to hire, your business comes up." },
      { name: "An AI chatbot in every language", tagline: "A 24/7 front desk that answers visitors in their own language, captures the lead, and hands complex requests to you." },
      { name: "Customers, events & payments", tagline: "Manage your customer list and email, sell event tickets, and take payments, tips, and contributions on your own site." },
    ],
  },
  how: {
    eyebrow: "How it works",
    heading: "From first call to a live presence in days",
    steps: [
      { title: "Free evaluation", desc: "Tell us about your business, your current site, and the customers you want more of. We map where customers are slipping past you today." },
      { title: "We build and launch", desc: "We build your website, app, and social presence, wire up your customer list, events, and on-site payments, and get it live. You review and approve before anything ships." },
      { title: "We keep it running", desc: "One team stays accountable — answering visitors, keeping you findable by AI, and running the whole presence while you run your business." },
    ],
  },
  team: {
    eyebrow: "Team",
    heading: "Built by people who've done it at scale",
    sub: "Management team — backed by a dedicated engineering and design team.",
    cta: "Meet the full team",
  },
  cta: {
    title: "Find out what you're invisible to.",
    description: "A free evaluation: tell us about your business and your current site, and we'll show you where customers are slipping past — and exactly what we'd build to catch them.",
    button: "Request a free evaluation",
    sub: "No cost, no commitment. Answer in any language — pick yours at the top of the page.",
  },
  evaluate: {
    eyebrow: "Free evaluation",
    h1: "See what you're invisible to.",
    intro: "Tell us about your business and your current site. We'll show you where local customers are slipping past you today — and exactly what we'd build to catch them. Free, no commitment. Answer in your own language.",
    whatYouGet: [
      "A look at where your current site (or lack of one) loses customers — and whether AI engines can find you",
      "What we'd build and run: website, mobile app, social media, AI chatbot, payments",
      "A straight answer on what it would take and where to start — no pitch, no obligation",
    ],
    form: {
      name: "Full name",
      email: "Email",
      phone: "Phone",
      business: "Business name",
      website: "Your current website",
      websitePlaceholder: "yoursite.com — or \"I don't have one yet\"",
      languages: "Languages your customers speak",
      languagesPlaceholder: "e.g. Spanish, Farsi, Armenian, English",
      needsLegend: "What do you need? (pick any)",
      needs: [
        "A new or rebuilt website",
        "Mobile app",
        "Social media management",
        "Found by AI (ChatGPT, Claude)",
        "AI chatbot / front desk",
        "Payments, events & customer list",
      ],
      message: "Anything else?",
      messagePlaceholder: "Tell us about your business, your customers, what's not working today...",
      consent: "We'll save your contact info to follow up about your evaluation. We don't share it.",
      consentRequired: "(required)",
      submit: "Request my free evaluation",
      sending: "Sending...",
      footnote: "Free, no commitment. We reply within one business day, in your language.",
      successTitle: "Got it — thanks.",
      successBody: "We'll review your business and reply within one business day, in your language. If it's urgent, book a 15-min call.",
      errConsent: "Please confirm we can save your contact info to follow up.",
      errGeneric: "Could not send your request. Try again in a moment.",
      errNetwork: "Network error. Try again.",
    },
  },
  footer: {
    tagline: "Made in Southern California. We build the digital presence — and make you findable by AI.",
    vert: "Verticals",
    company: "Company",
    bookCall: "Book a free 15-min call",
    rights: "Copyright ©2026, Rumi, Inc. Made in California.",
    terms: "Terms & Conditions",
    privacy: "Privacy",
  },
  langLabel: "Language",
};

export type Dict = typeof EN;

// ES/FA are filled with human-quality translations. They mirror EN's shape.
// (Placeholder = EN until the translation pass lands; replaced below.)
const ES: Dict = {
  "nav": {
    "pricing": "Precios",
    "team": "Equipo",
    "freeEval": "Evaluación gratuita"
  },
  "hero": {
    "headline": "Deja de ser invisible en el mundo digital.",
    "headlineAccent": "En la era de la IA, no te lo puedes permitir.",
    "sub": "Cada vez más clientes ya no solo buscan en Google: le preguntan a ChatGPT, Claude y Perplexity a quién contratar. Si la IA no sabe que tu negocio existe, para ella eres invisible. Construimos tu sitio web, tu app móvil y tus redes sociales, y hacemos que todo sea legible para los motores de IA, para que cuando alguien le pregunte a la IA por tu servicio, la respuesta seas tú.",
    "ctaPrimary": "Solicita una evaluación gratuita",
    "ctaSecondary": "Agenda una llamada de 15 min"
  },
  "pillars": {
    "eyebrow": "Lo que construimos y administramos",
    "heading": "En todos los lugares donde tus clientes buscan, incluida la IA.",
    "sub": "Tú manejas tu negocio. Nosotros construimos y administramos tu sitio web, tu app móvil y tus redes sociales, además de un chatbot de IA que responde a cada visitante, y nos aseguramos de que los motores de IA puedan encontrarte y recomendarte. Un solo equipo responsable de todo.",
    "items": [
      {
        "name": "Un sitio web moderno",
        "tagline": "Rápido, optimizado para móvil, hecho para convertir, y estructurado para que los buscadores y los motores de IA lo puedan leer."
      },
      {
        "name": "Una app móvil",
        "tagline": "Tu negocio en el bolsillo de tus clientes. La diseñamos, la construimos y la publicamos en la App Store y en Google Play."
      },
      {
        "name": "Redes sociales, administradas",
        "tagline": "Manejamos tu Instagram, TikTok y las demás: contenido, publicaciones y respuestas, para que sigas visible sin el desgaste diario."
      },
      {
        "name": "Encontrado por los motores de IA",
        "tagline": "Hacemos que tu sitio y tu contenido sean legibles y citables por ChatGPT, Claude y Perplexity, para que cuando los clientes le pregunten a la IA a quién contratar, tu negocio aparezca."
      },
      {
        "name": "Un chatbot de IA en todos los idiomas",
        "tagline": "Una recepción disponible 24/7 que responde a los visitantes en su propio idioma, captura el cliente potencial y te pasa las solicitudes más complejas."
      },
      {
        "name": "Clientes, eventos y pagos",
        "tagline": "Administra tu lista de clientes y tu correo, vende boletos para eventos y recibe pagos, propinas y aportes directamente en tu sitio."
      }
    ]
  },
  "how": {
    "eyebrow": "Cómo funciona",
    "heading": "De la primera llamada a una presencia en línea en cuestión de días",
    "steps": [
      {
        "title": "Evaluación gratuita",
        "desc": "Cuéntanos sobre tu negocio, tu sitio actual y los clientes que quieres atraer. Te mostramos dónde estás perdiendo clientes hoy."
      },
      {
        "title": "Construimos y lanzamos",
        "desc": "Construimos tu sitio web, tu app y tu presencia en redes, conectamos tu lista de clientes, tus eventos y los pagos en tu sitio, y lo ponemos en línea. Tú revisas y apruebas antes de que se publique cualquier cosa."
      },
      {
        "title": "Lo mantenemos funcionando",
        "desc": "Un solo equipo se mantiene responsable: responde a los visitantes, te mantiene visible para la IA y administra toda la presencia mientras tú manejas tu negocio."
      }
    ]
  },
  "team": {
    "eyebrow": "Equipo",
    "heading": "Creado por gente que ya lo ha hecho a gran escala",
    "sub": "Equipo directivo, respaldado por un equipo dedicado de ingeniería y diseño.",
    "cta": "Conoce al equipo completo"
  },
  "cta": {
    "title": "Descubre para qué eres invisible.",
    "description": "Una evaluación gratuita: cuéntanos sobre tu negocio y tu sitio actual, y te mostramos dónde se te están escapando los clientes, y exactamente qué construiríamos para atraparlos.",
    "button": "Solicita una evaluación gratuita",
    "sub": "Sin costo, sin compromiso. Responde en el idioma que prefieras: elige el tuyo arriba en la página."
  },
  "evaluate": {
    "eyebrow": "Evaluación gratuita",
    "h1": "Descubre para qué eres invisible.",
    "intro": "Cuéntanos sobre tu negocio y tu sitio actual. Te mostramos dónde se te están escapando los clientes locales hoy, y exactamente qué construiríamos para atraparlos. Gratis, sin compromiso. Responde en tu propio idioma.",
    "whatYouGet": [
      "Una mirada a dónde tu sitio actual (o la falta de uno) pierde clientes, y si los motores de IA te pueden encontrar",
      "Lo que construiríamos y administraríamos: sitio web, app móvil, redes sociales, chatbot de IA, pagos",
      "Una respuesta directa sobre lo que costaría y por dónde empezar, sin discursos de venta, sin obligación"
    ],
    "form": {
      "name": "Nombre completo",
      "email": "Correo electrónico",
      "phone": "Teléfono",
      "business": "Nombre del negocio",
      "website": "Tu sitio web actual",
      "websitePlaceholder": "tusitio.com — o \"todavía no tengo uno\"",
      "languages": "Idiomas que hablan tus clientes",
      "languagesPlaceholder": "p. ej. español, farsi, armenio, inglés",
      "needsLegend": "¿Qué necesitas? (elige los que apliquen)",
      "needs": [
        "Un sitio web nuevo o renovado",
        "App móvil",
        "Manejo de redes sociales",
        "Ser encontrado por la IA (ChatGPT, Claude)",
        "Chatbot de IA / recepción",
        "Pagos, eventos y lista de clientes"
      ],
      "message": "¿Algo más?",
      "messagePlaceholder": "Cuéntanos sobre tu negocio, tus clientes, qué no está funcionando hoy...",
      "consent": "Guardaremos tus datos de contacto para dar seguimiento a tu evaluación. No los compartimos.",
      "consentRequired": "(obligatorio)",
      "submit": "Solicitar mi evaluación gratuita",
      "sending": "Enviando...",
      "footnote": "Gratis, sin compromiso. Respondemos en un día hábil, en tu idioma.",
      "successTitle": "Listo, gracias.",
      "successBody": "Revisaremos tu negocio y te responderemos en un día hábil, en tu idioma. Si es urgente, agenda una llamada de 15 min.",
      "errConsent": "Por favor confirma que podemos guardar tus datos de contacto para dar seguimiento.",
      "errGeneric": "No se pudo enviar tu solicitud. Inténtalo de nuevo en un momento.",
      "errNetwork": "Error de red. Inténtalo de nuevo."
    }
  },
  "footer": {
    "tagline": "Hecho en el Sur de California. Construimos tu presencia digital, y hacemos que la IA te encuentre.",
    "vert": "Sectores",
    "company": "Empresa",
    "bookCall": "Agenda una llamada gratuita de 15 min",
    "rights": "Copyright ©2026, Rumi, Inc. Hecho en California.",
    "terms": "Términos y condiciones",
    "privacy": "Privacidad"
  },
  "langLabel": "Idioma"
};
const FA: Dict = {
  "nav": {
    "pricing": "قیمت‌ها",
    "team": "تیم",
    "freeEval": "ارزیابی رایگان"
  },
  "hero": {
    "headline": "دیگر در دنیای دیجیتال نامرئی نباشید.",
    "headlineAccent": "در عصر هوش مصنوعی، این یعنی از دست دادن مشتری.",
    "sub": "مشتری‌ها دیگر فقط در Google جست‌وجو نمی‌کنند — حالا از ChatGPT، Claude و Perplexity می‌پرسند سراغ چه کسی بروند. اگر هوش مصنوعی از وجود کسب‌وکار شما خبر نداشته باشد، برای آن‌ها نامرئی هستید. ما وب‌سایت، اپلیکیشن موبایل و شبکه‌های اجتماعی شما را می‌سازیم و همه را برای موتورهای هوش مصنوعی قابل‌خواندن می‌کنیم — تا وقتی کسی خدمات شما را از هوش مصنوعی می‌پرسد، جواب، شما باشید.",
    "ctaPrimary": "درخواست ارزیابی رایگان",
    "ctaSecondary": "رزرو تماس ۱۵ دقیقه‌ای"
  },
  "pillars": {
    "eyebrow": "چه چیزی می‌سازیم و اداره می‌کنیم",
    "heading": "هر جا که مشتری‌هایتان نگاه می‌کنند — از جمله هوش مصنوعی.",
    "sub": "شما کسب‌وکارتان را اداره کنید. ما وب‌سایت، اپلیکیشن موبایل و شبکه‌های اجتماعی شما را می‌سازیم و اداره می‌کنیم، به‌علاوه یک چت‌بات هوش مصنوعی که به هر بازدیدکننده پاسخ می‌دهد — و مطمئن می‌شویم که موتورهای هوش مصنوعی بتوانند شما را پیدا کنند و پیشنهاد دهند. یک تیم، پاسخگوی همه‌چیز.",
    "items": [
      {
        "name": "یک وب‌سایت مدرن",
        "tagline": "سریع، موبایل‌محور، طراحی‌شده برای جذب مشتری — و ساختاریافته به‌گونه‌ای که موتورهای جست‌وجو و هوش مصنوعی بتوانند آن را بخوانند."
      },
      {
        "name": "یک اپلیکیشن موبایل",
        "tagline": "کسب‌وکار شما در جیب مشتری‌هایتان. ما آن را طراحی، ساخته و در App Store و Google Play منتشر می‌کنیم."
      },
      {
        "name": "مدیریت شبکه‌های اجتماعی",
        "tagline": "ما Instagram، TikTok و بقیه را برایتان اداره می‌کنیم — محتوا، انتشار و پاسخ‌دهی — تا بدون دردسر روزانه دیده شوید."
      },
      {
        "name": "پیدا شدن توسط موتورهای هوش مصنوعی",
        "tagline": "سایت و محتوای شما را برای ChatGPT، Claude و Perplexity قابل‌خواندن و قابل‌ارجاع می‌کنیم — تا وقتی مشتری از هوش مصنوعی می‌پرسد سراغ چه کسی برود، نام کسب‌وکار شما بالا بیاید."
      },
      {
        "name": "یک چت‌بات هوش مصنوعی به هر زبان",
        "tagline": "یک پذیرش ۲۴ ساعته که به بازدیدکننده‌ها به زبان خودشان پاسخ می‌دهد، اطلاعات مشتری را ثبت می‌کند و درخواست‌های پیچیده را به شما می‌سپارد."
      },
      {
        "name": "مشتری‌ها، رویدادها و پرداخت‌ها",
        "tagline": "لیست مشتری‌ها و ایمیل‌هایتان را مدیریت کنید، بلیت رویداد بفروشید، و پرداخت‌ها، انعام و کمک‌های مالی را روی سایت خودتان دریافت کنید."
      }
    ]
  },
  "how": {
    "eyebrow": "چطور کار می‌کند",
    "heading": "از اولین تماس تا حضور آنلاین، ظرف چند روز",
    "steps": [
      {
        "title": "ارزیابی رایگان",
        "desc": "از کسب‌وکارتان، سایت فعلی‌تان و مشتری‌هایی که می‌خواهید بیشتر جذب کنید برایمان بگویید. ما مشخص می‌کنیم همین حالا مشتری‌ها کجا از دستتان در می‌روند."
      },
      {
        "title": "ما می‌سازیم و راه‌اندازی می‌کنیم",
        "desc": "وب‌سایت، اپلیکیشن و حضور اجتماعی شما را می‌سازیم، لیست مشتری‌ها، رویدادها و پرداخت‌های روی سایت را راه‌اندازی می‌کنیم و همه را آنلاین می‌کنیم. پیش از انتشار هر چیزی، شما بررسی و تأیید می‌کنید."
      },
      {
        "title": "ما همه‌چیز را فعال نگه می‌داریم",
        "desc": "یک تیم پاسخگو می‌ماند — به بازدیدکننده‌ها جواب می‌دهد، شما را برای هوش مصنوعی قابل‌یافتن نگه می‌دارد و کل حضور آنلاین را اداره می‌کند، در حالی که شما کسب‌وکارتان را پیش می‌برید."
      }
    ]
  },
  "team": {
    "eyebrow": "تیم",
    "heading": "ساخته‌شده به‌دست کسانی که این کار را در مقیاس بزرگ انجام داده‌اند",
    "sub": "تیم مدیریت — با پشتیبانی یک تیم اختصاصی مهندسی و طراحی.",
    "cta": "آشنایی با کل تیم"
  },
  "cta": {
    "title": "ببینید برای چه کسانی نامرئی هستید.",
    "description": "یک ارزیابی رایگان: از کسب‌وکار و سایت فعلی‌تان برایمان بگویید، و ما نشانتان می‌دهیم مشتری‌ها کجا از دستتان در می‌روند — و دقیقاً چه چیزی می‌سازیم تا آن‌ها را نگه داریم.",
    "button": "درخواست ارزیابی رایگان",
    "sub": "بدون هزینه، بدون تعهد. به هر زبانی پاسخ دهید — زبانتان را از بالای صفحه انتخاب کنید."
  },
  "evaluate": {
    "eyebrow": "ارزیابی رایگان",
    "h1": "ببینید برای چه کسانی نامرئی هستید.",
    "intro": "از کسب‌وکار و سایت فعلی‌تان برایمان بگویید. ما نشانتان می‌دهیم همین حالا مشتری‌های محلی کجا از دستتان در می‌روند — و دقیقاً چه چیزی می‌سازیم تا آن‌ها را نگه داریم. رایگان، بدون تعهد. به زبان خودتان پاسخ دهید.",
    "whatYouGet": [
      "نگاهی به اینکه سایت فعلی‌تان (یا نبودش) کجا مشتری از دست می‌دهد — و اینکه آیا موتورهای هوش مصنوعی می‌توانند شما را پیدا کنند",
      "چه چیزی می‌سازیم و اداره می‌کنیم: وب‌سایت، اپلیکیشن موبایل، شبکه‌های اجتماعی، چت‌بات هوش مصنوعی، پرداخت‌ها",
      "یک پاسخ صریح درباره اینکه چه چیزی لازم است و از کجا شروع کنید — بدون فروش، بدون اجبار"
    ],
    "form": {
      "name": "نام و نام خانوادگی",
      "email": "ایمیل",
      "phone": "تلفن",
      "business": "نام کسب‌وکار",
      "website": "وب‌سایت فعلی شما",
      "websitePlaceholder": "yoursite.com — یا «هنوز سایتی ندارم»",
      "languages": "زبان‌هایی که مشتری‌هایتان صحبت می‌کنند",
      "languagesPlaceholder": "مثلاً اسپانیایی، فارسی، ارمنی، انگلیسی",
      "needsLegend": "به چه چیزی نیاز دارید؟ (هر کدام را که خواستید انتخاب کنید)",
      "needs": [
        "وب‌سایت جدید یا بازسازی‌شده",
        "اپلیکیشن موبایل",
        "مدیریت شبکه‌های اجتماعی",
        "پیدا شدن توسط هوش مصنوعی (ChatGPT، Claude)",
        "چت‌بات هوش مصنوعی / پذیرش",
        "پرداخت‌ها، رویدادها و لیست مشتری‌ها"
      ],
      "message": "چیز دیگری هست؟",
      "messagePlaceholder": "از کسب‌وکارتان، مشتری‌هایتان و اینکه چه چیزی این روزها درست کار نمی‌کند بگویید...",
      "consent": "اطلاعات تماس شما را ذخیره می‌کنیم تا برای پیگیری ارزیابی‌تان با شما در تماس باشیم. آن را با کسی به اشتراک نمی‌گذاریم.",
      "consentRequired": "(الزامی)",
      "submit": "درخواست ارزیابی رایگان من",
      "sending": "در حال ارسال...",
      "footnote": "رایگان، بدون تعهد. ظرف یک روز کاری، به زبان شما پاسخ می‌دهیم.",
      "successTitle": "دریافت شد — ممنون.",
      "successBody": "کسب‌وکار شما را بررسی می‌کنیم و ظرف یک روز کاری، به زبان شما پاسخ می‌دهیم. اگر فوری است، یک تماس ۱۵ دقیقه‌ای رزرو کنید.",
      "errConsent": "لطفاً تأیید کنید که می‌توانیم اطلاعات تماس شما را برای پیگیری ذخیره کنیم.",
      "errGeneric": "ارسال درخواست شما ممکن نشد. لحظه‌ای دیگر دوباره تلاش کنید.",
      "errNetwork": "خطای شبکه. دوباره تلاش کنید."
    }
  },
  "footer": {
    "tagline": "ساخته‌شده در جنوب کالیفرنیا. ما حضور دیجیتال را می‌سازیم — و شما را برای هوش مصنوعی قابل‌یافتن می‌کنیم.",
    "vert": "حوزه‌های کاری",
    "company": "شرکت",
    "bookCall": "رزرو تماس رایگان ۱۵ دقیقه‌ای",
    "rights": "حق نشر ©۲۰۲۶، Rumi, Inc. ساخته‌شده در کالیفرنیا.",
    "terms": "شرایط و قوانین",
    "privacy": "حریم خصوصی"
  },
  "langLabel": "زبان"
};

const DICT: Record<Lang, Dict> = { en: EN, es: ES, fa: FA };

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

import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

// Inter is the single brand font (Saba spec §3). All weights the site uses.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-inter",
});

// Vazirmatn covers Farsi (Persian script); Inter can't render it.
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-vazirmatn",
});

// Site-wide metadata leads with the AI Employees offer (the five roles) and
// still names the extra services we build and run. `title` is a plain string,
// not a { default, template } pair, so every page that sets a title replaces
// this one wholesale — and any page that sets openGraph must restate
// images/type/siteName or it loses the social preview image.
// `alternates.canonical` and `openGraph.url` are both relative on purpose: they
// resolve against metadataBase, so they follow whatever host is configured
// rather than pinning a domain here — a sibling site ships under the same
// hardcoded host, so a literal URL here is a tag pointing at the other site the
// day this one moves. Every page that sets its own `alternates` replaces this
// one, the same way `title` works — a page without one inherits "/", which is
// only correct for the homepage, so any new indexable route must declare its
// own.
export const metadata: Metadata = {
  metadataBase: new URL("https://rumi.build"),
  alternates: { canonical: "/" },
  title: "Rumi AI — Hire AI employees that work 24/7, from $300/mo",
  description:
    "Rumi recruits, trains, and manages AI employees for your business: an AI Receptionist from $300/mo, Executive Assistant from $500/mo, Social Media Manager from $400/mo, or a bundle from $800/mo. Each covers work that costs roughly ten times as much today, and takes the repetitive part off your team. We also build the website, app, content, and AI visibility behind it. Book a call.",
  openGraph: {
    title: "Rumi AI — Hire AI employees that work 24/7, from $300/mo",
    description:
      "Five AI employees you can hire — reception, executive support, social media, or a bundle — trained on your business, live in 1-3 weeks, managed by our team, at about a tenth of what that work costs today. Plus the website, app, and visibility behind it.",
    url: "/",
    siteName: "Rumi AI",
    type: "website",
    // `?v=2` is a cache bust, not a second file — the literal on disk is still
    // public/og-image.png. Scrapers (Facebook, X, LinkedIn, Slack, iMessage)
    // key their preview cache on the image URL and hold it for months, and
    // brand v2 replaced this card IN PLACE: every link already shared would
    // otherwise keep serving the old amber-on-black card forever. Every page
    // that restates an openGraph/twitter images block carries the same suffix,
    // or the busted URL only applies to the pages that inherit this one.
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630 }],
  },
  // NO title or description here, ever. `twitter` inherits wholesale exactly
  // like `openGraph` — but unlike openGraph, no page except /workplace restates
  // a twitter block, so a title declared here shipped as EVERY page's
  // twitter:title, and X prefers twitter:* over og:* (verified in the built
  // HTML: faq, services and schedule all carried the homepage's twitter:title
  // beside their own og:title). Declaring only the card and image makes X fall
  // back to each page's og:title/og:description, which are already correct
  // per-page. Pinned by tests/unit/routing.test.ts.
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${vazirmatn.variable}`}
    >
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}

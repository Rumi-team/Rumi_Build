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
export const metadata: Metadata = {
  metadataBase: new URL("https://rumi.build"),
  title: "Rumi AI — Hire AI employees that work 24/7, from $300/mo",
  description:
    "Rumi recruits, trains, and manages AI employees for your business: an AI Receptionist from $300/mo, Executive Assistant from $500/mo, Social Media Manager from $400/mo, or a bundle from $800/mo. Each covers work that costs roughly ten times as much today, and takes the repetitive part off your team. We also build the website, app, content, and AI visibility behind it. Book a call.",
  openGraph: {
    title: "Rumi AI — Hire AI employees that work 24/7, from $300/mo",
    description:
      "Five AI employees you can hire — reception, executive support, social media, or a bundle — trained on your business, live in 1-3 weeks, managed by our team, at about a tenth of what that work costs today. Plus the website, app, and visibility behind it.",
    url: "https://rumi.build",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi AI — Hire AI employees that work 24/7, from $300/mo",
    description:
      "Five AI employees you can hire — trained on your business, live in 1-3 weeks, managed by our team, at about a tenth of what that work costs today. Book a call.",
    images: ["/og-image.png"],
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

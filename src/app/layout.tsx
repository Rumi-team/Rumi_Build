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

export const metadata: Metadata = {
  metadataBase: new URL("https://rumi.build"),
  title: "Rumi AI — We handle the digital work, so you can run your business",
  description:
    "Rumi AI builds and runs your website, social presence, and AI visibility — so customers find you, including when they ask ChatGPT, Claude, or Perplexity who to hire. One team, accountable for all of it. Founded and based in Los Angeles. Book a call.",
  openGraph: {
    title: "Rumi AI — We handle the digital work, so you can run your business",
    description:
      "We build and run your website, social presence, and AI visibility — so customers find you, including when they ask AI who to hire. One team, accountable for all of it. Book a call.",
    url: "https://rumi.build",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi AI — We handle the digital work, so you can run your business",
    description:
      "We build and run your website, social presence, and AI visibility — so customers find you, including when they ask AI who to hire. Book a call.",
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

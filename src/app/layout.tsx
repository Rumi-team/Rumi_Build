import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Vazirmatn } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rumi.build"),
  title: "Rumi Build — Stop being invisible in the AI era",
  description:
    "More customers ask ChatGPT, Claude, and Perplexity who to hire. We build your website, mobile app, and social media — and make all of it findable by the AI engines, so when someone asks AI for your service, you're the answer. Request a free evaluation.",
  openGraph: {
    title: "Rumi Build — Stop being invisible in the AI era",
    description:
      "Customers ask ChatGPT, Claude, and Perplexity who to hire. We build your website, mobile app, and social media — and make it all findable by the AI engines, so you're the answer. Request a free evaluation.",
    url: "https://rumi.build",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi Build — Stop being invisible in the AI era",
    description:
      "Customers ask ChatGPT and Claude who to hire. We build your website, mobile app, and social media — and make it all findable by the AI engines. Request a free evaluation.",
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
      className={`${GeistSans.variable} ${GeistMono.variable} ${vazirmatn.variable}`}
    >
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}

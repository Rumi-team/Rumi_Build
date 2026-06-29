import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Vazirmatn } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rumi.build"),
  title: "Rumi Build — Be found in the AI era, in every language LA speaks",
  description:
    "Your competitors lose the 56% of LA County who don't search in English first. We build and run your whole web presence — a multilingual site and an AI chatbot that answers every visitor in their own language and captures the lead. Request a free evaluation.",
  openGraph: {
    title: "Rumi Build — Be found in the AI era, in every language LA speaks",
    description:
      "We build and run your whole web presence — a multilingual site and an AI chatbot that answers every visitor in their own language and captures the customers your competitors lose. Request a free evaluation.",
    url: "https://rumi.build",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi Build — Be found in the AI era, in every language LA speaks",
    description:
      "We build and run your whole web presence — multilingual site + an AI chatbot that answers every visitor in their own language. Capture the customers your competitors lose. Request a free evaluation.",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}

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
  title: "Rumi Build — Qualified local customers across Southern California",
  description:
    "Qualified local customers calling your store every month — in every language spoken in Southern California. Capture the 56% of LA County your competitors lose to language barriers. Limited-time launch pricing from $199/mo with money-back guarantee.",
  openGraph: {
    title: "Rumi Build — Qualified local customers across Southern California",
    description:
      "Qualified local customers calling your store every month, in every language LA speaks. Capture the customers your competitors lose. Limited-time launch pricing from $199/mo with money-back guarantee.",
    url: "https://rumi.build",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi Build — Qualified local customers across Southern California",
    description:
      "Qualified local customers across Southern California — in every language LA speaks. Capture the customers English-only menus lose. Limited-time launch pricing from $199/mo.",
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

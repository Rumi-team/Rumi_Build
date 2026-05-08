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
  title: "Rumi Build — Local growth for small businesses",
  description:
    "5–20 qualified local customers calling your store every month, in Persian, English, or Spanish. Targeted local campaigns, leads routed straight to your phone, money-back guarantee. From $499/mo.",
  openGraph: {
    title: "Rumi Build — Local growth for small businesses",
    description:
      "5–20 qualified local customers calling your store every month, in Persian, English, or Spanish. Multilingual local marketing. From $499/mo with money-back guarantee.",
    url: "https://rumi.build",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi Build — Local growth for small businesses",
    description:
      "5–20 qualified local customers calling your store every month — Persian, English, or Spanish. From $499/mo.",
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

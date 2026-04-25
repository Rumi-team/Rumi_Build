import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rumi Build — Hire Your Next AI Employee",
  description:
    "Chief of Staff, Chief of Operations, Chief of Marketing, Chief of Customer Service. Four AI specialists. Fraction of the cost. 24/7 availability. Deployed in days. Free discovery call.",
  openGraph: {
    title: "Rumi Build — Hire Your Next AI Employee",
    description:
      "Four AI specialists. Fraction of the cost. 24/7. Deployed in days.",
    url: "https://rumi.build",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi Build — Hire Your Next AI Employee",
    description:
      "Four AI specialists. Fraction of the cost. 24/7. Deployed in days.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

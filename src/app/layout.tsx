import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rumi Build — AI Automation in Days, Not Months",
  description:
    "We build working AI automations for your business in 5 days. Free 30-minute discovery call, then a focused sprint to ship your first AI workflow.",
  openGraph: {
    title: "Rumi Build — AI Automation in Days, Not Months",
    description: "Working AI automations for your business. Free discovery call.",
    url: "https://rumi.build",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi Build — AI Automation in Days, Not Months",
    description: "Working AI automations for your business. Free discovery call.",
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

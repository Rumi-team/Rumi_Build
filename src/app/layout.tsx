import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rumi Build — Voice AI, Web Dev & Automation",
  description:
    "Voice AI agents from $250/mo, websites in days, workflow automation that saves 10+ hrs/week. Free 30-minute discovery call.",
  openGraph: {
    title: "Rumi Build — Voice AI, Web Dev & Automation",
    description: "Voice AI from $250/mo. Websites in days. Automation that saves 10+ hrs/week.",
    url: "https://rumi.build",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi Build — Voice AI, Web Dev & Automation",
    description: "Voice AI from $250/mo. Websites in days. Automation that saves 10+ hrs/week.",
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

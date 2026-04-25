import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rumi Build — Head of HR for AI Employees",
  description:
    "Cut your payroll. Hire AI employees that work 24/7. Rumi is your Head of HR — we recruit, deploy, and manage three AI specialists trained on your context: Chief of Staff, Chief of Marketing, Chief of Customer Service.",
  openGraph: {
    title: "Rumi Build — Head of HR for AI Employees",
    description:
      "Cut your payroll. Hire AI employees that work 24/7. Three specialists, deployed in days.",
    url: "https://rumi.build",
    siteName: "Rumi Build",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumi Build — Head of HR for AI Employees",
    description:
      "Cut your payroll. Hire AI employees that work 24/7. Three specialists, deployed in days.",
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

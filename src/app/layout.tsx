import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { siteConfig } from "@/config/site";
import { getFooterContent } from "@/features/landing/data/footer";
import { getNavigationContent } from "@/features/landing/data/navigation";
import { buildOrganizationJsonLd } from "@/lib/seo";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Blockchain-Verified Real Estate Marketplace in Ghana`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Ghana real estate",
    "blockchain real estate",
    "property financing Ghana",
    "verified property titles",
    "real estate investment Ghana",
    "Afram",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [navigation, footer] = await Promise.all([getNavigationContent(), getFooterContent()]);

  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="text-ink-900 flex min-h-full flex-col bg-white">
        <JsonLd data={buildOrganizationJsonLd()} />
        <SiteNav verifyLabel={navigation?.verifyLabel} navGroups={navigation?.navGroups} />
        <main className="flex-1">{children}</main>
        <SiteFooter content={footer} />
        <SanityLive />
      </body>
    </html>
  );
}

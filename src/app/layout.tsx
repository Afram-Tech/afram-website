import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { DisableDraftMode } from "@/components/DisableDraftMode";
import { RequestAccess } from "@/components/access/RequestAccess";
import { CookieConsentBanner } from "@/components/shell/CookieConsent";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { siteConfig } from "@/config/site";
import { ApolloProvider } from "@/graphql/ApolloProvider";
import { getFooterContent } from "@/features/landing/data/footer";
import { getNavigationContent } from "@/features/landing/data/navigation";
import { buildOrganizationJsonLd } from "@/lib/seo";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";

/* Outfit, as in the V2 design. globals.css scales the type scale's negative
   letter-spacing down (--tracking-scale) to suit its narrower letters. */
const brandFont = Outfit({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
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
  openGraph: { locale: siteConfig.locale, siteName: siteConfig.name, type: "website" },
  icons: {
    icon: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [navigation, footer, { isEnabled: isDraftMode }] = await Promise.all([
    getNavigationContent(),
    getFooterContent(),
    draftMode(),
  ]);

  return (
    <html lang="en-GH" className={`${brandFont.variable} h-full antialiased`}>
      <body className="text-ink-900 flex min-h-full flex-col bg-white">
        <ApolloProvider>
          <JsonLd data={buildOrganizationJsonLd()} />
          <a
            href="#main"
            className="focus:bg-brand-700 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <SiteNav verifyLabel={navigation?.verifyLabel} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter content={footer} />
          <RequestAccess />
          <CookieConsentBanner />
        </ApolloProvider>
        <SanityLive />
        {isDraftMode && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}

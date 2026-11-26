import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { PersonaShell } from "@/components/persona/PersonaShell";
import { OpenRaisesGrid } from "@/features/invest/OpenRaisesGrid";
import { InvestFlow } from "@/features/invest/InvestFlow";
import { Liquidity } from "@/features/invest/Liquidity";
import { PERSONAS, ORDER, DEFAULT } from "@/lib/data/invest-personas";

export const metadata: Metadata = buildMetadata({
  title: "Invest in verified property from GHS 1,500",
  description:
    "Own a fractional, title-verified stake in real Ghanaian buildings and earn rental income plus capital growth. From GHS 1,500. Capital at risk.",
  path: "/invest",
  noindex: true,
});

/**
 * Hidden until the open raises are real: the grid still shows the design's
 * sample buildings and figures. Flip to true to publish the page, and add it
 * back to the sitemap.
 */
const INVEST_PAGE_LIVE = false;

export default function InvestPage() {
  if (!INVEST_PAGE_LIVE) notFound();

  return (
    <PersonaShell
      personas={PERSONAS}
      order={ORDER}
      defaultId={DEFAULT}
      accent="fuchsia"
      hero={{
        headline: "Own a slice of verified Ghana.",
        subhead:
          "Buy a fractional, title-verified stake in real buildings and earn a share of the rent and any growth — from GHS 1,500. Capital at risk.",
      }}
      primary={{ label: "Browse open raises", href: "#raises" }}
      secondary={{ label: "How it works", href: "/how-it-works" }}
      faqTitleSuffix="investors ask…"
      finalCta={{
        title: "Start with one building. From GHS 1,500.",
        subtitle: "Browse open raises and own a verified slice of real Ghana.",
        primary: { label: "Browse open raises", href: "#raises" },
        secondary: { label: "How it works", href: "/how-it-works" },
      }}
    >
      <OpenRaisesGrid />
      <InvestFlow />
      <Liquidity />
    </PersonaShell>
  );
}

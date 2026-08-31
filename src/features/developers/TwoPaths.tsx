import { ArrowRight, Coins, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export type Path = {
  badge: string;
  icon: LucideIcon;
  title: string;
  intro: string;
  points: [string, string][];
  cta: { label: string; href: string };
};

const SIGN_UP_AS_ISSUER = `${siteConfig.signUpUrl}?userType=issuer`;

/**
 * The second path — a vendor raising capital against their own project — is
 * documented alongside "sell faster" so this page never leaves the impression
 * that financing is only something buyers get.
 */
export const VENDOR_PATHS: Path[] = [
  {
    badge: "Sell faster",
    icon: TrendingUp,
    title: "Get access to already financed members.",
    intro: "Members arrive approved. Their financier pays you the full price at completion.",
    points: [
      ["Paid in full.", "Repayment stays with the member and their financier."],
      ["Verified title.", "The ownership question is answered on the listing."],
      ["Your name, your agents.", "Your team closes every sale."],
    ],
    cta: { label: "Get Started", href: SIGN_UP_AS_ISSUER },
  },
  {
    badge: "Raise capital",
    icon: Coins,
    title: "List your property to access financing.",
    intro:
      "Afram does not lend. The financiers on Afram do, and a verified title is what they price.",
    points: [
      ["Break ground or finish a phase.", "Capital for either."],
      ["Verified once.", "Both kinds of lender review the same pack."],
      ["You negotiate.", "Afram takes no share of the project."],
    ],
    cta: { label: "Talk to a partner", href: "#talk" },
  },
];

export function TwoPaths({
  title = "Sell what you built. Fund what you have not.",
  paths = VENDOR_PATHS,
  tone,
}: {
  title?: string;
  paths?: Path[];
  /** Surface tint — pages alternate these so sections read as separate blocks. */
  tone?: "mint";
}) {
  return (
    <Section id="paths" className={cn("scroll-mt-24", tone === "mint" && "bg-brand-50/50")}>
      <SectionHeading title={title} />
      <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-8">
        {paths.map((p) => (
          <div
            key={p.badge}
            className="ring-ink-100 flex flex-col rounded-[1.75rem] bg-white p-7 ring-1 sm:p-9"
          >
            <span className="bg-accent-50 text-accent-700 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold tracking-[0.1em] uppercase">
              <p.icon className="h-3.5 w-3.5" />
              {p.badge}
            </span>

            <h3 className="text-ink-900 mt-5 text-[clamp(1.35rem,2.2vw,1.6rem)] leading-[1.15] font-bold tracking-[-0.02em]">
              {p.title}
            </h3>
            <p className="text-ink-500 mt-3 text-[15px] leading-relaxed">{p.intro}</p>

            <ul className="mt-7 space-y-3.5">
              {p.points.map(([lead, rest]) => (
                <li key={lead} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="bg-accent-400 mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" />
                  <span className="text-ink-500">
                    <b className="text-ink-900 font-semibold">{lead}</b> {rest}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={p.cta.href}
              className="bg-brand-500 hover:bg-brand-600 focus-visible:outline-brand-500 mt-auto inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full px-6 pt-0 text-[15px] font-semibold text-white shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
              style={{ marginTop: "2.25rem" }}
            >
              {p.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}

import { BadgeCheck, HandCoins, Search, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "How It Works",
  description:
    "How Afram verifies property titles, connects buyers with financing, and helps vendors and financiers transact with confidence.",
  path: "/how-it-works",
});

const STEPS = [
  {
    icon: Search,
    title: "Browse verified listings",
    description:
      "Every property on Afram is reconciled against Ghana's Lands Commission records before it's listed.",
  },
  {
    icon: ShieldCheck,
    title: "Verify the title yourself",
    description:
      "Independently confirm ownership records at registry.afram.co, whether or not you're an Afram user.",
  },
  {
    icon: HandCoins,
    title: "Get matched with financing",
    description:
      "Qualified buyers are connected with financiers offering a typical 20% deposit and instalments over up to 10 years.",
  },
  {
    icon: BadgeCheck,
    title: "Close with confidence",
    description:
      "Standardised documentation and a registered first legal charge protect both buyers and financiers through closing.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-ink-900 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">
            How {siteConfig.name} works
          </h1>
          <p className="text-ink-500 mt-4">
            A transparent, blockchain-verified process for buyers, vendors, and financiers.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
          {STEPS.map((step) => (
            <div key={step.title} className="flex gap-4">
              <div className="bg-brand-100 text-brand-700 flex size-11 shrink-0 items-center justify-center rounded-full">
                <step.icon className="size-5" />
              </div>
              <div>
                <h2 className="text-ink-900 font-semibold">{step.title}</h2>
                <p className="text-ink-500 mt-1 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="verify-title" className="bg-ink-50 scroll-mt-20 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-ink-900 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
            Verify a title
          </h2>
          <p className="text-ink-500 mt-3">
            Anyone can independently verify a property title against Ghana&apos;s Lands Commission
            records, whether or not you&apos;re an Afram user.
          </p>
          <div className="mt-6">
            <a
              href={siteConfig.registryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants("primary")}
            >
              Open title registry
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-ink-900 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
            Ready to get started?
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/properties" className={buttonVariants("primary")}>
              Browse properties
            </Link>
            <Link href="/developers" className={buttonVariants("secondary")}>
              List a property
            </Link>
            <Link href="/financiers" className={buttonVariants("secondary")}>
              Deploy capital
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";

type Step = { n: string; title: string; body: string };

const SIGN_UP_AS_ISSUER = `${siteConfig.signUpUrl}?userType=issuer`;

const SALE_STEPS: Step[] = [
  {
    n: "01",
    title: "Upload your project",
    body: "Upload your title documents and project details. It takes a few minutes.",
  },
  {
    n: "02",
    title: "We verify and endorse",
    body: "We check and validate your title and ownership records against the trust institutions in Ghana.",
  },
  {
    n: "03",
    title: "Access financed members",
    body: "Members arrive financed by Afram lenders or pay through your own payment plan. Either way, you sell faster.",
  },
  {
    n: "04",
    title: "Review and close",
    body: "Review the offers from financed members. Agree the terms. Close the sale.",
  },
];

const CAPITAL_STEPS: Step[] = [
  {
    n: "01",
    title: "Upload your project",
    body: "Upload your title, permit and project documents. It takes a few minutes.",
  },
  {
    n: "02",
    title: "We verify and endorse",
    body: "We validate your title and ownership records against Lands Commission records.",
  },
  {
    n: "03",
    title: "Financiers review your documents",
    body: "Banks and private credit providers review the documents.",
  },
  {
    n: "04",
    title: "Review offers and accept funding terms",
    body: "Compare the offers. Negotiate directly. Afram takes no share of your project.",
  },
];

function Steps({
  title,
  intro,
  steps,
  cta,
  className,
}: {
  title: string;
  intro: string;
  steps: Step[];
  cta?: boolean;
  className?: string;
}) {
  return (
    <Section className={className}>
      <SectionHeading title={title} intro={intro} />

      <div className="gap-card mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Reveal key={step.n} delay={index * 0.08}>
            <div className="ring-ink-100 flex h-full flex-col rounded-[1.75rem] bg-white p-7 ring-1">
              <span className="tnum bg-accent-50 text-accent-700 flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold">
                {step.n}
              </span>
              <h3 className="text-ink-900 mt-6 text-lg font-semibold tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="text-ink-500 mt-2 text-[15px] leading-relaxed">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {cta && (
        <Link
          href={SIGN_UP_AS_ISSUER}
          className="bg-brand-500 hover:bg-brand-600 focus-visible:outline-brand-500 mt-10 inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </Section>
  );
}

/** Selling: listing to a closed sale with a financed member. */
export function SellFlow() {
  return (
    <Steps
      title="Four steps from listing to closing a sale."
      intro="No bank queues for your members. No chasing leads for you."
      steps={SALE_STEPS}
      cta
      className="bg-ink-50/60"
    />
  );
}

/** Raising capital: listing to accepted funding terms. */
export function CapitalFlow() {
  return (
    <Steps
      title="Four steps from listing to raising capital."
      intro="Verify once. Let lenders come to you."
      steps={CAPITAL_STEPS}
    />
  );
}

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { CapitalAtRiskBadge } from "@/components/ui/CapitalAtRiskBadge";
import { LegalReader } from "@/features/legal/LegalReader";
import { LEGAL, LEGAL_SLUGS, type LegalSlug } from "@/lib/data/legal";
import { LEGAL_DOCUMENTS } from "@/lib/data/legal-documents";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = LEGAL[slug as LegalSlug];
  if (!doc) return {};
  return buildMetadata({ title: doc.title, description: doc.description, path: `/legal/${slug}` });
}

/** Sub-nav that cross-links all the legal pages. */
function LegalNav({ current }: { current: LegalSlug }) {
  return (
    <nav aria-label="Legal pages" className="flex flex-wrap gap-2">
      {LEGAL_SLUGS.map((slug) => {
        const active = slug === current;
        return (
          <Link
            key={slug}
            href={`/legal/${slug}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              active
                ? "bg-ink-900 text-white"
                : "bg-ink-50 text-ink-600 ring-1 ring-ink-100 hover:bg-ink-100 hover:text-ink-900",
            )}
          >
            {LEGAL[slug].navLabel}
          </Link>
        );
      })}
    </nav>
  );
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = LEGAL[slug as LegalSlug];
  if (!doc) notFound();

  // Real, bespoke content for the key-risks page.
  if (slug === "key-risks") {
    return <KeyRisks />;
  }

  // Legal's published policies, word for word.
  if (slug === "privacy" || slug === "cookie-policy") {
    const related = slug === "privacy"
      ? { title: "Cookie Policy", href: "/legal/cookie-policy" }
      : { title: "Privacy Policy", href: "/legal/privacy" };
    return <LegalReader doc={LEGAL_DOCUMENTS[slug]} nav={<LegalNav current={slug} />} related={related} />;
  }

  // "Coming soon" stub for every other legal page.
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-3xl">
        <LegalNav current={slug as LegalSlug} />

        <header className="mt-6 border-b border-ink-100 pb-8 sm:mt-8 lg:mt-10">
          <h1 className="t-h1-sm text-ink-900">
            {doc.title}
          </h1>
          <p className="mt-3 text-[13px] text-ink-400">
            Last updated: <span className="tnum">coming soon</span>
          </p>
        </header>

        <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink-600">
          {doc.body.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>

        <p className="mt-10 text-[14px] text-ink-500">
          Looking for the risks of investing?{" "}
          <Link
            href="/legal/key-risks"
            className="inline-flex items-center gap-1 font-medium text-ink-900 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-900"
          >
            Read the key risks &amp; disclosures
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* Key risks & disclosures — real content, linked site-wide.        */
/* ---------------------------------------------------------------- */

const RISKS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Your capital is at risk",
    body: (
      <>
        Investments can fall as well as rise. You may get back less than you put
        in, and you could lose the whole amount you invest. Returns are never
        guaranteed — any figure shown is a target or an illustration, not a
        promise. Only invest money you can afford to set aside.
      </>
    ),
  },
  {
    title: "Property values can fall",
    body: (
      <>
        The value of a property — and of any share you hold in it — depends on
        the market, the location, the condition of the building, and demand from
        buyers and tenants. Prices can go down as well as up. Rental income can
        also fall, pause, or stop entirely, which affects the return you
        receive.
      </>
    ),
  },
  {
    title: "Limited liquidity",
    body: (
      <>
        Fractional investments are not instant cash. There is no guarantee you
        can sell when you want to, or at the price you hoped for. Liquidity
        windows are typically <span className="tnum">quarterly</span>, and you
        should plan to hold an investment for a{" "}
        <span className="tnum">3–5</span> year period. If no other investor
        wants to buy your share during a window, you may need to wait.
      </>
    ),
  },
  {
    title: "Developer & counterparty risk",
    body: (
      <>
        Some opportunities depend on a developer completing a project, a builder
        delivering on time, or a counterparty meeting its obligations. Projects
        can be delayed, run over budget, or fail to complete. A counterparty can
        default. We check the parties we work with, but we cannot remove these
        risks, and a problem with a counterparty can reduce or delay your
        return.
      </>
    ),
  },
  {
    title: "Currency risk",
    body: (
      <>
        If you invest in US dollars from the diaspora while the underlying
        property earns in Ghana Cedis — or the other way around — movements in
        the exchange rate will affect your return. A currency can weaken as well
        as strengthen, and that swing can add to, or eat into, the value of your
        investment independent of how the property itself performs.
      </>
    ),
  },
  {
    title: "Financing & missed payments",
    body: (
      <>
        If you buy a home and pay monthly, missing payments has consequences —
        it can lead to fees, the loss of your position, and in the worst case
        the loss of the property. Understand the terms before you commit. We set
        out exactly what happens, step by step, on the{" "}
        <Link
          href="/how-it-works#missed-payment"
          className="font-medium text-ink-900 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-900"
        >
          how it works
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    title: "Afram is not a licensed investment adviser",
    body: (
      <>
        Afram is a property exchange. Nothing on this site is financial advice,
        and we do not assess whether an investment is suitable for your personal
        circumstances. We give you the facts; the decision is yours.
      </>
    ),
  },
];

function KeyRisks() {
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-3xl">
        <LegalNav current="key-risks" />

        <header className="mt-6 sm:mt-8 lg:mt-10">
          <h1 className="mt-4 max-w-3xl t-h1-sm text-ink-900">
            Key risks &amp; disclosures
          </h1>
          <p className="mt-4 max-w-2xl t-lead text-ink-500">
            Please read this before you invest. It explains, in plain language,
            the main ways you could lose money or be unable to access it when
            you want to.
          </p>
          <p className="mt-4 text-[13px] text-ink-400">
            Last updated: <span className="tnum">coming soon</span>
          </p>
        </header>

        <div className="mt-8">
          <CapitalAtRiskBadge variant="block" withLink={false} />
        </div>

        <div className="mt-10 divide-y divide-ink-100 border-y border-ink-100">
          {RISKS.map((r) => (
            <section key={r.title} className="py-7">
              <h2 className="t-h4 text-ink-900">
                {r.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
                {r.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-100">
          <p className="text-[15px] leading-relaxed text-ink-700">
            This page is not financial advice and does not take account of your
            personal situation. If you are unsure whether an investment is right
            for you, please seek independent financial and legal advice before
            you commit.
          </p>
        </div>
      </div>
    </Section>
  );
}

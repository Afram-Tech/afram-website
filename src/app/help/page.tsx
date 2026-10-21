import type { Metadata } from "next";

import { ReportIssueForm } from "@/components/help/ReportIssueForm";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HELP_GROUPS } from "@/features/help/faqs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Help",
  description:
    "Answers to common questions about Afram — getting access, identity verification, buying, selling and financing — and a way to report an issue.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <>
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <h1 className="text-ink-900 text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] font-bold tracking-[-0.025em]">
          Help
        </h1>
        <p className="text-ink-500 mt-3 max-w-xl text-[16px] leading-relaxed">
          Answers to common questions, or tell us what went wrong.
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="space-y-12">
            {HELP_GROUPS.map((group) => (
              <div key={group.label}>
                <h2 className="text-accent-700 text-[12px] font-bold tracking-[0.14em] uppercase">
                  {group.label}
                </h2>
                <FaqAccordion items={group.items} className="mt-3" />
              </div>
            ))}
          </div>

          <aside
            id="report"
            className="ring-ink-100 h-fit scroll-mt-24 rounded-[1.75rem] bg-white p-6 ring-1 sm:p-8 lg:sticky lg:top-28"
          >
            <SectionHeading title="Report an issue" />
            <p className="text-ink-500 mt-2 text-[14.5px] leading-relaxed">
              Something broken, or stuck? Tell us and we&apos;ll look into it.
            </p>
            <div className="mt-6">
              <ReportIssueForm />
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

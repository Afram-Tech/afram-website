import { BadgeCheck, Building2, Landmark } from "lucide-react";

import { Section } from "@/components/ui/Section";

/**
 * Answers "who stands behind these records" with more substance than a bare
 * regulatory-status strip. Marketing's draft carried a fourth card for the
 * Securities and Exchange Commission; that is not shipped, since this page
 * is careful never to imply Afram is itself regulated.
 */
const BODIES = [
  {
    mark: "LC",
    icon: Landmark,
    name: "Ghana Lands Commission",
    note: "Title and ownership records verified against the official registry",
  },
  {
    mark: "GR",
    icon: Building2,
    name: "GREDA",
    note: "Developer standards on title, permits and delivery",
  },
  {
    mark: "RC",
    icon: BadgeCheck,
    name: "REAC",
    note: "Real estate agency conduct and listing standards",
  },
];

export function RecognisedBy() {
  return (
    <Section id="trust" className="scroll-mt-24">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
        <div>
          <h2 className="text-ink-900 max-w-[20ch] text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
            The institutions that set the standard in Ghanaian property.
          </h2>
        </div>
        <p className="text-ink-500 max-w-[46ch] text-[15px] leading-relaxed">
          Records are verified against official registries, and our criteria are built around the
          bodies your compliance team already answers to.
        </p>
      </div>

      <dl className="bg-ink-100 ring-ink-100 mt-10 grid gap-px overflow-hidden rounded-[1.5rem] ring-1 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
        {BODIES.map((b) => (
          <div key={b.mark} className="bg-white p-7">
            <span className="bg-accent-50 text-accent-700 flex h-11 w-11 items-center justify-center rounded-xl">
              <b.icon className="h-5 w-5" />
            </span>
            <dt className="text-ink-900 mt-5 text-[15px] font-bold tracking-[-0.01em]">{b.name}</dt>
            <dd className="text-ink-500 mt-2 text-[13.5px] leading-relaxed">{b.note}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

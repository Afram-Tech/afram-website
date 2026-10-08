import Image from "next/image";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The financiers a project can be funded by on Afram. A provider without a
 * `src` shows as a wordmark until its logo file lands in /public/partners.
 *
 * Hand-maintained on purpose: the API's getFinanciers query needs a signed-in
 * user, so the public site can't read the list. Affinity and Origen are
 * listed per the vendors page doc (Oct 2026), which asks to confirm both are
 * onboarded — remove either here if not.
 */
const PROVIDERS: { name: string; src?: string }[] = [
  { name: "Affinity" },
  { name: "Ecobank", src: "/partners/ecobank.svg" },
  { name: "Origen" },
];

export function FinancierTypes() {
  return (
    <Section id="financiers" className="bg-brand-50/50 scroll-mt-24">
      <SectionHeading title="Capital providers." />

      <ul className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-12 lg:gap-5">
        {PROVIDERS.map((p) => (
          <li
            key={p.name}
            className="ring-ink-100 flex h-28 items-center justify-center rounded-[1.5rem] bg-white p-6 ring-1 sm:h-32"
          >
            {p.src ? (
              <div className="relative h-full w-full max-w-[180px]">
                <Image src={p.src} alt={p.name} fill sizes="180px" className="object-contain" />
              </div>
            ) : (
              <span className="text-brand-700 text-[22px] font-extrabold tracking-[0.01em]">
                {p.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

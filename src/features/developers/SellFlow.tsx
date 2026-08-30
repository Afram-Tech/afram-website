import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    n: "01",
    title: "List your project",
    body: "Submit your details and title documents. It takes minutes, and listing is free.",
  },
  {
    n: "02",
    title: "We verify and endorse",
    body: "We check the title against Lands Commission records, then add the Afram endorsement.",
  },
  {
    n: "03",
    title: "Financed members come to you",
    body: "Members arrive Afram-backed — 20% down, the rest paid monthly over up to 10 years.",
  },
  {
    n: "04",
    title: "You get paid faster",
    body: "Recover your capital without waiting on slow sales, ready for the next build.",
  },
];

export function SellFlow() {
  return (
    <Section className="bg-ink-50/60">
      <SectionHeading
        title="Four steps from listing to cash."
        intro="No bank queues for your members, no chasing leads for you."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
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
    </Section>
  );
}

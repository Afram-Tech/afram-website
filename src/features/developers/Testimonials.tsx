import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/features/personas/testimonials";

/**
 * Peer proof. Vendors discover Afram through other developers and validate
 * it the same way, so the quotes matter — but only real ones ship. Renders
 * nothing until `TESTIMONIALS` has entries.
 */
export function Testimonials({ title }: { title: string }) {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <Section className="pt-0">
      <SectionHeading title={title} />
      <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="bg-accent-50/70 flex flex-col rounded-[1.5rem] p-7 sm:p-8"
          >
            <blockquote className="text-ink-900 text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.4] font-semibold tracking-[-0.02em]">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3.5 pt-7">
              <span className="text-accent-700 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[15px] font-bold">
                {t.initials}
              </span>
              <span className="leading-tight">
                <b className="text-ink-900 block text-[14.5px] font-semibold">{t.name}</b>
                <span className="text-ink-500 text-[13px]">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

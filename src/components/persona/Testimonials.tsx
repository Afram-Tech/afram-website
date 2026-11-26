import { Section, SectionHeading } from "@/components/ui/Section";
import { TESTIMONIALS } from "@/lib/data/testimonials";

/**
 * Peer proof. This segment discovers Afram through other developers and
 * validates it the same way, so the quotes matter — but only real ones ship.
 * Renders nothing until `TESTIMONIALS` has entries.
 */
export function Testimonials({ title }: { title: string }) {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <Section className="pt-0 sm:pt-0 lg:pt-0">
      <SectionHeading title={title} />
      <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-3xl bg-accent-50/70 p-7 sm:p-8"
          >
            <blockquote className="text-[clamp(1.05rem,1.6vw,1.2rem)] font-semibold leading-[1.4] tracking-[calc(-0.02em*var(--tracking-scale,1))] text-ink-900">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3.5 pt-7">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[15px] font-bold text-accent-700">
                {t.initials}
              </span>
              <span className="leading-tight">
                <b className="block text-[14px] font-semibold text-ink-900">
                  {t.name}
                </b>
                <span className="text-[13px] text-ink-500">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

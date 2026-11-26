import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { SecBadge } from "@/components/ui/SecBadge";

/**
 * Role-page hero — a light, accent-tinted gradient card with the copy on the
 * left and a contained, rounded photo on the right (padded inside the card,
 * not bleeding to the edge). Clean and minimal; stacks on mobile.
 */
export function PersonaHero({
  headline,
  subhead,
  image,
  seed,
  badge = "Verified titles",
  children,
}: {
  headline: ReactNode;
  subhead: string;
  image: string;
  seed: string;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-white px-4 pb-8 pt-4 sm:pb-10 lg:px-[34px] lg:pb-16">
      <div className="relative mx-auto max-w-[1536px] overflow-hidden rounded-3xl bg-[radial-gradient(120%_140%_at_0%_0%,#fff_0%,var(--color-brand-50)_45%,var(--color-brand-100)_100%)] ring-1 ring-brand-500/15">

        <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_0.92fr] lg:gap-14 lg:p-14">
          {/* Copy */}
          <div className="max-w-[620px]">
            <SecBadge />

            <h1 className="t-h1 mt-5 text-ink-900">
              {headline}
            </h1>

            <p className="mt-5 max-w-md t-lead text-ink-600">
              {subhead}
            </p>

            {children && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {children}
              </div>
            )}
          </div>

          {/* Contained photo */}
          <div className="relative">
            <Photo
              seed={seed}
              src={image}
              priority
              sizes="(max-width: 1024px) 90vw, 600px"
              className="aspect-[4/3] w-full rounded-3xl shadow-raised ring-1 ring-black/5"
            />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-ink-900 shadow-float backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-accent-600" />
              {badge}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

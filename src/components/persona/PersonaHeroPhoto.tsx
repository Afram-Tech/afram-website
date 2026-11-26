import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SecBadge } from "@/components/ui/SecBadge";
import { Button } from "@/components/ui/Button";

/**
 * Full-bleed photo hero for the Vendor/Financier pages (Figma 1343-12219,
 * 1343-12301) — a rounded card with a cover photo behind the copy, no accent
 * tint, and a single CTA. Distinct from the gradient-card `PersonaHero` used
 * on Buyers/Invest; swapped in via `PersonaShell`'s `heroSlot` prop.
 */
export function PersonaHeroPhoto({
  photo,
  photoAlt,
  photoPosition,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  /** soft white diagonal wash for legibility over a darker photo (desktop) */
  overlay = false,
}: {
  photo: string;
  photoAlt: string;
  /** Wide-screen crop, e.g. "xl:object-[center_20%]" to keep a head in frame. */
  photoPosition?: string;
  headline: ReactNode;
  /**
   * Optional. Leave it out when the headline is a full sentence that already
   * says everything; the headline then sets a size down so it stays a block
   * of four or five lines rather than seven.
   */
  subhead?: string;
  ctaLabel: string;
  ctaHref: string;
  overlay?: boolean;
}) {
  return (
    <section className="bg-white px-4 pb-[var(--section-y,2rem)] pt-4 sm:pb-[var(--section-y-sm,2.5rem)] lg:px-[34px] lg:pb-[var(--section-y-lg,4rem)]">
      <div className="relative mx-auto flex max-w-[1536px] flex-col overflow-hidden rounded-3xl bg-brand-50 lg:block lg:min-h-[520px]">
        {/* The copy sits on the photo only at desktop, where the subject has
            room beside it. Narrower than that the two stack, so the text is
            never set across a person. */}
        {/* On small laptops the photo takes the right half beside the text
            rather than sitting behind it, so the headline never runs over
            the people in the picture. From xl it fills the whole card. */}
        <div className="relative order-last aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:left-[46%] lg:right-0 lg:w-auto lg:aspect-auto xl:left-0">
          <Image
            src={photo}
            alt={photoAlt}
            fill
            priority
            sizes="100vw"
            className={cn("object-cover object-[72%_center] lg:object-[72%_center]", photoPosition ?? "xl:object-center")}
          />

          {overlay && (
            <div
              className="absolute inset-0 hidden xl:block"
              style={{
                backgroundImage:
                  "linear-gradient(238deg, rgba(255,255,255,0.72) 22%, rgba(255,255,255,0.05) 52%)",
              }}
              aria-hidden
            />
          )}
        </div>

        <div className="relative z-10 flex max-w-[760px] flex-col lg:max-w-[46%] xl:max-w-[760px] justify-center px-6 py-7 sm:px-10 sm:py-10 lg:min-h-[520px] lg:px-14">
          <SecBadge />

          <h1
            className={cn(
              "mt-5 text-deep-950",
              subhead ? "t-h1 max-w-[560px]" : "t-h1-sm max-w-[600px]"
            )}
          >
            {headline}
          </h1>
          {subhead && (
            <p className="t-lead mt-4 max-w-[400px] text-deep-950/75">
              {subhead}
            </p>
          )}

          <Button href={ctaHref} size="lg" className="mt-7 w-fit">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fragment } from "react";

import { PolygonWordmark } from "@/components/PolygonWordmark";

export function PersonaPhotoHero({
  image,
  imageAlt,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  /** soft white diagonal wash for legibility over a darker photo (desktop) */
  overlay = false,
}: {
  image: string;
  imageAlt: string;
  headline: string[];
  subhead: string;
  ctaLabel: string;
  ctaHref: string;
  overlay?: boolean;
}) {
  // Lines break from sm up; on a phone the headline just wraps.
  const headlineNodes = headline.map<ReactNode>((line, index) =>
    index === 0 ? (
      line
    ) : (
      <Fragment key={line}>
        <br className="hidden sm:block" /> {line}
      </Fragment>
    ),
  );

  return (
    // Side padding matches the site header so the hero lines up with it.
    <section className="bg-white px-6 pt-4 pb-8 sm:px-8 sm:pb-10 lg:px-16 lg:pb-16">
      <div className="relative mx-auto min-h-[340px] max-w-[1536px] overflow-hidden rounded-[22px] bg-gradient-to-b from-[#fff9f6] to-white sm:min-h-[400px] lg:min-h-[461px]">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />

        {/* Mobile/tablet: a narrower crop brings the subject close to the text
            column at any object-position, so fade the top half toward white
            for legibility; the photo still reads clearly below. Desktop has
            room for the subject and text to sit side by side, so this is
            hidden at lg. */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/88 via-white/45 to-transparent lg:hidden"
          aria-hidden
        />

        {overlay && (
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              backgroundImage:
                "linear-gradient(238deg, rgba(255,255,255,0.72) 22%, rgba(255,255,255,0.05) 52%)",
            }}
            aria-hidden
          />
        )}

        <div className="relative z-10 flex min-h-[340px] max-w-[560px] flex-col justify-center px-6 py-8 sm:min-h-[400px] sm:px-10 sm:py-10 lg:min-h-[461px] lg:px-14">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-[#002d30]/60 uppercase">
            Powered by
            <PolygonWordmark className="h-[12px] w-auto text-[#7B3FE4]" />
          </div>

          <h1 className="mt-5 text-[clamp(1.9rem,3.05vw,2.375rem)] leading-[1.18] font-semibold tracking-[-0.035em] text-[#002d30]">
            {headlineNodes}
          </h1>
          <p className="mt-4 max-w-[380px] text-[15px] leading-relaxed text-[#002d30]/75">
            {subhead}
          </p>

          <Link
            href={ctaHref}
            className="mt-7 inline-flex h-12 w-fit items-center justify-center rounded-full bg-[#002d30] px-7 text-[15px] font-semibold text-white transition-all hover:bg-[#06474c] active:scale-[0.98]"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

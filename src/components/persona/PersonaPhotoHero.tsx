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
}: {
  image: string;
  imageAlt: string;
  headline: string[];
  subhead: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="bg-white px-6 pt-4 pb-6 sm:px-8 lg:px-16">
      <div className="relative mx-auto h-[520px] max-w-[1536px] overflow-hidden rounded-[2rem] sm:h-[580px] lg:h-[640px]">
        <Image src={image} alt={imageAlt} fill priority sizes="1536px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

        <div className="relative z-10 flex h-full max-w-[640px] flex-col justify-center px-6 sm:px-10 lg:px-14">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-[#002d30]/70 uppercase">
            Powered by
            <PolygonWordmark className="h-[12px] w-auto text-[#002D30]" />
          </span>

          <h1 className="mt-6 text-[clamp(2.1rem,3.6vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-[#002d30]">
            {headline.map<ReactNode>((line, index) =>
              index === 0 ? (
                line
              ) : (
                <Fragment key={line}>
                  <br />
                  {line}
                </Fragment>
              ),
            )}
          </h1>

          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[#002D30]/75">{subhead}</p>

          <div className="mt-8">
            <Link
              href={ctaHref}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#002d30] px-7 text-[15px] font-semibold text-white transition-all hover:bg-[#06474c] active:scale-[0.98]"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

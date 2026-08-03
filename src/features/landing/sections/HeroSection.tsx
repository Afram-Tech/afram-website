import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PolygonWordmark } from "@/components/PolygonWordmark";
import type { HomePageContent } from "@/features/landing/data/home";
import { ROLE_CARDS } from "@/features/landing/data/role-cards";
import { lighten } from "@/lib/utils";

interface HeroSectionProps {
  content?: HomePageContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  // Backgrounds, pill colors, and art positioning stay design-locked — only
  // the copy/link/image for each role card is overridable from Sanity, and
  // only when there's an override for that specific slot.
  const roleCards = ROLE_CARDS.map((card, index) => {
    const override = content?.roleCards?.[index];
    return {
      ...card,
      eyebrow: override?.eyebrow || card.eyebrow,
      title: override?.title || card.title,
      href: override?.link || card.href,
      art: { ...card.art, src: override?.image || card.art.src },
    };
  });

  const heroEyebrow = content?.heroEyebrow ?? "Powered by";
  const heroImage = content?.heroImage ?? "/hero-townhouses-v5.webp";
  const primaryCtaLabel = content?.heroPrimaryCtaLabel ?? "View Properties";
  const primaryCtaLink = content?.heroPrimaryCtaLink ?? "/properties";
  const secondaryCtaLabel = content?.heroSecondaryCtaLabel ?? "How it works";
  const secondaryCtaLink = content?.heroSecondaryCtaLink ?? "/how-it-works";

  return (
    <section className="flex min-h-[calc(100dvh-72px)] flex-col bg-white pt-4">
      <div className="relative min-h-140 flex-1 overflow-hidden bg-[linear-gradient(to_bottom,#c0f8f5_0%,#eafcfb_45%,#f7fefe_100%)] sm:min-h-90">
        <div className="pointer-events-none absolute inset-x-0 top-[68%] bottom-0 select-none sm:top-[44%] lg:top-[33%] xl:top-[30%] 2xl:top-[27%]">
          <Image
            src={heroImage}
            alt="A row of modern verified homes"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_10%]"
          />
        </div>

        <div className="relative z-10 mx-auto h-full max-w-[1536px] px-6 sm:px-8 lg:px-16">
          <div className="max-w-[840px] pt-8 sm:pt-10 lg:pt-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-[#002d30]/60 uppercase">
              {heroEyebrow}
              <PolygonWordmark className="h-[12px] w-auto text-[#002D30]" />
            </div>

            {content?.heroHeading ? (
              <h1 className="mt-4 text-[clamp(1.75rem,2.9vw,2.375rem)] leading-[1.16] font-semibold tracking-[-0.035em] whitespace-pre-line text-[#002d30]">
                {content.heroHeading}
              </h1>
            ) : (
              <h1 className="mt-4 text-[clamp(1.75rem,2.9vw,2.375rem)] leading-[1.16] font-semibold tracking-[-0.035em] text-[#002d30]">
                A Transparent Real Estate Marketplace for
                <br className="hidden sm:block" /> Buyers, Vendors, and Financiers
                <br className="hidden sm:block" /> powered by Blockchain.
              </h1>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryCtaLink}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#002d30] px-7 text-[15px] font-semibold text-white transition-all hover:bg-[#06474c] active:scale-[0.98]"
              >
                {primaryCtaLabel}
              </Link>
              <Link
                href={secondaryCtaLink}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#d9f1f4] px-7 text-[15px] font-semibold text-[#002d30] backdrop-blur-sm transition-all hover:bg-[#c5e8ec] active:scale-[0.98]"
              >
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-2 w-full max-w-[1600px] shrink-0 px-6 pb-4 sm:px-8 sm:pb-6 lg:px-6">
        <div className="grid grid-cols-1 gap-2 rounded-[22px] bg-[#fafafa] p-2 sm:grid-cols-3">
          {roleCards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              style={{
                background: `linear-gradient(to bottom, ${card.backgroundColor}, ${lighten(card.backgroundColor, 0.6)})`,
              }}
              className="group relative h-[135px] overflow-hidden rounded-[18px] px-5 pt-4 transition-shadow duration-300 hover:shadow-[0_18px_40px_-26px_rgba(0,45,48,0.45)] sm:h-[160px] lg:h-[175px]"
            >
              <Image
                src={card.art.src}
                alt={card.art.alt}
                width={100}
                height={100}
                className={`pointer-events-none transition-transform duration-500 ease-out select-none group-hover:scale-[1.03] ${card.art.class}`}
              />

              <div className="relative z-10 flex h-full max-w-57.5 flex-col lg:max-w-95">
                <span
                  style={{ backgroundColor: card.pillColor }}
                  className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] font-medium tracking-[-0.02em] text-[#002d30] sm:text-[13px]"
                >
                  {card.eyebrow}
                </span>

                <h3 className="mt-2 max-w-87.5 text-[1rem] leading-[1.2] font-semibold tracking-[-0.03em] text-[#002d30] sm:mt-2.5 sm:text-[1.15rem] sm:leading-[1.22] lg:text-[1.25rem]">
                  {card.title}
                </h3>

                <span className="inline-flex items-center gap-2 pb-1 text-[13px] font-medium text-[#002d30]/70 sm:text-[15px]">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

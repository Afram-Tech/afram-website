import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SecBadge } from "@/components/ui/SecBadge";
import { buttonVariants } from "@/components/ui/button-variants";
import type { HomePageContent } from "@/features/landing/data/home";
import { ROLE_CARDS } from "@/features/landing/data/role-cards";

interface HeroSectionProps {
  content?: HomePageContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  // Backgrounds, pill colours and art geometry stay design-locked; only the
  // copy, link and image for each role card is overridable from Sanity, and
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

  const heroEyebrow = content?.heroEyebrow;
  const heroImage = content?.heroImage ?? "/hero-townhouses-v5.webp";
  const primaryCtaLabel = content?.heroPrimaryCtaLabel ?? "View Properties";
  const primaryCtaLink = content?.heroPrimaryCtaLink ?? "/properties";
  const secondaryCtaLabel = content?.heroSecondaryCtaLabel ?? "How it works";
  const secondaryCtaLink = content?.heroSecondaryCtaLink ?? "/how-it-works";

  return (
    <section className="bg-white pt-4 lg:pt-[25px]">
      {/* Hero band: a cyan gradient. The cut-out render (transparent sky)
          fills the band on desktop and sits below the copy on phones. */}
      <div className="relative flex flex-col overflow-hidden bg-[linear-gradient(180deg,var(--color-brand-100)_0px,var(--color-brand-50)_320px,#fff_620px)] [--hero-band-h:clamp(640px,41.9vw,880px)] lg:block lg:h-[var(--hero-band-h)]">
        {/* Copy, on the same container as the nav. */}
        <div className="relative z-10 mx-auto w-full max-w-[1536px] px-6 sm:px-8 lg:px-16">
          <div className="rise pt-10 sm:pt-12 lg:pt-[64px]">
            <SecBadge label={heroEyebrow} />

            <h1 className="t-h1 text-deep-950 mt-5 text-[clamp(1.875rem,3.1vw,2.75rem)] leading-[1.12] whitespace-pre-line">
              {content?.heroHeading ?? (
                <>
                  A transparent Real estate marketplace
                  <br className="hidden sm:block" /> powered by Blockchain
                </>
              )}
            </h1>

            <div className="mt-[27px] flex flex-col gap-2 sm:flex-row">
              <Link href={primaryCtaLink} className={buttonVariants("primary", "lg")}>
                {primaryCtaLabel}
              </Link>
              <Link href={secondaryCtaLink} className={buttonVariants("secondary", "lg")}>
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>
        </div>

        {/* Townhouse render, uncropped by a mask. Phones and tablets: its own
            strip under the copy. Desktop: full band width at its natural
            aspect, bleeding off the band's bottom (and, on wide screens, its
            top). Its top offset is the larger of 10% of the overflow (wins
            from ~1800px up) and a laptop floor that slides the houses down as
            the viewport narrows, so the middle roof never runs under the CTAs.
            54.458vw is the render's height at full viewport width
            (1307 / 2400). */}
        <div className="pointer-events-none relative mt-8 h-[260px] w-full select-none [--hero-img-top:max(calc((var(--hero-band-h)_-_54.458vw)_*_0.1),calc(40px_+_(1536px_-_100vw)_*_0.22))] sm:mt-10 sm:h-[340px] md:h-[400px] lg:absolute lg:inset-x-0 lg:top-[var(--hero-img-top)] lg:mt-0 lg:aspect-[2400/1307] lg:h-auto">
          <Image
            src={heroImage}
            alt="A row of modern verified homes"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Role cards: three separate cards on the site container. The gap
          above them matches the gap between them. */}
      <div className="mx-auto mt-3 max-w-[1536px] px-6 sm:px-8 lg:mt-6 lg:px-16 xl:mt-[36px]">
        <div className="grid gap-3 lg:grid-cols-3 lg:gap-6 xl:gap-[36px]">
          {roleCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              style={{ backgroundImage: card.background }}
              className="group relative min-h-[176px] overflow-hidden rounded-[20px] px-5 pt-[19px] pb-4 transition-shadow duration-300 [--art-k:0.72] hover:shadow-[0_18px_40px_-26px_rgba(0,45,48,0.45)] sm:px-[23px] sm:[--art-k:1] lg:min-h-[214px] lg:[--art-k:0.72] xl:min-h-[194px] xl:[--art-k:1]"
            >
              <Image
                src={card.art.src}
                alt=""
                width={card.art.width}
                height={card.art.height}
                sizes="220px"
                style={{
                  height: `calc(${card.art.h}px * var(--art-k))`,
                  bottom: `calc(${-card.art.drop}px * var(--art-k))`,
                  right: `calc(${card.art.right}px * var(--art-k))`,
                }}
                className="pointer-events-none absolute w-auto max-w-none origin-bottom transition-transform duration-500 ease-out select-none group-hover:scale-[1.03]"
              />

              <div className="relative z-10">
                <span
                  style={{ backgroundColor: card.pillColor }}
                  className="text-deep-950 flex h-7 w-fit items-center rounded-full px-[14px] pt-[2px] text-[15px] font-medium tracking-[-0.035em]"
                >
                  {card.eyebrow}
                </span>

                <h3 className="text-deep-950 mt-3 max-w-[min(400px,62%)] text-[20px] leading-[1.27] font-semibold tracking-[-0.03em] text-pretty sm:max-w-[min(400px,78%)] xl:max-w-[400px] xl:text-[22px]">
                  {card.title}
                </h3>

                <span className="text-deep-950/70 mt-px flex w-fit items-center gap-2 text-[16px] leading-6 font-medium">
                  Explore
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

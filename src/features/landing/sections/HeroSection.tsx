import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PolygonWordmark } from "@/components/PolygonWordmark";
import { ROLE_CARDS } from "@/features/landing/data/role-cards";
import { lighten } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="bg-white pt-4">
      <div className="relative h-[560px] overflow-hidden bg-[linear-gradient(to_bottom,#c0f8f5_0%,#eafcfb_45%,#f7fefe_100%)] sm:h-[620px] lg:h-[700px] xl:h-[800px] 2xl:h-[880px]">
        <div className="pointer-events-none absolute inset-x-0 top-[46%] bottom-0 select-none sm:top-[44%] lg:top-[41%] xl:top-[38%] 2xl:top-[35%]">
          <Image
            src="/hero-townhouses-v5.webp"
            alt="A row of modern verified homes"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_10%]"
          />
        </div>

        <div className="relative z-10 mx-auto h-full max-w-[1536px] px-6 sm:px-8 lg:px-16">
          <div className="max-w-[840px] pt-12 sm:pt-14 lg:pt-[72px]">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-[#002d30]/60 uppercase">
              Powered by
              <PolygonWordmark className="h-[12px] w-auto text-[#002D30]" />
            </div>

            <h1 className="mt-5 text-[clamp(1.9rem,3.05vw,2.375rem)] leading-[1.18] font-semibold tracking-[-0.035em] text-[#002d30]">
              A Transparent Real Estate Marketplace for
              <br className="hidden sm:block" /> Buyers, Vendors, and Financiers
              <br className="hidden sm:block" /> powered by Blockchain.
            </h1>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/properties"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#002d30] px-7 text-[15px] font-semibold text-white transition-all hover:bg-[#06474c] active:scale-[0.98]"
              >
                View Properties
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#d9f1f4] px-7 text-[15px] font-semibold text-[#002d30] backdrop-blur-sm transition-all hover:bg-[#c5e8ec] active:scale-[0.98]"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-2 max-w-[1600px] px-6 sm:px-8 lg:px-6">
        <div className="grid gap-2 rounded-[22px] bg-[#fafafa] p-2 sm:grid-cols-3">
          {ROLE_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              style={{
                background: `linear-gradient(to bottom, ${card.backgroundColor}, ${lighten(card.backgroundColor, 0.6)})`,
              }}
              className="group relative h-[190px] overflow-hidden rounded-[18px] px-5 pt-5 transition-shadow duration-300 hover:shadow-[0_18px_40px_-26px_rgba(0,45,48,0.45)] sm:h-[215px]"
            >
              <img
                src={card.art.src}
                alt={card.art.alt}
                className={`pointer-events-none transition-transform duration-500 ease-out select-none group-hover:scale-[1.03] ${card.art.class}`}
              />

              <div className="relative z-10 flex h-full max-w-57.5 flex-col lg:max-w-95">
                <span
                  style={{ backgroundColor: card.pillColor }}
                  className="inline-flex w-fit items-center rounded-full px-3.5 py-1 text-[13px] font-medium tracking-[-0.02em] text-[#002d30]"
                >
                  {card.eyebrow}
                </span>

                <h3 className="mt-2 max-w-87.5 text-[1.15rem] leading-[1.22] font-semibold tracking-[-0.03em] text-[#002d30] sm:mt-2.5 sm:text-[1.375rem] sm:leading-[1.25]">
                  {card.title}
                </h3>

                <span className="mt-4 inline-flex items-center gap-2 pb-1 text-[14px] font-medium text-[#002d30]/70 sm:text-[16px]">
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

import Image from "next/image";

import { PARTNERS } from "@/features/landing/data/partners";

export function PartnerLogosSection() {
  const track = [...PARTNERS, ...PARTNERS];

  return (
    <section className="bg-white px-6 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-14">
      <div className="mx-auto max-w-[1536px]">
        <h2 className="text-ink-900 text-center text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
          Trusted by leading institutions
        </h2>
        <div className="group relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:mt-8">
          <div className="marquee-track flex items-center gap-4 group-hover:[animation-play-state:paused] sm:gap-5">
            {track.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="group border-ink-100 flex h-20 w-44 shrink-0 items-center justify-center rounded-2xl border bg-white p-5 sm:h-24 sm:w-52"
              >
                <Image
                  src={partner.logoSrc}
                  alt={partner.name}
                  width={140}
                  height={48}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

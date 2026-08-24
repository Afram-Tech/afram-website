import Image from "next/image";

type Partner = { name: string; src?: string; full?: string };

/**
 * A partner without a `src` renders as a wordmark until its file lands. To
 * add GREDA or REAC artwork, drop the file in /public/partners and add the
 * path here — nothing else changes.
 */
const PARTNERS: Partner[] = [
  { name: "Ecobank", src: "/partners/ecobank.svg" },
  { name: "Ghana Lands Commission", src: "/partners/lands-commission.jpeg" },
  { name: "Merson Developers", src: "/partners/merson-developers.png" },
  { name: "GREDA", full: "Ghana Real Estate Developers Association" },
  { name: "REAC", full: "Real Estate Agency Council" },
];

function LogoCard({ name, src, full }: Partner) {
  return (
    <div className="border-ink-100 group flex h-20 w-44 shrink-0 items-center justify-center rounded-2xl border bg-white p-5 sm:h-24 sm:w-52">
      {src ? (
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={name}
            fill
            sizes="200px"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </div>
      ) : (
        <span className="flex flex-col items-center text-center transition-transform duration-300 group-hover:scale-[1.04]">
          <span className="text-brand-700 text-[17px] font-extrabold tracking-[0.02em]">
            {name}
          </span>
          {full && (
            <span className="text-ink-400 mt-1 text-[8.5px] leading-tight font-semibold tracking-[0.06em] uppercase">
              {full}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

/**
 * Infinite logo marquee — the track is the partner list duplicated once so
 * translateX(-50%) loops seamlessly (see .marquee-track in globals.css).
 */
export function PartnerLogos() {
  const track = [...PARTNERS, ...PARTNERS];

  return (
    <section className="bg-white px-6 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-14">
      <div className="mx-auto max-w-[1536px]">
        <h2 className="text-ink-900 text-center text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
          Trusted by leading institutions
        </h2>
        <div className="group relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:mt-8">
          <div className="marquee-track flex items-center gap-4 group-hover:[animation-play-state:paused] sm:gap-5">
            {track.map((p, i) => (
              <LogoCard key={`${p.name}-${i}`} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

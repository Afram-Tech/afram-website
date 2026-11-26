import { LogoTicker } from "@/components/ui/LogoTicker";
import type { HomePartnerContent } from "@/features/landing/data/home";
import { PARTNERS } from "@/features/landing/data/partners";

interface PartnerLogosSectionProps {
  heading?: string;
  partners?: HomePartnerContent[];
}

/** Institutions on the home page, in a slow ticker so the strip keeps working as the list grows. */
export function PartnerLogosSection({ heading, partners }: PartnerLogosSectionProps) {
  const logos = (partners ?? PARTNERS.map((p) => ({ name: p.name, logo: p.logoSrc }))).map((p) => ({
    name: p.name,
    src: p.logo,
  }));

  return (
    <section className="bg-white px-6 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-14">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="t-overline text-ink-400 text-center">
          {heading ?? "Trusted by leading institutions"}
        </h2>
        <LogoTicker
          logos={logos}
          className="mt-6 py-1"
          tileClassName="h-16 w-36 border border-ink-100 shadow-xs sm:h-20 sm:w-48"
        />
      </div>
    </section>
  );
}

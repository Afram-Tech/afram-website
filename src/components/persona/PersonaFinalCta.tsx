import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { DuotonePhoto } from "@/components/ui/DuotonePhoto";
import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/button-variants";

export function PersonaFinalCta({
  title,
  subtitle,
  primary,
  secondary,
}: {
  title: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <Section className="pt-0">
      <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] lg:min-h-[440px]">
        <DuotonePhoto
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=68"
          alt=""
          className="absolute inset-0 h-full w-full"
        >
          <div className="from-brand-950/82 via-brand-950/45 to-brand-900/20 absolute inset-0 bg-gradient-to-t" />
        </DuotonePhoto>
        <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-8 sm:p-12 lg:min-h-[440px] lg:p-14">
          <h2 className="max-w-2xl text-[clamp(2rem,3.8vw,3rem)] leading-[1.06] font-extrabold tracking-[-0.02em] text-white">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/75">{subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={primary.href} className={buttonVariants("inverse", "lg")}>
              {primary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {secondary ? (
              <Link href={secondary.href} className={buttonVariants("outline", "lg")}>
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}

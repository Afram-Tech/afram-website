import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/button-variants";
import { getAllProperties } from "@/features/landing/data/properties";
import { PROPERTY_TYPE_PAGES, propertiesOfType, typePath } from "@/lib/property-seo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Browse title-verified homes and land for sale in Ghana.",
  robots: { index: false, follow: true },
};

/**
 * Shown for any unknown URL and whenever a page calls notFound() (an
 * unlisted property, a deleted article). Next still answers with a 404
 * status; the links give both visitors and crawlers a way back into the
 * listings instead of a dead end.
 */
export default async function NotFound() {
  const properties = await getAllProperties();
  // Only types that currently have listings — the others are 404s themselves.
  const types = PROPERTY_TYPE_PAGES.filter((type) => propertiesOfType(properties, type).length > 0);

  return (
    <Section className="py-20 sm:py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-brand-600 text-sm font-semibold tracking-[0.14em] uppercase">404</p>
        <h1 className="text-ink-900 mt-3 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          We couldn&apos;t find that page
        </h1>
        <p className="text-ink-500 mt-4 text-[16px] leading-relaxed">
          The listing may have been sold or taken down, or the link may be mistyped. Browse
          what&apos;s available now instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/properties" className={buttonVariants("primary", "lg")}>
            Browse properties
          </Link>
          <Link href="/" className={buttonVariants("secondary", "lg")}>
            Go to the home page
          </Link>
        </div>
        {types.length > 0 && (
          <nav aria-label="Property types" className="mt-10">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[14px]">
              {types.map((type) => (
                <li key={type.slug}>
                  <Link
                    href={typePath(type)}
                    className="text-ink-600 hover:text-brand-700 underline-offset-4 hover:underline"
                  >
                    {type.plural} for sale
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </Section>
  );
}

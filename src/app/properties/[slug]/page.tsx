import { Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Photo } from "@/components/ui/Photo";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  findPropertyBySlug,
  formatPropertyPrice,
  getAllProperties,
} from "@/features/landing/data/properties";
import { formatPropertySize } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProperties().map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = findPropertyBySlug(slug);

  if (!property) {
    return buildMetadata({
      title: "Property not found",
      description: "This property listing could not be found.",
      path: `/properties/${slug}`,
    });
  }

  return buildMetadata({
    title: `${property.name} — ${property.location}`,
    description: `${property.name} in ${property.location}. ${property.beds} bed, ${property.baths} bath, ${formatPropertySize(property.sqft)}. Title-verified on Afram.`,
    path: `/properties/${property.slug}`,
  });
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = findPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Photo
          seed={property.seed}
          src={property.image}
          alt={property.name}
          className="h-72 w-full rounded-[1.25rem]"
        />

        <div className="mt-6 flex flex-wrap gap-1.5">
          {property.tags.map((tag) => (
            <span
              key={tag}
              className="bg-brand-50 text-brand-700 rounded-full px-2.5 py-1 text-[11px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-ink-900 mt-3 text-[clamp(1.8rem,3vw,2.25rem)] font-bold tracking-[-0.02em]">
          {property.name}
        </h1>
        <p className="text-ink-500 mt-1 flex items-center gap-1 text-[15px]">
          <MapPin className="text-brand-500 h-4 w-4" />
          {property.location}
        </p>

        <p className="text-brand-500 mt-4 text-2xl font-bold">{formatPropertyPrice(property)}</p>

        <div className="border-ink-100 text-ink-700 mt-6 flex items-center gap-6 border-t pt-6 text-sm">
          <span className="flex items-center gap-2">
            <BedDouble className="size-5" /> {property.beds} beds
          </span>
          <span className="flex items-center gap-2">
            <Bath className="size-5" /> {property.baths} baths
          </span>
          <span className="flex items-center gap-2">
            <Maximize className="size-5" /> {formatPropertySize(property.sqft)}
          </span>
        </div>

        <p className="text-ink-700 mt-8">
          This listing has been title-verified against Ghana&apos;s Lands Commission records.
          Flexible financing is available for qualified buyers, with a typical structure of a 20%
          deposit and instalments over up to 10 years.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className={buttonVariants("primary")}>
            Enquire about this property
          </Link>
          <Link href="/properties" className={buttonVariants("secondary")}>
            Back to all properties
          </Link>
        </div>
      </div>
    </section>
  );
}

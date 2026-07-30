import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findPropertyBySlug, getAllProperties } from "@/features/landing/data/properties";
import { PropertyDetail } from "@/features/properties/PropertyDetail";
import { formatPropertySize } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const properties = await getAllProperties();
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await findPropertyBySlug(slug);

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
  const property = await findPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return <PropertyDetail property={property} />;
}

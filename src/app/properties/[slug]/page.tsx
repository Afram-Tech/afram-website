import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { findPropertyBySlug, getAllProperties } from "@/features/landing/data/properties";
import { PropertyDetail } from "@/features/properties/PropertyDetail";
import {
  buildPropertyJsonLd,
  locationName,
  locationPath,
  locationTrail,
  propertyDescription,
  propertyHeadline,
} from "@/lib/property-seo";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

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

  // The search phrase leads ("2 Bedroom Apartment for Sale in Adenta…"), the
  // listing's own name follows — people search for the former, not the latter.
  return buildMetadata({
    title: `${propertyHeadline(property)} | ${property.name}`,
    description: propertyDescription(property),
    path: `/properties/${property.slug}`,
    images: property.images.slice(0, 4),
  });
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await findPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const trail = locationTrail(property);

  return (
    <>
      <JsonLd data={buildPropertyJsonLd(property)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Properties", path: "/properties" },
          ...trail.map((node) => ({ name: locationName(node), path: locationPath(node) })),
          { name: property.name, path: `/properties/${property.slug}` },
        ])}
      />
      <PropertyDetail property={property} />
    </>
  );
}

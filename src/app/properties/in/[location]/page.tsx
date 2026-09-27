import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllProperties } from "@/features/landing/data/properties";
import { PropertyCollection } from "@/features/properties/PropertyCollection";
import {
  collectionDescription,
  collectionHeading,
  getLocationPage,
  locationPath,
  locationsWithListings,
  propertiesInLocation,
} from "@/lib/property-seo";
import { buildMetadata } from "@/lib/seo";

interface LocationPageProps {
  params: Promise<{ location: string }>;
}

/** e.g. /properties/in/greater-accra, /properties/in/adenta — every region
 *  and district with listings. */
export async function generateStaticParams() {
  const properties = await getAllProperties();
  return locationsWithListings(properties).map(({ node }) => ({ location: node.slug }));
}

async function load(params: LocationPageProps["params"]) {
  const location = getLocationPage((await params).location);
  if (!location) return null;
  const allProperties = await getAllProperties();
  const properties = propertiesInLocation(allProperties, location);
  return properties.length > 0 ? { location, properties, allProperties } : null;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const page = await load(params);
  if (!page) return {};
  return buildMetadata({
    title: collectionHeading(undefined, page.location),
    description: collectionDescription(page.properties, undefined, page.location),
    path: locationPath(page.location),
    images: [page.properties[0].image],
  });
}

export default async function PropertyLocationPage({ params }: LocationPageProps) {
  const page = await load(params);
  if (!page) notFound();

  return (
    <PropertyCollection
      properties={page.properties}
      allProperties={page.allProperties}
      location={page.location}
      path={locationPath(page.location)}
    />
  );
}

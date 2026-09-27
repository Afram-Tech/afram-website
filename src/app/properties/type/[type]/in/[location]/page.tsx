import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllProperties } from "@/features/landing/data/properties";
import { PropertyCollection } from "@/features/properties/PropertyCollection";
import {
  collectionDescription,
  collectionHeading,
  getLocationPage,
  getTypePage,
  propertiesInLocation,
  propertiesOfType,
  typeLocationPairs,
  typeLocationPath,
} from "@/lib/property-seo";
import { buildMetadata } from "@/lib/seo";

interface TypeLocationPageProps {
  params: Promise<{ type: string; location: string }>;
}

/** e.g. /properties/type/apartments/in/accra — "apartments for sale in
 *  Accra" is the shape most property searches take. Only pairs with
 *  listings are built. */
export async function generateStaticParams() {
  const properties = await getAllProperties();
  return typeLocationPairs(properties).map(({ type, node }) => ({
    type: type.slug,
    location: node.slug,
  }));
}

async function load(params: TypeLocationPageProps["params"]) {
  const slugs = await params;
  const type = getTypePage(slugs.type);
  const location = getLocationPage(slugs.location);
  if (!type || !location) return null;
  const allProperties = await getAllProperties();
  const properties = propertiesInLocation(propertiesOfType(allProperties, type), location);
  return properties.length > 0 ? { type, location, properties, allProperties } : null;
}

export async function generateMetadata({ params }: TypeLocationPageProps): Promise<Metadata> {
  const page = await load(params);
  if (!page) return {};
  return buildMetadata({
    title: collectionHeading(page.type, page.location),
    description: collectionDescription(page.properties, page.type, page.location),
    path: typeLocationPath(page.type, page.location),
    images: [page.properties[0].image],
  });
}

export default async function PropertyTypeLocationPage({ params }: TypeLocationPageProps) {
  const page = await load(params);
  if (!page) notFound();

  return (
    <PropertyCollection
      properties={page.properties}
      allProperties={page.allProperties}
      type={page.type}
      location={page.location}
      path={typeLocationPath(page.type, page.location)}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllProperties } from "@/features/landing/data/properties";
import { PropertyCollection } from "@/features/properties/PropertyCollection";
import {
  collectionDescription,
  collectionHeading,
  getTypePage,
  PROPERTY_TYPE_PAGES,
  propertiesOfType,
  typePath,
} from "@/lib/property-seo";
import { buildMetadata } from "@/lib/seo";

interface TypePageProps {
  params: Promise<{ type: string }>;
}

/** e.g. /properties/type/apartments — only types with listings are built. */
export async function generateStaticParams() {
  const properties = await getAllProperties();
  return PROPERTY_TYPE_PAGES.filter((type) => propertiesOfType(properties, type).length > 0).map(
    (type) => ({ type: type.slug }),
  );
}

async function load(params: TypePageProps["params"]) {
  const type = getTypePage((await params).type);
  if (!type) return null;
  const allProperties = await getAllProperties();
  const properties = propertiesOfType(allProperties, type);
  return properties.length > 0 ? { type, properties, allProperties } : null;
}

export async function generateMetadata({ params }: TypePageProps): Promise<Metadata> {
  const page = await load(params);
  if (!page) return {};
  return buildMetadata({
    title: collectionHeading(page.type),
    description: collectionDescription(page.properties, page.type),
    path: typePath(page.type),
    images: [page.properties[0].image],
  });
}

export default async function PropertyTypePage({ params }: TypePageProps) {
  const page = await load(params);
  if (!page) notFound();

  return (
    <PropertyCollection
      properties={page.properties}
      allProperties={page.allProperties}
      type={page.type}
      path={typePath(page.type)}
    />
  );
}

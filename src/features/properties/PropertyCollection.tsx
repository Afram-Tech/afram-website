import { Map as MapIcon } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/button-variants";
import type { Property } from "@/features/landing/data/properties";
import { PropertyCard } from "@/features/landing/PropertyCard";
import type { LocationNode } from "@/lib/location-taxonomy";
import {
  buildItemListJsonLd,
  collectionDescription,
  collectionHeading,
  locationName,
  locationPath,
  locationsWithListings,
  PROPERTY_TYPE_PAGES,
  propertiesInLocation,
  propertiesOfType,
  typeLocationPath,
  typePath,
  type PropertyTypePage,
} from "@/lib/property-seo";
import { REGIONS } from "@/lib/location-taxonomy";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

interface PropertyCollectionProps {
  /** The listings already narrowed to this type and/or place. */
  properties: Property[];
  /** Every listing — for the "browse more" links to sibling collections. */
  allProperties: Property[];
  type?: PropertyTypePage;
  location?: LocationNode;
  path: string;
}

function LinkChips({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; count: number }[];
}) {
  if (links.length === 0) return null;
  return (
    <div>
      <h2 className="text-ink-900 text-[15px] font-semibold">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="border-ink-200 text-ink-700 hover:border-brand-300 hover:text-brand-700 inline-flex h-9 items-center gap-1.5 rounded-full border bg-white px-3.5 text-[13px] font-medium transition-colors"
            >
              {link.label}
              <span className="text-ink-400">{link.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A server-rendered, crawlable collection of listings — "Apartments for Sale
 * in Accra" and the like. /properties itself filters in the browser, so its
 * results aren't in the HTML a search engine first sees; these pages are,
 * and each one answers a query people actually type.
 */
export function PropertyCollection({
  properties,
  allProperties,
  type,
  location,
  path,
}: PropertyCollectionProps) {
  const heading = collectionHeading(type, location);

  // Sibling collections: other types here, and this type (or everything)
  // elsewhere. Only ones with listings — an empty page is never linked.
  const here = location ? propertiesInLocation(allProperties, location) : allProperties;
  const typeLinks = PROPERTY_TYPE_PAGES.filter((t) => t !== type)
    .map((t) => ({
      href: location ? typeLocationPath(t, location) : typePath(t),
      label: location ? `${t.plural} in ${locationName(location)}` : t.plural,
      count: propertiesOfType(here, t).length,
    }))
    .filter((link) => link.count > 0);

  const placeLinks = locationsWithListings(
    type ? propertiesOfType(allProperties, type) : allProperties,
  )
    .filter(({ node }) => node.id !== location?.id)
    // Regions first, then the busiest districts — a long tail of one-listing
    // districts isn't worth a wall of chips.
    .sort(
      (a, b) =>
        Number(REGIONS.some((r) => r.id === b.node.id)) -
          Number(REGIONS.some((r) => r.id === a.node.id)) ||
        b.properties.length - a.properties.length,
    )
    .slice(0, 16)
    .map(({ node, properties: here }) => ({
      href: type ? typeLocationPath(type, node) : locationPath(node),
      label: type ? `${type.plural} in ${locationName(node)}` : locationName(node),
      count: here.length,
    }));

  const breadcrumbs = [
    { name: "Properties", path: "/properties" },
    ...(type ? [{ name: type.plural, path: typePath(type) }] : []),
    ...(location ? [{ name: locationName(location), path }] : []),
  ];

  const mapParams = location
    ? `?${"parentId" in location ? "city" : "region"}=${location.slug}`
    : "";

  return (
    <Section className="py-10 lg:py-14">
      <JsonLd data={buildItemListJsonLd(properties, heading, path)} />
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, ...breadcrumbs])} />

      <nav
        aria-label="Breadcrumb"
        className="text-ink-400 flex flex-wrap items-center gap-2 text-[13px]"
      >
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="contents">
            {index > 0 && <span>›</span>}
            {index < breadcrumbs.length - 1 ? (
              <Link href={crumb.path} className="hover:text-ink-700">
                {crumb.name}
              </Link>
            ) : (
              <span className="text-ink-700">{crumb.name}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-ink-900 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">
            {heading}
          </h1>
          <p className="text-ink-500 mt-3 text-[16px] leading-relaxed">
            {collectionDescription(properties, type, location)}
          </p>
        </div>
        <Link
          href={`/properties/map${mapParams}`}
          className={buttonVariants("secondary", "sm", "shrink-0 rounded-full")}
        >
          <MapIcon className="h-4 w-4" />
          View on map
        </Link>
      </div>

      <div className="gap-x-card mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
        {properties.map((property) => (
          <PropertyCard key={property.slug} property={property} />
        ))}
      </div>

      <div className="border-ink-100 mt-16 flex flex-col gap-8 border-t pt-10">
        <LinkChips title={location ? "Other property types" : "Property types"} links={typeLinks} />
        <LinkChips
          title={type ? `${type.plural} by location` : "Other locations"}
          links={placeLinks}
        />
      </div>
    </Section>
  );
}

/** Every type and place with listings, as plain links — for /properties,
 *  whose own results are filtered client-side and so give a crawler nothing
 *  to follow on their own. */
export function PropertyBrowseLinks({ allProperties }: { allProperties: Property[] }) {
  const typeLinks = PROPERTY_TYPE_PAGES.map((type) => ({
    href: typePath(type),
    label: type.plural,
    count: propertiesOfType(allProperties, type).length,
  })).filter((link) => link.count > 0);

  const placeLinks = locationsWithListings(allProperties).map(({ node, properties }) => ({
    href: locationPath(node),
    label: locationName(node),
    count: properties.length,
  }));

  return (
    <div className="border-ink-100 mt-16 flex flex-col gap-8 border-t pt-10">
      <LinkChips title="Browse by property type" links={typeLinks} />
      <LinkChips title="Browse by location" links={placeLinks} />
    </div>
  );
}

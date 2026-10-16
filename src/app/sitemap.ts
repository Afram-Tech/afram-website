import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getAllArticles } from "@/features/landing/data/articles";
import { getAllProperties, type Property } from "@/features/landing/data/properties";
import {
  locationPath,
  locationsWithListings,
  PROPERTY_TYPE_PAGES,
  propertiesOfType,
  typeLocationPairs,
  typeLocationPath,
  typePath,
} from "@/lib/property-seo";

/**
 * `lastModified` is only set where we know when a page's content changed.
 * Google ignores <lastmod> on sites where it's always "now", so a missing
 * date is better than an invented one. Listing pages use the listing's
 * `updatedAt`; pages that show listings use the newest listing they show;
 * article pages use the publish date.
 */
type ListingSource = "all" | "none";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  listings: ListingSource;
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", listings: "all" },
  { path: "/developers", priority: 0.9, changeFrequency: "monthly", listings: "none" },
  { path: "/financiers", priority: 0.9, changeFrequency: "monthly", listings: "none" },
  { path: "/properties", priority: 0.8, changeFrequency: "daily", listings: "all" },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly", listings: "none" },
  { path: "/how-it-works", priority: 0.6, changeFrequency: "monthly", listings: "none" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly", listings: "none" },
];

/** The most recent `updatedAt` among the listings, if any has one. */
function newest(properties: Property[]): Date | undefined {
  const times = properties
    .map((property) => (property.updatedAt ? Date.parse(property.updatedAt) : NaN))
    .filter((time) => Number.isFinite(time));
  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, articles] = await Promise.all([getAllProperties(), getAllArticles()]);
  const latestArticle = articles.length
    ? new Date(Math.max(...articles.map((article) => Date.parse(article.date))))
    : undefined;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => {
    const lastModified =
      route.listings === "all"
        ? newest(properties)
        : route.path === "/insights"
          ? latestArticle
          : undefined;
    return {
      url: `${siteConfig.url}${route.path}`,
      ...(lastModified && { lastModified }),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
  });

  const propertyEntries: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${siteConfig.url}/properties/${property.slug}`,
    ...(property.updatedAt && { lastModified: new Date(property.updatedAt) }),
    changeFrequency: "weekly",
    priority: 0.7,
    // Google's image sitemap extension — lets listing photos surface in
    // image search and beside the result, the way marketplace listings do.
    images: property.images,
  }));

  // The crawlable collection pages — only those with listings, same as the
  // routes themselves build. Each is as fresh as its newest listing.
  const collections: { path: string; properties: Property[] }[] = [
    ...PROPERTY_TYPE_PAGES.map((type) => ({
      path: typePath(type),
      properties: propertiesOfType(properties, type),
    })).filter((collection) => collection.properties.length > 0),
    ...locationsWithListings(properties).map(({ node, properties }) => ({
      path: locationPath(node),
      properties,
    })),
    ...typeLocationPairs(properties).map(({ type, node, properties }) => ({
      path: typeLocationPath(type, node),
      properties,
    })),
  ];
  const collectionEntries: MetadataRoute.Sitemap = collections.map((collection) => {
    const lastModified = newest(collection.properties);
    return {
      url: `${siteConfig.url}${collection.path}`,
      ...(lastModified && { lastModified }),
      changeFrequency: "daily",
      priority: 0.8,
    };
  });

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/insights/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...collectionEntries, ...propertyEntries, ...articleEntries];
}

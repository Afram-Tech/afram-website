import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { ARTICLES } from "@/features/landing/data/articles";
import { getAllProperties } from "@/features/landing/data/properties";

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/developers", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/financiers", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/properties", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/how-it-works", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/signup", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/signin", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const propertyEntries: MetadataRoute.Sitemap = getAllProperties().map((property) => ({
    url: `${siteConfig.url}/properties/${property.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${siteConfig.url}/insights/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...propertyEntries, ...articleEntries];
}

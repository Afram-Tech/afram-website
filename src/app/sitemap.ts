import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getAllArticles } from "@/features/landing/data/articles";
import { getAllProperties } from "@/features/landing/data/properties";

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/developers", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/financiers", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/properties", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/how-it-works", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const properties = await getAllProperties();
  const propertyEntries: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${siteConfig.url}/properties/${property.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articles = await getAllArticles();
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/insights/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...propertyEntries, ...articleEntries];
}

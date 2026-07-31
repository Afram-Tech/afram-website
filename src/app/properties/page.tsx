import type { Metadata } from "next";

import { Section } from "@/components/ui/Section";
import { getAllProperties } from "@/features/landing/data/properties";
import { PropertiesBrowser } from "@/features/properties/PropertiesBrowser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Browse Verified Properties",
  description:
    "Browse blockchain-verified properties for sale in Ghana, complete with flexible financing options for qualified buyers.",
  path: "/properties",
});

export default async function PropertiesPage() {
  const allProperties = await getAllProperties();

  return (
    <Section>
      <PropertiesBrowser properties={allProperties} />
    </Section>
  );
}

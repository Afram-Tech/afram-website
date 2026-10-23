import type { Metadata } from "next";

import { HelpCenter } from "@/components/help/HelpCenter";
import { HELP_GROUPS } from "@/features/help/faqs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Help",
  description:
    "Answers to common questions about Afram — getting access, identity verification, buying, selling and financing — a message to the team, and a way to track it.",
  path: "/help",
});

export default function HelpPage() {
  return <HelpCenter groups={HELP_GROUPS} />;
}

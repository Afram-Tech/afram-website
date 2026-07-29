import type { Metadata } from "next";

import { getAllArticles } from "@/features/landing/data/articles";
import { ArticleCard } from "@/features/landing/ArticleCard";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights — Guides & Market Data",
  description:
    "Guides, market data, and verification explainers from the Afram team, covering diaspora investing, title verification, and property financing in Ghana.",
  path: "/insights",
});

export default async function InsightsPage() {
  const articles = await getAllArticles();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-16">
        <h1 className="text-ink-900 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          Insights
        </h1>
        <p className="text-ink-500 mt-3 max-w-2xl text-[16px] leading-relaxed">
          Guides, market data, and verification explainers from the Afram team.
        </p>

        <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3 lg:gap-y-12">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

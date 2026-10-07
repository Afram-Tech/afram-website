import type { Metadata } from "next";

import { getArticlesFresh } from "@/features/landing/data/articles";
import { getPropertyNews } from "@/features/landing/data/news";
import { ArticleCard } from "@/features/landing/ArticleCard";
import { NewsHeadlines } from "@/features/landing/NewsHeadlines";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights — Guides & Market Data",
  description:
    "Guides, market data, and verification explainers from the Afram team, covering diaspora investing, title verification, and property financing in Ghana.",
  path: "/insights",
});

export default async function InsightsPage() {
  const [articles, news] = await Promise.all([getArticlesFresh(), getPropertyNews()]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-16">
        <h1 className="text-ink-900 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          Insights
        </h1>
        <p className="text-ink-500 mt-3 max-w-2xl text-[16px] leading-relaxed">
          Guides, market data, and verification explainers from the Afram team.
        </p>

        <div className="gap-x-card mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3 lg:gap-y-12">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {/* Publishers' headlines, linking out — alongside the team's own
            articles above, which still come from Sanity. Hidden entirely if
            every feed is unreachable. */}
        {news.length > 0 && (
          <div className="border-ink-100 mt-20 border-t pt-14">
            <h2 className="text-ink-900 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
              Property &amp; land news in Ghana
            </h2>
            <p className="text-ink-500 mt-3 max-w-2xl text-[16px] leading-relaxed">
              The latest real estate, land and housing headlines from Ghanaian publishers. Each
              story opens on the publisher&apos;s own site.
            </p>
            <div className="mt-8">
              <NewsHeadlines items={news} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

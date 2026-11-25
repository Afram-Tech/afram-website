import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SecBadge } from "@/components/ui/SecBadge";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/features/landing/ArticleCard";
import { formatArticleDate, getArticlesFresh } from "@/features/landing/data/articles";
import { getPropertyNews, READ_IN_DRAWER } from "@/features/landing/data/news";
import { NewsHeadlines } from "@/features/landing/NewsHeadlines";
import { NewsReader } from "@/features/landing/news/NewsReader";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights",
  description:
    "Guides, market research, and verification explainers from the Afram team — buying, financing, and investing in Ghanaian real estate.",
  path: "/insights",
});

export default async function InsightsPage() {
  const [articles, news] = await Promise.all([getArticlesFresh(), getPropertyNews()]);
  const [hero, ...rest] = articles;

  return (
    <Section className="bg-white pt-8 sm:pt-10 lg:pt-14">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <SecBadge />
          <h1 className="t-h1 text-ink-900 mt-5">
            Guides, market data, and verification explainers.
          </h1>
        </div>
        <p className="t-lead text-ink-500 max-w-xl lg:pb-1.5">
          Straight answers on buying, financing, and investing in Ghanaian real estate, written by
          the Afram team.
        </p>
      </div>

      {/* Featured article */}
      {hero && (
        <Link
          href={`/insights/${hero.slug}`}
          className="group ring-ink-100 mt-10 grid gap-6 overflow-hidden rounded-[20px] ring-1 sm:mt-12 lg:grid-cols-2"
        >
          <div className="relative aspect-[16/10] lg:aspect-auto">
            <Image
              src={hero.cover}
              alt={hero.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="ease-out-soft object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              priority
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <span className="bg-brand-50 text-brand-700 inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] font-semibold">
              {hero.category}
            </span>
            <h2 className="t-h3 text-ink-900 group-hover:text-brand-700 mt-4 transition-colors">
              {hero.title}
            </h2>
            <p className="text-ink-500 mt-3 max-w-lg text-[15px] leading-relaxed">{hero.excerpt}</p>
            <div className="text-ink-400 mt-5 flex items-center gap-2 text-[13px]">
              <span>{hero.author.name}</span>
              <span aria-hidden>·</span>
              <span className="tnum">{formatArticleDate(hero.date)}</span>
              <span aria-hidden>·</span>
              <span className="tnum">{hero.readMinutes} min read</span>
            </div>
            <span className="text-brand-700 mt-6 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold">
              Read article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="mt-10 grid gap-x-8 gap-y-10 sm:mt-12 sm:grid-cols-2 lg:grid-cols-6 lg:gap-y-12">
        {rest.map((article, i) => {
          // Rows of three; whatever is left shares the last row evenly.
          const left = rest.length % 3;
          const lastRow = left > 0 && i >= rest.length - left;
          return (
            <div
              key={article.slug}
              className={
                !lastRow
                  ? "lg:col-span-2"
                  : left === 2
                    ? "lg:col-span-3"
                    : "sm:col-span-2 lg:col-span-6"
              }
            >
              <ArticleCard article={article} wide={lastRow} />
            </div>
          );
        })}
      </div>

      {/* Publishers' stories — read in a drawer (READ_IN_DRAWER) or linking
          out — alongside the team's own articles above, which come from
          Sanity. Hidden entirely if every feed is unreachable. */}
      {news.length > 0 && (
        <div className="border-ink-100 mt-20 border-t pt-14">
          <h2 className="t-h2 text-ink-900">Property &amp; land news in Ghana</h2>
          <p className="t-lead text-ink-500 mt-3 max-w-2xl">
            {READ_IN_DRAWER
              ? "The latest real estate, land and housing stories from Ghanaian publishers. Open one to read it here, credited to its publisher."
              : "The latest real estate, land and housing headlines from Ghanaian publishers. Each story opens on the publisher's own site."}
          </p>
          <div className="mt-8">
            {READ_IN_DRAWER ? <NewsReader items={news} /> : <NewsHeadlines items={news} />}
          </div>
        </div>
      )}
    </Section>
  );
}

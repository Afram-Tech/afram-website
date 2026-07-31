import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/button-variants";
import { getAllArticles } from "@/features/landing/data/articles";
import { ArticleCard } from "@/features/landing/ArticleCard";

interface FeaturedArticlesSectionProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

export async function FeaturedArticlesSection({
  heading,
  subheading,
  ctaLabel,
  ctaLink,
}: FeaturedArticlesSectionProps = {}) {
  const articles = await getAllArticles();
  const featured = articles.slice(0, 3);

  return (
    <Section className="bg-ink-50/40">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-ink-900 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em]">
            {heading ?? "Insights"}
          </h2>
          <p className="text-ink-500 mt-3 text-[16px] leading-relaxed">
            {subheading ?? "Guides, market data, and verification explainers from the Afram team."}
          </p>
        </div>
        <Link
          href={ctaLink ?? "/insights"}
          className={buttonVariants("primary", "sm", "shrink-0 rounded-full")}
        >
          {ctaLabel ?? "See all"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-x-8 gap-y-6 sm:mt-10 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3 lg:gap-y-12">
        {featured.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </Section>
  );
}

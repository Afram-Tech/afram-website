import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { stegaClean } from "@sanity/client/stega";

import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import {
  findArticleBySlug,
  formatArticleDate,
  getAllArticleSlugs,
} from "@/features/landing/data/articles";
import { buildMetadata } from "@/lib/seo";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-ink-900 mt-8 text-xl font-bold tracking-[-0.01em]">{children}</h2>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-brand-300 text-ink-800 border-l-2 pl-5 text-lg font-medium italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p>{children}</p>,
  },
};

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await findArticleBySlug(slug);

  if (!article) {
    return buildMetadata({
      title: "Article not found",
      description: "This article could not be found.",
      path: `/insights/${slug}`,
    });
  }

  return buildMetadata({
    title: stegaClean(article.title),
    description: stegaClean(article.excerpt),
    path: `/insights/${article.slug}`,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await findArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: stegaClean(article.title),
    description: stegaClean(article.excerpt),
    datePublished: article.date,
    image: article.cover,
    author: { "@type": "Organization", name: siteConfig.legalName },
    publisher: { "@type": "Organization", name: siteConfig.legalName },
  };

  return (
    <article className="py-16">
      <JsonLd data={articleJsonLd} />
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-16">
        <span className="bg-brand-50 text-brand-700 rounded-full px-3 py-1 text-[12px] font-semibold">
          {article.category}
        </span>
        <h1 className="text-ink-900 mt-4 text-[clamp(1.8rem,3vw,2.25rem)] font-bold tracking-[-0.02em]">
          {article.title}
        </h1>
        <div className="text-ink-400 mt-3 flex items-center gap-2 text-[13px]">
          <span className="text-ink-600 font-medium">{article.author.name}</span>
          <span aria-hidden>·</span>
          <time dateTime={article.date} className="tnum">
            {formatArticleDate(article.date)}
          </time>
          <span aria-hidden>·</span>
          <span className="tnum">{article.readMinutes} min read</span>
        </div>

        <div className="relative mt-8 h-72 w-full overflow-hidden rounded-[1.25rem] sm:h-96">
          <Image
            src={article.cover}
            alt={article.title}
            fill
            sizes="(min-width: 640px) 672px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="text-ink-700 mt-8 space-y-5 text-[16px] leading-relaxed">
          {article.body ? (
            <PortableText value={article.body} components={portableTextComponents} />
          ) : null}
        </div>

        <Link href="/insights" className="text-brand-600 mt-10 inline-block text-sm font-medium">
          ← Back to Insights
        </Link>
      </div>
    </article>
  );
}

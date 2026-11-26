import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { stegaClean } from "@sanity/client/stega";

import { JsonLd } from "@/components/JsonLd";
import { SecBadge } from "@/components/ui/SecBadge";
import { ArticleCard } from "@/features/landing/ArticleCard";
import {
  findArticleBySlug,
  formatArticleDate,
  getAllArticles,
  getAllArticleSlugs,
} from "@/features/landing/data/articles";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="t-h3 text-ink-900 pt-2">{children}</h2>,
    blockquote: ({ children }) => (
      <blockquote className="border-brand-500 text-ink-700 border-l-[3px] py-1 pl-5 text-[17px] leading-relaxed font-medium italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-ink-600 text-[15px] leading-relaxed">{children}</p>
    ),
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
      noindex: true,
    });
  }

  return buildMetadata({
    title: stegaClean(article.title),
    description: stegaClean(article.excerpt),
    path: `/insights/${article.slug}`,
    images: article.cover ? [article.cover] : undefined,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await findArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const title = stegaClean(article.title);
  const more = (await getAllArticles()).filter((other) => other.slug !== article.slug).slice(0, 3);
  const articleJsonLd = buildArticleJsonLd({
    title,
    description: stegaClean(article.excerpt),
    slug: article.slug,
    datePublished: article.date,
    image: article.cover,
    authorName: stegaClean(article.author?.name) || undefined,
  });

  return (
    <div className="bg-white px-5 py-8 lg:px-[34px] lg:py-10">
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: title, path: `/insights/${article.slug}` },
        ])}
      />
      <article className="mx-auto max-w-[1180px]">
        {/* Top bar */}
        <div className="border-ink-100 flex items-center justify-between gap-4 border-b pb-5">
          <Link
            href="/insights"
            className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-2 text-[14px] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <p className="text-ink-400 hidden items-center gap-2 text-[13px] sm:flex">
            <Link href="/insights" className="hover:text-ink-700">
              Insights
            </Link>
            <span>›</span>
            <span className="text-ink-700">{article.title}</span>
          </p>
        </div>

        {/* Title */}
        <div className="mx-auto mt-8 max-w-[760px]">
          <SecBadge className="mb-3 flex" />
          <span className="bg-brand-50 text-brand-700 inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold">
            {article.category}
          </span>
          <h1 className="t-h1-sm text-ink-900 mt-4">{article.title}</h1>
          <div className="text-ink-500 mt-4 flex items-center gap-2 text-[14px]">
            <span className="text-ink-800 font-semibold">{article.author.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.date} className="tnum">
              {formatArticleDate(article.date)}
            </time>
            <span aria-hidden>·</span>
            <span className="tnum">{article.readMinutes} min read</span>
          </div>
        </div>

        {/* Cover */}
        <div className="bg-ink-50 relative mx-auto mt-8 aspect-[16/8] max-w-[980px] overflow-hidden rounded-3xl">
          <Image
            src={article.cover}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 980px"
            className="object-cover"
            priority
          />
        </div>

        {/* Body */}
        <div className="mx-auto mt-10 flex justify-center">
          <div className="max-w-[680px] space-y-5">
            {article.body ? (
              <PortableText value={article.body} components={portableTextComponents} />
            ) : null}
          </div>
        </div>
      </article>

      {/* More insights */}
      {more.length > 0 && (
        <div className="border-ink-100 mx-auto mt-16 max-w-[1180px] border-t pt-10 sm:mt-20 sm:pt-12">
          <h2 className="t-h3 text-ink-900">More insights</h2>
          <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((other) => (
              <ArticleCard key={other.slug} article={other} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

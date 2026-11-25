import Image from "next/image";
import Link from "next/link";

import { formatArticleDate, type Article } from "@/features/landing/data/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group block rounded-2xl focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
    >
      <div className="bg-ink-100 relative aspect-16/11 overflow-hidden rounded-2xl">
        <Image
          src={article.cover}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        <span className="bg-deep-950/55 absolute top-3 left-3 inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] backdrop-blur-md">
          {article.category}
        </span>
      </div>

      <h3 className="t-h4 text-ink-900 group-hover:text-brand-500 mt-4 transition-colors">
        {article.title}
      </h3>
      <p className="text-ink-500 mt-2 line-clamp-2 text-[14px] leading-relaxed">
        {article.excerpt}
      </p>
      <div className="text-ink-400 mt-3 flex items-center gap-2 text-[13px]">
        <span className="tnum">{formatArticleDate(article.date)}</span>
        <span aria-hidden>·</span>
        <span className="tnum">{article.readMinutes} min read</span>
      </div>
    </Link>
  );
}

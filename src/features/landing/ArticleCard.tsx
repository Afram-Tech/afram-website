import Image from "next/image";
import Link from "next/link";

import { formatArticleDate, type Article } from "@/features/landing/data/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block">
      <div className="bg-ink-50 relative aspect-16/11 overflow-hidden rounded-[1.25rem]">
        <Image
          src={article.cover}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="text-brand-700 absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold backdrop-blur-sm">
          {article.category}
        </span>
      </div>

      <h3 className="text-ink-900 group-hover:text-brand-700 mt-4 text-[1.2rem] leading-tight font-bold tracking-[-0.01em] transition-colors">
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

import { ArrowUpRight } from "lucide-react";

import { formatArticleDate } from "@/features/landing/data/articles";
import type { NewsItem } from "@/features/landing/data/news";

/**
 * Headlines from Ghanaian publishers, each linking out to the original.
 * Headline, source and date only — no article text or images — so the
 * publisher's page is where the story is actually read.
 */
export function NewsHeadlines({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="gap-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group border-ink-100 hover:border-brand-200 flex flex-col rounded-[1.25rem] border bg-white p-5 transition-colors"
        >
          <p className="text-ink-400 flex items-center gap-2 text-[12px] font-medium">
            <span className="text-brand-700 font-semibold">{item.source}</span>
            <span aria-hidden>·</span>
            <time dateTime={item.publishedAt} className="tnum">
              {formatArticleDate(item.publishedAt)}
            </time>
          </p>
          <h3 className="text-ink-900 group-hover:text-brand-700 mt-2.5 line-clamp-3 text-[1.05rem] leading-snug font-bold tracking-[-0.01em] transition-colors">
            {item.title}
          </h3>
          <span className="text-ink-500 group-hover:text-brand-700 mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-medium transition-colors">
            Read on {item.source}
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </span>
        </a>
      ))}
    </div>
  );
}

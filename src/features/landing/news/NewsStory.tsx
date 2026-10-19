"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

import type { NewsItem } from "@/features/landing/data/news";
import { formatArticleDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { newsSerif } from "./fonts";
import { PublisherImage } from "./PublisherImage";
import { Block, longDate, standfirst } from "./story-parts";

export const STORY_TITLE_ID = "news-story-title";

interface NewsStoryProps {
  item: NewsItem;
  upNext: { item: NewsItem; index: number }[];
  onSelect: (index: number) => void;
}

/**
 * One publisher's story, typeset as news: kicker, serif headline, standfirst,
 * byline between rules, full-width lead photo, serif body with a drop cap,
 * an end mark, the source note and "More stories". The text and images are
 * safe blocks (see lib/article-blocks.ts), always credited to and linking
 * back to the publisher. `data-nosnippet` keeps search engines from quoting
 * another site's article as if it were ours.
 */
export function NewsStory({ item, upNext, onSelect }: NewsStoryProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const deck = standfirst(item);
  const firstParagraph = item.body.findIndex((block) => block.type === "paragraph");

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <article data-nosnippet className={cn(newsSerif.variable, "rise pb-8")}>
      <header className="mx-auto max-w-[880px] px-5 pt-5 sm:px-6 sm:pt-6">
        <p className="text-brand-700 flex items-center gap-3 font-sans text-[11.5px] font-bold tracking-[0.16em] uppercase">
          <span aria-hidden className="bg-brand-500 h-0.5 w-6" />
          {item.source}
        </p>
        <h2
          id={STORY_TITLE_ID}
          ref={titleRef}
          tabIndex={-1}
          className="text-ink-950 mt-3 font-serif text-[clamp(1.85rem,3.8vw,2.55rem)] leading-[1.1] font-bold tracking-[-0.015em] outline-none"
        >
          {item.title}
        </h2>
        {deck && <p className="text-ink-600 mt-3 font-serif text-[1.2rem] leading-[1.5]">{deck}</p>}
        <div className="border-ink-200 text-ink-500 mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-y py-2 font-sans text-[12.5px] sm:gap-x-3">
          {item.author && (
            <>
              <span>
                By <span className="text-ink-900 font-semibold">{item.author}</span>
              </span>
              <span aria-hidden className="bg-ink-200 hidden h-3 w-px sm:block" />
            </>
          )}
          <time dateTime={item.publishedAt} className="tnum">
            {longDate(item.publishedAt)}
          </time>
          {item.readMinutes && (
            <>
              <span aria-hidden className="bg-ink-200 hidden h-3 w-px sm:block" />
              <span className="tnum">{item.readMinutes} min read</span>
            </>
          )}
        </div>
      </header>

      {item.image && (
        // Inset to the text column, with rounded corners, rather than edge to edge.
        <figure className="mx-auto mt-5 max-w-[880px] px-5 sm:px-6">
          <PublisherImage
            src={item.image}
            alt=""
            eager
            className="bg-ink-50 aspect-[16/9] w-full rounded-xl object-cover"
          />
          <figcaption className="text-ink-400 pt-1.5 font-sans text-[12px]">
            Photo: {item.source}
          </figcaption>
        </figure>
      )}

      {/* Half-screen drawers get wide; the text keeps a readable measure. */}
      <div className="mx-auto max-w-[880px] px-5 sm:px-6">
        <div className="text-ink-800 mt-5 space-y-4 font-serif text-[1.125rem] leading-[1.75]">
          {item.body.length > 0 ? (
            item.body.map((block, index) => (
              <Block
                key={index}
                block={block}
                dropCap={index === firstParagraph}
                source={item.source}
              />
            ))
          ) : (
            <p>{item.summary}</p>
          )}
          <span aria-hidden className="bg-brand-600 block h-2.5 w-2.5" />
        </div>

        <footer className="border-ink-900 mt-8 border-t-2 pt-3 font-sans">
          <p className="text-ink-400 text-[11px] font-bold tracking-[0.16em] uppercase">Source</p>
          <p className="text-ink-600 mt-2 text-[14px] leading-relaxed">
            Originally published by{" "}
            <span className="text-ink-900 font-semibold">{item.source}</span> on{" "}
            {longDate(item.publishedAt)}. Shown on Afram with credit to the publisher.
          </p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 hover:text-brand-800 mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold underline-offset-4 hover:underline"
          >
            Read the original on {item.source}
            <ArrowUpRight className="h-4 w-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </footer>

        {upNext.length > 0 && (
          <nav aria-label="More stories" className="mt-8">
            <h3 className="border-ink-900 text-ink-900 border-b-2 pb-2 font-sans text-[12px] font-bold tracking-[0.16em] uppercase">
              More stories
            </h3>
            <ol>
              {upNext.map(({ item: next, index }, position) => (
                <li key={next.url} className="border-ink-100 border-b">
                  <button
                    type="button"
                    onClick={() => onSelect(index)}
                    className="group/next flex w-full items-start gap-4 py-3 text-left"
                  >
                    <span
                      aria-hidden
                      className="text-brand-600 w-7 shrink-0 font-serif text-[1.6rem] leading-none font-bold"
                    >
                      {String(position + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-ink-950 group-hover/next:text-brand-700 line-clamp-3 block font-serif text-[1.08rem] leading-snug font-semibold transition-colors">
                        {next.title}
                      </span>
                      <span className="text-ink-400 mt-1.5 block font-sans text-[12px]">
                        <span className="text-brand-700 font-semibold">{next.source}</span> ·{" "}
                        {formatArticleDate(next.publishedAt)}
                        {next.readMinutes ? ` · ${next.readMinutes} min read` : ""}
                      </span>
                    </span>
                    {next.image && (
                      <PublisherImage
                        src={next.image}
                        alt=""
                        className="bg-ink-50 aspect-square w-20 shrink-0 object-cover"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </article>
  );
}

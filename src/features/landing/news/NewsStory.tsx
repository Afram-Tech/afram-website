"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { NewsItem } from "@/features/landing/data/news";
import type { ArticleBlock, InlineSpan } from "@/lib/article-blocks";
import { formatArticleDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { newsSerif } from "./fonts";

export const STORY_TITLE_ID = "news-story-title";

/** "8 October 2026", the way a news byline dates a story. */
const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const plain = (spans: InlineSpan[]) =>
  spans
    .map((span) => span.text)
    .join("")
    .replace(/\s+/g, " ")
    .trim();

/** The feed's summary, unless it's just the opening paragraph again (which
 *  is how MyJoyOnline fills it). */
function standfirst(item: NewsItem): string | undefined {
  const summary = item.summary?.replace(/\s+/g, " ").trim();
  if (!summary) return undefined;
  const first = item.body.find((block) => block.type === "paragraph");
  const opening = first && "spans" in first ? plain(first.spans) : "";
  const probe = (text: string) => text.slice(0, 80).toLowerCase();
  return opening && probe(opening) === probe(summary) ? undefined : summary;
}

function Spans({ spans }: { spans: InlineSpan[] }) {
  return spans.map((span, index) => {
    let node: React.ReactNode = span.text;
    if (span.italic) node = <em>{node}</em>;
    if (span.bold) node = <strong className="text-ink-950 font-semibold">{node}</strong>;
    if (span.href) {
      node = (
        <a
          href={span.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-brand-700 decoration-brand-300 underline decoration-1 underline-offset-[3px] hover:decoration-current"
        >
          {node}
        </a>
      );
    }
    return <span key={index}>{node}</span>;
  });
}

/** A publisher's image, loaded straight from their server. Hidden if it
 *  fails, rather than leaving a broken-image icon in the story. */
function PublisherImage({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string;
  alt: string;
  className: string;
  /** For the story's lead image, which is on screen as soon as it opens. */
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- third-party image of unknown size, served as-is
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

interface BlockProps {
  block: ArticleBlock;
  /** The story's opening paragraph gets the drop cap. */
  dropCap: boolean;
  source: string;
}

function Block({ block, dropCap, source }: BlockProps) {
  switch (block.type) {
    case "heading":
      return (
        <h3 className="text-ink-950 pt-4 font-sans text-[1.1rem] leading-snug font-bold tracking-[-0.01em]">
          <Spans spans={block.spans} />
        </h3>
      );
    case "quote":
      return (
        <blockquote className="border-brand-500 text-ink-950 my-8 border-l-[3px] py-1 pl-5 text-[1.3rem] leading-[1.45] whitespace-pre-line italic">
          <Spans spans={block.spans} />
        </blockquote>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={cn(
            "marker:text-brand-600 space-y-2 pl-6",
            block.ordered ? "list-decimal marker:font-sans marker:font-semibold" : "list-disc",
          )}
        >
          {block.items.map((spans, index) => (
            <li key={index} className="pl-1">
              <Spans spans={spans} />
            </li>
          ))}
        </List>
      );
    }
    case "image":
      return (
        <figure className="my-8">
          <PublisherImage
            src={block.src}
            alt={block.alt}
            className="bg-ink-50 w-full object-cover"
          />
          <figcaption className="text-ink-500 border-ink-100 mt-2 border-b pb-2 font-sans text-[12.5px] leading-snug">
            {block.caption ? `${block.caption} ` : ""}
            <span className="text-ink-400">Photo: {source}</span>
          </figcaption>
        </figure>
      );
    default:
      return (
        <p
          className={cn(
            "whitespace-pre-line",
            dropCap &&
              "first-letter:text-ink-950 first-letter:float-left first-letter:mt-[0.3rem] first-letter:mr-2.5 first-letter:text-[3.9rem] first-letter:leading-[0.8] first-letter:font-bold",
          )}
        >
          <Spans spans={block.spans} />
        </p>
      );
  }
}

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
    <article data-nosnippet className={cn(newsSerif.variable, "rise pb-14")}>
      <header className="px-6 pt-8 sm:px-10 sm:pt-10">
        <p className="text-brand-700 flex items-center gap-3 font-sans text-[11.5px] font-bold tracking-[0.16em] uppercase">
          <span aria-hidden className="bg-brand-500 h-0.5 w-6" />
          {item.source}
        </p>
        <h2
          id={STORY_TITLE_ID}
          ref={titleRef}
          tabIndex={-1}
          className="text-ink-950 mt-4 font-serif text-[clamp(1.85rem,3.8vw,2.55rem)] leading-[1.1] font-bold tracking-[-0.015em] outline-none"
        >
          {item.title}
        </h2>
        {deck && <p className="text-ink-600 mt-4 font-serif text-[1.2rem] leading-[1.5]">{deck}</p>}
        <div className="border-ink-200 text-ink-500 mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-y py-3 font-sans text-[12.5px] sm:gap-x-3">
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
        <figure className="mt-6">
          <PublisherImage
            src={item.image}
            alt=""
            eager
            className="bg-ink-50 aspect-[16/9] w-full object-cover"
          />
          <figcaption className="text-ink-400 px-6 pt-2 font-sans text-[12px] sm:px-10">
            Photo: {item.source}
          </figcaption>
        </figure>
      )}

      <div className="px-6 sm:px-10">
        <div className="text-ink-800 mt-7 space-y-6 font-serif text-[1.125rem] leading-[1.75]">
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

        <footer className="border-ink-900 mt-12 border-t-2 pt-4 font-sans">
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
          <nav aria-label="More stories" className="mt-14">
            <h3 className="border-ink-900 text-ink-900 border-b-2 pb-2 font-sans text-[12px] font-bold tracking-[0.16em] uppercase">
              More stories
            </h3>
            <ol>
              {upNext.map(({ item: next, index }, position) => (
                <li key={next.url} className="border-ink-100 border-b">
                  <button
                    type="button"
                    onClick={() => onSelect(index)}
                    className="group/next flex w-full items-start gap-4 py-5 text-left"
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

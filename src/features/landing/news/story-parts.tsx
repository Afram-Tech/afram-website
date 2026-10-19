import type { NewsItem } from "@/features/landing/data/news";
import type { ArticleBlock, InlineSpan } from "@/lib/article-blocks";
import { cn } from "@/lib/utils";

import { PublisherImage } from "./PublisherImage";

/**
 * The typesetting shared by the news story page and the (currently
 * disabled) reader drawer: one publisher's story as safe blocks, every
 * photo credited to the publisher.
 */

/** "8 October 2026", the way a news byline dates a story. */
export const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const plain = (spans: InlineSpan[]) =>
  spans
    .map((span) => span.text)
    .join("")
    .replace(/\s+/g, " ")
    .trim();

/** The feed's summary, unless it's just the opening paragraph again (which
 *  is how MyJoyOnline fills it). */
export function standfirst(item: NewsItem): string | undefined {
  const summary = item.summary?.replace(/\s+/g, " ").trim();
  if (!summary) return undefined;
  const first = item.body.find((block) => block.type === "paragraph");
  const opening = first && "spans" in first ? plain(first.spans) : "";
  const probe = (text: string) => text.slice(0, 80).toLowerCase();
  if (opening && probe(opening) === probe(summary)) return undefined;
  return shortDeck(summary);
}

/** A standfirst is a sentence or two. Whole sentences up to
 *  STANDFIRST_MAX characters; nothing if even the first is longer (some
 *  feeds put the whole introduction in the summary). */
const STANDFIRST_MAX = 260;
export function shortDeck(summary: string): string | undefined {
  const sentences = summary.match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) ?? [summary];
  let deck = "";
  for (const sentence of sentences) {
    if ((deck + sentence).trim().length > STANDFIRST_MAX) break;
    deck += sentence;
  }
  return deck.trim() || undefined;
}

export function Spans({ spans }: { spans: InlineSpan[] }) {
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

export interface BlockProps {
  block: ArticleBlock;
  /** The story's opening paragraph gets the drop cap. */
  dropCap: boolean;
  source: string;
}

export function Block({ block, dropCap, source }: BlockProps) {
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

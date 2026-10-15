"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

import { Drawer } from "@/components/ui/drawer/Drawer";
import type { NewsItem } from "@/features/landing/data/news";
import { NewsHeadlines } from "@/features/landing/NewsHeadlines";

import { NewsStory, STORY_TITLE_ID } from "./NewsStory";

const UP_NEXT = 3;

const iconButton =
  "text-ink-500 hover:bg-ink-50 hover:text-ink-900 focus-visible:ring-brand-400 flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35";

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/**
 * The /insights news section: headline cards that open the full story in a
 * side drawer, where readers can move through every story (buttons, ← → keys,
 * "Up next") without leaving Afram. Cards stay real links, so crawlers,
 * new-tab clicks and stories without a body still go to the publisher.
 */
export function NewsReader({ items }: { items: NewsItem[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  const readable = items.map((item) => item.body.length > 0);
  const story = items[index];

  const show = useCallback((next: number) => {
    setIndex(next);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const step = useCallback(
    (direction: 1 | -1) =>
      setIndex((current) => Math.min(items.length - 1, Math.max(0, current + direction))),
    [items.length],
  );

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else return;
      event.preventDefault();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, step]);

  const onCardClick = (event: MouseEvent<HTMLAnchorElement>, cardIndex: number) => {
    if (!readable[cardIndex]) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    show(cardIndex);
  };

  const upNext = items
    .map((item, itemIndex) => ({ item, index: itemIndex }))
    .filter(({ index: itemIndex }) => itemIndex > index && readable[itemIndex])
    .slice(0, UP_NEXT);

  return (
    <>
      <NewsHeadlines items={items} readable={readable} onCardClick={onCardClick} />

      <Drawer
        open={open}
        onClose={close}
        labelledBy={STORY_TITLE_ID}
        bodyRef={bodyRef}
        header={
          story && (
            <div className="flex items-center gap-2 py-3 pr-3 pl-5 sm:pl-10">
              <p className="text-ink-500 min-w-0 flex-1 truncate text-[13px] font-medium">
                <span className="text-ink-900 hidden font-semibold sm:inline">
                  Property &amp; land news ·{" "}
                </span>
                <span className="tnum">
                  {index + 1} of {items.length}
                </span>
              </p>
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={index === 0}
                aria-label="Previous story"
                aria-keyshortcuts="ArrowLeft"
                className={iconButton}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={index === items.length - 1}
                aria-label="Next story"
                aria-keyshortcuts="ArrowRight"
                className={iconButton}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open on ${story.source} (new tab)`}
                className={iconButton}
              >
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <span aria-hidden className="bg-ink-100 mx-1 h-6 w-px" />
              <button type="button" onClick={close} aria-label="Close" className={iconButton}>
                <X className="h-5 w-5" />
              </button>
            </div>
          )
        }
      >
        {story && <NewsStory key={story.url} item={story} upNext={upNext} onSelect={show} />}
      </Drawer>
    </>
  );
}

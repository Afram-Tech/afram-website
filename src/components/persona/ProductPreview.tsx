"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

import {
  BrowserFrame,
  FinanceMock,
  PayMock,
  TrackMock,
  VerifyMock,
} from "@/components/how/platform-mockups";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    key: "verify",
    url: "afram.co/verify",
    caption: "Title checked against Lands Commission records.",
    render: () => <VerifyMock />,
  },
  {
    key: "finance",
    url: "afram.co/financing",
    caption: "Member financing priced before anyone commits.",
    render: () => <FinanceMock />,
  },
  {
    key: "pay",
    url: "afram.co/deposit",
    caption: "Deposits taken and held, not chased.",
    render: () => <PayMock />,
  },
  {
    key: "track",
    url: "afram.co/progress",
    caption: "Every milestone tracked through to handover.",
    render: () => <TrackMock />,
  },
];

/**
 * The product shot, demoted to the bottom and made steppable. It reassures
 * people who have already decided; it does not persuade anyone who has not,
 * so it should not take the space above the answers.
 */
export function ProductPreview({ title, intro }: { title: string; intro: string }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((n) => (n + d + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[i];

  return (
    <Section className="bg-brand-50/50">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading title={title} intro={intro} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous screen"
            className="text-ink-500 ring-ink-200 hover:bg-ink-50 hover:text-ink-900 focus-visible:outline-brand-500 flex h-11 w-11 items-center justify-center rounded-full ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next screen"
            className="text-ink-500 ring-ink-200 hover:bg-ink-50 hover:text-ink-900 focus-visible:outline-brand-500 flex h-11 w-11 items-center justify-center rounded-full ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mt-10">
        <BrowserFrame url={slide.url}>{slide.render()}</BrowserFrame>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-ink-500 text-[15px]">
          {slide.caption}
        </p>
        <div className="flex items-center gap-2">
          {SLIDES.map((s, n) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Screen ${n + 1}: ${s.caption}`}
              aria-current={n === i}
              className={cn(
                "focus-visible:outline-brand-500 h-2 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
                n === i ? "bg-brand-500 w-7" : "bg-ink-200 hover:bg-ink-300 w-2",
              )}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AffordablePropertiesDialog } from "@/features/landing/AffordablePropertiesDialog";
import { PropertyCardCompact } from "@/features/landing/PropertyCardCompact";
import { PropertyCardCompactSkeleton } from "@/features/landing/PropertyCardCompactSkeleton";
import {
  ANNUAL_RATE,
  INCOME_MAX,
  INCOME_MIN,
  INCOME_STEP,
  LTV,
  TENOR_MONTHS,
  type RecommendedProperty,
  incomeToSnapshot,
} from "@/features/landing/affordability";
import { ghs, ghsCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

const RECOMMENDATION_COUNT = 3;
/** How long the recommendation strip shows a skeleton after the price changes, before revealing matches. */
const RECOMMENDATION_LOADING_MS = 450;

interface AffordabilityCalculatorProps {
  /** Starting income, pre-computed server-side so the calculator opens on Afram's cheapest listing. */
  initialIncome: number;
  /** All recommendable properties, pre-sorted ascending by GHS-normalised price. */
  properties: RecommendedProperty[];
}

export function AffordabilityCalculator({
  initialIncome,
  properties,
}: AffordabilityCalculatorProps) {
  const [income, setIncome] = useState(initialIncome);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  const snapshot = useMemo(() => incomeToSnapshot(income), [income]);

  // Nearest listings by price. Showing only what is affordable leaves an
  // empty shelf at most incomes, so show the closest either way and label
  // them honestly — never imply something is in reach when it is not.
  //
  // `all` is the same list unsliced: the cards on the page are the head of
  // what the dialog shows, so opening it never reshuffles what was on screen.
  const { matches, all, withinBudget } = useMemo(() => {
    const affordable = properties.filter((p) => p.priceGhs <= snapshot.price);
    const pool = affordable.length > 0 ? affordable : properties;
    const sorted = [...pool].sort(
      (a, b) => Math.abs(a.priceGhs - snapshot.price) - Math.abs(b.priceGhs - snapshot.price),
    );
    return {
      matches: sorted.slice(0, RECOMMENDATION_COUNT),
      all: sorted,
      withinBudget: affordable.length > 0,
    };
  }, [properties, snapshot.price]);

  return (
    <div className="border-ink-100 mx-auto mt-10 max-w-5xl rounded-[1.75rem] border bg-white p-7 shadow-sm sm:mt-12 sm:p-10">
      <label className="text-ink-600 block text-sm font-medium" htmlFor="affordability-income">
        Your monthly take-home
      </label>
      <p className="tnum text-ink-900 mt-2 text-[clamp(2rem,5vw,2.75rem)] font-bold tracking-[-0.03em]">
        {ghs(income)}
      </p>
      <input
        id="affordability-income"
        type="range"
        min={INCOME_MIN}
        max={INCOME_MAX}
        step={INCOME_STEP}
        value={income}
        onChange={(event) => setIncome(Number(event.target.value))}
        className="accent-accent-600 mt-5 w-full"
        aria-label="Monthly take-home income"
      />
      <div className="text-ink-400 mt-1 flex justify-between text-[12px]">
        <span className="tnum">{ghs(INCOME_MIN)}</span>
        <span className="tnum">{ghs(INCOME_MAX)}</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Home price" value={ghsCompact(snapshot.price)} lead />
        <Stat label="20% deposit" value={ghsCompact(snapshot.deposit)} />
        <Stat label="Monthly · 5 yr" value={ghs(snapshot.monthly5)} />
        <Stat label="Monthly · 10 yr" value={ghs(snapshot.monthly10)} accent />
      </div>

      <p className="text-ink-400 mt-6 text-center text-[12.5px] leading-relaxed">
        Illustrative only. Assumes a {Math.round((1 - LTV) * 100)}% deposit, a{" "}
        {(ANNUAL_RATE * 100).toFixed(0)}% annual rate, and a comfortable payment of about 35% of
        take-home over ten years. The five-year instalment pays the same home off sooner, so it is
        higher. Final terms are confirmed on application.
      </p>

      <RecommendationStrip
        key={snapshot.price}
        matches={matches}
        all={all}
        withinBudget={withinBudget}
        onOpen={() => setOpen(true)}
        triggerRef={trigger}
      />

      <AffordablePropertiesDialog
        open={open}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        properties={all}
        budget={snapshot.price}
        withinBudget={withinBudget}
        deposit={1 - LTV}
        rate={ANNUAL_RATE}
        months={TENOR_MONTHS}
      />
    </div>
  );
}

function RecommendationStrip({
  matches,
  all,
  withinBudget,
  onOpen,
  triggerRef,
}: {
  matches: RecommendedProperty[];
  all: RecommendedProperty[];
  withinBudget: boolean;
  onOpen: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  // Recommendations are already loaded and matched instantly — this is a deliberate,
  // simulated pause so the strip reads as "looking up matches" instead of just snapping.
  const [isMatching, setIsMatching] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsMatching(false), RECOMMENDATION_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!isMatching && matches.length === 0) return null;

  return (
    <div className="border-ink-100 mt-8 border-t pt-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-ink-900 text-[17px] font-bold tracking-[-0.01em]">
          {withinBudget ? "Properties within this budget" : "Closest listings — above this budget"}
        </h3>
        <button
          ref={triggerRef}
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="text-brand-700 hover:text-brand-800 group focus-visible:outline-accent-600 inline-flex items-center gap-1.5 rounded-full text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          {withinBudget ? `View all ${all.length}` : "View the nearest"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isMatching
          ? Array.from({ length: matches.length || RECOMMENDATION_COUNT }, (_, index) => (
              <PropertyCardCompactSkeleton key={index} />
            ))
          : matches.map((property) => (
              <PropertyCardCompact key={property.slug} property={property} />
            ))}
      </div>

      {!isMatching && !withinBudget && (
        <p className="text-ink-500 mt-5 text-[13.5px] leading-relaxed">
          Nothing on Afram is within this budget yet. These are the nearest listings — drag higher
          to see what comes into reach.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  lead,
}: {
  label: string;
  value: string;
  accent?: boolean;
  lead?: boolean;
}) {
  return (
    <div
      className={cn("rounded-2xl p-5 text-center", lead ? "bg-brand-700 text-white" : "bg-ink-50")}
    >
      <p
        className={cn(
          "text-[11px] font-semibold tracking-wider uppercase",
          lead ? "text-white/60" : "text-ink-400",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "tnum mt-1.5 text-[1.4rem] font-bold tracking-[-0.02em]",
          lead ? "text-white" : accent ? "text-accent-700" : "text-ink-900",
        )}
      >
        {value}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

import { PropertyCardCompact } from "@/features/landing/PropertyCardCompact";
import { PropertyCardCompactSkeleton } from "@/features/landing/PropertyCardCompactSkeleton";
import {
  INCOME_MAX,
  INCOME_MIN,
  INCOME_STEP,
  type RecommendedProperty,
  incomeToSnapshot,
  nearestByPrice,
} from "@/features/landing/affordability";
import { ghs, ghsCompact } from "@/lib/format";

const RECOMMENDATION_COUNT = 6;
/** How far a listing's price may sit from the slider's target before it's excluded (0.4 = within ±40%). */
const RECOMMENDATION_BAND = 0.4;
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

  const snapshot = useMemo(() => incomeToSnapshot(income), [income]);

  const recommendations = useMemo(
    () => nearestByPrice(properties, snapshot.price, RECOMMENDATION_COUNT, RECOMMENDATION_BAND),
    [properties, snapshot.price],
  );

  return (
    <div className="border-ink-100 mx-auto mt-12 max-w-3xl rounded-[1.75rem] border bg-white p-7 shadow-sm sm:p-10">
      <label className="text-ink-600 block text-sm font-medium" htmlFor="affordability-income">
        Your monthly take-home
      </label>
      <p className="tnum text-ink-900 mt-2 text-4xl font-semibold">{ghs(income)}</p>
      <input
        id="affordability-income"
        type="range"
        min={INCOME_MIN}
        max={INCOME_MAX}
        step={INCOME_STEP}
        value={income}
        onChange={(event) => setIncome(Number(event.target.value))}
        className="accent-accent-500 mt-5 w-full"
        aria-label="Monthly take-home income"
      />
      <div className="text-ink-400 mt-1 flex justify-between text-[12px]">
        <span className="tnum">{ghs(INCOME_MIN)}</span>
        <span className="tnum">{ghs(INCOME_MAX)}</span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Home price" value={ghsCompact(snapshot.price)} />
        <Stat label="20% deposit" value={ghsCompact(snapshot.deposit)} />
        <Stat label="Monthly · 10 yr" value={ghs(snapshot.monthly)} accent />
      </div>

      <p className="text-ink-400 mt-6 text-center text-[12px] leading-snug">
        Illustrative only. Assumes a 20% deposit, a 14% annual rate over 10 years, and a comfortable
        payment of about 30% of take-home. Final terms are confirmed on application.
      </p>

      {/* Keyed by price so a new budget remounts the strip and restarts its own loading state. */}
      <RecommendationStrip key={snapshot.price} recommendations={recommendations} />
    </div>
  );
}

function RecommendationStrip({ recommendations }: { recommendations: RecommendedProperty[] }) {
  // Recommendations are already loaded and matched instantly — this is a deliberate,
  // simulated pause so the strip reads as "looking up matches" instead of just snapping.
  const [isMatching, setIsMatching] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsMatching(false), RECOMMENDATION_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!isMatching && recommendations.length === 0) return null;

  return (
    <div className="border-ink-100 mt-8 border-t pt-6">
      <p className="text-ink-600 text-sm font-medium">Properties near this budget</p>
      <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {isMatching
          ? Array.from({ length: RECOMMENDATION_COUNT }, (_, index) => (
              <div key={index} className="w-41 shrink-0 snap-start">
                <PropertyCardCompactSkeleton />
              </div>
            ))
          : recommendations.map((property) => (
              <div key={property.slug} className="w-41 shrink-0 snap-start">
                <PropertyCardCompact property={property} />
              </div>
            ))}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-ink-50 rounded-2xl p-5 text-center">
      <p className="text-ink-400 text-[12px] tracking-wider uppercase">{label}</p>
      <p
        className={`tnum mt-1 text-2xl font-semibold ${accent ? "text-accent-700" : "text-ink-900"}`}
      >
        {value}
      </p>
    </div>
  );
}

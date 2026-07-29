import { useMemo, useState } from "react";

import { ghs, ghsCompact } from "@/lib/format";

const ASSUMED_RATE = 0.12;

/** Max loan a fixed monthly payment can sustain at `annualRate` over `months`. */
function affordableLoan(monthly: number, annualRate: number, months: number) {
  const i = annualRate / 12;
  if (i === 0) return monthly * months;
  return (monthly * (1 - Math.pow(1 + i, -months))) / i;
}

export function AffordabilityCalculatorSection() {
  const [income, setIncome] = useState(8000);

  const snapshot = useMemo(() => {
    const monthly = Math.round(income * 0.35);
    const loan = affordableLoan(monthly, ASSUMED_RATE, 10 * 12);
    const price = Math.round(loan / 0.8 / 1000) * 1000;
    return {
      monthly,
      price,
      deposit: Math.round((price * 0.2) / 1000) * 1000,
    };
  }, [income]);

  return (
    <div className="border-ink-100 mx-auto mt-12 max-w-3xl rounded-[1.75rem] border bg-white p-7 shadow-sm sm:p-10">
      <label className="text-ink-600 block text-sm font-medium" htmlFor="affordability-income">
        Your monthly take-home
      </label>
      <p className="tnum text-ink-900 mt-2 text-4xl font-semibold">{ghs(income)}</p>
      <input
        id="affordability-income"
        type="range"
        min={2000}
        max={40000}
        step={500}
        value={income}
        onChange={(event) => setIncome(Number(event.target.value))}
        className="accent-accent-500 mt-5 w-full"
        aria-label="Monthly take-home income"
      />
      <div className="text-ink-400 mt-1 flex justify-between text-[12px]">
        <span className="tnum">GHS 2,000</span>
        <span className="tnum">GHS 40,000</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Home price" value={ghsCompact(snapshot.price)} />
        <Stat label="20% deposit" value={ghsCompact(snapshot.deposit)} />
        <Stat label="Monthly · 10 yr" value={ghs(snapshot.monthly)} accent />
      </div>

      <p className="text-ink-400 mt-6 text-center text-[12px] leading-snug">
        Illustrative only. Assumes a 20% deposit and a comfortable payment of about 35% of
        take-home. Final terms are confirmed on application.
      </p>
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

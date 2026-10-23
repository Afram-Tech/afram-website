"use client";

import { Check, Loader2 } from "lucide-react";
import { useId, useState, useTransition } from "react";

import { checkReport } from "@/features/help/actions";
import type { ReportCheck, RequestState } from "@/features/help/report-issue";
import { cn } from "@/lib/utils";

const STEPS = ["Sent", "Team on it", "Sorted"] as const;
const STATES: Record<RequestState, { label: string; done: number; tone: string }> = {
  received: { label: "Waiting on team", done: 1, tone: "bg-ink-50 text-ink-700" },
  in_progress: { label: "Team on it", done: 2, tone: "bg-brand-50 text-brand-700" },
  resolved: { label: "Sorted", done: 3, tone: "bg-emerald-50 text-emerald-700" },
};

/** Where a request is, by the reference from its confirmation. */
export function TrackRequest({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [result, setResult] = useState<ReportCheck | null>(null);
  const [pending, startTransition] = useTransition();
  const id = useId();

  const check = () => {
    if (!value.trim()) return;
    startTransition(async () => setResult(await checkReport(value)));
  };

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="ring-ink-100 flex flex-col gap-3 rounded-[1.5rem] bg-white px-6 py-5 ring-1"
    >
      <h2 id={`${id}-title`} className="text-ink-900 text-[15.5px] font-bold">
        Track a request
      </h2>
      <p className="text-ink-500 -mt-1 text-[13.5px] leading-relaxed">
        Enter the reference from your confirmation.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          check();
        }}
        className="flex gap-2"
      >
        <label htmlFor={`${id}-ref`} className="sr-only">
          Reference
        </label>
        <input
          id={`${id}-ref`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="AF-XXXXXX"
          autoCapitalize="characters"
          spellCheck={false}
          className="tnum text-ink-900 ring-ink-200 placeholder:text-ink-400 focus:ring-brand-400 h-11 min-w-0 flex-1 rounded-[14px] bg-white px-4 text-[14.5px] font-semibold tracking-[0.04em] uppercase ring-1 placeholder:font-normal placeholder:tracking-normal placeholder:normal-case focus:ring-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="text-brand-500 ring-brand-500 hover:bg-brand-50 inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-5 text-[14px] font-semibold ring-1 transition-colors disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </button>
      </form>

      <div aria-live="polite">
        {result?.status === "found" && <TrackResult result={result} />}
        {result?.status === "not_found" && (
          <p className="bg-ink-50 text-ink-700 rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed">
            We couldn&apos;t find <b className="font-semibold">{result.reference}</b>. Check it
            against your confirmation: AF- and then 6 letters and numbers.
          </p>
        )}
        {result?.status === "error" && (
          <p className="bg-coral-100/60 text-ink-700 rounded-2xl px-4 py-3 text-[13.5px]">
            We couldn&apos;t check just now. Try again in a moment.
          </p>
        )}
      </div>
    </section>
  );
}

function TrackResult({ result }: { result: Extract<ReportCheck, { status: "found" }> }) {
  const state = STATES[result.state];
  const done = (step: number) => step < state.done;
  const fill = result.state === "resolved" ? "bg-emerald-500" : "bg-brand-500";

  return (
    <div className="ring-ink-100 flex flex-col gap-3 rounded-2xl px-4 py-4 ring-1">
      <div className="flex items-center justify-between gap-3">
        <span className="tnum text-ink-900 text-[14px] font-semibold tracking-[0.03em]">
          {result.reference}
        </span>
        <span className={cn("rounded-full px-2.5 py-0.5 text-[12px] font-semibold", state.tone)}>
          {state.label}
        </span>
      </div>
      <ol className="grid grid-cols-3 gap-2">
        {STEPS.map((step, i) => (
          <li key={step} className="flex flex-col gap-1.5">
            <span className={cn("h-[5px] rounded-full", done(i) ? fill : "bg-ink-100")} />
            <span
              className={cn(
                "flex items-center gap-1 text-[12px]",
                done(i) ? "text-ink-900 font-semibold" : "text-ink-400",
              )}
            >
              {done(i) && <Check className="h-3 w-3" strokeWidth={3} />}
              {step}
            </span>
          </li>
        ))}
      </ol>
      {(result.receivedAt || result.updatedAt) && (
        <p className="text-ink-500 text-[12.5px]">
          {result.receivedAt && <>Sent {when(result.receivedAt)}</>}
          {result.updatedAt && <> · Updated {when(result.updatedAt)}</>}
        </p>
      )}
    </div>
  );
}

function when(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day} at ${time}`;
}

import { Check, Clock3, FileCheck2, Landmark, Lock, ShieldCheck, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { PolygonMark } from "@/components/PolygonWordmark";
import { cn } from "@/lib/utils";

/** Browser chrome around a mock platform screen. */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ring-ink-200/70 overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-50px_rgba(0,45,48,0.55)] ring-1",
        className,
      )}
    >
      <div className="border-ink-100 bg-ink-50/70 flex items-center gap-2 border-b px-4 py-2.5">
        <span className="bg-ink-200 h-2.5 w-2.5 rounded-full" />
        <span className="bg-ink-200 h-2.5 w-2.5 rounded-full" />
        <span className="bg-ink-200 h-2.5 w-2.5 rounded-full" />
        <span className="text-ink-400 ring-ink-100 ml-2 truncate rounded-md bg-white px-2.5 py-1 text-[11px] font-medium ring-1">
          {url}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const GREEN = "text-[#047857]";

function VerifiedPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[12px] font-bold text-[#047857] ring-1 ring-[#a7f3d0]">
      <ShieldCheck className="h-3.5 w-3.5" />
      Verified
    </span>
  );
}

function CheckRow({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5] ring-1 ring-[#a7f3d0]">
        <Check className={cn("h-3 w-3", GREEN)} strokeWidth={3} />
      </span>
      <span className="text-ink-700 text-[13px] font-medium">{children}</span>
    </li>
  );
}

/** Step 1 — title verification result. */
export function VerifyMock() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ink-400 text-[11px] font-semibold tracking-wide uppercase">
            Title verification
          </p>
          <p className="text-ink-900 mt-0.5 text-[15px] font-bold">2-bed · Oyarifa, Accra</p>
        </div>
        <VerifiedPill />
      </div>

      <ul className="mt-4 space-y-2.5">
        <CheckRow>Lands Commission record on file</CheckRow>
        <CheckRow>Master title deed on file</CheckRow>
        <CheckRow>No pending disputes or caveats</CheckRow>
      </ul>

      <div className="bg-ink-50 mt-4 flex items-center justify-between rounded-xl px-3 py-2.5">
        <span className="text-ink-500 inline-flex items-center gap-1.5 text-[12px] font-medium">
          <PolygonMark className="h-3.5 w-3.5 text-[#7B3FE4]" />
          On-chain ref
        </span>
        <span className="tnum text-ink-700 text-[12px] font-semibold">0x7a4f…e4f2</span>
      </div>
    </div>
  );
}

/** Step 2 — payment plan + escrow. */
export function PayMock() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-ink-400 text-[11px] font-semibold tracking-wide uppercase">
          Payment plan
        </p>
        <span className="text-brand-700 text-[12px] font-semibold">10-year plan</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="bg-ink-50 rounded-xl p-3">
          <p className="text-ink-400 text-[11px]">Home price</p>
          <p className="tnum text-ink-900 mt-0.5 text-[15px] font-bold">GHS 280,000</p>
        </div>
        <div className="bg-ink-50 rounded-xl p-3">
          <p className="text-ink-400 text-[11px]">20% deposit</p>
          <p className="tnum text-ink-900 mt-0.5 text-[15px] font-bold">GHS 56,000</p>
        </div>
      </div>

      <div className="bg-brand-600 mt-2.5 rounded-xl p-3.5 text-white">
        <p className="text-[11px] text-white/70">Then monthly, for 120 months</p>
        <p className="tnum mt-0.5 text-2xl leading-none font-extrabold">
          GHS 3,210
          <span className="text-[13px] font-medium text-white/70"> /mo</span>
        </p>
      </div>

      <div className="text-ink-500 mt-3 flex items-center gap-2 text-[12px] font-medium">
        <Landmark className="text-brand-600 h-3.5 w-3.5" />
        Held in escrow · GCB Bank Ghana
      </div>
    </div>
  );
}

/** Step 3 — financing decision / fractional invest. */
export function FinanceMock() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-ink-400 text-[11px] font-semibold tracking-wide uppercase">
          Financing decision
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[12px] font-bold text-[#047857] ring-1 ring-[#a7f3d0]">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          Approved
        </span>
      </div>

      <div className="border-ink-100 mt-3 rounded-xl border p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-ink-500 text-[13px] font-medium">Monthly repayment</span>
          <span className="tnum text-ink-900 text-[15px] font-bold">GHS 3,210</span>
        </div>
        <div className="border-ink-100 mt-2 flex items-center justify-between border-t pt-2">
          <span className="text-ink-500 text-[13px] font-medium">Term</span>
          <span className="text-ink-900 text-[14px] font-semibold">10 years</span>
        </div>
        <div className="border-ink-100 text-ink-500 mt-2 flex items-center gap-2 border-t pt-2 text-[12px] font-medium">
          <FileCheck2 className="text-brand-600 h-3.5 w-3.5" />
          First legal charge registered
        </div>
      </div>

      <div className="bg-brand-50 ring-brand-100 mt-2.5 flex items-center justify-between rounded-xl px-3 py-2.5 ring-1">
        <span className="text-brand-700 inline-flex items-center gap-1.5 text-[12px] font-semibold">
          <TrendingUp className="h-3.5 w-3.5" />
          Or invest from GHS 1,500
        </span>
        <span className="text-brand-700 text-[12px] font-bold">14–22% p.a.</span>
      </div>
    </div>
  );
}

/** Step 4 — escrow milestone tracker. */
export function TrackMock() {
  const steps = [
    { label: "Deposit secured", done: true },
    { label: "Foundation complete", done: true },
    { label: "Superstructure", current: true },
    { label: "Handover & keys", locked: true },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-ink-400 text-[11px] font-semibold tracking-wide uppercase">
          Escrow & delivery
        </p>
        <span className="text-ink-500 inline-flex items-center gap-1.5 text-[12px] font-medium">
          <PolygonMark className="h-3.5 w-3.5 text-[#7B3FE4]" />
          On-chain
        </span>
      </div>

      <ul className="mt-3 space-y-2.5">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1",
                s.done && "bg-[#ecfdf5] ring-[#a7f3d0]",
                s.current && "bg-brand-600 ring-brand-600",
                s.locked && "bg-ink-50 ring-ink-200",
              )}
            >
              {s.done && <Check className={cn("h-3 w-3", GREEN)} strokeWidth={3} />}
              {s.current && <Clock3 className="h-3 w-3 text-white" />}
              {s.locked && <Lock className="text-ink-400 h-3 w-3" />}
            </span>
            <span
              className={cn("text-[13px] font-medium", s.locked ? "text-ink-400" : "text-ink-700")}
            >
              {s.label}
            </span>
            {s.current && (
              <span className="text-brand-700 ml-auto text-[11px] font-semibold">In progress</span>
            )}
          </li>
        ))}
      </ul>

      <div className="border-ink-100 mt-4 grid grid-cols-2 gap-2.5 border-t pt-3">
        <div>
          <p className="text-ink-400 text-[11px]">Released</p>
          <p className="tnum text-ink-900 text-[14px] font-bold">GHS 112,000</p>
        </div>
        <div>
          <p className="text-ink-400 text-[11px]">Still in escrow</p>
          <p className="tnum text-ink-900 text-[14px] font-bold">GHS 112,000</p>
        </div>
      </div>
    </div>
  );
}

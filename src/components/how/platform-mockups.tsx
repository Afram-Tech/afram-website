import type { ReactNode } from "react";
import {
  Check,
  ShieldCheck,
  Lock,
  Landmark,
  TrendingUp,
  FileCheck2,
  Clock3,
} from "lucide-react";
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
        "overflow-hidden rounded-2xl bg-white shadow-modal ring-1 ring-ink-200/70",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50/70 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="ml-2 truncate rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-ink-400 ring-1 ring-ink-100">
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
      <span className="text-[13px] font-medium text-ink-700">{children}</span>
    </li>
  );
}

/** Step 1 — title verification result. */
export function VerifyMock() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="t-overline text-ink-400">
            Title verification
          </p>
          <p className="mt-0.5 text-[15px] font-bold text-ink-900">
            2-bed · Oyarifa, Accra
          </p>
        </div>
        <VerifiedPill />
      </div>

      <ul className="mt-4 space-y-2.5">
        <CheckRow>Lands Commission record on file</CheckRow>
        <CheckRow>Master title deed on file</CheckRow>
        <CheckRow>No disputes or caveats found at search date</CheckRow>
      </ul>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-500">
          <PolygonMark className="h-3.5 w-3.5 text-brand-500" />
          On-chain ref
        </span>
        <span className="tnum text-[12px] font-semibold text-ink-700">
          0x7a4f…e4f2
        </span>
      </div>
    </div>
  );
}

/** Step 2 — payment plan + escrow. */
export function PayMock() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="t-overline text-ink-400">
          Payment plan
        </p>
        <span className="text-[12px] font-semibold text-brand-700">
          10-year plan
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-xl bg-ink-50 p-3">
          <p className="text-[11px] text-ink-400">Home price</p>
          <p className="tnum mt-0.5 text-[15px] font-bold text-ink-900">
            GHS 280,000
          </p>
        </div>
        <div className="rounded-xl bg-ink-50 p-3">
          <p className="text-[11px] text-ink-400">20% deposit</p>
          <p className="tnum mt-0.5 text-[15px] font-bold text-ink-900">
            GHS 56,000
          </p>
        </div>
      </div>

      <div className="mt-2.5 rounded-xl bg-brand-600 p-3.5 text-white">
        <p className="text-[11px] text-white/70">
          Then monthly, for 120 months
        </p>
        <p className="tnum mt-0.5 text-2xl font-bold leading-none">
          GHS 3,210
          <span className="text-[13px] font-medium text-white/70"> /mo</span>
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[12px] font-medium text-ink-500">
        <Landmark className="h-3.5 w-3.5 text-brand-600" />
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
        <p className="t-overline text-ink-400">
          Financing decision
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[12px] font-bold text-[#047857] ring-1 ring-[#a7f3d0]">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          Approved
        </span>
      </div>

      <div className="mt-3 rounded-xl border border-ink-100 p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-ink-500">
            Monthly repayment
          </span>
          <span className="tnum text-[15px] font-bold text-ink-900">
            GHS 3,210
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-ink-100 pt-2">
          <span className="text-[13px] font-medium text-ink-500">Term</span>
          <span className="text-[14px] font-semibold text-ink-900">
            10 years
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 border-t border-ink-100 pt-2 text-[12px] font-medium text-ink-500">
          <FileCheck2 className="h-3.5 w-3.5 text-brand-600" />
          First legal charge registered
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2.5 ring-1 ring-brand-100">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-700">
          <TrendingUp className="h-3.5 w-3.5" />
          Or invest from GHS 1,500
        </span>
        <span className="text-[12px] font-bold text-brand-700">
          14–22% p.a.
        </span>
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
        <p className="t-overline text-ink-400">
          Escrow & delivery
        </p>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-500">
          <PolygonMark className="h-3.5 w-3.5 text-brand-500" />
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
              {s.done && (
                <Check className={cn("h-3 w-3", GREEN)} strokeWidth={3} />
              )}
              {s.current && <Clock3 className="h-3 w-3 text-white" />}
              {s.locked && <Lock className="h-3 w-3 text-ink-400" />}
            </span>
            <span
              className={cn(
                "text-[13px] font-medium",
                s.locked ? "text-ink-400" : "text-ink-700",
              )}
            >
              {s.label}
            </span>
            {s.current && (
              <span className="ml-auto text-[11px] font-semibold text-brand-700">
                In progress
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-ink-100 pt-3">
        <div>
          <p className="text-[11px] text-ink-400">Released</p>
          <p className="tnum text-[14px] font-bold text-ink-900">GHS 112,000</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400">Still in escrow</p>
          <p className="tnum text-[14px] font-bold text-ink-900">GHS 112,000</p>
        </div>
      </div>
    </div>
  );
}

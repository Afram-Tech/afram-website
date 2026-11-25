import { Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import type { OpenRaise } from "@/lib/data/open-raises";
import { ghsCompact, ghs, cn } from "@/lib/utils";

const STATUS: Record<OpenRaise["status"], { label: string; cls: string }> = {
  live: { label: "Live raise", cls: "bg-accent-500 text-white" },
  closing: { label: "Closing soon", cls: "bg-coral-500 text-white" },
  funded: { label: "Funded", cls: "bg-ink-900 text-white" },
};

export function OpenRaiseCard({ raise }: { raise: OpenRaise }) {
  const s = STATUS[raise.status];
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-raised">
      <Photo
        seed={raise.seed}
        src={raise.image}
        sizes="(max-width: 768px) 100vw, 380px"
        tone="brand"
        label={raise.location}
        className="h-40 w-full"
      >
        <span
          className={cn(
            "absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            s.cls,
          )}
        >
          {s.label}
        </span>
      </Photo>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold tracking-[calc(-0.01em*var(--tracking-scale,1))] text-ink-900">
          {raise.name}
        </h3>
        <p className="mt-0.5 text-[13px] text-ink-400">{raise.type}</p>

        {/* progress */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-[13px]">
            <span className="tnum font-semibold text-ink-900">
              {ghsCompact((raise.targetRaise * raise.raisedPct) / 100)}
            </span>
            <span className="tnum text-ink-400">
              of {ghsCompact(raise.targetRaise)}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className={cn(
                "h-full rounded-full",
                raise.status === "funded" ? "bg-ink-900" : "bg-accent-500",
              )}
              style={{ width: `${raise.raisedPct}%` }}
            />
          </div>
        </div>

        {/* stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-100 pt-4">
          <div>
            <p className="flex items-center gap-1 t-overline text-ink-400">
              <TrendingUp className="h-3 w-3" /> Proj. yield
            </p>
            <p className="tnum mt-0.5 text-[15px] font-semibold text-sky-600">
              {raise.projectedYield}
            </p>
          </div>
          <div>
            <p className="t-overline text-ink-400">
              Min ticket
            </p>
            <p className="tnum mt-0.5 text-[15px] font-semibold text-ink-900">
              {ghs(raise.minTicket)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[13px] text-ink-500">
            <Clock className="h-3.5 w-3.5" />
            {raise.status === "funded"
              ? "Fully funded"
              : `${raise.daysRemaining} days left`}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-700 group-hover:text-accent-700">
            {raise.status === "funded" ? "View" : "Invest"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

import { Check } from "lucide-react";

interface AccessReceivedProps {
  email: string;
  onDone: () => void;
}

export function AccessReceived({ email, onDone }: AccessReceivedProps) {
  return (
    <div aria-live="polite">
      <span className="check-pop bg-brand-50 text-brand-700 flex h-14 w-14 items-center justify-center rounded-full">
        <Check className="h-6 w-6" strokeWidth={2.5} />
      </span>
      <h2
        id="access-title"
        className="rise text-ink-900 mt-5 pr-8 text-[1.75rem] leading-[1.15] font-bold tracking-[-0.02em]"
      >
        Request received
      </h2>
      <p className="rise text-ink-500 mt-2 text-[15px] leading-relaxed">
        Thanks. We&apos;ll review your request and email{" "}
        <b className="text-ink-900 font-semibold">{email}</b> with your invite once you&apos;re
        approved.
      </p>
      <button
        type="button"
        onClick={onDone}
        autoFocus
        className="text-ink-700 ring-ink-200 hover:bg-ink-50 mt-8 h-11 w-full rounded-full text-[14.5px] font-semibold ring-1 transition-colors"
      >
        Done
      </button>
    </div>
  );
}

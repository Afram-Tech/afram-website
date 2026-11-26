import { Clock } from "lucide-react";

interface AccessReceivedProps {
  email: string;
  onDone: () => void;
}

/** V2's "Request received" step, without its demo approval panel: here the
 *  request goes to the team, who approve it outside the site. */
export function AccessReceived({ email, onDone }: AccessReceivedProps) {
  return (
    <div aria-live="polite">
      <span className="bg-accent-50 text-accent-700 flex h-12 w-12 items-center justify-center rounded-full">
        <Clock className="h-5 w-5" />
      </span>
      <h2 id="access-title" className="t-h3 text-ink-900 mt-5 pr-8">
        Request received
      </h2>
      <p className="text-ink-500 mt-2 text-[15px] leading-relaxed break-words">
        We&apos;ll email <b className="text-ink-900 font-semibold">{email}</b> once you&apos;re
        approved.
      </p>
      <button
        type="button"
        onClick={onDone}
        autoFocus
        className="btn-secondary mt-6 h-11 w-full rounded-full text-[14px] font-semibold"
      >
        Done
      </button>
    </div>
  );
}

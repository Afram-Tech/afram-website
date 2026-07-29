"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function NewsletterForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="bg-brand-50 text-brand-700 flex items-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium">
        <CheckCircle2 className="h-4 w-4" />
        You&apos;re on the list — talk soon.
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        required
        placeholder="name@email.com"
        aria-label="Email address"
        className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 flex-1 rounded-full border bg-white px-5 py-[12px] text-[15px] focus:outline-none"
      />
      <button
        type="submit"
        className="bg-brand-500 hover:bg-brand-600 inline-flex h-12 items-center justify-center gap-1.5 rounded-full px-6 text-[15px] font-semibold text-white transition-all active:scale-[0.98]"
      >
        Subscribe
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

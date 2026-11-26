"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        required
        placeholder="name@email.com"
        aria-label="Email address"
        className="field h-11 flex-1"
      />
      <button
        type="submit"
        className="btn-primary inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-6 text-[15px] font-semibold"
      >
        Subscribe
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

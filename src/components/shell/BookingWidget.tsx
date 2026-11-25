"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, ChevronDown } from "lucide-react";
import {
  isSpam,
  parseContactMessage,
  type ContactFormState,
} from "@/features/contact/contact-message";
import { useContactUs } from "@/hooks/data";
import { cn } from "@/lib/utils";

const SEND_FAILED = "We couldn’t send your message just now. Please try again in a moment.";

const fieldCls = "field h-11";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[13px] font-medium text-ink-600">
      {children}
    </span>
  );
}

export function BookingWidget({
  topics = ["Book a site visit", "Talk to a partner", "Speak to a lawyer"],
  cta = "Request a callback",
  simple = false,
  className,
}: {
  topics?: string[];
  cta?: string;
  /** Name, email, topic and message only — no phone. */
  simple?: boolean;
  className?: string;
}) {
  // Delivered through the API's contactUs mutation.
  const { contactUs } = useContactUs();
  const submit = async (_previous: ContactFormState, form: FormData): Promise<ContactFormState> => {
    if (isSpam(form)) return { status: "sent" };
    const message = parseContactMessage(form);
    if (!message.ok) return { status: "error", error: message.error };
    try {
      const { data } = await contactUs({ variables: { input: message.input } });
      if (!data?.contactUs.success) return { status: "error", error: SEND_FAILED };
      return { status: "sent" };
    } catch {
      return { status: "error", error: SEND_FAILED };
    }
  };
  const [state, action, pending] = useActionState(submit, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div
        className={cn(
          "flex flex-col items-start gap-3 rounded-2xl bg-accent-50 p-6 ring-1 ring-accent-100",
          className,
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-500 text-white">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <p className="text-lg font-semibold text-ink-900">Message received</p>
        <p className="text-[15px] text-ink-600">Thanks — we&apos;ll be in touch within one business day.</p>
      </div>
    );
  }

  return (
    <form action={action} className={cn("space-y-4", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <Label>{simple ? "Full name" : "Your name"}</Label>
          <input
            name="name"
            required
            placeholder="Ama Mensah"
            autoComplete="name"
            className={fieldCls}
          />
        </label>
        <label className="block">
          <Label>{simple ? "Email address" : "Email"}</Label>
          <input
            name="email"
            type="email"
            required
            placeholder="ama@email.com"
            autoComplete="email"
            className={fieldCls}
          />
        </label>
      </div>

      <div className={cn("grid gap-4", !simple && "sm:grid-cols-2")}>
        {!simple && (
        <label className="block">
          <Label>Phone (optional)</Label>
          <input
            name="phone"
            inputMode="tel"
            placeholder="024 000 0000"
            autoComplete="tel"
            className={fieldCls}
          />
        </label>
        )}
        <label className="block">
          <Label>{simple ? "Topic" : "What is it about?"}</Label>
          <div className="relative">
            <select
              name="topic"
              className={cn(fieldCls, "appearance-none pr-10")}
            >
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </label>
      </div>

      <label className="block">
        <Label>Message</Label>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us a little about what you need…"
          className={cn(
            fieldCls,
            "h-auto min-h-[120px] resize-none py-3 leading-relaxed",
          )}
        />
      </label>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 opacity-0"
      />

      {state.status === "error" && (
        <p role="alert" className="text-[13px] font-medium text-coral-500">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold disabled:opacity-70"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : cta}
      </button>

      <p className="text-[12px] leading-relaxed text-ink-400">
        We will never share your details.
        {!simple && " Prefer WhatsApp? Mention it and we will message you there."}
      </p>
    </form>
  );
}

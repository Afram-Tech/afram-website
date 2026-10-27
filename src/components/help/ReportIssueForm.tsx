"use client";

import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

import { reportIssue } from "@/features/help/actions";
import type { ReportField, ReportState } from "@/features/help/report-issue";
import { cn } from "@/lib/utils";

import { TURNSTILE_SITE_KEY, TurnstileCheck } from "./TurnstileCheck";

const INITIAL_STATE: ReportState = { status: "idle" };

const fieldClass =
  "w-full rounded-[14px] bg-white px-4 text-[15px] text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-400 aria-[invalid=true]:ring-coral-500/60";

/** One message and an email — filed as a support request, like in-app Help. */
export function ReportIssueForm({
  onSent,
  onAgain,
}: {
  onSent?: (reference: string, email: string) => void;
  onAgain?: () => void;
}) {
  const [state, action, pending] = useActionState(reportIssue, INITIAL_STATE);
  // Controlled: React resets a form after its action, and an error shouldn't wipe it.
  const [values, setValues] = useState({ message: "", email: "" });
  const [captcha, setCaptcha] = useState("");
  const turnstile = useRef<TurnstileInstance>(null);
  /* One key per message: sending it again after a dropped connection can't
     file it twice. Editing the message makes a new one. */
  const sendKey = useRef<string | null>(null);
  if (sendKey.current == null) sendKey.current = crypto.randomUUID();
  const edit = (change: Partial<typeof values>) => {
    sendKey.current = crypto.randomUUID();
    setValues((current) => ({ ...current, ...change }));
  };
  // Without a site key (local dev) there's no check to wait for.
  const waitingOnCheck = !!TURNSTILE_SITE_KEY && !captcha;

  const sentReference = state.status === "sent" ? state.reference : null;
  useEffect(() => {
    if (sentReference) onSent?.(sentReference, values.email.trim());
    // The email is read once, when the reference arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentReference, onSent]);

  // Where the visitor is and on what device, added at submit to help triage.
  const submit = (form: FormData) => {
    form.set("path", window.location.pathname);
    form.set("userAgent", navigator.userAgent);
    form.set("viewport", `${window.innerWidth}×${window.innerHeight}`);
    form.set("language", navigator.language);
    form.set("captchaToken", captcha);
    form.set("idempotencyKey", sendKey.current ?? crypto.randomUUID());
    action(form);
    // A token works once, sent or refused: the next send needs a fresh check.
    turnstile.current?.reset();
    setCaptcha("");
  };

  if (state.status === "sent") {
    const email = values.email.trim();
    return (
      <div className="flex flex-col gap-3" aria-live="polite">
        <div className="bg-brand-500 max-w-[88%] self-end rounded-2xl rounded-br-md px-4 py-3 text-[14px] leading-relaxed wrap-break-word whitespace-pre-wrap text-white">
          {values.message.trim()}
        </div>
        <div className="text-ink-900 ring-ink-100 max-w-[92%] self-start rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[14px] leading-relaxed ring-1">
          <span className="text-brand-700 mb-0.5 block text-[11.5px] font-bold">Afram Support</span>
          Thanks, we&apos;ve got it. Your reference is{" "}
          <b className="tnum font-semibold">{state.reference}</b>.{" "}
          {email ? (
            <>We&apos;ll reply to {email}. Check on it below with the reference and that email.</>
          ) : (
            "Quote it if you contact us. Add an email next time so we can reply."
          )}
        </div>
        {onAgain && (
          <button
            type="button"
            onClick={onAgain}
            className="text-brand-500 hover:text-brand-700 self-start text-[13.5px] font-semibold"
          >
            Send another message
          </button>
        )}
      </div>
    );
  }

  const error = state.status === "error" ? state : null;
  const errorFor = (field: ReportField) =>
    error?.field === field ? (
      <span role="alert" className="mt-1.5 block text-[13px] font-medium text-red-600">
        {error.message}
      </span>
    ) : null;

  return (
    <form action={submit} className="flex flex-col gap-2.5" noValidate>
      <label className="block">
        <span className="sr-only">Your message</span>
        <textarea
          name="message"
          value={values.message}
          onChange={(event) => edit({ message: event.target.value })}
          aria-invalid={error?.field === "message"}
          rows={4}
          maxLength={4000}
          placeholder="Type your message…"
          className={cn(fieldClass, "min-h-[118px] resize-y py-3 leading-relaxed")}
        />
        {errorFor("message")}
      </label>

      <label className="block">
        <span className="sr-only">Your email</span>
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => edit({ email: event.target.value })}
          aria-invalid={error?.field === "email"}
          autoComplete="email"
          placeholder="Your email, so we can reply"
          className={cn(fieldClass, "h-12")}
        />
        {errorFor("email")}
      </label>

      <TurnstileCheck
        ref={turnstile}
        action="support-request"
        onToken={setCaptcha}
        className="min-h-[65px]"
      />

      {error && !error.field && (
        <p role="alert" className="text-[13.5px] font-medium text-red-600">
          {error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || waitingOnCheck}
        className="bg-brand-500 hover:bg-brand-600 mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-all active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}

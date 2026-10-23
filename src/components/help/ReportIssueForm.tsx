"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useActionState, useState, type ReactNode } from "react";

import { fieldClass } from "@/components/access/FormField";
import { reportIssue } from "@/features/help/actions";
import type { ReportField, ReportState } from "@/features/help/report-issue";
import { cn } from "@/lib/utils";

const INITIAL_STATE: ReportState = { status: "idle" };

/** Report an issue — one message, filed into the Exchange's report intake like in-app reports. */
export function ReportIssueForm() {
  const [state, action, pending] = useActionState(reportIssue, INITIAL_STATE);
  // Controlled: React resets a form after its action, and an error shouldn't wipe it.
  const [values, setValues] = useState({ message: "", blocked: false, email: "" });

  // Where the visitor is and on what device, added at submit to help triage.
  const submit = (form: FormData) => {
    form.set("path", window.location.pathname);
    form.set("userAgent", navigator.userAgent);
    form.set("viewport", `${window.innerWidth}×${window.innerHeight}`);
    form.set("language", navigator.language);
    action(form);
  };

  if (state.status === "sent") {
    return (
      <div
        className="bg-accent-50 ring-accent-100 flex flex-col items-start gap-3 rounded-2xl p-6 ring-1"
        aria-live="polite"
      >
        <span className="bg-accent-500 flex h-11 w-11 items-center justify-center rounded-full text-white">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <p className="text-ink-900 text-lg font-semibold">Thanks, we&apos;ve got it</p>
        <p className="text-ink-600 text-[15px]">
          Your reference is <b className="tnum text-ink-900 font-semibold">{state.reference}</b>.
          {values.email ? " We'll reply by email." : " Quote it if you get in touch."}
        </p>
      </div>
    );
  }

  const error = state.status === "error" ? state : null;
  const errorFor = (field: ReportField) => (error?.field === field ? error.message : undefined);

  return (
    <form action={submit} className="space-y-4" noValidate>
      <Field label="What's going wrong?" error={errorFor("message")}>
        <textarea
          name="message"
          value={values.message}
          onChange={(event) =>
            setValues((current) => ({ ...current, message: event.target.value }))
          }
          aria-invalid={error?.field === "message"}
          rows={6}
          maxLength={4000}
          placeholder="Tell us in your own words. For example: my access link says it has expired."
          className={cn(fieldClass, "h-auto min-h-[150px] resize-y py-3 leading-relaxed sm:h-auto")}
        />
      </Field>

      <Field
        label={
          <>
            Your email <span className="text-ink-400 font-normal">(so we can reply)</span>
          </>
        }
        error={errorFor("email")}
      >
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          aria-invalid={error?.field === "email"}
          autoComplete="email"
          placeholder="you@email.com"
          className={fieldClass}
        />
      </Field>

      {error && !error.field && (
        <p role="alert" className="text-[13.5px] font-medium text-red-600">
          {error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-500 hover:bg-brand-600 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-all active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send"
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-ink-900 mb-2 block text-[14px] font-semibold">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-[13px] font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

"use client";

import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { useActionState, useState, type ChangeEvent } from "react";

import { FormField, fieldClass } from "@/components/access/FormField";
import { reportIssue } from "@/features/help/actions";
import {
  REPORT_AREAS,
  REPORT_IMPACTS,
  REPORT_KINDS,
  type ReportField,
  type ReportState,
} from "@/features/help/report-issue";
import { cn } from "@/lib/utils";

const INITIAL_STATE: ReportState = { status: "idle" };
const EMPTY_VALUES: Record<ReportField, string> = {
  kind: "bug",
  area: "",
  impact: "",
  title: "",
  details: "",
  email: "",
};

/** Report an issue — files into the Exchange's report intake, like in-app reports. */
export function ReportIssueForm() {
  const [state, action, pending] = useActionState(reportIssue, INITIAL_STATE);
  // Controlled: React resets a form after its action, and an error shouldn't wipe it.
  const [values, setValues] = useState(EMPTY_VALUES);

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

  const bind = (field: ReportField) => ({
    name: field,
    value: values[field],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value })),
    "aria-invalid": error?.field === field,
  });

  return (
    <form action={submit} className="space-y-5" noValidate>
      <fieldset>
        <legend className="text-ink-600 mb-2 block text-[13.5px] font-medium sm:text-[14px]">
          What&apos;s happening?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {REPORT_KINDS.map((kind) => (
            <label
              key={kind.id}
              className={cn(
                "has-[:focus-visible]:ring-brand-400 flex h-12 cursor-pointer items-center justify-center rounded-xl px-2 text-center text-[14.5px] font-semibold ring-1 transition-colors has-[:focus-visible]:ring-2",
                values.kind === kind.id
                  ? "bg-brand-50 text-brand-800 ring-brand-400"
                  : "text-ink-600 ring-ink-200 hover:ring-brand-200 bg-white",
              )}
            >
              <input
                type="radio"
                {...bind("kind")}
                value={kind.id}
                checked={values.kind === kind.id}
                className="sr-only"
              />
              {kind.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="What's it about?" error={errorFor("area")}>
          <Select {...bind("area")} options={REPORT_AREAS} />
        </FormField>
        <FormField label="How much is it affecting you?" error={errorFor("impact")}>
          <Select {...bind("impact")} options={REPORT_IMPACTS} />
        </FormField>
      </div>

      <FormField label="Summary" error={errorFor("title")}>
        <input
          {...bind("title")}
          maxLength={120}
          placeholder="e.g. My access link says it has expired"
          className={fieldClass}
        />
      </FormField>

      <FormField label="What happened?" error={errorFor("details")}>
        <textarea
          {...bind("details")}
          rows={5}
          maxLength={4000}
          placeholder="What were you doing, and what did you expect to happen?"
          className={cn(
            fieldClass,
            "h-auto min-h-[130px] resize-none py-3 leading-relaxed sm:h-auto",
          )}
        />
      </FormField>

      <FormField label="Email (optional, so we can reply)" error={errorFor("email")}>
        <input
          {...bind("email")}
          type="email"
          autoComplete="email"
          placeholder="ama@email.com"
          className={fieldClass}
        />
      </FormField>

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
          "Send report"
        )}
      </button>
    </form>
  );
}

function Select({
  options,
  ...props
}: {
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  "aria-invalid": boolean;
  options: readonly { id: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select {...props} className={cn(fieldClass, "appearance-none pr-10")}>
        <option value="" disabled>
          Choose one
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="text-ink-400 pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2" />
    </div>
  );
}

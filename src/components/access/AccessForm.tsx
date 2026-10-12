"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useActionState, useState, type ChangeEvent } from "react";

import { siteConfig } from "@/config/site";
import {
  isSpam,
  parseAccessRequest,
  type AccessField,
  type AccessState,
} from "@/features/access/request-access";
import type { AccessRole } from "@/features/access/roles";
import { useRequestAccess } from "@/hooks/data";

import { AccessReceived } from "./AccessReceived";
import { FormField, fieldClass } from "./FormField";
import { RoleOptions } from "./RoleOptions";

type ContactField = Exclude<AccessField, "role">;

const INITIAL_STATE: AccessState = { status: "idle" };
const EMPTY_VALUES: Record<ContactField, string> = { name: "", email: "", phone: "" };
const SEND_FAILED: AccessState = {
  status: "error",
  message: "We couldn’t send your request just now. Please try again in a moment.",
};

interface AccessFormProps {
  role: AccessRole;
  onRoleChange: (role: AccessRole) => void;
  onDone: () => void;
}

export function AccessForm({ role, onRoleChange, onDone }: AccessFormProps) {
  const { requestAccess } = useRequestAccess();

  const submit = async (_previous: AccessState, form: FormData): Promise<AccessState> => {
    if (isSpam(form)) {
      return { status: "received", email: String(form.get("email") ?? ""), role: "Member" };
    }

    const request = parseAccessRequest(form);
    if (!request.ok) return request.state;

    try {
      const { data } = await requestAccess({ variables: { input: request.input } });
      if (!data?.requestAccess.success) return SEND_FAILED;
      return { status: "received", email: request.email, role: request.role };
    } catch {
      return SEND_FAILED;
    }
  };

  const [state, action, pending] = useActionState(submit, INITIAL_STATE);
  const [values, setValues] = useState(EMPTY_VALUES);

  if (state.status === "received") {
    return <AccessReceived email={state.email} onDone={onDone} />;
  }

  const error = state.status === "error" ? state : null;
  const errorFor = (field: ContactField) => (error?.field === field ? error.message : undefined);

  const bind = (field: ContactField) => ({
    name: field,
    value: values[field],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value })),
    "aria-invalid": error?.field === field,
    className: fieldClass,
    required: true,
  });

  return (
    <>
      <h2
        id="access-title"
        className="text-ink-900 pr-8 text-[1.75rem] leading-[1.15] font-bold tracking-[-0.02em]"
      >
        Request access
      </h2>
      <p className="text-ink-500 mt-2 text-[15px]">
        Afram is invite-only for now. Tell us who you are and we&apos;ll be in touch.
      </p>

      <form action={action} className="mt-8 space-y-5" noValidate>
        <RoleOptions value={role} onChange={onRoleChange} />

        <FormField label="Full name" error={errorFor("name")}>
          <input {...bind("name")} autoComplete="name" placeholder="Ama Mensah" autoFocus />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Email" error={errorFor("email")}>
            <input
              {...bind("email")}
              type="email"
              autoComplete="email"
              placeholder="ama@email.com"
            />
          </FormField>
          <FormField label="Phone" error={errorFor("phone")}>
            <input
              {...bind("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+233 24 000 0000"
            />
          </FormField>
        </div>

        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />

        {error && !error.field && (
          <p role="alert" className="text-[13.5px] font-medium text-red-600">
            {error.message}
          </p>
        )}

        <SubmitButton pending={pending} />
      </form>

      <p className="text-ink-500 mt-6 text-center text-[13.5px]">
        Already have access?{" "}
        <a
          href={siteConfig.signInUrl}
          className="text-brand-600 font-semibold underline-offset-4 hover:underline"
        >
          Sign in
        </a>
      </p>
    </>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-500 hover:bg-brand-600 !mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-all active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending…
        </>
      ) : (
        <>
          Request access
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

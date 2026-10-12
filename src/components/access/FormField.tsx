import type { ReactNode } from "react";

export const fieldClass =
  "h-12 w-full rounded-xl bg-brand-50/70 px-4 text-[15px] text-ink-900 ring-1 ring-brand-100 transition placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-brand-400 focus:outline-none aria-[invalid=true]:ring-red-300";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-ink-600 mb-1.5 block text-[13px] font-medium">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-[12.5px] font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

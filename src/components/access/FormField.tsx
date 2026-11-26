import type { ReactNode } from "react";

/** V2's field. 16px text on phones so iOS doesn't zoom in on focus. */
export const fieldClass =
  "field h-11 min-w-0 text-ink-900 max-sm:text-base aria-[invalid=true]:border-coral-500";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="block min-w-0">
      <span className="text-ink-600 mb-1.5 block text-[13px] font-medium">
        {label}
      </span>
      {children}
      {error && (
        <span role="alert" className="text-coral-500 mt-1.5 block text-[13px] font-medium">
          {error}
        </span>
      )}
    </label>
  );
}

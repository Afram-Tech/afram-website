"use client";

import { X } from "lucide-react";
import type { MouseEvent } from "react";

import { cn } from "@/lib/utils";

import { AccessForm } from "./AccessForm";
import { useAccessDialog } from "./useAccessDialog";

export function RequestAccess() {
  const { dialogRef, role, setRole, formKey, close, handleClosed } = useAccessDialog();

  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="access-title"
      onClick={closeOnBackdrop}
      onClose={handleClosed}
      className={cn(
        "modal-pop modal-sheet bg-transparent p-0 backdrop:backdrop-blur-[3px]",
        "mx-0 mt-auto mb-0 w-full max-w-none sm:m-auto sm:w-[calc(100%-2rem)] sm:max-w-[560px]",
      )}
    >
      <div className="relative max-h-[calc(100dvh-24px)] overflow-y-auto rounded-t-[1.75rem] bg-white px-6 pt-8 pb-7 shadow-[0_40px_100px_-40px_rgba(0,38,42,0.6)] sm:rounded-[2rem] sm:px-10 sm:pt-10 sm:pb-9">
        <span
          aria-hidden
          className="bg-ink-200 absolute top-2.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full sm:hidden"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="text-ink-500 hover:bg-ink-50 hover:text-ink-900 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
        <AccessForm key={formKey} role={role} onRoleChange={setRole} onDone={close} />
      </div>
    </dialog>
  );
}

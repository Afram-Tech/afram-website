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
        "modal-pop modal-sheet overflow-visible bg-transparent p-0 backdrop:backdrop-blur-[3px]",
        "mx-0 mt-auto mb-0 h-fit max-h-none w-full max-w-none",
        "sm:m-auto sm:w-[calc(100%-3rem)] sm:max-w-[640px]",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-x-hidden overflow-y-auto overscroll-contain bg-white",
          "max-h-[calc(100vh-1.5rem)] supports-[height:100dvh]:max-h-[calc(100dvh-1.5rem)]",
          "rounded-t-[1.75rem] px-5 pt-9 pb-[calc(1.75rem+env(safe-area-inset-bottom))] min-[400px]:px-7",
          "sm:max-h-[calc(100vh-4rem)] sm:rounded-[2.25rem] sm:px-12 sm:pt-12 sm:pb-11 supports-[height:100dvh]:sm:max-h-[calc(100dvh-4rem)]",
          "shadow-[0_40px_100px_-40px_rgba(0,38,42,0.6)]",
        )}
      >
        <span
          aria-hidden
          className="bg-ink-200 absolute top-2.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full sm:hidden"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="text-ink-500 hover:bg-ink-50 hover:text-ink-900 absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors sm:top-5 sm:right-5"
        >
          <X className="h-5 w-5" />
        </button>
        <AccessForm key={formKey} role={role} onRoleChange={setRole} onDone={close} />
      </div>
    </dialog>
  );
}

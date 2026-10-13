"use client";

import { X } from "lucide-react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import {
  useFocusTrap,
  useInertSiblings,
  useModalPresence,
  useScrollLock,
  useSwipeToDismiss,
} from "./useModalBehaviour";

const EXIT_MS = 260;

const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Modal({
  open,
  onClose,
  labelledBy,
  children,
  className,
  bodyClassName,
}: ModalProps) {
  const isClient = useIsClient();
  const { rendered, state } = useModalPresence(open, EXIT_MS);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const swipe = useSwipeToDismiss(panelRef, onClose);

  useScrollLock(rendered);
  useInertSiblings(rootRef, open && rendered);
  useFocusTrap(panelRef, open && rendered, onClose);

  if (!isClient || !rendered) return null;

  return createPortal(
    <div
      ref={rootRef}
      data-state={state}
      className="group fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
    >
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "bg-ink-950/55 absolute inset-0 backdrop-blur-[6px]",
          "opacity-0 transition-opacity duration-200 ease-out",
          "group-data-[state=open]:opacity-100 group-data-[state=open]:duration-500",
          "motion-reduce:transition-none",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          "relative flex w-full flex-col bg-white outline-none",
          "shadow-[0_40px_100px_-40px_rgba(0,38,42,0.6)]",
          "max-h-[calc(100vh-1.5rem)] supports-[height:100dvh]:max-h-[calc(100dvh-1.5rem)]",
          "rounded-t-[1.75rem] sm:max-h-[calc(100vh-3rem)] sm:rounded-[2.25rem] supports-[height:100dvh]:sm:max-h-[calc(100dvh-3rem)]",
          "translate-y-full transition-[transform,opacity] duration-[260ms] ease-in",
          "sm:translate-y-6 sm:scale-[0.96] sm:opacity-0",
          "group-data-[state=open]:translate-y-0 group-data-[state=open]:duration-[560ms] group-data-[state=open]:ease-[cubic-bezier(0.32,0.72,0,1)]",
          "sm:group-data-[state=open]:translate-y-0 sm:group-data-[state=open]:scale-100 sm:group-data-[state=open]:opacity-100 sm:group-data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
          "motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-opacity",
          className,
        )}
      >
        <div
          {...swipe}
          className="flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-1 sm:hidden"
        >
          <span aria-hidden className="bg-ink-200 h-1 w-10 rounded-full" />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "text-ink-500 hover:bg-ink-50 hover:text-ink-900 absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full sm:top-5 sm:right-5",
            "transition-[background-color,color,transform] duration-200 hover:rotate-90",
            "focus-visible:ring-brand-400 focus-visible:ring-2 focus-visible:outline-none",
          )}
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className={cn(
            "modal-stagger overflow-x-hidden overflow-y-auto overscroll-contain",
            bodyClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

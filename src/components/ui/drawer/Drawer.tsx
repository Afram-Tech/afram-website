"use client";

import { useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import {
  useFocusTrap,
  useInertSiblings,
  useModalPresence,
  useScrollLock,
} from "../modal/useModalBehaviour";

const EXIT_MS = 280;

const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  /** Pinned above the scrolling body. */
  header: ReactNode;
  children: ReactNode;
  /** The scrolling body, for callers that reset its scroll position. */
  bodyRef?: RefObject<HTMLDivElement | null>;
}

/**
 * A panel that slides in from the right edge: full width on phones, up to
 * 680px on larger screens. Behaves like the Modal: focus stays inside, Escape
 * and the backdrop close it, the page behind is inert and doesn't scroll.
 */
export function Drawer({ open, onClose, labelledBy, header, children, bodyRef }: DrawerProps) {
  const isClient = useIsClient();
  const { rendered, state } = useModalPresence(open, EXIT_MS);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(rendered);
  useInertSiblings(rootRef, open && rendered);
  useFocusTrap(panelRef, open && rendered, onClose);

  if (!isClient || !rendered) return null;

  return createPortal(
    <div ref={rootRef} data-state={state} className="group/overlay fixed inset-0 z-[100]">
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "bg-ink-950/45 absolute inset-0 backdrop-blur-[3px]",
          "opacity-0 transition-opacity duration-200 ease-out",
          "group-data-[state=open]/overlay:opacity-100 group-data-[state=open]/overlay:duration-500",
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
          "absolute inset-y-0 right-0 flex w-full flex-col bg-white outline-none sm:w-[min(680px,92vw)]",
          "shadow-[-30px_0_80px_-30px_rgba(0,38,42,0.45)]",
          "translate-x-full transition-transform duration-[280ms] ease-in",
          "group-data-[state=open]/overlay:translate-x-0 group-data-[state=open]/overlay:duration-[520ms] group-data-[state=open]/overlay:ease-[cubic-bezier(0.32,0.72,0,1)]",
          "motion-reduce:translate-x-0 motion-reduce:transition-none",
        )}
      >
        <div className="border-ink-100 shrink-0 border-b">{header}</div>
        <div ref={bodyRef} className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

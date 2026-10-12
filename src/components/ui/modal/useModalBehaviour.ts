"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden]):not([tabindex='-1'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function focusableWithin(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => element.getClientRects().length > 0,
  );
}

export type ModalState = "open" | "closed";

export function useModalPresence(open: boolean, exitMs: number) {
  const [rendered, setRendered] = useState(open);
  const [entered, setEntered] = useState(false);

  if (open && !rendered) setRendered(true);

  useEffect(() => {
    if (!rendered) return;

    if (open) {
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }

    const timeout = window.setTimeout(() => {
      setRendered(false);
      setEntered(false);
    }, exitMs);
    return () => window.clearTimeout(timeout);
  }, [open, rendered, exitMs]);

  const state: ModalState = open && entered ? "open" : "closed";
  return { rendered, state };
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const previous = { overflow: root.style.overflow, paddingRight: body.style.paddingRight };

    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      root.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
    };
  }, [active]);
}

export function useInertSiblings(rootRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!active || !root) return;

    const siblings = [...document.body.children].filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element !== root && !element.inert,
    );
    siblings.forEach((element) => (element.inert = true));

    return () => siblings.forEach((element) => (element.inert = false));
  }, [rootRef, active]);
}

export function useFocusTrap(
  panelRef: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape: () => void,
) {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!active || !panel) return;

    const returnFocusTo = document.activeElement as HTMLElement | null;

    if (!panel.contains(document.activeElement)) {
      const preferred = panel.querySelector<HTMLElement>("[autofocus]");
      (preferred ?? focusableWithin(panel)[0] ?? panel).focus({ preventScroll: true });
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscapeRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = focusableWithin(panel);
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !panel.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !panel.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (returnFocusTo?.isConnected) returnFocusTo.focus({ preventScroll: true });
    };
  }, [panelRef, active]);
}

export function useSwipeToDismiss(
  panelRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  threshold = 120,
) {
  const start = useRef<{ y: number; pointerId: number } | null>(null);

  const reset = (panel: HTMLElement) => {
    panel.style.transition = "";
    panel.style.transform = "";
  };

  return {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") return;
      start.current = { y: event.clientY, pointerId: event.pointerId };
      event.currentTarget.setPointerCapture(event.pointerId);
      if (panelRef.current) panelRef.current.style.transition = "none";
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      const panel = panelRef.current;
      if (!start.current || !panel || event.pointerId !== start.current.pointerId) return;
      const distance = Math.max(0, event.clientY - start.current.y);
      panel.style.transform = `translateY(${distance}px)`;
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      const panel = panelRef.current;
      if (!start.current || !panel) return;
      const distance = event.clientY - start.current.y;
      start.current = null;
      reset(panel);
      if (distance > threshold) onDismiss();
    },
    onPointerCancel: () => {
      start.current = null;
      if (panelRef.current) reset(panelRef.current);
    },
  };
}

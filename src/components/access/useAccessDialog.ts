"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { isAccessLink, roleForUserType } from "@/features/access/links";
import {
  OPEN_REQUEST_ACCESS,
  REQUEST_ACCESS_PARAM,
  ROLE_FOR_PATH,
  USER_TYPE_PARAM,
  type AccessRole,
} from "@/features/access/roles";

function isPlainLeftClick(event: MouseEvent): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

function consumeAccessParams(): AccessRole | undefined | null {
  const params = new URLSearchParams(window.location.search);
  if (!params.has(REQUEST_ACCESS_PARAM)) return null;

  const role = roleForUserType(params.get(USER_TYPE_PARAM));
  params.delete(REQUEST_ACCESS_PARAM);
  params.delete(USER_TYPE_PARAM);

  const query = params.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
  );
  return role;
}

function useAccessTriggers(open: (role?: AccessRole) => void) {
  useEffect(() => {
    const onOpenEvent = (event: Event) =>
      open((event as CustomEvent<AccessRole | undefined>).detail);

    const onClick = (event: MouseEvent) => {
      if (!isPlainLeftClick(event)) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || !isAccessLink(link)) return;
      event.preventDefault();
      open(roleForUserType(new URL(link.href).searchParams.get(USER_TYPE_PARAM)));
    };

    const requestedRole = consumeAccessParams();
    if (requestedRole !== null) open(requestedRole);

    window.addEventListener(OPEN_REQUEST_ACCESS, onOpenEvent);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(OPEN_REQUEST_ACCESS, onOpenEvent);
      document.removeEventListener("click", onClick, true);
    };
  }, [open]);
}

function useCloseOnNavigation(close: () => void) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    close();
  }, [pathname, close]);
}

export function useAccessDialog() {
  const isOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<AccessRole>("Member");
  const [formKey, setFormKey] = useState(0);

  const open = useCallback((requestedRole?: AccessRole) => {
    if (isOpenRef.current) return;
    isOpenRef.current = true;
    setRole(requestedRole ?? ROLE_FOR_PATH[window.location.pathname] ?? "Member");
    setFormKey((key) => key + 1);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    isOpenRef.current = false;
    setIsOpen(false);
  }, []);

  useAccessTriggers(open);
  useCloseOnNavigation(close);

  return { isOpen, role, setRole, formKey, close };
}

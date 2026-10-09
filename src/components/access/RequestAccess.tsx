"use client";

import { ArrowRight, Building2, Check, Home, Landmark, Loader2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { siteConfig } from "@/config/site";
import { requestAccess, type AccessState } from "@/features/access/actions";
import { INVITE_ONLY } from "@/features/access/invite-only";
import {
  OPEN_REQUEST_ACCESS,
  REQUEST_ACCESS_ATTR,
  ROLE_FOR_PATH,
  REQUEST_ACCESS_PARAM,
  ROLE_FOR_USER_TYPE,
  USER_TYPE_PARAM,
  type AccessRole,
} from "@/features/access/roles";
import { cn } from "@/lib/utils";

/**
 * Afram is invite-only for now. Sign-up and log-in links open this instead
 * of the app: pick a role, leave name, email and phone, and the
 * team gets back to you with an invite. People who already have access
 * continue to the app from the "Sign in" link at the bottom.
 *
 * While INVITE_ONLY is on, the sign-up controls READ "Request Access" rather
 * than "Get Started" or "Create Account" (features/access/cta does the swap) —
 * a button should say what clicking it does. This catches the clicks:
 *
 * Mounted once in the root layout. It opens for:
 * - any click on a link to the app's sign-up page — caught here rather than
 *   wired onto each button, so a new sign-up link is covered automatically;
 * - any link marked `data-request-access` (the nav's account control);
 * - openRequestAccess() (features/access/roles), from code;
 * - `?request-access=1` on arrival, which is how the app hands someone over
 *   from its own gated signup screens.
 * Cmd/Ctrl/Shift-clicks and pages without JS still follow the link.
 *
 * A native <dialog> gives the
 * focus trap, Esc-to-close and the top layer for free; `.modal-pop` animates
 * it in and out (a spring-y pop on desktop, a bottom sheet on phones —
 * `.modal-sheet`), see globals.css.
 */

const ROLES: { id: AccessRole; icon: LucideIcon }[] = [
  { id: "Member", icon: Home },
  { id: "Vendor", icon: Building2 },
  { id: "Financier", icon: Landmark },
];

/** A link to the app's sign-up page, or one marked to open this dialog.
 *  Nothing is intercepted once INVITE_ONLY is off — otherwise opting out would
 *  still trap every sign-up link in this dialog. */
function isAccessLink(link: HTMLAnchorElement): boolean {
  if (!INVITE_ONLY) return false;
  if (link.hasAttribute(REQUEST_ACCESS_ATTR)) return true;
  try {
    const url = new URL(link.href);
    return (
      url.origin === new URL(siteConfig.appUrl!).origin &&
      /^\/(signup|get-started)\/?$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

const fieldClass =
  "h-12 w-full rounded-xl bg-brand-50/70 px-4 text-[15px] text-ink-900 ring-1 ring-brand-100 transition placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-brand-400 focus:outline-none aria-[invalid=true]:ring-red-300";

export function RequestAccess() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const [role, setRole] = useState<AccessRole>("Member");
  // Bumped on every open, so the form remounts empty instead of showing the
  // last submission.
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const open = (requested?: AccessRole) => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      setRole(requested ?? ROLE_FOR_PATH[window.location.pathname] ?? "Member");
      setFormKey((k) => k + 1);
      dialog.showModal();
    };

    const onOpen = (e: Event) => open((e as CustomEvent<AccessRole | undefined>).detail);

    // Capture phase on document, so this runs before any link's own handler
    // or Next's client-side navigation.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || !isAccessLink(link)) return;
      e.preventDefault();
      const userType = new URL(link.href).searchParams.get("userType") ?? "";
      open(ROLE_FOR_USER_TYPE[userType]);
    };

    /* Arriving from the app's own "Request access" — it links to
       `…/?request-access=1&userType=issuer`. Open the form on the role it
       names, then strip both params so a refresh, a back-button return or a
       copied link is the plain page again rather than a modal that will not
       stay shut. Honoured whatever INVITE_ONLY says: it is an explicit
       request, not an interception. */
    const params = new URLSearchParams(window.location.search);
    if (params.has(REQUEST_ACCESS_PARAM)) {
      open(ROLE_FOR_USER_TYPE[params.get(USER_TYPE_PARAM) ?? ""]);
      params.delete(REQUEST_ACCESS_PARAM);
      params.delete(USER_TYPE_PARAM);
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (query ? `?${query}` : "") + window.location.hash,
      );
    }

    window.addEventListener(OPEN_REQUEST_ACCESS, onOpen);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(OPEN_REQUEST_ACCESS, onOpen);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  /* Navigating away closes it. Skipping the mount pass matters: this effect
     runs after the one above, so on a `?request-access=1` arrival it would
     close the dialog that had just been opened — the hand-off from the app
     would flash a modal and swallow it. */
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    dialogRef.current?.close();
  }, [pathname]);

  // The page behind shouldn't scroll while the dialog is up.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const sync = () => {
      document.documentElement.style.overflow = dialog.open ? "hidden" : "";
    };
    const observer = new MutationObserver(sync);
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => {
      observer.disconnect();
      document.documentElement.style.overflow = "";
    };
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="access-title"
      // A click on the dimmed area outside the panel lands on the <dialog>
      // itself (the panel fills it), so that's a backdrop click.
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className={cn(
        "modal-pop modal-sheet bg-transparent p-0 backdrop:backdrop-blur-[3px]",
        // Phones: a full-width sheet on the bottom edge. sm+: centred card.
        "mx-0 mt-auto mb-0 w-full max-w-none sm:m-auto sm:w-[calc(100%-2rem)] sm:max-w-[560px]",
      )}
    >
      <div className="relative max-h-[calc(100dvh-24px)] overflow-y-auto rounded-t-[1.75rem] bg-white px-6 pt-8 pb-7 shadow-[0_40px_100px_-40px_rgba(0,38,42,0.6)] sm:rounded-[2rem] sm:px-10 sm:pt-10 sm:pb-9">
        {/* Grab handle — a hint that the sheet is a sheet, phones only. */}
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
        <AccessForm key={formKey} role={role} setRole={setRole} onDone={close} />
      </div>
    </dialog>
  );
}

function AccessForm({
  role,
  setRole,
  onDone,
}: {
  role: AccessRole;
  setRole: (role: AccessRole) => void;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState<AccessState, FormData>(requestAccess, {
    status: "idle",
  });
  // Controlled, because React resets a form after its action runs and a
  // validation error shouldn't wipe what was typed.
  const [values, setValues] = useState({ name: "", email: "", phone: "" });
  const bind = (key: keyof typeof values) => ({
    name: key,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value })),
    "aria-invalid": state.status === "error" && state.field === key,
  });

  if (state.status === "received") {
    return <Received email={state.email} onDone={onDone} />;
  }

  const error = state.status === "error" ? state : null;
  const fieldError = (key: string) => (error?.field === key ? error.message : undefined);

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
        <fieldset>
          <legend className="text-ink-600 mb-2.5 block text-[13px] font-medium">I&apos;m a</legend>
          <div className="grid grid-cols-3 gap-3">
            {ROLES.map(({ id, icon: Icon }) => {
              const on = role === id;
              return (
                <label
                  key={id}
                  className={cn(
                    "has-[:focus-visible]:ring-brand-400 flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl px-3 py-4 ring-1 transition-all duration-200 has-[:focus-visible]:ring-2",
                    on
                      ? "bg-brand-50 ring-brand-400 scale-[1.02]"
                      : "ring-ink-200 hover:ring-brand-200 bg-white",
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={id}
                    checked={on}
                    onChange={() => setRole(id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200",
                      on ? "bg-brand-600 text-white" : "bg-ink-50 text-ink-500",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-ink-900 text-[14px] font-semibold">{id}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field label="Full name" error={fieldError("name")}>
          <input
            {...bind("name")}
            required
            autoComplete="name"
            placeholder="Ama Mensah"
            className={fieldClass}
            autoFocus
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" error={fieldError("email")}>
            <input
              {...bind("email")}
              type="email"
              required
              autoComplete="email"
              placeholder="ama@email.com"
              className={fieldClass}
            />
          </Field>
          <Field label="Phone" error={fieldError("phone")}>
            <input
              {...bind("phone")}
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="+233 24 000 0000"
              className={fieldClass}
            />
          </Field>
        </div>

        {/* Spam trap — hidden from people, filled in by bots. */}
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
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

function Received({ email, onDone }: { email: string; onDone: () => void }) {
  return (
    <div aria-live="polite">
      <span className="check-pop bg-brand-50 text-brand-700 flex h-14 w-14 items-center justify-center rounded-full">
        <Check className="h-6 w-6" strokeWidth={2.5} />
      </span>
      <h2
        id="access-title"
        className="rise text-ink-900 mt-5 pr-8 text-[1.75rem] leading-[1.15] font-bold tracking-[-0.02em]"
      >
        Request received
      </h2>
      <p className="rise text-ink-500 mt-2 text-[15px] leading-relaxed">
        Thanks. We&apos;ll review your request and email{" "}
        <b className="text-ink-900 font-semibold">{email}</b> with your invite once you&apos;re
        approved.
      </p>
      <button
        type="button"
        onClick={onDone}
        autoFocus
        className="text-ink-700 ring-ink-200 hover:bg-ink-50 mt-8 h-11 w-full rounded-full text-[14.5px] font-semibold ring-1 transition-colors"
      >
        Done
      </button>
    </div>
  );
}

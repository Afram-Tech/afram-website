"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import {
  ALL_OFF,
  ALL_ON,
  COOKIE_CATEGORIES,
  onOpenCookieSettings,
  openCookieSettings,
  readConsent,
  saveConsent,
  type CookieCategory,
  type CookieChoices,
} from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";

/**
 * The cookie banner the Cookie Policy describes. Shown on a first visit until
 * a choice is made; "Reject non-essential" sits beside "Accept all" at the same
 * weight, so saying no is as easy as saying yes. "Manage choices" opens one
 * switch per category. Reopened from the footer's "Cookie settings".
 */
const noSubscribe = () => () => {};

export function CookieConsentBanner() {
  // A first visit (no saved choice) opens the banner. Read in the browser
  // only, so the server never renders it.
  const firstVisit = useSyncExternalStore(noSubscribe, () => !readConsent(), () => false);
  const [decided, setDecided] = useState(false);
  const [reopened, setReopened] = useState(false);
  const [managing, setManaging] = useState(false);
  const [choices, setChoices] = useState<CookieChoices>(ALL_OFF);

  useEffect(
    () =>
      onOpenCookieSettings(() => {
        setChoices(readConsent()?.choices ?? ALL_OFF);
        setManaging(true);
        setReopened(true);
      }),
    [],
  );

  const open = reopened || (firstVisit && !decided);
  if (!open) return null;

  const decide = (c: CookieChoices) => {
    saveConsent(c);
    setDecided(true);
    setReopened(false);
    setManaging(false);
  };
  const hasChoice = !!readConsent();

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      data-print="hide"
      className="shadow-float fixed inset-x-3 bottom-3 z-[70] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-3xl bg-white p-5 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[420px] sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="bg-brand-50 text-brand-500 ring-brand-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1">
          <Cookie className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="cookie-title" className="text-ink-900 text-[16px] font-bold">
            Cookies on Afram
          </h2>
          <p className="text-ink-500 mt-1 text-[14px] leading-relaxed">
            We use essential cookies to make Afram work. With your OK, we&apos;d also use cookies to
            remember your preferences and understand how the site is used.{" "}
            <Link
              href="/legal/cookie-policy"
              className="text-brand-500 hover:text-brand-700 font-semibold underline underline-offset-2"
            >
              Cookie Policy
            </Link>
          </p>
        </div>
        {hasChoice && (
          <button
            type="button"
            onClick={() => {
              setReopened(false);
              setManaging(false);
            }}
            aria-label="Close"
            className="text-ink-400 hover:bg-ink-50 hover:text-ink-900 -mt-1 -mr-1 rounded-full p-1.5"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {managing && (
        <ul className="divide-ink-100 ring-ink-100 mt-4 divide-y overflow-hidden rounded-2xl ring-1">
          {COOKIE_CATEGORIES.map((c) => {
            const locked = c.id === "essential";
            const on = locked || choices[c.id as CookieCategory];
            return (
              <li key={c.id}>
                <label
                  className={cn(
                    "flex items-start gap-3 px-4 py-3",
                    locked ? "cursor-default" : "cursor-pointer",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-ink-900 block text-[14px] font-semibold">{c.label}</span>
                    <span className="text-ink-500 block text-[13px] leading-snug">{c.body}</span>
                  </span>
                  <input
                    type="checkbox"
                    role="switch"
                    checked={on}
                    disabled={locked}
                    onChange={(e) => setChoices((s) => ({ ...s, [c.id]: e.target.checked }))}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "peer-focus-visible:ring-brand-400 relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2",
                      on ? "bg-brand-500" : "bg-ink-200",
                      locked && "opacity-60",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
                        on ? "left-[18px]" : "left-0.5",
                      )}
                    />
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {managing ? (
          <button
            type="button"
            onClick={() => decide(choices)}
            className="btn-secondary h-11 rounded-full text-[14px] font-semibold"
          >
            Save choices
          </button>
        ) : (
          <button
            type="button"
            onClick={() => decide(ALL_OFF)}
            className="btn-secondary h-11 rounded-full text-[14px] font-semibold"
          >
            Reject non-essential
          </button>
        )}
        <button
          type="button"
          onClick={() => decide(ALL_ON)}
          className="btn-primary h-11 rounded-full text-[14px] font-semibold"
        >
          Accept all
        </button>
      </div>
      {!managing && (
        <button
          type="button"
          onClick={() => setManaging(true)}
          className="text-brand-500 hover:text-brand-700 mt-3 w-full text-center text-[13px] font-semibold"
        >
          Manage choices
        </button>
      )}
    </section>
  );
}

/** "Cookie settings" — reopens the choices. For the footer. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}

"use client";

import { ExternalLink } from "lucide-react";
import { useRef } from "react";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";

export function VerifyTitleDialog({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className={className}>
        {children}
      </button>
      <dialog
        ref={dialogRef}
        className="border-ink-100 backdrop:bg-ink-950/50 m-auto max-w-sm overflow-hidden rounded-2xl border bg-white p-0 shadow-xl"
      >
        <div className="bg-brand-50">
          <svg
            viewBox="0 0 400 180"
            className="h-40 w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="30" r="3" className="fill-brand-200" />
            <circle cx="340" cy="140" r="4" className="fill-brand-200" />
            <circle cx="200" cy="24" r="2.5" className="fill-brand-300" />

            <path
              d="M150 95 C 190 95, 210 95, 250 95"
              className="stroke-brand-300"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M244 88 L256 95 L244 102 Z" className="fill-brand-500" />

            <g>
              <rect
                x="46"
                y="55"
                width="104"
                height="80"
                rx="14"
                className="stroke-ink-200 fill-white"
                strokeWidth="1.5"
              />
              <circle cx="72" cy="80" r="8" className="fill-brand-100" />
              <circle cx="72" cy="80" r="3" className="fill-brand-600" />
              <rect x="88" y="76" width="42" height="7" rx="3.5" className="fill-ink-200" />
              <rect x="62" y="102" width="76" height="6" rx="3" className="fill-ink-100" />
              <rect x="62" y="114" width="54" height="6" rx="3" className="fill-ink-100" />
            </g>

            <g>
              <rect
                x="250"
                y="40"
                width="104"
                height="100"
                rx="14"
                className="stroke-ink-200 fill-white"
                strokeWidth="1.5"
              />
              <g>
                <path
                  d="M302 58 L322 65 V84 C322 98 314 108 302 113 C290 108 282 98 282 84 V65 Z"
                  className="fill-brand-50 stroke-brand-500"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M294 84 L300 90 L312 76"
                  className="stroke-brand-600"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <rect x="270" y="122" width="64" height="6" rx="3" className="fill-ink-100" />
            </g>
          </svg>
        </div>

        <div className="px-6 pt-5">
          <h2 className="text-ink-900 text-lg font-bold">You&apos;re leaving Afram</h2>
          <p className="text-ink-500 mt-1.5 text-sm">
            Title verification opens in a new tab at{" "}
            <span className="text-ink-700 font-medium">registry.afram.co</span>.
          </p>
        </div>

        <div className="flex justify-end gap-2 px-6 pt-5 pb-6">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="text-ink-700 hover:bg-ink-50 inline-flex h-11 items-center justify-center rounded-full px-5 text-[15px] font-semibold transition-colors"
          >
            Cancel
          </button>
          <a
            href={siteConfig.registryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => dialogRef.current?.close()}
            className="bg-brand-600 hover:bg-brand-700 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white transition-colors"
          >
            Continue
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </dialog>
    </>
  );
}

"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
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
        className="modal-pop border-ink-100 m-auto max-w-sm overflow-hidden rounded-2xl border bg-white p-0 shadow-xl"
      >
        <div className="bg-brand-50">
          <Image
            src="/illustrations/verify-title.svg"
            alt=""
            width={918}
            height={766}
            className="h-40 w-full object-cover"
          />
        </div>

        <div className="px-6 pt-5">
          <h2 className="text-ink-900 text-lg font-bold">You are leaving Afram</h2>
          <p className="text-ink-500 mt-1.5 text-sm">
            Explore verified land records, court rulings, and property details{" "}
            <span className="text-ink-700 font-medium">: registry.afram.co</span>.
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

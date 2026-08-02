"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { VerifyTitleDialog } from "@/components/VerifyTitleDialog";
import { buttonVariants } from "@/components/ui/button-variants";
import { NAV_GROUPS, type NavGroup } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navLinkClassName =
  "rounded-lg px-3 py-2 text-[15px] font-medium text-ink-700 transition-colors hover:text-brand-600";

interface SiteNavProps {
  /** Overrides from the Sanity `navigation` singleton — falls back to the static config when unset. */
  navGroups?: NavGroup[];
  verifyLabel?: string;
}

export function SiteNav({ navGroups = NAV_GROUPS, verifyLabel = "Verify a title" }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-200",
          scrolled ? "border-ink-100 bg-white/90 backdrop-blur-md" : "border-transparent bg-white",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1536px] items-center justify-between gap-4 px-6 sm:px-8 lg:px-16">
          <Link href="/" aria-label="Afram home" className="shrink-0">
            <Image
              src="/afram-logo.svg"
              alt="Afram"
              width={110}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navGroups.map((group) => (
              <div
                key={group.label}
                className="group relative"
                style={{ "--role": group.accentColor } as React.CSSProperties}
              >
                <Link
                  href={group.href}
                  className="text-ink-700 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors hover:[color:var(--role)]"
                >
                  {group.label}
                  <ChevronDown className="text-ink-300 h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-hover:[color:var(--role)]" />
                </Link>

                <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="border-ink-100 w-[360px] rounded-2xl border bg-white p-2 shadow-[0_16px_50px_-12px_rgba(0,86,94,0.18)]">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="hover:bg-ink-50 flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors"
                      >
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: group.accentColor }}
                        />
                        <span>
                          <span className="text-ink-900 block text-sm font-semibold">
                            {item.label}
                          </span>
                          <span className="text-ink-500 block text-[13px]">{item.description}</span>
                        </span>
                      </Link>
                    ))}
                    <Link
                      href={group.href}
                      className="bg-ink-50 hover:bg-ink-100 mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
                      style={{ color: group.accentColor }}
                    >
                      Explore {group.exploreLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            <Link href="/insights" className={navLinkClassName}>
              Insights
            </Link>
            <VerifyTitleDialog className={navLinkClassName}>{verifyLabel}</VerifyTitleDialog>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href={siteConfig.signUpUrl}
              className="text-ink-800 hover:text-brand-600 rounded-lg px-3.5 py-2 text-[15px] font-semibold transition-colors"
            >
              Create Account
            </Link>
            <Link href={siteConfig.signInUrl} className={buttonVariants("primary", "sm")}>
              Log In
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="text-ink-900 hover:bg-brand-50 inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-white px-5 pt-3 pb-10 lg:hidden">
          <div className="divide-ink-100 divide-y">
            {navGroups.map((group) => (
              <div key={group.label} className="py-3">
                <Link
                  href={group.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-base font-semibold"
                  style={{ color: group.accentColor }}
                >
                  {group.label}
                  <ArrowRight className="text-ink-300 h-4 w-4" />
                </Link>
                <div className="mt-2 space-y-1 pl-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-ink-500 block py-1.5 text-[15px]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/insights"
              onClick={() => setMobileMenuOpen(false)}
              className="text-ink-900 block py-3 text-base font-semibold"
            >
              Insights
            </Link>
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href={siteConfig.signInUrl}
              onClick={() => setMobileMenuOpen(false)}
              className={buttonVariants("primary", "lg", "w-full")}
            >
              Log In
            </Link>
            <Link
              href={siteConfig.signUpUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="bg-brand-50 text-brand-700 flex items-center justify-center rounded-xl px-4 py-3 text-base font-semibold"
            >
              Create Account
            </Link>
            <VerifyTitleDialog className="bg-brand-50 text-brand-700 flex items-center justify-center rounded-xl px-4 py-3 text-base font-semibold">
              {verifyLabel}
            </VerifyTitleDialog>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button, buttonClass } from "@/components/ui/Button";
import { VerifyTitleDialog } from "@/components/VerifyTitleDialog";
import { siteConfig } from "@/config/site";
import { INVITE_ONLY, REQUEST_ACCESS_LABEL } from "@/features/access/invite-only";
import { REQUEST_ACCESS_ATTR } from "@/features/access/roles";
import { cn } from "@/lib/utils";
import { useSignedIn } from "@/lib/use-signed-in";

type NavItem = { label: string; desc: string; href: string };
type NavGroup = {
  /** CTA text shown in the nav pill (per-role, e.g. "List Properties") */
  label: string;
  /** lowercase audience noun, used for the mega-menu "Explore {audience}" line */
  audience?: string;
  href: string;
  items?: NavItem[];
  /** Afram surface on its own domain — opens in a new tab. */
  external?: boolean;
  /** Spoken/tooltip context so an off-domain hop still reads as Afram. */
  hint?: string;
  /** Opens the in-site "You are leaving Afram" dialog for title checks. */
  verify?: boolean;
};

/** Sign-up opens the request-access form while access is by invitation. */
const SIGN_UP_LABEL = INVITE_ONLY ? REQUEST_ACCESS_LABEL : "Create Account";
const signUpProps = INVITE_ONLY
  ? { [REQUEST_ACCESS_ATTR]: "", "aria-haspopup": "dialog" as const }
  : {};

const NAV: NavGroup[] = [
  { label: "View Properties", href: "/properties" },
  {
    label: "List Properties",
    audience: "vendors",
    href: "/vendors",
  },
  {
    label: "Financiers",
    audience: "financiers",
    href: "/financiers",
  },
  { label: "Insights", href: "/insights" },
  {
    label: "Verify a title",
    href: siteConfig.registryUrl,
    verify: true,
  },
  { label: "How Afram works", href: "/how-it-works" },
];

/** Simplified nav shown once a user returns signed in — no dropdowns. */
const SIGNED_IN_NAV: NavGroup[] = [
  { label: "View Properties", href: "/properties" },
  { label: "List Properties", href: "/vendors" },
  { label: "Financiers", href: "/financiers" },
  { label: "Insights", href: "/insights" },
  {
    label: "Verify a title",
    href: siteConfig.registryUrl,
    verify: true,
  },
  { label: "How Afram works", href: "/how-it-works" },
];

const linkClass =
  "inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[14px] font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900 focus-visible:outline-none focus-visible:shadow-focus";
const linkActive = "bg-brand-50 text-brand-500 hover:bg-brand-50 hover:text-brand-500";

export function SiteNav({ verifyLabel = "Verify a title" }: { verifyLabel?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const signedIn = useSignedIn();
  const pathname = usePathname();
  const isCurrent = (href: string) =>
    href.startsWith("/") && (pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color] duration-200",
        scrolled
          ? "border-ink-100 border-b bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-white",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1536px] items-center justify-between gap-4 px-5 lg:px-[34px]">
        <Link href="/" aria-label="Afram home" className="shrink-0">
          <Logo className="h-6" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {signedIn
            ? SIGNED_IN_NAV.map((item) =>
                item.verify ? (
                  <VerifyTitleDialog key={item.label} className={linkClass}>
                    {verifyLabel}
                  </VerifyTitleDialog>
                ) : item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(linkClass, isCurrent(item.href) && linkActive)}
                  >
                    {item.label}
                  </Link>
                ),
              )
            : NAV.map((group) => (
                <div key={group.label} className="group relative">
                  {group.verify ? (
                    <VerifyTitleDialog className={linkClass}>{verifyLabel}</VerifyTitleDialog>
                  ) : group.external ? (
                    <a
                      href={group.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={group.hint}
                      aria-label={group.hint ? `${group.label} — ${group.hint}` : undefined}
                      className={linkClass}
                    >
                      {group.label}
                    </a>
                  ) : (
                    <Link
                      href={group.href}
                      className={cn(linkClass, isCurrent(group.href) && linkActive)}
                    >
                      {group.label}
                      {group.items && (
                        <ChevronDown className="text-ink-400 h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                      )}
                    </Link>
                  )}

                  {group.items && (
                    <div className="ease-out-soft invisible absolute top-full left-1/2 z-50 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-[opacity,transform,visibility] duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="shadow-float w-[340px] rounded-2xl bg-white p-2">
                        {group.items.map((it) => (
                          <Link
                            key={it.href}
                            href={it.href}
                            className="hover:bg-ink-50 flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors"
                          >
                            <span>
                              <span className="text-ink-900 block text-[14px] font-semibold">
                                {it.label}
                              </span>
                              <span className="text-ink-500 block text-[13px]">{it.desc}</span>
                            </span>
                          </Link>
                        ))}
                        <Link
                          href={group.href}
                          className="bg-brand-50 text-brand-500 hover:bg-brand-100 mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors"
                        >
                          Explore {group.audience ?? group.label.toLowerCase()}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
        </nav>

        {/* Right cluster */}
        <div className="hidden items-center gap-1.5 xl:flex">
          {signedIn ? (
            <Link
              href={siteConfig.appUrl ?? siteConfig.signInUrl}
              data-direct
              className={buttonClass("tinted")}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Button href={siteConfig.signUpUrl} variant="ghost" {...signUpProps}>
                {SIGN_UP_LABEL}
              </Button>
              <Button href={siteConfig.signInUrl} variant="primary">
                Log in
              </Button>
            </>
          )}
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-ink-900 hover:bg-ink-50 inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="scrim-in fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white px-5 pt-3 pb-10 xl:hidden">
          <div className="divide-ink-100 divide-y">
            {signedIn
              ? SIGNED_IN_NAV.map((item) =>
                  item.verify ? (
                    <VerifyTitleDialog
                      key={item.label}
                      className="text-ink-900 block w-full py-3 text-left text-base font-semibold"
                    >
                      {verifyLabel}
                    </VerifyTitleDialog>
                  ) : item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="text-ink-900 block py-3 text-base font-semibold"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-ink-900 block py-3 text-base font-semibold"
                    >
                      {item.label}
                    </Link>
                  ),
                )
              : NAV.map((group) => (
                  <div key={group.label} className="py-3">
                    {group.verify ? (
                      <VerifyTitleDialog className="text-ink-900 flex w-full items-center justify-between text-left text-base font-semibold">
                        {verifyLabel}
                        <ArrowRight className="text-ink-300 h-4 w-4" />
                      </VerifyTitleDialog>
                    ) : group.external ? (
                      <a
                        href={group.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={group.hint}
                        onClick={() => setOpen(false)}
                        className="text-ink-900 flex items-center justify-between text-base font-semibold"
                      >
                        {group.label}
                        <ArrowRight className="text-ink-300 h-4 w-4" />
                      </a>
                    ) : (
                      <Link
                        href={group.href}
                        onClick={() => setOpen(false)}
                        className="text-ink-900 flex items-center justify-between text-base font-semibold"
                      >
                        {group.label}
                        <ArrowRight className="text-ink-300 h-4 w-4" />
                      </Link>
                    )}
                    {group.items && (
                      <div className="mt-2 space-y-1 pl-1">
                        {group.items.map((it) => (
                          <Link
                            key={it.href}
                            href={it.href}
                            onClick={() => setOpen(false)}
                            className="text-ink-500 block py-1.5 text-[15px]"
                          >
                            {it.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            {signedIn ? (
              <Link
                href={siteConfig.appUrl ?? siteConfig.signInUrl}
                data-direct
                onClick={() => setOpen(false)}
                className={buttonClass("tinted", "lg", "w-full")}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Button href={siteConfig.signInUrl} size="lg" className="w-full">
                  Log in
                </Button>
                <Link
                  href={siteConfig.signUpUrl}
                  {...signUpProps}
                  onClick={() => setOpen(false)}
                  className={buttonClass("tinted", "lg", "w-full")}
                >
                  {SIGN_UP_LABEL}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

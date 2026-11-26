import Link from "next/link";
import { SecBadge } from "@/components/ui/SecBadge";
import { CookieSettingsButton } from "@/components/shell/CookieConsent";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import type { FooterContent } from "@/features/landing/data/footer";

const COMPANY = [
  { label: "Home", href: "/" },
  { label: "Browse properties", href: "/properties" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Insights", href: "/insights" },
  { label: "Fees", href: "/fees" },
  { label: "About", href: "/about" },
  { label: "Help", href: "/help" },
];

const SOCIAL = [
  { label: "Facebook", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "TikTok", href: "#" },
];

const LEGAL = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
];

/** Sanity's `footer` singleton can override any of the copy and link lists. */
export function SiteFooter({ content }: { content?: FooterContent | null }) {
  const company = content?.companyLinks ?? COMPANY;
  const social = content?.socialLinks ?? SOCIAL;
  const legal = content?.legalLinks ?? LEGAL;
  return (
    <footer>
      {/* Light top */}
      <div className="border-ink-100 border-t bg-white">
        <div className="mx-auto max-w-[1536px] px-5 py-10 sm:py-12 lg:px-[34px] lg:py-16">
          {/* brand row */}
          <div className="border-ink-100 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-8 lg:pb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Logo className="h-7" />
              <SecBadge />
            </div>
          </div>

          {/* columns */}
          <div className="mt-8 grid gap-6 sm:gap-8 lg:mt-12 lg:grid-cols-[1fr_1fr_1.6fr] lg:gap-10">
            <div>
              <h3 className="t-overline text-ink-400">Company</h3>
              <ul className="mt-4 space-y-2.5">
                {company.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-ink-600 hover:text-brand-500 text-[14px] font-medium transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="t-overline text-ink-400">Follow us</h3>
              <ul className="mt-4 space-y-2.5">
                {social.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-ink-600 hover:text-brand-500 text-[14px] font-medium transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="t-h4 text-ink-900">
                {content?.newsletterHeading ?? "Be the first to know."}
              </h3>
              <p className="text-ink-500 mt-2 max-w-md text-[14px] leading-relaxed">
                {content?.newsletterBody ??
                  "Stay ahead in real estate. Get updates, expert tips, and insider insights delivered monthly."}
              </p>
              <div className="mt-4 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark teal bottom bar */}
      <div className="bg-deep-950 text-white/75">
        <div className="mx-auto flex max-w-[1536px] flex-col gap-3 px-5 py-5 text-[13px] sm:flex-row sm:items-center sm:justify-between lg:px-[34px]">
          <p>
            {content?.copyrightTemplate?.replace("{year}", String(new Date().getFullYear())) ??
              "© 2026 Afram Technologies. All rights reserved."}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {legal.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
            <CookieSettingsButton className="transition-colors hover:text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}

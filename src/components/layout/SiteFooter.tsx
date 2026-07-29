import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { PolygonWordmark } from "@/components/PolygonWordmark";
import { FOOTER_COMPANY_LINKS, FOOTER_LEGAL_LINKS, FOOTER_SOCIAL_LINKS } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="border-ink-100 border-t bg-white">
        <div className="mx-auto max-w-[1536px] px-6 py-14 sm:px-8 lg:px-16 lg:py-16">
          <div className="border-ink-100 flex flex-col gap-5 border-b pb-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Image
                src="/afram-logo-dark.svg"
                alt="Afram"
                width={110}
                height={32}
                className="h-8 w-auto"
              />
              <p className="text-ink-400 mt-2 text-[13px]">{siteConfig.tagline}</p>
            </div>
            <span className="text-ink-400 inline-flex items-center gap-2 text-[13px] font-medium">
              POWERED BY
              <PolygonWordmark className="h-[13px] w-auto text-[#002D30]" />
            </span>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr_1.6fr]">
            <div>
              <h2 className="text-ink-900 text-[13px] font-bold tracking-[0.1em] uppercase">
                Company
              </h2>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-ink-500 hover:text-brand-600 text-[15px] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-ink-900 text-[13px] font-bold tracking-[0.1em] uppercase">
                Follow us
              </h2>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-ink-500 hover:text-brand-600 text-[15px] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-ink-900 text-[18px] font-bold tracking-[-0.01em]">
                Be the first to know.
              </h2>
              <p className="text-ink-500 mt-2 max-w-md text-[14px] leading-relaxed">
                Stay ahead in real estate. Get updates, expert tips, and insider insights delivered
                monthly.
              </p>
              <div className="mt-4 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-700 text-white/80">
        <div className="mx-auto flex max-w-[1536px] flex-col gap-3 px-6 py-5 text-[13px] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-16">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

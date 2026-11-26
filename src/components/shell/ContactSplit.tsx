import type { ReactNode } from "react";
import { Mail, MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { BookingWidget } from "@/components/shell/BookingWidget";
import { cn } from "@/lib/utils";

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-200 ring-1 ring-white/10">
        {icon}
      </span>
      <span>
        <span className="block text-[12px] text-white/50">{label}</span>
        <span className="block text-[15px] font-semibold text-white transition-colors group-hover:text-brand-200">
          {value}
        </span>
      </span>
    </>
  );
  if (!href) {
    return <li className="-mx-2 flex items-center gap-3.5 p-2">{inner}</li>;
  }
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group -mx-2 flex items-center gap-3.5 rounded-xl p-2 transition-colors hover:bg-white/5"
      >
        {inner}
      </a>
    </li>
  );
}

/**
 * The shared "contact us" section — a dark teal split card with the universal
 * Afram contact methods on the left and a message form on the right. Copy and
 * form topics are passed per page; the contact details and layout stay
 * consistent across the site.
 */
export function ContactSplit({
  id,
  eyebrow = "Get in touch",
  title,
  subtitle,
  formTitle = "Send us a message",
  formSubtitle = "Leave your details and what it’s about. A real person will get back to you.",
  topics,
  cta = "Send a message",
  showContacts = true,
  simpleForm = false,
  className,
}: {
  id?: string;
  /** null leaves the label out (the vendor and financier pages). */
  eyebrow?: string | null;
  title: string;
  subtitle: string;
  formTitle?: string;
  formSubtitle?: string;
  topics?: string[];
  cta?: string;
  /** false hides the phone / WhatsApp / email / address rows. */
  showContacts?: boolean;
  simpleForm?: boolean;
  className?: string;
}) {
  return (
    <Section id={id} className={cn("scroll-mt-24 bg-white", className)}>
      <div className="overflow-hidden rounded-3xl shadow-modal ring-1 ring-ink-100 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left — dark teal contact panel */}
        <div className="relative overflow-hidden bg-brand-950 p-8 sm:p-10 lg:p-12">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            {eyebrow && (
              <span className="mb-4 inline-flex items-center gap-2 t-overline text-brand-200">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
                {eyebrow}
              </span>
            )}
            <h2 className="t-h2 text-white">
              {title}
            </h2>
            <p className="mt-4 max-w-sm t-lead text-white/70">
              {subtitle}
            </p>

            {showContacts && (
            <ul className="mt-8 space-y-1.5">
              <ContactRow
                icon={<Phone className="h-4 w-4" />}
                label="Call us"
                value="+233 24 545 2066"
                href="tel:+233245452066"
              />
              <ContactRow
                icon={<MessageCircle className="h-4 w-4" />}
                label="WhatsApp"
                value="Chat on WhatsApp"
                href="https://wa.me/233245452066"
                external
              />
              <ContactRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value="support@afram.co"
                href="mailto:support@afram.co"
              />
              <ContactRow
                icon={<MapPin className="h-4 w-4" />}
                label="Where we are"
                value="Accra, Ghana"
              />
            </ul>
            )}

            <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
              <Clock className="h-4 w-4 text-brand-200" />
              <span className="text-[13px] font-medium text-white/80">
                Typically replies within 1 business day
              </span>
            </div>
          </div>
        </div>

        {/* Right — message form */}
        <div className="bg-white p-8 sm:p-10 lg:p-12">
          <h3 className="t-h4 text-ink-900">
            {formTitle}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
            {formSubtitle}
          </p>
          <div className="mt-6">
            <BookingWidget topics={topics} cta={cta} simple={simpleForm} />
          </div>
        </div>
      </div>
    </Section>
  );
}

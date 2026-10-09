"use client";

import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { ReactNode } from "react";
import { useActionState } from "react";

import { sendContactMessage, type ContactFormState } from "@/features/contact/actions";
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
      <span className="text-brand-200 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
        {icon}
      </span>
      <span>
        <span className="block text-[12px] text-white/50">{label}</span>
        <span className="group-hover:text-brand-200 block text-[15px] font-semibold text-white transition-colors">
          {value}
        </span>
      </span>
    </>
  );
  if (!href) return <li className="flex items-center gap-3.5 p-2">{inner}</li>;
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

const fieldClass =
  "h-12 w-full rounded-xl bg-brand-50 px-4 text-[15px] text-ink-900 ring-1 ring-brand-100 transition placeholder:text-ink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400";

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-ink-600 mb-1.5 block text-[13px] font-medium">{children}</span>;
}

/**
 * Sends through the API's contactUs mutation (see features/contact/actions).
 * `simple` drops the phone field and the WhatsApp line, as on the vendors
 * page's "Talk to us".
 */
function MessageForm({
  topics = ["Book a site visit", "Talk to a partner", "Speak to a lawyer"],
  cta,
  simple,
}: {
  topics?: string[];
  cta: string;
  simple: boolean;
}) {
  const [state, action, pending] = useActionState<ContactFormState, FormData>(sendContactMessage, {
    status: "idle",
  });

  if (state.status === "sent") {
    return (
      <div
        role="status"
        className="bg-brand-50 text-brand-700 flex items-center gap-2.5 rounded-2xl px-5 py-5 text-[15px] font-medium"
      >
        <CheckCircle2 className="h-5 w-5" />
        Thanks — your message is in. We&apos;ll reply within one business day.
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <FieldLabel>{simple ? "Full name" : "Your name"}</FieldLabel>
          <input
            name="name"
            required
            placeholder="Ama Mensah"
            autoComplete="name"
            maxLength={120}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <FieldLabel>{simple ? "Email address" : "Email"}</FieldLabel>
          <input
            name="email"
            type="email"
            required
            placeholder="ama@email.com"
            autoComplete="email"
            maxLength={200}
            className={fieldClass}
          />
        </label>
      </div>

      <div className={cn("grid gap-4", !simple && "sm:grid-cols-2")}>
        {!simple && (
          <label className="block">
            <FieldLabel>Phone (optional)</FieldLabel>
            <input
              name="phone"
              inputMode="tel"
              placeholder="024 000 0000"
              autoComplete="tel"
              maxLength={40}
              className={fieldClass}
            />
          </label>
        )}
        <label className="block">
          <FieldLabel>{simple ? "Topic" : "What is it about?"}</FieldLabel>
          <div className="relative">
            <select name="topic" className={cn(fieldClass, "appearance-none pr-10")}>
              {topics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
            <ChevronDown className="text-ink-400 pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2" />
          </div>
        </label>
      </div>

      <label className="block">
        <FieldLabel>Message</FieldLabel>
        <textarea
          name="message"
          rows={4}
          maxLength={5000}
          placeholder="Tell us a little about what you need…"
          className={cn(fieldClass, "h-auto min-h-[120px] resize-none py-3 leading-relaxed")}
        />
      </label>

      {/* Spam trap — hidden from people, filled in by bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      {state.status === "error" && (
        <p role="alert" className="text-[13px] font-medium text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-accent-500 hover:bg-accent-600 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-all active:scale-[0.99] disabled:opacity-70"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : cta}
      </button>

      <p className="text-ink-400 text-[12px] leading-relaxed">
        We will never share your details.
        {!simple && " Prefer WhatsApp? Mention it and we will message you there."}
      </p>
    </form>
  );
}

export function ContactSplit({
  eyebrow = "Get in touch",
  title,
  subtitle,
  formTitle = "Send us a message",
  formSubtitle = "Leave your details and what it's about. A real person will get back to you.",
  topics,
  cta = "Send a message",
  showContacts = true,
  simpleForm = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  formTitle?: string;
  formSubtitle?: string;
  topics?: string[];
  cta?: string;
  /** false hides the phone / WhatsApp / email / address rows. */
  showContacts?: boolean;
  /** Name, email, topic and message only — no phone, no WhatsApp line. */
  simpleForm?: boolean;
}) {
  return (
    <div className="ring-ink-100 -mx-2 overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-50px_rgba(0,45,48,0.45)] ring-1 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <div className="bg-brand-950 relative overflow-hidden p-4 sm:p-10 lg:p-12">
        <div
          className="bg-brand-500/20 pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <span className="text-brand-200 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] uppercase">
            <span className="bg-brand-300 h-1.5 w-1.5 rounded-full" />
            {eyebrow}
          </span>
          <h2 className="mt-4 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.18] font-bold tracking-[-0.02em] text-white">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-white/70">{subtitle}</p>

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
            <Clock className="text-brand-200 h-4 w-4" />
            <span className="text-[13px] font-medium text-white/80">
              Typically replies within 1 business day
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-10 lg:p-12">
        <h3 className="text-ink-900 text-xl font-bold tracking-[-0.01em]">{formTitle}</h3>
        <p className="text-ink-500 mt-2 text-[15px] leading-relaxed">{formSubtitle}</p>
        <div className="mt-6">
          <MessageForm topics={topics} cta={cta} simple={simpleForm} />
        </div>
      </div>
    </div>
  );
}

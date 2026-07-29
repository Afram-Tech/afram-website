import { ArrowRight, CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

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

function MessageForm({ topics, cta }: { topics?: string[]; cta: string }) {
  const [done, setDone] = useState(false);
  const inputClass =
    "h-12 w-full rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none";

  if (done) {
    return (
      <div className="bg-brand-50 text-brand-700 flex items-center gap-2.5 rounded-2xl px-5 py-5 text-[15px] font-medium">
        <CheckCircle2 className="h-5 w-5" />
        Thanks — your message is in. We&apos;ll reply within one business day.
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={inputClass} placeholder="Full name" aria-label="Full name" required />
        <input
          className={inputClass}
          type="email"
          placeholder="Email address"
          aria-label="Email"
          required
        />
      </div>
      {topics && topics.length > 0 ? (
        <select
          className={cn(inputClass, "appearance-none")}
          aria-label="Topic"
          defaultValue={topics[0]}
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      ) : null}
      <textarea
        className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 min-h-[120px] w-full rounded-xl border bg-white px-4 py-3 text-[15px] focus:outline-none"
        placeholder="How can we help?"
        aria-label="Message"
        required
      />
      <button
        type="submit"
        className="bg-brand-500 hover:bg-brand-600 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full px-6 text-[15px] font-semibold text-white transition-all active:scale-[0.98] sm:w-auto"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </button>
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
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  formTitle?: string;
  formSubtitle?: string;
  topics?: string[];
  cta?: string;
}) {
  return (
    <div className="ring-ink-100 overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-50px_rgba(0,45,48,0.45)] ring-1 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <div className="bg-brand-950 relative overflow-hidden p-8 sm:p-10 lg:p-12">
        <div
          className="bg-brand-500/20 pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <span className="text-brand-200 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] uppercase">
            <span className="bg-brand-300 h-1.5 w-1.5 rounded-full" />
            {eyebrow}
          </span>
          <h2 className="mt-5 text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.06] font-bold tracking-[-0.02em] text-white">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-white/70">{subtitle}</p>

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
          <MessageForm topics={topics} cta={cta} />
        </div>
      </div>
    </div>
  );
}

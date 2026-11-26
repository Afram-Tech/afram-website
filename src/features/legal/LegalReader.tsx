"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BarChart3, CalendarDays, Check, ChevronDown, Clock3, Gauge, Link2, ListOrdered, Lock,
  Mail, MapPin, Megaphone, MessageCircle, Phone, Printer, Puzzle, Scale, ShieldCheck, SlidersHorizontal,
} from "lucide-react";
import {
  LEGAL_CONTACT, readingMinutes,
  type LegalBlock, type LegalDocument, type LegalIcon, type LegalItem,
} from "@/lib/data/legal-documents";
import { cn } from "@/lib/utils";

const ICONS: Record<LegalIcon, typeof Lock> = {
  lock: Lock, gauge: Gauge, sliders: SlidersHorizontal, chart: BarChart3, megaphone: Megaphone, puzzle: Puzzle,
};

const effectiveLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * A legal document laid out for reading: a calm header with the facts that
 * matter (when it took effect, how long it takes to read), a table of contents
 * that follows you down the page, numbered sections, and print/save as PDF.
 * The words come from Legal untouched (lib/data/legal-documents.ts).
 */
export function LegalReader({
  doc,
  nav,
  related,
}: {
  doc: LegalDocument;
  /** The legal pages sub-nav, rendered by the page. */
  nav: React.ReactNode;
  /** The other policy, offered at the end. */
  related?: { title: string; href: string };
}) {
  const [active, setActive] = useState(doc.sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const minutes = readingMinutes(doc);
  const effective = effectiveLabel(doc.effective);

  // How far through the document they are, and which section they're in.
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight * 0.6;
      setProgress(Math.min(1, Math.max(0, (window.innerHeight * 0.4 - r.top) / Math.max(1, span))));
      // The last section whose heading has reached the pinned menu; once the
      // document's end is on screen, the last section (it can't scroll that high).
      let current = 0;
      doc.sections.forEach((s, i) => {
        const top = document.getElementById(s.id)?.getBoundingClientRect().top ?? Infinity;
        if (top <= 170) current = i;
      });
      if (r.bottom <= window.innerHeight) current = doc.sections.length - 1;
      setActive(doc.sections[current]?.id ?? "");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [doc]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* Clipboard blocked: the address bar still has it. */ }
  };

  return (
    <>
      {/* Reading progress, under the sticky nav */}
      <div aria-hidden="true" data-print="hide" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div className="h-full origin-left bg-brand-500 transition-transform duration-150" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* Header */}
      <div className="relative overflow-hidden bg-[radial-gradient(120%_120%_at_0%_0%,#ffffff_0%,#eefafa_48%,#dcf3f4_100%)] print:bg-none">
        <IsoPattern className="[mask-image:linear-gradient(90deg,transparent_20%,black_90%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-[8%] -top-[40%] h-[150%] w-[45%] rounded-full bg-[#0eaabb] opacity-[0.12] blur-[90px]" />
        <div className="relative mx-auto max-w-[1180px] px-5 pb-12 pt-8 sm:pb-14 lg:px-[34px] lg:pb-16 lg:pt-10">
          <div data-print="hide">{nav}</div>
          <p className="mt-9 inline-flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-1.5 text-[13px] font-semibold text-brand-700 ring-1 ring-brand-100 lg:mt-12">
            <ShieldCheck className="h-4 w-4" strokeWidth={2} /> Afram legal
          </p>
          <h1 className="mt-4 t-h1-sm text-ink-900">{doc.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-ink-600">
            <Meta icon={<CalendarDays className="h-4 w-4" />}>Effective <b className="font-semibold text-ink-900">{effective}</b></Meta>
            <Meta icon={<Clock3 className="h-4 w-4" />}><span className="tnum">{minutes}</span> min read</Meta>
            <Meta icon={<ListOrdered className="h-4 w-4" />}><span className="tnum">{doc.sections.length}</span> sections</Meta>
            <Meta icon={<Scale className="h-4 w-4" />}>Data Protection Act (Act 843)</Meta>
          </div>
          <div data-print="hide" className="mt-7 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-primary inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
            >
              <Printer className="h-4 w-4" /> Print or save as PDF
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="btn-secondary inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
            >
              {copied ? <Check className="h-4 w-4 text-brand-500" /> : <Link2 className="h-4 w-4" />}
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>
      </div>

      {/* Contents and the document */}
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 pb-20 pt-10 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-16 lg:px-[34px] lg:pt-14">
        {/* Pinned under the site nav: a one-line jump menu on phones, the full contents on desktop. */}
        <aside data-print="hide" className="sticky top-[72px] z-30 -mx-5 -mt-3 bg-white/90 px-5 py-3 backdrop-blur-md lg:top-[104px] lg:z-auto lg:mx-0 lg:mt-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <Contents doc={doc} active={active} progress={progress} />
          <Link
            href="/help#message"
            className="mt-5 hidden items-center gap-3 rounded-[20px] bg-brand-50 px-4 py-4 ring-1 ring-brand-100 transition-colors hover:bg-brand-100/60 lg:flex"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-500 ring-1 ring-brand-100">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span className="text-[14px] leading-snug text-ink-700">
              Questions about this policy?
              <span className="mt-0.5 flex items-center gap-1 font-semibold text-brand-700">Message the team <ArrowRight className="h-3.5 w-3.5" /></span>
            </span>
          </Link>
        </aside>

        <div ref={articleRef} className="min-w-0 max-w-[760px]">
          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="group scroll-mt-[160px] lg:scroll-mt-[104px] border-t border-ink-100 pb-2 pt-10 first:border-t-0 first:pt-0">
              <div className="flex items-baseline gap-3.5">
                <span className="tnum shrink-0 text-[13px] font-bold tracking-[0.04em] text-brand-500">{String(i + 1).padStart(2, "0")}</span>
                <h2 id={`${s.id}-title`} className="t-h3 text-ink-900">
                  {s.title}
                  <a href={`#${s.id}`} data-print="hide" aria-label={`Link to ${s.title}`} className="ml-2 align-middle text-[0.8em] font-medium text-ink-300 opacity-0 transition-opacity hover:text-brand-500 focus:opacity-100 group-hover:opacity-100">#</a>
                </h2>
              </div>
              <div className="mt-1">
                <Blocks blocks={s.blocks} />
              </div>
            </section>
          ))}

          <div className="mt-12 flex flex-col gap-4 rounded-3xl bg-ink-50 px-6 py-6 ring-1 ring-ink-100 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] leading-relaxed text-ink-600">
              This {doc.title} takes effect from <b className="font-semibold text-ink-900">{effective}</b>.
            </p>
            {related && (
              <Link data-print="hide" href={related.href} className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold text-brand-500 hover:text-brand-700">
                Read the {related.title} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-brand-500">{icon}</span>
      <span>{children}</span>
    </span>
  );
}

function Contents({ doc, active, progress }: { doc: LegalDocument; active: string; progress: number }) {
  const [open, setOpen] = useState(false);
  const current = doc.sections.find((s) => s.id === active);
  const list = (
    <ol className="flex flex-col gap-0.5">
      {doc.sections.map((s, i) => {
        const on = s.id === active;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              aria-current={on ? "location" : undefined}
              className={cn(
                "relative flex gap-3 rounded-xl px-3 py-2 text-[14px] leading-snug transition-colors",
                on ? "bg-white font-semibold text-ink-900 shadow-raised ring-1 ring-ink-100" : "text-ink-500 hover:text-ink-900",
              )}
            >
              <span className={cn("tnum w-5 shrink-0 text-[12px] font-semibold", on ? "text-brand-500" : "text-ink-300")}>{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <nav aria-label="On this page" className="rounded-[20px] bg-ink-50/70 p-2.5 ring-1 ring-ink-100 lg:bg-ink-50/60">
      {/* Phones: one line that opens */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left lg:hidden"
      >
        <span className="min-w-0">
          <span className="block t-overline text-ink-400">On this page</span>
          <span className="mt-0.5 block truncate text-[14px] font-semibold text-ink-900">{current?.title}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink-400 transition-transform", open && "rotate-180")} />
      </button>
      <div className={cn("max-h-[55vh] overflow-y-auto lg:block lg:max-h-none lg:overflow-visible", open ? "mt-1 block" : "hidden")}>
        <div className="hidden items-center justify-between px-3 pb-2 pt-1.5 lg:flex">
          <span className="t-overline text-ink-400">On this page</span>
          <span className="tnum text-[12px] font-semibold text-ink-400">{Math.round(progress * 100)}%</span>
        </div>
        {list}
      </div>
    </nav>
  );
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "p":
            return <p key={i} className="mt-4 text-[16px] leading-[1.75] text-ink-600">{b.text}</p>;
          case "h3":
            return <h3 key={i} className="mt-9 t-h4 text-ink-900">{b.text}</h3>;
          case "label":
            return <p key={i} className="mt-6 t-overline text-brand-700">{b.text.replace(/:$/, "")}</p>;
          case "list":
            return b.ordered ? <Steps key={i} items={b.items} /> : <Bullets key={i} items={b.items} />;
          case "cards":
            return (
              <div key={i} className="mt-6 grid gap-3 sm:grid-cols-2">
                {b.items.map((c, j) => {
                  const Icon = c.icon ? ICONS[c.icon] : null;
                  return (
                    <div key={c.title} className="break-inside-avoid rounded-[1.1rem] bg-white p-5 ring-1 ring-ink-100 transition-shadow hover:shadow-raised">
                      <div className="flex items-center gap-3">
                        {Icon ? (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500"><Icon className="h-[18px] w-[18px]" /></span>
                        ) : (
                          <span className="tnum flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 px-1.5 text-[12px] font-bold text-brand-600">{String(j + 1).padStart(2, "0")}</span>
                        )}
                        <h3 className="text-[15px] font-semibold leading-snug text-ink-900">{c.title}</h3>
                      </div>
                      <p className="mt-3 text-[14px] leading-[1.65] text-ink-500">{c.text}</p>
                    </div>
                  );
                })}
              </div>
            );
          case "group":
            return (
              <div key={i} className="mt-6 break-inside-avoid rounded-[20px] bg-ink-50/60 px-5 py-5 ring-1 ring-ink-100 sm:px-6 sm:py-6">
                <h3 className="t-h4 text-ink-900">{b.title}</h3>
                <div className="[&>*:first-child]:mt-3"><Blocks blocks={b.blocks} /></div>
              </div>
            );
          case "contact":
            return <ContactCard key={i} />;
        }
      })}
    </>
  );
}

function ItemText({ item }: { item: LegalItem }) {
  if (!item.label) return <>{item.text}</>;
  return item.text ? <><b className="font-semibold text-ink-900">{item.label}:</b> {item.text}</> : <b className="font-semibold text-ink-900">{item.label}</b>;
}

function Bullets({ items }: { items: LegalItem[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3.5 text-[16px] leading-[1.7] text-ink-600">
          <span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
          <span><ItemText item={it} /></span>
        </li>
      ))}
    </ul>
  );
}

function Steps({ items }: { items: LegalItem[] }) {
  return (
    <ol className="mt-3 flex flex-col gap-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-[1.6] text-ink-700">
          <span className="tnum mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-bold text-brand-600 ring-1 ring-brand-100">{i + 1}</span>
          <span><ItemText item={it} /></span>
        </li>
      ))}
    </ol>
  );
}

function ContactCard() {
  const { address, email, phone } = LEGAL_CONTACT;
  return (
    <div className="mt-5 grid break-inside-avoid gap-px overflow-hidden rounded-[20px] bg-ink-100 ring-1 ring-ink-100 sm:grid-cols-2">
      <ContactRow icon={<MapPin className="h-4 w-4" />} label="Address">{address}</ContactRow>
      {email && <ContactRow icon={<Mail className="h-4 w-4" />} label="Email"><a href={`mailto:${email}`} className="text-brand-500 hover:text-brand-700">{email}</a></ContactRow>}
      {phone && <ContactRow icon={<Phone className="h-4 w-4" />} label="Phone"><a href={`tel:${phone.replace(/\s/g, "")}`} className="text-brand-500 hover:text-brand-700">{phone}</a></ContactRow>}
      <ContactRow icon={<MessageCircle className="h-4 w-4" />} label="Contact form">
        <Link href="/help#message" className="inline-flex items-center gap-1 font-semibold text-brand-500 hover:text-brand-700">
          Message us on the Help page <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </ContactRow>
    </div>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5 bg-white px-5 py-4">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">{icon}</span>
      <div className="min-w-0">
        <p className="t-overline text-ink-400">{label}</p>
        <div className="mt-1 text-[14px] leading-relaxed text-ink-700">{children}</div>
      </div>
    </div>
  );
}

/* The welcome screen's isometric diamond grid, as on Help. */
function IsoPattern({ className = "" }: { className?: string }) {
  const id = `iso-${useId().replace(/:/g, "")}`;
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full print:hidden", className)} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} width="40" height="23.09" patternUnits="userSpaceOnUse">
          <path d="M0 11.545 L20 0 L40 11.545 L20 23.09 Z M20 0 V23.09" fill="none" stroke="#007481" strokeOpacity={0.08} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

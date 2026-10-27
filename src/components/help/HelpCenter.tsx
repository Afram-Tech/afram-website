"use client";

import { ChevronDown, Search } from "lucide-react";
import { useCallback, useId, useMemo, useState, useSyncExternalStore } from "react";

import { ReportIssueForm } from "@/components/help/ReportIssueForm";
import { TrackRequest } from "@/components/help/TrackRequest";
import type { HelpGroup } from "@/features/help/faqs";
import { cn } from "@/lib/utils";

/* Mirrors the Exchange's support hours (its supportConfig.ts). */
const HOURS_LABEL = "Mon to Sat, 8am to 8pm";
/** Ghana runs on GMT all year, so UTC is local time. */
const isOnline = (now: Date) =>
  now.getUTCDay() !== 0 && now.getUTCHours() >= 8 && now.getUTCHours() < 20;

/**
 * The website's Help: a search over the answers, the answers themselves, and
 * beside them a message to the team plus a way to check on one already sent.
 */
export function HelpCenter({ groups }: { groups: HelpGroup[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(groups[0]?.items[0]?.q ?? null);
  const [sent, setSent] = useState({ reference: "", email: "" });
  const [formKey, setFormKey] = useState(0);

  const words = useMemo(
    () =>
      query
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 1),
    [query],
  );
  const shown = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            words.every((word) => `${item.q} ${item.a}`.toLowerCase().includes(word)),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [groups, words],
  );
  const onSent = useCallback(
    (reference: string, email: string) => setSent({ reference, email }),
    [],
  );

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,#ffffff_0%,#eefafa_50%,#dcf3f4_100%)] px-5 pt-14 pb-14 text-center sm:pt-16 sm:pb-16">
        <IsoPattern className="[mask-image:radial-gradient(70%_90%_at_50%_0%,black_0%,transparent_80%)]" />
        <div className="relative mx-auto flex max-w-[680px] flex-col items-center gap-4">
          <SupportStatus />
          <h1 className="text-ink-900 text-[clamp(2rem,4.4vw,2.85rem)] leading-[1.12] font-bold tracking-[-0.025em]">
            How can we help?
          </h1>
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              document
                .getElementById("answers")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="ring-ink-200 focus-within:ring-brand-400 flex h-14 w-full items-center gap-2.5 rounded-full bg-white pr-1.5 pl-5 shadow-[0_16px_40px_-24px_rgba(0,69,77,0.45)] ring-1 focus-within:ring-2"
          >
            <Search className="text-ink-400 h-5 w-5 shrink-0" />
            <label htmlFor="help-search" className="sr-only">
              Search help
            </label>
            <input
              id="help-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={'Try "how do I get access"'}
              className="text-ink-900 placeholder:text-ink-400 min-w-0 flex-1 bg-transparent text-[15px] outline-none"
            />
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 hidden h-11 shrink-0 rounded-full px-5 text-[14px] font-semibold text-white transition-colors sm:block"
            >
              Search
            </button>
          </form>
          {/* On phones the message sits below every answer, so point to it. */}
          <a href="#message" className="text-brand-500 text-[14px] font-semibold lg:hidden">
            Can&apos;t find it? Message us
          </a>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-12 lg:px-[34px] lg:py-16">
        <div id="answers" className="flex scroll-mt-28 flex-col gap-9">
          {shown.length === 0 ? (
            <div className="ring-ink-100 rounded-[1.25rem] bg-white px-6 py-8 text-center ring-1">
              <p className="text-ink-900 text-[16px] font-semibold">
                No answers match “{query.trim()}”
              </p>
              <p className="text-ink-500 mt-1.5 text-[14.5px]">
                Try other words, or send us a message and we&apos;ll help.
              </p>
              <a
                href="#message"
                className="bg-brand-500 hover:bg-brand-600 mt-4 inline-flex h-10 items-center rounded-full px-5 text-[14px] font-semibold text-white"
              >
                Message us
              </a>
            </div>
          ) : (
            shown.map((group) => (
              <div key={group.label}>
                <h2 className="text-ink-900 mb-3 text-[18px] font-bold tracking-[-0.01em]">
                  {group.label}
                </h2>
                <div className="divide-ink-100 ring-ink-100 divide-y overflow-hidden rounded-[1.25rem] bg-white ring-1">
                  {group.items.map((item) => {
                    // While searching, every match is open.
                    const isOpen = open === item.q || words.length > 0;
                    return (
                      <div key={item.q}>
                        <button
                          type="button"
                          onClick={() => setOpen(open === item.q ? null : item.q)}
                          aria-expanded={isOpen}
                          className="hover:bg-ink-50/60 flex w-full items-center justify-between gap-4 px-5 py-[18px] text-left transition-colors"
                        >
                          <span className="text-ink-900 text-[15.5px] font-semibold">{item.q}</span>
                          <ChevronDown
                            className={cn(
                              "text-ink-400 h-4 w-4 shrink-0 transition-transform",
                              isOpen && "text-brand-500 rotate-180",
                            )}
                          />
                        </button>
                        {isOpen && (
                          <p className="text-ink-500 px-5 pb-5 text-[14.5px] leading-relaxed">
                            {item.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-28">
          <section
            id="message"
            aria-labelledby="message-title"
            className="ring-ink-100 scroll-mt-28 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_-30px_rgba(0,69,77,0.45)] ring-1"
          >
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#007481_0%,#00454d_100%)] px-6 py-5 text-white">
              <IsoPattern color="#ffffff" opacity={0.08} />
              <p className="text-brand-200 relative text-[12.5px] font-semibold">Afram Support</p>
              <h2 id="message-title" className="relative mt-1 text-[19px] font-bold">
                Message us
              </h2>
              <p className="relative mt-1 text-[13px] text-white/75">{HOURS_LABEL}, Ghana time</p>
            </div>
            <div className="flex flex-col gap-3 bg-[#fbfcfc] px-5 pt-5 pb-5 sm:px-6">
              <div className="text-ink-900 ring-ink-100 max-w-[88%] self-start rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[14px] leading-relaxed ring-1">
                Hi there. Tell us what&apos;s happening and we&apos;ll take it from here.
              </div>
              <ReportIssueForm
                key={formKey}
                onSent={onSent}
                onAgain={() => setFormKey((key) => key + 1)}
              />
            </div>
          </section>

          {/* Keyed, so a message just sent starts it afresh with its own reference. */}
          <TrackRequest key={sent.reference} initial={sent.reference} initialEmail={sent.email} />
        </aside>
      </div>
    </>
  );
}

const noSubscribe = () => () => {};

function SupportStatus() {
  // Null on the server, so its clock never decides it; the browser works it out.
  const online = useSyncExternalStore(
    noSubscribe,
    () => isOnline(new Date()),
    () => null,
  );

  return (
    <span className="text-ink-700 ring-brand-100 inline-flex h-[30px] items-center gap-2 rounded-full bg-white px-3.5 text-[12.5px] font-semibold ring-1">
      <span
        className={cn("h-[7px] w-[7px] rounded-full", online ? "bg-emerald-500" : "bg-ink-300")}
        aria-hidden="true"
      />
      {online === null
        ? HOURS_LABEL
        : online
          ? `Team online · ${HOURS_LABEL}`
          : `Team away · back ${HOURS_LABEL}`}
    </span>
  );
}

/* The welcome screen's isometric diamond grid, as on the Exchange's Help. */
function IsoPattern({
  color = "#007481",
  opacity = 0.08,
  className,
}: {
  color?: string;
  opacity?: number;
  className?: string;
}) {
  const id = `iso-${useId().replace(/:/g, "")}`;
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} width="40" height="23.09" patternUnits="userSpaceOnUse">
          <path
            d="M0 11.545 L20 0 L40 11.545 L20 23.09 Z M20 0 V23.09"
            fill="none"
            stroke={color}
            strokeOpacity={opacity}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

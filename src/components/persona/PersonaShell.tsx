import type { CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { DuotonePhoto } from "@/components/ui/DuotonePhoto";
import { PHOTOS } from "@/lib/data/photos";
import { ACCENT_VARS, type AccentKey } from "@/lib/data/persona-accents";
import { PersonaHero } from "@/components/persona/PersonaHero";
import { PersonaScroller, type ScrollItem } from "@/components/persona/PersonaScroller";
import { PersonaSwitcher, type SwitchItem } from "@/components/persona/PersonaSwitcher";
import { PersonaFaq } from "@/components/persona/PersonaFaq";
import { PersonaAnswers } from "@/components/persona/PersonaAnswers";
import type { PersonaContent, Cta } from "@/lib/data/persona";

export function PersonaShell({
  personas,
  order,
  hero,
  primary,
  secondary,
  heroSlot,
  accent,
  layout = "scroller",
  faqTitleSuffix = "ask…",
  riskKind = "investment",
  finalCta,
  closingSlot,
  leadSlot,
  compact = false,
  footerSlot,
  answersTitle,
  children,
}: {
  personas: Record<string, PersonaContent>;
  order: string[];
  /** retained for API compatibility */
  defaultId?: string;
  /** ignored when `heroSlot` is provided */
  hero?: { headline: ReactNode; subhead: string };
  primary?: Cta;
  secondary?: Cta;
  /** overrides the built-in gradient-card hero entirely (e.g. `PersonaHeroPhoto`) */
  heroSlot?: ReactNode;
  accent: AccentKey;
  /**
   * "scroller" stacks every audience down the page. "switcher" shows one at a
   * time behind a toggle — the conversion layout for /vendors and
   * /financiers. /invest still uses the scroller.
   */
  /** "none" leaves the audience panel out; the page tells its own story. */
  layout?: "scroller" | "switcher" | "none";
  faqTitleSuffix?: string;
  riskKind?: "investment" | "lending";
  /** The closing photo band. Optional: /vendors has none. */
  finalCta?: { title: string; subtitle: string; primary: Cta; secondary?: Cta };
  /** Rendered after the FAQ, so the contact form sits next to the end of
   *  the page, followed only by the closing band or the quick links. */
  closingSlot?: ReactNode;
  /** Rendered between the hero and the audience panel. */
  leadSlot?: ReactNode;
  /** Tighter space between sections (/vendors, /financiers). */
  compact?: boolean;
  /** Rendered after the closing CTA — for low-priority secondary links. */
  footerSlot?: ReactNode;
  /** Switcher layout only: move each audience's cards out of the panel to a
   *  section with this title, just above the FAQ. */
  answersTitle?: string;
  children: ReactNode;
}) {
  const ordered = order.map((id) => personas[id]);

  const items: ScrollItem[] = ordered.map((p) => ({
    id: p.id,
    eyebrow: p.eyebrow,
    headline: p.headline,
    subhead: p.subhead,
    image: p.image,
    seed: `persona-${p.id}`,
    metrics: (p.stats ?? []).slice(0, 3).map((s) => ({
      label: s.label,
      value: s.value,
    })),
    blocks: p.blocks,
    callout: p.callout,
    blocksCta: p.blocksCta,
  }));

  const switchItems: SwitchItem[] = ordered.map((p, i) => ({
    id: p.id,
    tab: p.tab,
    eyebrow: p.eyebrow,
    headline: p.headline,
    subhead: p.subhead,
    metrics: items[i].metrics,
    blocks: p.blocks,
    blocksCta: p.blocksCta,
    callout: p.callout,
  }));

  return (
    <div
      style={{
        ...ACCENT_VARS[accent],
        ...(compact
          ? ({
              // Every gap between blocks becomes 2× these: 56 / 72 / 88px.
              "--section-y": "1.75rem",
              "--section-y-sm": "2.25rem",
              "--section-y-lg": "2.75rem",
              "--switcher-top": "1.75rem",
              "--switcher-top-sm": "2.25rem",
              "--switcher-top-lg": "2.75rem",
            } as CSSProperties)
          : {}),
      }}
    >
      {heroSlot ??
        (hero && primary && (
          <PersonaHero
            headline={hero.headline}
            subhead={hero.subhead}
            image={ordered[0].image}
            seed={`persona-${ordered[0].id}`}
            badge={ordered[0].imageBadge ?? "Verified titles"}
          >
            <Button href={primary.href} size="lg">
              {primary.label}
              <ArrowRight className="h-4 w-4" />
            </Button>
            {secondary && (
              <Button
                href={secondary.href}
                size="lg"
                variant="secondary"
                {...(secondary.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {secondary.label}
              </Button>
            )}
          </PersonaHero>
        ))}

      {leadSlot}

      {layout === "switcher" ? (
        <PersonaSwitcher items={switchItems} blocksInPanel={!answersTitle} />
      ) : layout === "scroller" ? (
        <PersonaScroller items={items} />
      ) : null}

      {children}

      {layout === "switcher" && answersTitle && (
        <PersonaAnswers items={switchItems} title={answersTitle} />
      )}

      <PersonaFaq
        title={`Questions ${faqTitleSuffix}`}
        groups={
          // Without the audience panel the page speaks to everyone at once,
          // so the questions are one list, not one per audience.
          layout === "none"
            ? [{ label: "", faqs: ordered.flatMap((p) => p.faqs) }]
            : ordered.map((p) => ({ label: p.tab, faqs: p.faqs }))
        }
        riskKind={riskKind}
      />

      {closingSlot}

      {/* Final CTA — duotone cover (stays Afram teal) */}
      {finalCta && (
        <Section className="pt-0 sm:pt-0 lg:pt-0">
          <div className="relative min-h-[260px] overflow-hidden rounded-3xl sm:min-h-[320px] lg:min-h-[440px]">
            <DuotonePhoto
              src={PHOTOS.glassTrees}
              alt=""
              sizes="100vw"
              className="absolute inset-0 h-full w-full"
            >
              <div className="from-brand-950/82 via-brand-950/45 to-brand-900/20 absolute inset-0 bg-gradient-to-t" />
            </DuotonePhoto>
            <div className="relative z-10 flex min-h-[260px] flex-col justify-end p-6 sm:min-h-[320px] sm:p-12 lg:min-h-[440px] lg:p-14">
              <h2 className="t-h1 max-w-2xl text-white">{finalCta.title}</h2>
              <p className="t-lead mt-4 max-w-md text-white/75">{finalCta.subtitle}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={finalCta.primary.href} size="lg" variant="inverse">
                  {finalCta.primary.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {finalCta.secondary && (
                  <Button href={finalCta.secondary.href} size="lg" variant="outline">
                    {finalCta.secondary.label}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Section>
      )}

      {footerSlot}
    </div>
  );
}

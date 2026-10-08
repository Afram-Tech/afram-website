"use client";

import { useEffect, useState } from "react";

import { PersonaBlocks } from "@/components/persona/PersonaBlocks";
import { PERSONA_EVENT } from "@/components/persona/PersonaSwitcher";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PersonaContent } from "@/features/personas/types";

/**
 * The audience's question cards, placed further down the page instead of
 * inside the "I am a…" panel. They follow the toggle at the top: the hash
 * on load, then the switcher's change event.
 */
export function PersonaAnswers({ personas, title }: { personas: PersonaContent[]; title: string }) {
  const [id, setId] = useState(personas[0]?.id);

  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (personas.some((p) => p.id === hash)) setId(hash);
    };
    const onChange = (e: Event) => setId((e as CustomEvent<string>).detail);
    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener(PERSONA_EVENT, onChange);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener(PERSONA_EVENT, onChange);
    };
  }, [personas]);

  const p = personas.find((it) => it.id === id) ?? personas[0];
  if (!p?.blocks?.length) return null;

  return (
    <Section id="answers" className="scroll-mt-24 pb-0 lg:pb-0">
      <p className="text-accent-700 text-[12px] font-semibold tracking-[0.18em] uppercase">
        {p.eyebrow}
      </p>
      <div className="mt-3">
        <SectionHeading title={title} />
      </div>
      <div className="mt-8 sm:mt-10">
        <PersonaBlocks key={p.id} blocks={p.blocks} cta={p.blocksCta} />
      </div>
    </Section>
  );
}

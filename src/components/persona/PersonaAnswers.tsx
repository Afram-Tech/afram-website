"use client";

import { useEffect, useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PersonaBlocks } from "@/components/persona/PersonaBlocks";
import { PERSONA_EVENT, type SwitchItem } from "@/components/persona/PersonaSwitcher";

/**
 * The audience's question cards, placed further down the page instead of
 * inside the "I am a…" panel. They follow the toggle at the top: the hash
 * on load, then the switcher's change event.
 */
export function PersonaAnswers({
  items,
  title,
}: {
  items: SwitchItem[];
  title: string;
}) {
  const [id, setId] = useState(items[0]?.id);

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      if (items.some((p) => p.id === h)) setId(h);
    };
    const onChange = (e: Event) => setId((e as CustomEvent<string>).detail);
    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener(PERSONA_EVENT, onChange);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener(PERSONA_EVENT, onChange);
    };
  }, [items]);

  const p = items.find((it) => it.id === id) ?? items[0];
  if (!p?.blocks?.length) return null;

  return (
    <Section id="answers" className="scroll-mt-24">
      <SectionHeading title={title} />
      <div className="mt-8 sm:mt-10">
        <PersonaBlocks key={p.id} blocks={p.blocks} cta={p.blocksCta} />
      </div>
    </Section>
  );
}

import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import type { PersonaContent } from "@/features/personas/types";
import { cn } from "@/lib/utils";

export function PersonaScroller({ personas }: { personas: PersonaContent[] }) {
  return (
    <section>
      <div className="mx-auto max-w-[1536px] px-6 sm:px-8 lg:px-16">
        <div className="space-y-6 lg:space-y-8">
          {personas.map((persona, index) => {
            const flip = index % 2 === 1;
            const metrics = persona.stats.slice(0, 3);
            return (
              <div
                key={persona.id}
                id={persona.id}
                className="from-accent-50 via-accent-50/40 ring-accent-100/70 grid scroll-mt-24 grid-cols-1 items-center gap-10 overflow-hidden rounded-[2rem] bg-gradient-to-br to-white p-7 ring-1 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-12"
              >
                <Reveal className={cn(flip && "lg:order-2")}>
                  <div className="flex items-center gap-3">
                    <span className="tnum text-accent-600 text-[13px] font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="bg-accent-400/70 h-px w-10" />
                    <span className="text-accent-700 text-[12px] font-semibold tracking-[0.18em] uppercase">
                      {persona.eyebrow}
                    </span>
                  </div>

                  <h2 className="text-ink-900 mt-5 max-w-xl text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
                    {persona.headline}
                  </h2>
                  <p className="text-ink-500 mt-4 max-w-md text-[16px] leading-relaxed">
                    {persona.subhead}
                  </p>

                  {metrics.length > 0 ? (
                    <dl className="mt-7 flex flex-wrap gap-x-9 gap-y-4">
                      {metrics.map((metric) => (
                        <div key={metric.label}>
                          <dt className="text-ink-400 text-[12px] tracking-[0.1em] uppercase">
                            {metric.label}
                          </dt>
                          <dd className="tnum text-ink-900 mt-1 text-[20px] font-semibold tracking-[-0.01em]">
                            {metric.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </Reveal>

                <Reveal delay={0.1} className={cn(flip && "lg:order-1")}>
                  <div className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-40px_rgba(0,45,48,0.45)] ring-1 ring-black/5">
                    <div className="border-ink-100 bg-ink-50 flex items-center gap-1.5 border-b px-4 py-2.5">
                      <span className="bg-ink-200 h-2.5 w-2.5 rounded-full" />
                      <span className="bg-ink-200 h-2.5 w-2.5 rounded-full" />
                      <span className="bg-ink-200 h-2.5 w-2.5 rounded-full" />
                    </div>
                    <Image
                      src="/dash-buyer.png"
                      alt=""
                      width={1200}
                      height={800}
                      className="block w-full"
                    />
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

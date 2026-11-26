export type FeeLine = {
  label: string;
  value: string;
};

/** Fee card for /fees: a short list of key figures on a paper card. */
export function FeeCard({
  title,
  intro,
  lines,
}: {
  title: string;
  intro: string;
  lines: FeeLine[];
}) {
  return (
    <div className="flex h-full flex-col rounded-[20px] border border-ink-100 bg-white p-6 shadow-card">
      <h3 className="t-h4 text-ink-900">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{intro}</p>

      <dl className="mt-auto flex flex-col pt-6">
        {lines.map((line) => (
          <div key={line.label} className="border-t border-ink-100 py-3 last:pb-0">
            <dt className="text-[13px] leading-[18px] text-ink-500">{line.label}</dt>
            <dd className="tnum mt-0.5 text-[15px] font-semibold tracking-[calc(-0.01em*var(--tracking-scale,1))] text-ink-900">
              {line.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

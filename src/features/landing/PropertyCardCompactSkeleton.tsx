/** Loading placeholder for PropertyCardCompact, sized to match it exactly. */
export function PropertyCardCompactSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="bg-ink-100 h-28 w-full rounded-xl" />
      <div className="bg-ink-100 mt-2 h-3.5 w-4/5 rounded-full" />
      <div className="bg-ink-100 mt-1.5 h-3 w-3/5 rounded-full" />
      <div className="bg-ink-100 mt-2 h-3.5 w-2/5 rounded-full" />
    </div>
  );
}

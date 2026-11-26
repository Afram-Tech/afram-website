/** Loading placeholder for PropertyCardCompact, sized to match it exactly. */
export function PropertyCardCompactSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="skel aspect-[4/3] w-full rounded-2xl" />
      <div className="skel mt-3 h-4 w-4/5 rounded-full" />
      <div className="skel mt-1.5 h-3.5 w-3/5 rounded-full" />
      <div className="skel mt-2 h-4 w-2/5 rounded-full" />
    </div>
  );
}

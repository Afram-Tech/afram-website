/** The shape of a PropertyCard, while a page of them loads. */
export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-ink-100 bg-white shadow-card" aria-hidden>
      <div className="skel mx-2 mt-2 aspect-[4/3] rounded-2xl" />
      <div className="flex flex-col gap-2 p-4">
        <div className="skel h-5 w-3/5 rounded-[10px]" />
        <div className="skel h-4 w-2/5 rounded-[10px]" />
        <div className="skel mt-1 h-4 w-4/5 rounded-[10px]" />
        <div className="mt-2 flex justify-between border-t border-ink-100 pt-3">
          <div className="skel h-5 w-1/3 rounded-[10px]" />
          <div className="skel h-5 w-1/4 rounded-[10px]" />
        </div>
      </div>
    </div>
  );
}

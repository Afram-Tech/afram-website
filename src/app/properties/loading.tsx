import { PropertyCardSkeleton } from "@/features/properties/PropertyCardSkeleton";

export default function Loading() {
  return (
    <section className="bg-white px-5 py-10 lg:px-[34px] lg:py-14" role="status" aria-label="Loading properties">
      <div className="mx-auto max-w-[1536px]">
        <div className="skel h-8 w-64 rounded-full" />
        <div className="skel mt-5 h-12 w-full max-w-xl rounded-[10px]" />
        <div className="skel mt-8 h-24 w-full rounded-[20px]" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

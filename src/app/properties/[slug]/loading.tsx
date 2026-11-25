export default function Loading() {
  return (
    <div className="bg-white px-5 py-8 lg:px-[34px] lg:py-10" role="status" aria-label="Loading property">
      <div className="mx-auto max-w-[1180px]">
        <div className="skel h-5 w-40 rounded-[10px]" />
        <div className="skel mt-6 h-10 w-80 max-w-full rounded-[10px]" />
        <div className="skel mt-3 h-5 w-52 rounded-[10px]" />
        <div className="skel mt-6 aspect-[16/8] w-full rounded-3xl" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            <div className="skel h-6 w-48 rounded-[10px]" />
            <div className="skel h-4 w-full rounded-[10px]" />
            <div className="skel h-4 w-5/6 rounded-[10px]" />
            <div className="skel h-4 w-2/3 rounded-[10px]" />
          </div>
          <div className="skel h-80 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

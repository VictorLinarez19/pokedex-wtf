export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="h-3 w-12 rounded bg-slate-200" />
        <div className="h-4 w-4 rounded bg-slate-200" />
      </div>
      <div className="mx-auto mt-4 h-24 w-24 rounded-full bg-slate-100" />
      <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
      <div className="mt-2 flex justify-center gap-1.5">
        <div className="h-5 w-14 rounded-full bg-slate-100" />
        <div className="h-5 w-14 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-1.5 w-full rounded bg-slate-100" />
        <div className="h-1.5 w-5/6 rounded bg-slate-100" />
        <div className="h-1.5 w-4/6 rounded bg-slate-100" />
      </div>
    </div>
  )
}

export default function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="h-3 w-12 rounded bg-slate-200" />
        <div className="h-4 w-4 rounded bg-slate-200" />
      </div>
      <div className="mx-auto mt-4 h-24 w-24 rounded-full bg-gradient-to-b from-slate-100 to-white" />
      <div className="mx-auto mt-4 h-4 w-2/3 rounded bg-slate-200" />
      <div className="mt-2 flex justify-center gap-1.5">
        <div className="h-5 w-14 rounded-full bg-slate-100" />
        <div className="h-5 w-14 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded-sm bg-slate-800/10" />
        <div className="h-3 w-5/6 rounded-sm bg-slate-800/10" />
        <div className="h-3 w-4/6 rounded-sm bg-slate-800/10" />
      </div>
    </div>
  )
}

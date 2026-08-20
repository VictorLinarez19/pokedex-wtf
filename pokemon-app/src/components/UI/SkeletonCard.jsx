// Esqueleto de carga con la misma silueta que una carta TCG.
export default function SkeletonCard() {
  return (
    <div className="tcg-card pointer-events-none animate-pulse">
      <div className="tcg-frame">
        <div className="tcg-inner">
          <div className="flex items-center gap-2 px-1">
            <div className="h-3.5 w-12 rounded bg-slate-300/80" />
            <div className="h-3.5 flex-1 rounded bg-slate-300/50" />
            <div className="h-3.5 w-14 rounded bg-slate-300/70" />
          </div>
          <div className="tcg-art">
            <div className="h-20 w-20 rounded-full bg-slate-200/90" />
          </div>
          <div className="h-4 rounded-full bg-slate-300/60" />
          <div className="space-y-1.5">
            <div className="h-9 rounded-lg bg-slate-300/50" />
            <div className="h-9 rounded-lg bg-slate-300/50" />
          </div>
          <div className="mt-1 flex gap-2">
            <div className="h-9 flex-1 rounded-lg bg-slate-300/50" />
            <div className="h-9 flex-1 rounded-lg bg-slate-300/50" />
            <div className="h-9 flex-1 rounded-lg bg-slate-300/50" />
          </div>
        </div>
      </div>
    </div>
  )
}

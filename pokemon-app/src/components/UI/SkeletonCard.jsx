// Esqueleto de carga con la misma silueta que la tarjeta Pokédex simplificada.
export default function SkeletonCard() {
  return (
    <div className="pokedex-card pointer-events-none animate-pulse">
      <div className="h-3 w-12 self-start rounded-sm bg-slate-200" />
      <div className="pokedex-card-screen">
        <div className="h-20 w-20 rounded-full bg-slate-200/90" />
      </div>
      <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
      <div className="mt-2 flex gap-1.5">
        <div className="h-5 w-14 rounded-[4px] bg-slate-100" />
        <div className="h-5 w-14 rounded-[4px] bg-slate-100" />
      </div>
      <div className="mt-4 w-full space-y-2.5 border-t-2 border-dashed border-slate-200 pt-3">
        <div className="h-3 w-full rounded-sm bg-slate-800/10" />
        <div className="h-3 w-5/6 rounded-sm bg-slate-800/10" />
        <div className="h-3 w-4/6 rounded-sm bg-slate-800/10" />
      </div>
    </div>
  )
}

import { Heart, Scale } from 'lucide-react'

export default function Navbar({
  showFavorites,
  favoritesCount,
  compareCount,
  onToggleFavorites,
  onOpenCompare,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onToggleFavorites} className="flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-800 bg-white">
            <span className="absolute left-1/2 top-1/2 h-[2px] w-4 -translate-x-1/2 -translate-y-1/2 bg-slate-800" />
            <span className="h-3 w-3 rounded-full border-2 border-slate-800 bg-rose-500" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">Pokédex</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFavorites}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              showFavorites
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Favoritos</span>
            {favoritesCount > 0 && (
              <span className="rounded-full bg-slate-100 px-1.5 text-xs font-semibold text-slate-600">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Comparar</span>
            {compareCount > 0 && (
              <span className="rounded-full bg-indigo-100 px-1.5 text-xs font-semibold text-indigo-600">
                {compareCount}/2
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

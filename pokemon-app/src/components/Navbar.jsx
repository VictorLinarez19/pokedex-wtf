import { Heart, Scale, Sparkles } from 'lucide-react'

export default function Navbar({
  showFavorites,
  favoritesCount,
  compareCount,
  shiny,
  onToggleFavorites,
  onToggleShiny,
  onOpenCompare,
}) {
  return (
    <header className="pokedex-header sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Lente clásica + LEDs */}
          <div className="flex items-center gap-2.5">
            <span className="pokedex-lens" aria-hidden="true" />
            <span className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className="pokedex-led led-red" />
              <span className="pokedex-led led-yellow" />
              <span className="pokedex-led led-green" />
            </span>
          </div>

          <button type="button" onClick={onToggleFavorites} className="flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-800 bg-white shadow-inner">
              <span className="absolute left-1/2 top-1/2 h-[2px] w-4 -translate-x-1/2 -translate-y-1/2 bg-slate-800" />
              <span className="h-3 w-3 rounded-full border-2 border-slate-800 bg-rose-500" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">Pokédex</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFavorites}
            className={`game-btn btn-a ${showFavorites ? 'active' : ''}`}
          >
            <Heart className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Favoritos</span>
            {favoritesCount > 0 && (
              <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[11px] font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleShiny}
            className={`game-btn btn-b ${shiny ? 'active' : ''}`}
          >
            <Sparkles className={`h-4 w-4 ${shiny ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Shiny</span>
          </button>

          <button type="button" onClick={onOpenCompare} className="game-btn btn-blue">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Comparar</span>
            {compareCount > 0 && (
              <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[11px] font-bold">
                {compareCount}/2
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

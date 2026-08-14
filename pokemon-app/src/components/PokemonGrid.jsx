import PokemonCard from './PokemonCard'

export default function PokemonGrid({
  pokemon,
  favorites,
  compare,
  onToggleFavorite,
  onCompare,
  onCardClick,
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {pokemon.map((p) => {
        const isFav = favorites.some((f) => f.id === p.id || f.name === p.name)
        const isSelected = compare.some((c) => c.id === p.id || c.name === p.name)
        return (
          <PokemonCard
            key={p.url || p.name}
            pokemon={p}
            isFavorite={isFav}
            isSelectedForCompare={isSelected}
            onToggleFavorite={onToggleFavorite}
            onCompare={onCompare}
            onCardClick={onCardClick}
          />
        )
      })}
    </div>
  )
}

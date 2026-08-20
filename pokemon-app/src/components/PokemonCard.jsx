import { useState } from 'react'
import { Heart, Scale, Sparkles } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import SkeletonCard from './UI/SkeletonCard'
import GameStatBar from './UI/GameStatBar'
import { getTypeTheme } from '../utils/typeColors'

const API = '/api'

const TYPE_STYLES = {
  normal: 'bg-slate-200 text-slate-700',
  fire: 'bg-orange-100 text-orange-700',
  water: 'bg-blue-100 text-blue-700',
  grass: 'bg-green-100 text-green-700',
  electric: 'bg-yellow-100 text-yellow-700',
  ice: 'bg-cyan-100 text-cyan-700',
  fighting: 'bg-red-100 text-red-700',
  poison: 'bg-purple-100 text-purple-700',
  ground: 'bg-amber-100 text-amber-700',
  flying: 'bg-indigo-100 text-indigo-700',
  psychic: 'bg-pink-100 text-pink-700',
  bug: 'bg-lime-100 text-lime-700',
  rock: 'bg-stone-200 text-stone-700',
  ghost: 'bg-violet-100 text-violet-700',
  dragon: 'bg-indigo-100 text-indigo-700',
  dark: 'bg-slate-300 text-slate-800',
  steel: 'bg-slate-200 text-slate-600',
  fairy: 'bg-rose-100 text-rose-700',
}

export function TypeBadge({ type }) {
  const style = TYPE_STYLES[type] || TYPE_STYLES.normal
  return (
    <span
      className={`inline-flex items-center rounded-[4px] border border-black/5 px-2 py-0.5 text-[11px] font-semibold capitalize shadow-sm ${style}`}
    >
      {type}
    </span>
  )
}

const CARD_STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'ATK' },
  { key: 'defense', label: 'DEF' },
]

function getStat(stats, name) {
  return stats?.find((s) => s.stat.name === name)?.base_stat ?? 0
}

function formatId(id) {
  return id ? `#${String(id).padStart(3, '0')}` : '#000'
}

export default function PokemonCard({
  pokemon,
  shiny,
  isFavorite,
  isSelectedForCompare,
  onToggleFavorite,
  onCompare,
  onCardClick,
}) {
  const url = pokemon?.sprites ? null : pokemon?.url
  const { data, loading } = useFetch(url)
  const [localShiny, setLocalShiny] = useState(false)

  const details = pokemon?.sprites ? pokemon : data
  const id = details?.id
  const name = details?.name || pokemon?.name
  const stats = details?.stats
  const isShiny = shiny || localShiny

  if (loading) return <SkeletonCard />
  if (!details) return null

  const theme = getTypeTheme(details.types)
  const sprite = isShiny
    ? details.sprites?.front_shiny || details.sprites?.front_default
    : details.sprites?.front_default

  return (
    <article
      onClick={() => onCardClick?.(details)}
      style={{
        '--type-main': theme.main,
        '--type-soft': theme.soft,
        '--type-border': theme.border,
      }}
      className="pokedex-card group"
    >
      {/* Acciones (favorito / comparar / shiny) — visibles al pasar el cursor */}
      <div className="pokedex-card-actions" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onCompare?.({ id, name, url: `${API}/pokemon/${id}` })
          }}
          className={`pokedex-action-btn ${isSelectedForCompare ? 'pokedex-action-btn--active pokedex-action-btn--blue' : ''}`}
          title="Añadir a comparar"
        >
          <Scale className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.({ id, name })
          }}
          className={`pokedex-action-btn ${isFavorite ? 'pokedex-action-btn--active pokedex-action-btn--rose' : ''}`}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={isShiny}
          aria-label="Alternar versión shiny"
          onClick={(e) => {
            e.stopPropagation()
            setLocalShiny((v) => !v)
          }}
          className={`pokedex-action-btn ${isShiny ? 'pokedex-action-btn--active pokedex-action-btn--amber' : ''}`}
          title="Alternar versión shiny"
        >
          <Sparkles className={`h-4 w-4 ${isShiny ? 'fill-current' : ''}`} />
        </button>
      </div>

      <span className="pokedex-card-id font-pixel">{formatId(id)}</span>

      <div className="pokedex-card-screen">
        {sprite ? (
          <img src={sprite} alt={name} loading="lazy" className="pixelated" />
        ) : (
          <span className="text-xs text-slate-400">Sin imagen</span>
        )}
      </div>

      <h3 className="pokedex-card-name">{name}</h3>

      <div className="pokedex-card-types">
        {details.types?.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </div>

      <div className="pokedex-card-stats">
        {CARD_STATS.map(({ key, label }) => {
          const value = getStat(stats, key)
          return (
            <div key={key} className="pokedex-stat-row">
              <span className="pokedex-stat-label">{label}</span>
              <GameStatBar value={value} max={180} />
              <span className="pokedex-stat-value">{value}</span>
            </div>
          )
        })}
      </div>
    </article>
  )
}

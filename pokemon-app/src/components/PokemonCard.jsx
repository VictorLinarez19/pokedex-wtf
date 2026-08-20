import { useState } from 'react'
import { Heart, Scale } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import SkeletonCard from './UI/SkeletonCard'
import PokeBallWatermark from './UI/PokeBallWatermark'
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
      className={`inline-flex items-center rounded-full border border-black/5 px-2 py-0.5 text-[11px] font-semibold capitalize shadow-sm ${style}`}
    >
      {type}
    </span>
  )
}

const CARD_STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'ATK' },
  { key: 'defense', label: 'DEF' },
  { key: 'speed', label: 'SPD' },
]

function getStat(stats, name) {
  return stats?.find((s) => s.stat.name === name)?.base_stat ?? 0
}

function formatId(id) {
  return id ? `#${String(id).padStart(3, '0')}` : ''
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
      className="pokemon-card group flex cursor-pointer flex-col overflow-hidden rounded-2xl p-4"
    >
      <PokeBallWatermark className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 text-slate-900/[0.06]" />
      <div className="card-shine" aria-hidden="true" />

      <div className="relative z-[2] flex items-center justify-between">
        <span className="font-pixel text-[10px] text-slate-400">{formatId(id)}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onCompare?.({ id, name, url: `${API}/pokemon/${id}` })
            }}
            className={`rounded-lg p-1.5 transition hover:bg-slate-100 ${
              isSelectedForCompare ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'
            }`}
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
            className={`rounded-lg p-1.5 transition hover:bg-slate-100 ${
              isFavorite ? 'text-rose-500' : 'text-slate-400'
            }`}
            title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div
        className="relative z-[2] mx-auto mt-3 flex h-28 w-28 items-center justify-center rounded-full"
        style={{
          background: `linear-gradient(180deg, ${theme.soft} 0%, #ffffff 100%)`,
          boxShadow: `inset 0 0 0 2px ${theme.border}`,
        }}
      >
        {sprite ? (
          <img
            src={sprite}
            alt={name}
            className="h-24 w-24 object-contain drop-shadow-sm"
            loading="lazy"
          />
        ) : (
          <span className="text-xs text-slate-300">Sin imagen</span>
        )}
      </div>

      <div className="relative z-[2] mt-3 flex items-center justify-center gap-2">
        <h3 className="text-base font-bold capitalize text-slate-800">{name}</h3>
        <button
          type="button"
          role="switch"
          aria-checked={isShiny}
          aria-label="Alternar versión shiny"
          onClick={(e) => {
            e.stopPropagation()
            setLocalShiny((v) => !v)
          }}
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
            isShiny ? 'bg-indigo-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              isShiny ? 'translate-x-4' : ''
            }`}
          />
        </button>
      </div>
      <p className="relative z-[2] mt-0.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {isShiny ? 'Shiny' : 'Normal'}
      </p>

      <div className="relative z-[2] mt-2 flex flex-wrap justify-center gap-1.5">
        {details.types?.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </div>

      <div className="relative z-[2] mt-4 space-y-2 border-t border-slate-200/70 pt-3">
        {CARD_STATS.map(({ key, label }) => {
          const value = getStat(stats, key)
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-8 font-pixel text-[9px] text-slate-500">{label}</span>
              <GameStatBar value={value} max={180} />
              <span className="w-8 text-right font-pixel text-[9px] text-slate-600">{value}</span>
            </div>
          )
        })}
      </div>
    </article>
  )
}

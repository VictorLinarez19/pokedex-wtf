import { useState } from 'react'
import { Heart, Scale } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import SkeletonCard from './UI/SkeletonCard'

const API = 'https://pokeapi.co/api/v2'

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
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${style}`}
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
  isFavorite,
  isSelectedForCompare,
  onToggleFavorite,
  onCompare,
  onCardClick,
}) {
  const url = pokemon?.sprites ? null : pokemon?.url
  const { data, loading } = useFetch(url)
  const [shiny, setShiny] = useState(false)

  const details = pokemon?.sprites ? pokemon : data
  const id = details?.id
  const name = details?.name || pokemon?.name
  const stats = details?.stats

  if (loading) return <SkeletonCard />
  if (!details) return null

  const sprite = shiny
    ? details.sprites?.front_shiny || details.sprites?.front_default
    : details.sprites?.front_default

  return (
    <article
      onClick={() => onCardClick?.(details)}
      className="flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-slate-400">
          {formatId(id)}
        </span>
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

      <div className="mx-auto mt-3 flex h-28 w-28 items-center justify-center rounded-full bg-slate-50">
        {sprite ? (
          <img src={sprite} alt={name} className="h-24 w-24 object-contain" loading="lazy" />
        ) : (
          <span className="text-xs text-slate-300">Sin imagen</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <h3 className="text-base font-semibold capitalize text-slate-800">{name}</h3>
        <button
          type="button"
          role="switch"
          aria-checked={shiny}
          aria-label="Alternar versión shiny"
          onClick={(e) => {
            e.stopPropagation()
            setShiny((v) => !v)
          }}
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
            shiny ? 'bg-indigo-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              shiny ? 'translate-x-4' : ''
            }`}
          />
        </button>
      </div>
      <p className="mt-0.5 text-center text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {shiny ? 'Shiny' : 'Normal'}
      </p>

      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {details.types?.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </div>

      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
        {CARD_STATS.map(({ key, label }) => {
          const value = getStat(stats, key)
          const pct = Math.min(100, Math.round((value / 180) * 100))
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-semibold uppercase text-slate-400">
                {label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-7 text-right text-[10px] font-medium text-slate-500">
                {value}
              </span>
            </div>
          )
        })}
      </div>
    </article>
  )
}

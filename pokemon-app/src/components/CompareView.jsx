import { useEffect, useState } from 'react'
import { Search, Scale, Trash2, X } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import { TypeBadge } from './PokemonCard'

const API = 'https://pokeapi.co/api/v2'

const COMPARE_STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Ataque' },
  { key: 'defense', label: 'Defensa' },
  { key: 'special-attack', label: 'At. Esp.' },
  { key: 'special-defense', label: 'Def. Esp.' },
  { key: 'speed', label: 'Velocidad' },
]

function getStat(stats, name) {
  return stats?.find((s) => s.stat.name === name)?.base_stat ?? 0
}

function CompareColumn({ pokemon, onRemove }) {
  const { data, loading, error } = useFetch(pokemon?.url || null)

  if (!pokemon) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
        <Scale className="h-6 w-6 text-slate-300" />
        <p className="mt-2 text-sm text-slate-400">Selecciona un Pokémon</p>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-72 animate-pulse rounded-xl border border-slate-200 bg-white p-4" />
  }

  if (error || !data) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-400">
        No se pudo cargar este Pokémon.
      </div>
    )
  }

  const id = `#${String(data.id).padStart(3, '0')}`

  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-4">
      <button
        type="button"
        onClick={() => onRemove(data.id)}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-300 transition hover:bg-slate-100 hover:text-rose-500"
        title="Quitar de la comparación"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
          <img
            src={data.sprites?.front_default}
            alt={data.name}
            className="h-16 w-16 object-contain"
          />
        </div>
        <span className="mt-1 text-xs font-semibold tracking-wide text-slate-400">{id}</span>
        <h4 className="text-base font-semibold capitalize text-slate-800">{data.name}</h4>
        <div className="mt-1.5 flex gap-1.5">
          {data.types?.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
        {COMPARE_STATS.map(({ key, label }) => {
          const value = getStat(data.stats, key)
          const pct = Math.min(100, Math.round((value / 200) * 100))
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-[11px] font-medium text-slate-500">{label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-7 text-right text-[11px] font-semibold text-slate-600">
                {value}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <p>
          <span className="font-medium text-slate-600">Altura:</span>{' '}
          {(data.height / 10).toFixed(1)} m
        </p>
        <p>
          <span className="font-medium text-slate-600">Peso:</span>{' '}
          {(data.weight / 10).toFixed(1)} kg
        </p>
        <p className="capitalize">
          <span className="font-medium text-slate-600">Habilidades:</span>{' '}
          {data.abilities?.map((a) => a.ability.name).join(', ')}
        </p>
      </div>
    </div>
  )
}

export default function CompareView({ compare, onClose, onAdd, onRemove, onClear }) {
  const [query, setQuery] = useState('')
  const [submitUrl, setSubmitUrl] = useState(null)
  const { data: found, loading: finding, error: findError } = useFetch(submitUrl)

  useEffect(() => {
    if (found) {
      onAdd({ id: found.id, name: found.name, url: `${API}/pokemon/${found.id}` })
      setQuery('')
      setSubmitUrl(null)
    }
  }, [found, onAdd])

  function handleSubmit(e) {
    e.preventDefault()
    const q = query.trim().toLowerCase()
    if (!q || compare.length >= 2) return
    setSubmitUrl(`${API}/pokemon/${q}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-semibold text-slate-900">Comparar Pokémon</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {compare.length}/2
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Añadir por nombre o ID…"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <button
              type="submit"
              disabled={finding || compare.length >= 2}
              className="rounded-xl bg-slate-800 px-4 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {finding ? 'Buscando…' : 'Añadir'}
            </button>
          </form>
          {findError && (
            <p className="mt-2 text-xs font-medium text-rose-500">
              No se encontró ese Pokémon. Revisa el nombre o ID.
            </p>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CompareColumn pokemon={compare[0]} onRemove={onRemove} />
            <CompareColumn pokemon={compare[1]} onRemove={onRemove} />
          </div>
        </div>

        <div className="flex justify-between border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

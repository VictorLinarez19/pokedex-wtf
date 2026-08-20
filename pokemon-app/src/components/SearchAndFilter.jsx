import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'

const TYPES = [
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
  'normal',
]

const GENERATIONS = [
  { id: 1, label: 'Gen I' },
  { id: 2, label: 'Gen II' },
  { id: 3, label: 'Gen III' },
  { id: 4, label: 'Gen IV' },
  { id: 5, label: 'Gen V' },
  { id: 6, label: 'Gen VI' },
  { id: 7, label: 'Gen VII' },
  { id: 8, label: 'Gen VIII' },
  { id: 9, label: 'Gen IX' },
]

function Dropdown({ placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)
  const label = selected?.label ?? placeholder

  function choose(next) {
    onChange(next)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pokedex-input flex w-full items-center justify-between gap-2 px-3 py-2 text-sm capitalize text-slate-700"
      >
        <span className="truncate capitalize">{label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul className="absolute left-0 z-20 mt-1 max-h-64 w-full min-w-44 overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          {options.map((o) => {
            const active = o.value === value
            return (
              <li key={o.value ?? 'all'}>
                <button
                  type="button"
                  onClick={() => choose(o.value)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-sm capitalize transition ${
                    active ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {o.label}
                  {active && <Check className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function SearchAndFilter({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedGeneration,
  onGenerationChange,
}) {
  return (
    <section className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre o ID…"
          className="pokedex-input w-full py-2.5 pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 font-pixel text-[9px] uppercase tracking-wider text-slate-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
            Tipo
          </p>
          <Dropdown
            placeholder="Todos"
            options={[
              { value: '', label: 'Todos' },
              ...TYPES.map((type) => ({ value: type, label: type })),
            ]}
            value={selectedType}
            onChange={onTypeChange}
          />
        </div>

        <div>
          <p className="mb-1.5 flex items-center gap-1.5 font-pixel text-[9px] uppercase tracking-wider text-slate-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
            Generación
          </p>
          <Dropdown
            placeholder="Todas"
            options={[
              { value: null, label: 'Todas' },
              ...GENERATIONS.map((gen) => ({ value: gen.id, label: gen.label })),
            ]}
            value={selectedGeneration}
            onChange={onGenerationChange}
          />
        </div>
      </div>
    </section>
  )
}

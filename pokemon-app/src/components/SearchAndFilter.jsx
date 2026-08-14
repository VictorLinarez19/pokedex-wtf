import { Search, X } from 'lucide-react'

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

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
        active
          ? 'border-slate-800 bg-slate-800 text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
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
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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

      <div className="flex flex-wrap gap-2">
        <Pill active={selectedType === ''} onClick={() => onTypeChange('')}>
          Todos
        </Pill>
        {TYPES.map((type) => (
          <Pill key={type} active={selectedType === type} onClick={() => onTypeChange(type)}>
            {type}
          </Pill>
        ))}
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Generación
        </p>
        <div className="flex flex-wrap gap-2">
          <Pill active={selectedGeneration === null} onClick={() => onGenerationChange(null)}>
            Todas
          </Pill>
          {GENERATIONS.map((gen) => (
            <Pill
              key={gen.id}
              active={selectedGeneration === gen.id}
              onClick={() => onGenerationChange(gen.id)}
            >
              {gen.label}
            </Pill>
          ))}
        </div>
      </div>
    </section>
  )
}

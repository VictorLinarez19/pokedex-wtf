import { GitFork, X } from 'lucide-react'
import EvolutionChain from './EvolutionChain'

export default function EvolutionModal({ pokemonName, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
              <GitFork className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold capitalize text-slate-900">{pokemonName}</h2>
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
        <div className="px-5 py-5">
          <EvolutionChain pokemonName={pokemonName} />
        </div>
      </div>
    </div>
  )
}

import { GitFork, X } from 'lucide-react'
import EvolutionChain from './EvolutionChain'

export default function EvolutionModal({ pokemonName, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <GitFork className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-semibold capitalize text-slate-900">{pokemonName}</h2>
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

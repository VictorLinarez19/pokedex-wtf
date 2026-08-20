import { X } from 'lucide-react'
import EvolutionChain from './EvolutionChain'

export default function EvolutionModal({ pokemonName, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="pokedex-modal-panel w-max max-w-2xl min-w-[20rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pokedex-modal-header">
          <div>
            <h2 className="text-base font-extrabold capitalize text-white">{pokemonName}</h2>
            <p className="pokedex-modal-subtitle">EVOLUCIONES</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pokedex-close-btn"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="pokedex-modal-body">
          <EvolutionChain pokemonName={pokemonName} />
        </div>
      </div>
    </div>
  )
}

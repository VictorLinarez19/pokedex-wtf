// Silueta de Pokéball usada como marca de agua suave en las tarjetas.
export default function PokeBallWatermark({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} fill="none">
      <path
        d="M50 0a50 50 0 0 1 50 50h-26.8A23.2 23.2 0 0 0 50 26.8V0Z"
        fill="currentColor"
      />
      <path
        d="M50 100a50 50 0 0 1-50-50h26.8A23.2 23.2 0 0 0 50 73.2V100Z"
        fill="currentColor"
        opacity="0.3"
      />
      <rect x="0" y="46" width="100" height="8" fill="currentColor" />
      <circle cx="50" cy="50" r="12" fill="currentColor" />
    </svg>
  )
}

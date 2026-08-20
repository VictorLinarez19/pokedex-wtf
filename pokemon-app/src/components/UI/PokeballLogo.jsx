// Logo clásico de Pokéball (colores oficiales) con brillo.
export default function PokeballLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <circle cx="50" cy="50" r="48" fill="#f0f0f0" stroke="#222224" strokeWidth="4" />
      <path d="M50 4a46 46 0 0 1 46 46H4a46 46 0 0 1 46-46Z" fill="#ee1515" />
      <rect x="4" y="45" width="92" height="10" fill="#222224" />
      <circle cx="50" cy="50" r="17" fill="#f0f0f0" stroke="#222224" strokeWidth="4" />
      <circle cx="50" cy="50" r="7" fill="#222224" />
      <ellipse cx="38" cy="26" rx="14" ry="8" fill="#ffffff" opacity="0.35" transform="rotate(-25 38 26)" />
    </svg>
  )
}

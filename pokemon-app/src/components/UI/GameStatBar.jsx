import { statBarColor } from '../../utils/typeColors'

// Barra de estadísticas con aspecto de barra de vida/estado de videojuegos clásicos.
export default function GameStatBar({ value, max = 180, className = '' }) {
  const pct = Math.min(100, Math.round((Math.max(0, value) / max) * 100))
  const color = statBarColor(value)
  return (
    <div
      className={`stat-track ${className}`}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="stat-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

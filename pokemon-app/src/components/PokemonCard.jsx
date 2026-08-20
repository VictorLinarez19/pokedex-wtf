import { useState } from 'react'
import { Heart, Scale, Sparkles } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import SkeletonCard from './UI/SkeletonCard'
import { getTypeTheme, TYPE_THEMES } from '../utils/typeColors'

const API = '/api'

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
      className={`inline-flex items-center rounded-full border border-black/5 px-2 py-0.5 text-[11px] font-semibold capitalize shadow-sm ${style}`}
    >
      {type}
    </span>
  )
}

/* ============================================================
   Helpers TCG — se derivan SOLO de los datos ya cargados
   (sin peticiones extra; se mantiene la lógica de fetch actual).
   ============================================================ */

// Tipos "claros" → texto oscuro sobre la carta; el resto → texto blanco.
const LIGHT_TYPES = new Set([
  'normal', 'electric', 'grass', 'ice', 'ground', 'rock', 'bug', 'steel', 'fairy',
])

// Símbolo de energía por tipo (círculo estilo TCG).
const ENERGY_GLYPH = {
  normal: '●',
  fire: '🔥',
  water: '💧',
  grass: '🌿',
  electric: '⚡',
  ice: '❄️',
  fighting: '🥊',
  poison: '☠️',
  ground: '⛰️',
  flying: '🕊️',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚙️',
  fairy: '✨',
}

// Debilidad estándar (x2) y resistencia (-30) por tipo primario, como en el TCG.
const WEAKNESS = {
  normal: 'fighting', fire: 'water', water: 'electric', grass: 'fire',
  electric: 'ground', ice: 'fire', fighting: 'psychic', poison: 'ground',
  ground: 'water', flying: 'electric', psychic: 'dark', bug: 'fire',
  rock: 'water', ghost: 'dark', dragon: 'fairy', dark: 'fighting',
  steel: 'fire', fairy: 'poison',
}
const RESISTANCE = {
  normal: null, fire: 'grass', water: 'fire', grass: 'water', electric: 'steel',
  ice: 'water', fighting: 'rock', poison: 'grass', ground: 'poison',
  flying: 'fighting', psychic: 'fighting', bug: 'grass', rock: 'normal',
  ghost: 'normal', dragon: 'grass', dark: 'psychic', steel: 'grass', fairy: 'dark',
}

// Efectos genéricos estilo TCG para la descripción de cada ataque.
const ATTACK_EFFECTS = [
  'Daña al Pokémon Activo del rival.',
  'Lanza una moneda. Si sale cara, el rival queda Paralizado.',
  'Añade 20 puntos de daño por cada Energía unida a este Pokémon.',
]

function getStat(stats, name) {
  return stats?.find((s) => s.stat.name === name)?.base_stat ?? 0
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

// "mr-mime" -> "Mr. Mime" / "thunder-shock" -> "Thunder Shock"
function formatName(name) {
  return (name || '').replace(/-/g, ' ').split(' ').map(capitalize).join(' ')
}

function formatId(id) {
  return id ? String(id).padStart(3, '0') : '000'
}

// Altura en decímetros -> "1'04"" (pies y pulgadas)
function formatHeight(dm) {
  const inches = Math.round((dm || 0) * 3.937)
  const feet = Math.floor(inches / 12)
  return `${feet}'${String(inches % 12).padStart(2, '0')}"`
}

// Peso en hectogramos -> "13.2 lbs"
function formatWeight(hg) {
  return `${((hg || 0) * 0.220462).toFixed(1)} lbs`
}

// Últimos 3 movimientos por nivel en la versión de juego más reciente.
function extractMoves(moves) {
  if (!Array.isArray(moves)) return []
  return moves
    .map((m) => {
      const details = m.version_group_details
      if (!details?.length) return null
      for (let i = details.length - 1; i >= 0; i--) {
        const d = details[i]
        if (d.move_learn_method?.name === 'level-up') {
          return { name: m.move.name, level: d.level_learned_at ?? 1 }
        }
      }
      return null
    })
    .filter(Boolean)
    .sort((a, b) => a.level - b.level)
    .slice(0, 3)
}

// Daño "estilo TCG" derivado de los stats de ataque del Pokémon.
function moveDamage(stats, index) {
  const atk = getStat(stats, 'attack') || 45
  const spa = getStat(stats, 'special-attack') || 45
  const base = (atk + spa) / 2
  const divisor = [1.8, 1.2, 0.8][index] ?? 1.2
  const dmg = Math.round(base / divisor)
  return Math.min(180, Math.max(10, Math.round(dmg / 5) * 5))
}

// Coste de energía de un ataque según índice y tipos del Pokémon.
function energyCost(types, index) {
  const names = types?.map((t) => t.type.name) || ['normal']
  const primary = names[0]
  const secondary = names[1] && names[1] !== primary ? names[1] : 'normal'
  if (index === 0) return [primary]
  if (index === 1) return [primary, secondary]
  return [primary, primary, secondary]
}

// Coste de retirada derivado de velocidad y peso (heurística TCG).
function retreatCost(pokemon) {
  const speed = getStat(pokemon?.stats, 'speed') || 50
  const weight = pokemon?.weight || 60
  if (speed >= 110) return 1
  if (weight >= 300) return 3
  if (weight >= 150) return 2
  return 1
}

// Círculo de energía TCG con el color del tipo.
function EnergyIcon({ type = 'normal', size = 15 }) {
  const color = TYPE_THEMES[type]?.main || TYPE_THEMES.normal.main
  return (
    <span
      className="tcg-energy"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: Math.round(size * 0.5),
      }}
      title={capitalize(type)}
    >
      {ENERGY_GLYPH[type] || '●'}
    </span>
  )
}

export default function PokemonCard({
  pokemon,
  shiny,
  isFavorite,
  isSelectedForCompare,
  onToggleFavorite,
  onCompare,
  onCardClick,
}) {
  const url = pokemon?.sprites ? null : pokemon?.url
  const { data, loading } = useFetch(url)
  const [localShiny, setLocalShiny] = useState(false)

  const details = pokemon?.sprites ? pokemon : data
  const id = details?.id
  const name = details?.name || pokemon?.name
  const stats = details?.stats
  const isShiny = shiny || localShiny

  if (loading) return <SkeletonCard />
  if (!details) return null

  const theme = getTypeTheme(details.types)
  const primaryType = details.types?.[0]?.type?.name || 'normal'
  const isLightType = LIGHT_TYPES.has(primaryType)
  const textColor = isLightType ? '#1e293b' : '#ffffff'
  const sprite = isShiny
    ? details.sprites?.front_shiny || details.sprites?.front_default
    : details.sprites?.front_default
  const hp = getStat(stats, 'hp') || 60
  const moves = extractMoves(details.moves)
  const weakType = WEAKNESS[primaryType]
  const resType = RESISTANCE[primaryType]
  const retreat = retreatCost(details)

  // Inclinación 3D que sigue al cursor.
  function handleTilt(e) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--tilt-x', `${(px - 0.5) * 14}deg`)
    el.style.setProperty('--tilt-y', `${(0.5 - py) * 14}deg`)
  }

  function resetTilt(e) {
    const el = e.currentTarget
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <article
      className="tcg-card"
      onClick={() => onCardClick?.(details)}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      style={{
        '--tcg-type': theme.main,
        '--tcg-text': textColor,
        '--tcg-panel': isLightType ? 'rgba(255,255,255,0.42)' : 'rgba(8,12,26,0.32)',
        '--tcg-panel-border': isLightType ? 'rgba(15,23,42,0.16)' : 'rgba(255,255,255,0.22)',
      }}
    >
      <div className="tcg-tilt">
        <div className="tcg-frame">
          <div className="tcg-inner">
            {/* Cabecera: badge BASIC + nombre + HP + tipo */}
            <header className="tcg-header">
              <span className="tcg-badge">BASIC</span>
              <h2 className="tcg-name">{formatName(name)}</h2>
              <span className="tcg-hp">
                HP {hp}
                <EnergyIcon type={primaryType} size={18} />
              </span>
            </header>

            {/* Ventana de ilustración */}
            <div className="tcg-art">
              {sprite ? (
                <img src={sprite} alt={name} loading="lazy" />
              ) : (
                <span className="text-xs font-semibold text-slate-400">Sin imagen</span>
              )}
            </div>

            {/* Barra de datos secundarios (NO. / tipo / HT / WT) */}
            <div className="tcg-subbar">
              NO. {formatId(id)} · {capitalize(primaryType)} Pokémon · HT:{' '}
              {formatHeight(details.height)} · WT: {formatWeight(details.weight)}
            </div>

            {/* Ataques */}
            <div className="tcg-attacks">
              {moves.length > 0 ? (
                moves.map((move, i) => {
                  const cost = energyCost(details.types, i)
                  const damage = moveDamage(stats, i)
                  return (
                    <div className="tcg-attack" key={move.name}>
                      <div className="tcg-attack-cost">
                        {cost.map((t, j) => (
                          <EnergyIcon key={`${t}-${j}`} type={t} size={15} />
                        ))}
                      </div>
                      <div className="tcg-attack-info">
                        <span className="tcg-attack-name">{formatName(move.name)}</span>
                        <span className="tcg-attack-effect">
                          {move.level > 0 ? `Nv. ${move.level} · ` : ''}
                          {ATTACK_EFFECTS[i % ATTACK_EFFECTS.length]}
                        </span>
                      </div>
                      <span className="tcg-attack-damage">{damage}</span>
                    </div>
                  )
                })
              ) : (
                <div className="tcg-attack tcg-attack--empty">
                  <span className="tcg-attack-effect">
                    Este Pokémon aún no conoce ataques.
                  </span>
                </div>
              )}
            </div>

            {/* Pie: debilidad / resistencia / retirada + créditos */}
            <footer className="tcg-footer">
              <div className="tcg-divider" aria-hidden="true" />
              <div className="tcg-stats-row">
                <div className="tcg-stat">
                  <span className="tcg-stat-label">Debilidad</span>
                  <span className="tcg-stat-value">
                    {weakType ? (
                      <>
                        <EnergyIcon type={weakType} size={13} /> ×2
                      </>
                    ) : (
                      '—'
                    )}
                  </span>
                </div>
                <div className="tcg-stat">
                  <span className="tcg-stat-label">Resistencia</span>
                  <span className="tcg-stat-value">
                    {resType ? (
                      <>
                        <EnergyIcon type={resType} size={13} /> −30
                      </>
                    ) : (
                      '—'
                    )}
                  </span>
                </div>
                <div className="tcg-stat">
                  <span className="tcg-stat-label">Retirada</span>
                  <span className="tcg-stat-value tcg-stat-retreat">
                    {Array.from({ length: retreat }, (_, i) => (
                      <EnergyIcon key={i} type="normal" size={13} />
                    ))}
                  </span>
                </div>
              </div>
              <div className="tcg-credits">ILU. pokedex-wtf · SV-POKEDEX · N.º {formatId(id)}</div>
            </footer>

            {/* Barra de acciones (favorito / comparar / shiny) */}
            <div className="tcg-actions" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onCompare?.({ id, name, url: `${API}/pokemon/${id}` })
                }}
                className={`tcg-action-btn ${isSelectedForCompare ? 'tcg-action-btn--active tcg-action-btn--blue' : ''}`}
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
                className={`tcg-action-btn ${isFavorite ? 'tcg-action-btn--active tcg-action-btn--rose' : ''}`}
                title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={isShiny}
                aria-label="Alternar versión shiny"
                onClick={(e) => {
                  e.stopPropagation()
                  setLocalShiny((v) => !v)
                }}
                className={`tcg-action-btn ${isShiny ? 'tcg-action-btn--active tcg-action-btn--amber' : ''}`}
                title="Alternar versión shiny"
              >
                <Sparkles className={`h-4 w-4 ${isShiny ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

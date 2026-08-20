import { Fragment, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, Loader2 } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import { getTypeTheme } from '../utils/typeColors'
import PokeballLogo from './UI/PokeballLogo'

const API = '/api'

// Recorre TODA la cadena (incluyendo ramas) agrupando por etapa.
// Devuelve algo como: [ [{name, url}], [{name, url}, {name, url}], [{name, url}] ]
function collectStages(chain) {
  const stages = []
  const walk = (node, depth) => {
    if (!node) return
    if (!stages[depth]) stages[depth] = []
    stages[depth].push({ name: node.species.name, url: node.species.url })
    ;(node.evolves_to || []).forEach((child) => walk(child, depth + 1))
  }
  walk(chain, 0)
  return stages.filter(Boolean)
}

export default function EvolutionChain({ pokemonName }) {
  const speciesUrl = pokemonName ? `${API}/pokemon-species/${pokemonName}` : null
  const { data: species, loading: speciesLoading, error: speciesError } = useFetch(speciesUrl)
  const { data: chainData, loading: chainLoading, error: chainError } = useFetch(
    species?.evolution_chain?.url || null,
  )

  const [detailsMap, setDetailsMap] = useState({})
  const [loadingSprites, setLoadingSprites] = useState(false)

  const stages = useMemo(
    () => (chainData?.chain ? collectStages(chainData.chain) : []),
    [chainData],
  )

  useEffect(() => {
    if (!stages.length) return
    const names = [...new Set(stages.flat().map((n) => n.name))]
    setLoadingSprites(true)
    Promise.all(
      names.map((n) => fetch(`${API}/pokemon/${n}`).then((r) => (r.ok ? r.json() : null))),
    )
      .then((results) => {
        const map = {}
        results.filter(Boolean).forEach((p) => {
          map[p.name] = p
        })
        setDetailsMap(map)
      })
      .finally(() => setLoadingSprites(false))
  }, [stages])

  if (!pokemonName) return null

  if (speciesLoading || chainLoading || loadingSprites) {
    return (
      <div className="pokedex-evol-card">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando evolución…
        </div>
      </div>
    )
  }

  if (speciesError || chainError || !chainData?.chain) return null

  // Lineal: una sola evolución por etapa → layout horizontal compacto.
  // Ramificada: varias por etapa → layout vertical con más espacio.
  const linear = stages.length > 0 && stages.every((s) => s.length === 1)

  function renderNode(node) {
    const evo = detailsMap[node.name]
    const theme = evo ? getTypeTheme(evo.types) : null
    const isCurrent = node.name === pokemonName
    const sprite = evo?.sprites?.front_default
    return (
      <div
        key={node.name}
        style={
          theme
            ? {
                '--type-main': theme.main,
                '--type-soft': theme.soft,
                '--type-border': theme.border,
              }
            : undefined
        }
        className={`pokedex-evol-node ${isCurrent ? 'pokedex-evol-node--current' : ''}`}
      >
        <div className="pokedex-card-screen pokedex-card-screen--sm">
          {sprite ? (
            <img src={sprite} alt={node.name} className="pixelated" loading="lazy" />
          ) : (
            <span className="text-[10px] text-slate-300">?</span>
          )}
        </div>
        <span className="pokedex-evol-id font-pixel">
          {evo?.id ? `#${String(evo.id).padStart(3, '0')}` : ''}
        </span>
        <span className="pokedex-evol-name">{node.name}</span>
        {isCurrent && <span className="pokedex-evol-flag">ACTUAL</span>}
      </div>
    )
  }

  return (
    <div className="pokedex-evol-card">
      <header className="pokedex-evol-header">
        <span className="pokedex-evol-icon" aria-hidden="true">
          <PokeballLogo />
        </span>
        <div>
          <h3 className="pokedex-evol-title">Cadena de evolución</h3>
          <p className="pokedex-evol-subtitle">{pokemonName}</p>
        </div>
      </header>

      {linear ? (
        <div className="pokedex-evol-flow">
          {stages.map((stage, depth) => (
            <Fragment key={depth}>
              {depth > 0 && (
                <ArrowRight className="pokedex-evol-arrow" aria-hidden="true" />
              )}
              {renderNode(stage[0])}
            </Fragment>
          ))}
        </div>
      ) : (
        stages.map((stage, depth) => (
          <Fragment key={depth}>
            {depth > 0 && (
              <div className="pokedex-evol-connector" aria-hidden="true">
                <ArrowDown className="h-4 w-4" />
              </div>
            )}
            <div className="pokedex-evol-stage">{stage.map((node) => renderNode(node))}</div>
          </Fragment>
        ))
      )}
    </div>
  )
}

import { Fragment, useEffect, useState } from 'react'
import { ArrowRight, GitFork, Loader2 } from 'lucide-react'
import useFetch from '../hooks/useFetch'

const API = '/api'

function flatten(chain, out = []) {
  if (!chain) return out
  out.push(chain.species.name)
  if (chain.evolves_to?.length > 0) {
    flatten(chain.evolves_to[0], out)
  }
  return out
}

export default function EvolutionChain({ pokemonName }) {
  const speciesUrl = pokemonName ? `${API}/pokemon-species/${pokemonName}` : null
  const { data: species, loading: speciesLoading, error: speciesError } = useFetch(speciesUrl)
  const { data: chainData, loading: chainLoading, error: chainError } = useFetch(
    species?.evolution_chain?.url || null,
  )

  const [evolutions, setEvolutions] = useState([])
  const [loadingSprites, setLoadingSprites] = useState(false)

  useEffect(() => {
    if (chainData?.chain) {
      const names = flatten(chainData.chain)
      setLoadingSprites(true)
      Promise.all(
        names.map((n) =>
          fetch(`${API}/pokemon/${n}`).then((r) => (r.ok ? r.json() : null)),
        ),
      )
        .then((results) => setEvolutions(results.filter(Boolean)))
        .finally(() => setLoadingSprites(false))
    }
  }, [chainData])

  if (!pokemonName) return null

  if (speciesLoading || chainLoading || loadingSprites) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando evolución…
        </div>
      </section>
    )
  }

  if (speciesError || chainError || !chainData?.chain) return null

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
          <GitFork className="h-4 w-4" />
        </span>
        Cadena de evolución
      </h3>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {evolutions.map((evo, i) => (
          <Fragment key={evo.id}>
            {i > 0 && <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />}
            <div className="flex w-20 flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-100 bg-gradient-to-b from-slate-50 to-white shadow-sm">
                <img
                  src={evo.sprites?.front_default}
                  alt={evo.name}
                  className="h-14 w-14 object-contain"
                  loading="lazy"
                />
              </div>
              <span className="mt-1 font-pixel text-[8px] text-slate-400">
                {evo.id ? `#${String(evo.id).padStart(3, '0')}` : ''}
              </span>
              <span className="truncate text-xs font-semibold capitalize text-slate-600">
                {evo.name}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}

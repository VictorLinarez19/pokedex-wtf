import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, TriangleAlert } from 'lucide-react'
import Navbar from './components/Navbar'
import SearchAndFilter from './components/SearchAndFilter'
import PokemonGrid from './components/PokemonGrid'
import PokemonCard from './components/PokemonCard'
import EvolutionChain from './components/EvolutionChain'
import CompareView from './components/CompareView'
import SkeletonCard from './components/UI/SkeletonCard'
import useFetch from './hooks/useFetch'
import { loadFavorites, toggleFavorite } from './utils/localStorage'

const API = 'https://pokeapi.co/api/v2'
const PAGE_SIZE = 20
const ALL_POKEMON_LIMIT = 100000

function extractIdFromUrl(url) {
  return Number(url.split('/').filter(Boolean).pop())
}

function SkeletonGrid() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <TriangleAlert className="h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
      <p className="mt-1 text-xs text-slate-400">Inténtalo con otro nombre, ID o tipo.</p>
    </div>
  )
}

function EmptyFavorites() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <Heart className="h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm font-medium text-slate-600">Aún no tienes favoritos</p>
      <p className="mt-1 text-xs text-slate-400">Toca el corazón de un Pokémon para guardarlo aquí.</p>
    </div>
  )
}

function Pagination({ offset, count, onPrev, onNext }) {
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1
  return (
    <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={offset <= 0}
        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </button>
      <span className="text-sm text-slate-500">
        Página <span className="font-semibold text-slate-700">{currentPage}</span> de {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={offset + PAGE_SIZE >= count}
        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function App() {
  const [searchInput, setSearchInput] = useState('')
  const searchTerm = searchInput.trim().toLowerCase()
  const [selectedType, setSelectedType] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState(null)
  const [offset, setOffset] = useState(0)
  const [favorites, setFavorites] = useState(loadFavorites)
  const [showFavorites, setShowFavorites] = useState(false)
  const [compare, setCompare] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)

  const allUrl = searchTerm ? `${API}/pokemon?limit=${ALL_POKEMON_LIMIT}` : null
  const typeUrl = selectedType ? `${API}/type/${selectedType}` : null
  const genUrl = selectedGeneration ? `${API}/generation/${selectedGeneration}` : null
  const listUrl =
    !searchTerm && !selectedType && !selectedGeneration
      ? `${API}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
      : null

  const { data: allData, loading: allLoading, error: allError } = useFetch(allUrl)
  const { data: typeData, loading: typeLoading, error: typeError } = useFetch(typeUrl)
  const { data: genData, loading: genLoading, error: genError } = useFetch(genUrl)
  const { data: listData, loading: listLoading, error: listError } = useFetch(listUrl)

  const searchResults = useMemo(() => {
    if (!searchTerm || !allData?.results) return []
    if (/^\d+$/.test(searchTerm)) {
      return allData.results.filter((p) => String(extractIdFromUrl(p.url)).startsWith(searchTerm))
    }
    return allData.results.filter((p) => p.name.startsWith(searchTerm))
  }, [searchTerm, allData])

  const exactMatch = useMemo(() => {
    if (!searchTerm || !allData?.results) return null
    if (/^\d+$/.test(searchTerm)) {
      return allData.results.find((p) => extractIdFromUrl(p.url) === Number(searchTerm)) || null
    }
    return allData.results.find((p) => p.name === searchTerm) || null
  }, [searchTerm, allData])

  const typePokemon = useMemo(() => {
    if (!typeData?.pokemon) return []
    return typeData.pokemon.map((entry) => entry.pokemon)
  }, [typeData])

  const genPokemon = useMemo(() => {
    if (!genData?.pokemon_species) return []
    return genData.pokemon_species.map((species) => ({
      name: species.name,
      url: species.url.replace('/pokemon-species/', '/pokemon/'),
    }))
  }, [genData])

  const favoritePokemon = useMemo(
    () => favorites.map((f) => ({ name: f.name, url: `${API}/pokemon/${f.id}` })),
    [favorites],
  )

  function handleToggleFavorite(pokemon) {
    setFavorites((prev) => toggleFavorite(prev, pokemon))
  }

  function handleCompare(pokemon) {
    setCompare((prev) => {
      const exists = prev.some((p) => p.id === pokemon.id)
      if (exists) return prev.filter((p) => p.id !== pokemon.id)
      if (prev.length >= 2) return prev
      return [...prev, { id: pokemon.id, name: pokemon.name, url: `${API}/pokemon/${pokemon.id}` }]
    })
  }

  function handleRemoveCompare(id) {
    setCompare((prev) => prev.filter((p) => p.id !== id))
  }

  function handleAddCompare(pokemon) {
    setCompare((prev) => {
      if (prev.some((p) => p.id === pokemon.id) || prev.length >= 2) return prev
      return [...prev, pokemon]
    })
  }

  function handleTypeChange(type) {
    setSelectedType(type)
    setSearchInput('')
    setSelectedGeneration(null)
    setOffset(0)
  }

  function handleGenerationChange(gen) {
    setSelectedGeneration(gen)
    setSearchInput('')
    setSelectedType('')
    setOffset(0)
  }

  function handleSearchChange(value) {
    setSearchInput(value)
    if (value) {
      setSelectedType('')
      setSelectedGeneration(null)
    }
  }

  function handlePrevPage() {
    setOffset((o) => Math.max(0, o - PAGE_SIZE))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNextPage() {
    setOffset((o) => o + PAGE_SIZE)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let content = null

  if (showFavorites) {
    content =
      favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <PokemonGrid
          pokemon={favoritePokemon}
          favorites={favorites}
          compare={compare}
          onToggleFavorite={handleToggleFavorite}
          onCompare={handleCompare}
        />
      )
  } else if (searchTerm) {
    if (allLoading) {
      content = <SkeletonGrid />
    } else if (allError) {
      content = <ErrorState message="No se pudo cargar el listado de Pokémon." />
    } else if (searchResults.length === 0) {
      content = (
        <ErrorState
          message={`No se encontraron Pokémon que empiecen con “${searchInput.trim()}”.`}
        />
      )
    } else {
      const visibleResults = searchResults.slice(0, 20)
      const exactId = exactMatch ? extractIdFromUrl(exactMatch.url) : null
      content = (
        <div className="mt-6 space-y-6">
          {exactMatch && (
            <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
              <PokemonCard
                pokemon={exactMatch}
                isFavorite={favorites.some((f) => f.id === exactId || f.name === exactMatch.name)}
                isSelectedForCompare={compare.some(
                  (c) => c.id === exactId || c.name === exactMatch.name,
                )}
                onToggleFavorite={handleToggleFavorite}
                onCompare={handleCompare}
              />
              <EvolutionChain pokemonName={exactMatch.name} />
            </div>
          )}
          <div>
            <p className="text-sm text-slate-500">
              {visibleResults.length} resultado{visibleResults.length !== 1 ? 's' : ''} para “
              {searchInput.trim()}”
            </p>
            <PokemonGrid
              pokemon={visibleResults}
              favorites={favorites}
              compare={compare}
              onToggleFavorite={handleToggleFavorite}
              onCompare={handleCompare}
            />
          </div>
        </div>
      )
    }
  } else if (selectedType) {
    if (typeLoading) {
      content = <SkeletonGrid />
    } else if (typeError) {
      content = <ErrorState message="No se pudo cargar el tipo seleccionado." />
    } else {
      content = (
        <PokemonGrid
          pokemon={typePokemon}
          favorites={favorites}
          compare={compare}
          onToggleFavorite={handleToggleFavorite}
          onCompare={handleCompare}
        />
      )
    }
  } else if (selectedGeneration) {
    if (genLoading) {
      content = <SkeletonGrid />
    } else if (genError) {
      content = <ErrorState message="No se pudo cargar la generación seleccionada." />
    } else {
      content = (
        <div className="mt-6">
          <p className="text-sm text-slate-500">
            {genPokemon.length} Pokémon en esta generación
          </p>
          <PokemonGrid
            pokemon={genPokemon}
            favorites={favorites}
            compare={compare}
            onToggleFavorite={handleToggleFavorite}
            onCompare={handleCompare}
          />
        </div>
      )
    }
  } else if (listLoading) {
    content = <SkeletonGrid />
  } else if (listError) {
    content = <ErrorState message="No se pudo cargar la lista de Pokémon." />
  } else {
    content = (
      <>
        <PokemonGrid
          pokemon={listData?.results ?? []}
          favorites={favorites}
          compare={compare}
          onToggleFavorite={handleToggleFavorite}
          onCompare={handleCompare}
        />
        {listData && (
          <Pagination
            offset={offset}
            count={listData.count}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        showFavorites={showFavorites}
        favoritesCount={favorites.length}
        compareCount={compare.length}
        onToggleFavorites={() => setShowFavorites((v) => !v)}
        onOpenCompare={() => setCompareOpen(true)}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {!showFavorites && (
          <SearchAndFilter
            search={searchInput}
            onSearchChange={handleSearchChange}
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
            selectedGeneration={selectedGeneration}
            onGenerationChange={handleGenerationChange}
          />
        )}
        {content}
      </main>
      {compareOpen && (
        <CompareView
          compare={compare}
          onClose={() => setCompareOpen(false)}
          onAdd={handleAddCompare}
          onRemove={handleRemoveCompare}
          onClear={() => setCompare([])}
        />
      )}
    </div>
  )
}

export default App

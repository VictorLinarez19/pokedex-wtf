const FAVORITES_KEY = 'pokedex-favorites'

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch {
    // storage unavailable or full; ignore
  }
}

export function toggleFavorite(favorites, pokemon) {
  const exists = favorites.some((f) => f.id === pokemon.id)
  const next = exists
    ? favorites.filter((f) => f.id !== pokemon.id)
    : [...favorites, { id: pokemon.id, name: pokemon.name }]
  saveFavorites(next)
  return next
}

const FAVORITES_KEY = 'pokedex-favorites'
const SESSION_KEY = 'pokedex-session'

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

/* ============================================================
   Sesión de usuario (login)
   ============================================================ */
export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && parsed.username && parsed.access_token ? parsed : null
  } catch {
    return null
  }
}

export function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // storage unavailable or full; ignore
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // storage unavailable; ignore
  }
}

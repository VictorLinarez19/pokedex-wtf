// Temas de color por tipo primario de Pokémon.
// Se usan para el borde/accento dinámico de las tarjetas y la marca de agua.
export const TYPE_THEMES = {
  normal:   { main: '#A8A77A', soft: '#F1F0E7', border: '#DCDBC4' },
  fire:     { main: '#EE8130', soft: '#FDEAD8', border: '#F6C49B' },
  water:    { main: '#6390F0', soft: '#E3ECFD', border: '#B7CBF8' },
  electric: { main: '#F7D02C', soft: '#FDF5D4', border: '#F5E48F' },
  grass:    { main: '#7AC74C', soft: '#E8F6DE', border: '#C2E7A9' },
  ice:      { main: '#96D9D6', soft: '#E4F6F5', border: '#C4EAE7' },
  fighting: { main: '#C22E28', soft: '#F9E0DF', border: '#EBA8A6' },
  poison:   { main: '#A33EA1', soft: '#F3E1F3', border: '#DEA8DD' },
  ground:   { main: '#E2BF65', soft: '#F9F0DB', border: '#EBDB9F' },
  flying:   { main: '#A98FF3', soft: '#EEE9FC', border: '#D3C5F8' },
  psychic:  { main: '#F95587', soft: '#FDE3EC', border: '#F9B6CA' },
  bug:      { main: '#A6B91A', soft: '#F0F4DB', border: '#D4DD97' },
  rock:     { main: '#B6A136', soft: '#F3EFD9', border: '#DED39A' },
  ghost:    { main: '#735797', soft: '#EAE3F2', border: '#C6B2DA' },
  dragon:   { main: '#6F35FC', soft: '#E9E1FE', border: '#C4ADFC' },
  dark:     { main: '#705746', soft: '#E9E2DC', border: '#C6B5AA' },
  steel:    { main: '#B7B7CE', soft: '#EBEBF2', border: '#D1D1E0' },
  fairy:    { main: '#D685AD', soft: '#F9E7F0', border: '#EBC1D8' },
}

export const TYPE_FALLBACK = TYPE_THEMES.normal

export function getTypeTheme(types) {
  const primary = types?.[0]?.type?.name
  return TYPE_THEMES[primary] || TYPE_FALLBACK
}

// Color de la barra estilo HP de videojuegos clásicos según el valor.
export function statBarColor(value) {
  if (value >= 90) return '#22c55e' // verde
  if (value >= 60) return '#84cc16' // lima
  if (value >= 40) return '#eab308' // amarillo
  if (value >= 20) return '#f97316' // naranja
  return '#ef4444' // rojo
}

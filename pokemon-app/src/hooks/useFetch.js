import { useEffect, useState } from 'react'

/**
 * Custom hook que realiza una petición GET a una URL.
 * Limpia estados en cada cambio de URL y evita race conditions
 * mediante un AbortController y una bandera `active`.
 */
export default function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!!url)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) {
      setData(null)
      setLoading(false)
      setError(null)
      return undefined
    }

    const controller = new AbortController()
    let active = true

    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          const err = new Error(`HTTP ${res.status}`)
          err.status = res.status
          throw err
        }
        return res.json()
      })
      .then((json) => {
        if (active) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active && err.name !== 'AbortError') {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [url])

  return { data, loading, error }
}

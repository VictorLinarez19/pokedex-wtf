import { useState } from 'react'
import { Eye, EyeOff, Loader2, Lock, LogIn, User } from 'lucide-react'
import PokeballLogo from './UI/PokeballLogo'

const LOGIN_URL = '/auth/login'


export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!username.trim() || !password) {
      setError('Completa el usuario y la contraseña.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.detail || 'Usuario o contraseña incorrectos')
      }

      const data = await response.json()
      onLogin({ access_token: data.access_token, username: data.username })
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pokedex-bg flex min-h-screen items-center justify-center px-4 py-10 text-slate-900">
      <div className="w-full max-w-sm">
        <div className="auth-card p-8 sm:p-9">
          {/* Lente clásica + LEDs */}
          <div className="flex items-center gap-2.5" aria-hidden="true">
            <span className="pokedex-lens" />
            <span className="flex flex-col gap-[3px]">
              <span className="pokedex-led led-red" />
              <span className="pokedex-led led-yellow" />
              <span className="pokedex-led led-green" />
            </span>
          </div>

          {/* Título */}
          <div className="mt-9 flex flex-col items-center text-center">
            <PokeballLogo className="h-14 w-14 drop-shadow-md" />
            <h1 className="font-pixel mt-5 text-sm tracking-wider text-slate-800">POKÉDEX</h1>
            <p className="mt-3 text-sm font-medium text-slate-500">Acceso de entrenador</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600"
              >
                Usuario
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pokedex-input w-full py-2.5 pl-9 pr-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pokedex-input w-full py-2.5 pl-9 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="game-btn btn-red w-full py-2.5 text-sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogIn className="h-4 w-4" aria-hidden="true" />
              )}
              {loading ? 'Verificando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

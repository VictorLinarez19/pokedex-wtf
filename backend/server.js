import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

const POKEAPI = process.env.POKEAPI_URL
const PORT = process.env.PORT || 3000

function rewriteUrls(value) {
  if (Array.isArray(value)) return value.map(rewriteUrls)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, val] of Object.entries(value)) {
      out[key] =
        typeof val === 'string' && val.startsWith(POKEAPI)
          ? val.replace(POKEAPI, '/api')
          : rewriteUrls(val)
    }
    return out
  }
  return value
}

app.get('/api', (_req, res) => {
  res.json({
    name: 'Pokédex API',
    endpoints: [
      '/api/pokemon?limit=&offset=',
      '/api/pokemon/:nameOrId',
      '/api/type/:type',
      '/api/generation/:generation',
      '/api/pokemon-species/:name',
      '/api/evolution-chain/:id',
    ],
  })
})


app.use('/api', async (req, res) => {
  const target = POKEAPI + req.originalUrl.replace(/^\/api/, '')

  try {
    const upstream = await fetch(target)

    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: `PokeAPI respondió con estado ${upstream.status}` })
    }

    const data = await upstream.json()
    res.json(rewriteUrls(data))
  } catch {
    res.status(502).json({ error: 'No se pudo contactar a PokeAPI' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend Pokédex corriendo en http://localhost:${PORT}`)
})

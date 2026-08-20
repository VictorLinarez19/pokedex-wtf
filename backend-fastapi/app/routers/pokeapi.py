"""Router proxy a PokeAPI — reemplaza al antiguo backend Express (server.js).

Reenvía las peticiones `/api/...` a PokeAPI y reescribe las URLs de la
respuesta de `https://pokeapi.co/api/v2/...` a `/api/...` para que el
frontend las consuma como rutas relativas.

Optimizaciones de rendimiento:
- Usa el cliente HTTP compartido de la app (reutiliza conexiones/TLS).
- Caché en memoria con TTL: los datos de PokeAPI son estáticos, así que
  volver a ver una página o un Pokémon no vuelve a llamar a PokeAPI.
"""

import time
from collections import OrderedDict

import httpx
from fastapi import APIRouter, HTTPException, Request

from app.config import POKEAPI_URL

router = APIRouter(tags=["pokeapi"])

# Caché simple en memoria: {target_url: (timestamp, data_reescrita)}
_CACHE_MAX_ITEMS = 512
_CACHE_TTL_SECONDS = 3600  # 1 hora (los datos de PokeAPI apenas cambian)
_cache: "OrderedDict[str, tuple[float, dict]]" = OrderedDict()


def _get_cached(key: str):
    entry = _cache.get(key)
    if entry is None:
        return None
    timestamp, data = entry
    if time.time() - timestamp > _CACHE_TTL_SECONDS:
        _cache.pop(key, None)
        return None
    return data


def _set_cached(key: str, data):
    _cache[key] = (time.time(), data)
    _cache.move_to_end(key)
    while len(_cache) > _CACHE_MAX_ITEMS:
        _cache.popitem(last=False)


def rewrite_urls(value):
    """Reescribe recursivamente las URLs de PokeAPI a rutas relativas /api/..."""
    if isinstance(value, list):
        return [rewrite_urls(item) for item in value]
    if isinstance(value, dict):
        return {
            key: (
                val.replace(POKEAPI_URL, "/api")
                if isinstance(val, str) and val.startswith(POKEAPI_URL)
                else rewrite_urls(val)
            )
            for key, val in value.items()
        }
    return value


@router.get("/api")
def api_info():
    """Lista los endpoints disponibles del servicio."""
    return {
        "name": "Pokédex API",
        "endpoints": [
            "/api/pokemon?limit=&offset=",
            "/api/pokemon/:nameOrId",
            "/api/type/:type",
            "/api/generation/:generation",
            "/api/pokemon-species/:name",
            "/api/evolution-chain/:id",
        ],
    }


@router.api_route("/api/{path:path}", methods=["GET"])
async def pokeapi_proxy(path: str, request: Request):
    """Reenvía `/api/{path}` a PokeAPI (con caché) y reescribe las URLs."""
    target = f"{POKEAPI_URL}/{path}"
    if request.url.query:
        target = f"{target}?{request.url.query}"

    # 1) Responder desde caché si este recurso ya se consultó antes
    cached = _get_cached(target)
    if cached is not None:
        return cached

    # 2) Consultar a PokeAPI con el cliente HTTP compartido de la app
    try:
        upstream = await request.app.state.http_client.get(target)
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="No se pudo contactar a PokeAPI")

    if upstream.status_code >= 400:
        raise HTTPException(
            status_code=upstream.status_code,
            detail=f"PokeAPI respondió con estado {upstream.status_code}",
        )

    data = rewrite_urls(upstream.json())
    _set_cached(target, data)
    return data

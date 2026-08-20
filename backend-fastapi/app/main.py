"""Aplicación FastAPI de la Pokédex (backend unificado).

Reemplaza al antiguo backend Express: incluye tanto el login como el
proxy a PokeAPI, organizado por routers:

- app/routers/auth.py    -> login /auth/*
- app/routers/pokeapi.py -> proxy /api/*
- app/config.py          -> configuración (.env)
"""

from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, pokeapi


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Cliente HTTP compartido: reutiliza conexiones y TLS con PokeAPI
    # (evita abrir una conexión nueva por cada tarjeta/llamada).
    app.state.http_client = httpx.AsyncClient(timeout=15.0)
    yield
    await app.state.http_client.aclose()


app = FastAPI(title="Pokédex API (FastAPI)", version="2.0.0", lifespan=lifespan)

# CORS solo para desarrollo (el frontend corre en el puerto 5173).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(pokeapi.router)

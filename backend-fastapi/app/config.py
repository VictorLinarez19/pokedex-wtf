"""Configuración central del backend FastAPI.

Todas las variables se cargan desde el archivo `.env` (no hay valores
hardcodeados en el código). Si falta alguna, la app falla con un mensaje claro.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def _required(name: str) -> str:
    """Devuelve el valor de una variable del `.env` o falla si no existe."""
    value = os.getenv(name)
    if value is None or value == "":
        raise RuntimeError(f"Falta la variable '{name}' en el archivo .env")
    return value


# Puerto del servidor unificado
PORT = int(_required("PORT"))

# URL base de PokeAPI (proxy)
POKEAPI_URL = _required("POKEAPI_URL")

# Credenciales del login
ADMIN_USERNAME = _required("ADMIN_USERNAME")
ADMIN_PASSWORD = _required("ADMIN_PASSWORD")

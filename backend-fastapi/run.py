"""Punto de entrada para levantar el backend FastAPI unificado de la Pokédex.

Uso:
    python run.py
"""

import uvicorn

from app.config import PORT

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=PORT, reload=True)

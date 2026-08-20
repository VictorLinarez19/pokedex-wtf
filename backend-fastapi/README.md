# Backend FastAPI — Pokédex (único backend)

Backend unificado de la Pokédex escrito con **FastAPI**. Reemplaza al antiguo
backend Express: expone tanto el **login** como el **proxy a PokeAPI**.

## Estructura

```
backend-fastapi/
├── app/
│   ├── main.py            # Aplicación FastAPI (CORS + routers)
│   ├── config.py          # Configuración desde .env
│   └── routers/
│       ├── auth.py        # Login (/auth/login, /auth/health)
│       └── pokeapi.py     # Proxy a PokeAPI (/api/*)
├── run.py                 # Punto de entrada
├── requirements.txt
└── .env                   # Configuración (puerto, credenciales, PokeAPI)
```

## Credenciales predeterminadas

Están en variables dentro de `app/config.py` (sobrescribibles con `.env`):

| Usuario | Contraseña |
| ------- | ---------- |
| `admin` | `admin123` |

## Requisitos

- Python 3.10+

## Instalación y arranque

```powershell
cd backend-fastapi
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

El servidor queda escuchando en `http://127.0.0.1:3000`.

## Endpoints

- `GET  /auth/health` — estado del servicio.
- `POST /auth/login` — recibe `{ "username": "...", "password": "..." }` y devuelve un token.
- `GET  /api/...` — proxy a PokeAPI (con reescritura de URLs a `/api`).

## Configuración (opcional)

Copia `.env.example` a `.env` para cambiar puerto, credenciales o la URL de PokeAPI:

```powershell
Copy-Item .env.example .env
```

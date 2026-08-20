"""Router de autenticación — login de la Pokédex.

Las credenciales se guardan en variables (app/config.py) y se pueden
sobrescribir con el archivo `.env`.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.config import ADMIN_PASSWORD, ADMIN_USERNAME

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str


@router.get("/auth/health")
def health():
    """Comprueba que el servicio esté activo."""
    return {"status": "ok", "service": "pokedex-api"}


@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    """Valida las credenciales y devuelve un token de acceso."""
    if payload.username != ADMIN_USERNAME or payload.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )

    token = f"pokedex-demo-{payload.username}"
    return LoginResponse(access_token=token, username=payload.username)

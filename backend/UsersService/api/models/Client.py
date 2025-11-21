from typing import Optional

from fastapi.openapi.models import Contact
from pydantic import BaseModel, model_validator
from sqlmodel import SQLModel, Field

from utils import verif_str, validate_password, verif_tel_number
from enum import Enum

class Statut(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"

class ClientModel(BaseModel):
    nom: str
    email: str
    motDePasse: str
    statut: Optional[Statut] = Statut.ACTIVE
    adresse: Optional[str] = None
    telephone: Optional[str] = None
    ImageUrl: Optional[str] = None
    estVendeur: Optional[bool] = False

    @model_validator(mode='after')
    @classmethod
    def _validate(self, m:"Contact") -> "Contact":
        missing = [f for f in ("nom", "email", "motDePasse") if getattr(m, f) is None]
        if missing:
            raise ValueError(f"Missing fields: {', '.join(missing)}")
        if not verif_str(getattr(m, "nom")):
            raise ValueError(f"Username must be alphabetical")
        if not validate_password(getattr(m, "motDePasse")):
            raise ValueError(f"Password not valid")
        if getattr(m,"telephone") and not verif_tel_number(getattr(m, "telephone")):
            raise ValueError(f"Telephone number not valid")
        return m

class ClientLoginModel(BaseModel):
    email: str
    motDePasse: str

    @model_validator(mode='after')
    @classmethod
    def _validate(self, m:"Contact") -> "Contact":
        if not validate_password(getattr(m, "motDePasse")):
            raise ValueError(f"Password not valid")
        return m

class Client(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    nom: str = Field(nullable=False, default=None)
    email: str = Field(nullable=False, default=None)
    motDePasse: str = Field(nullable=False, default=None)
    statut: Optional[Statut] = Field(nullable=False, default=Statut.ACTIVE)
    adresse: Optional[str] = Field(default=None)
    telephone: Optional[str] = Field(default=None)
    estVendeur: Optional[bool] = Field(default=False)

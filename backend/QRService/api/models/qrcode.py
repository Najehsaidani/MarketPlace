"""
QR Code Table Model

Defines the `QRCode` table using SQLModel.
"""

from typing import Optional

from pydantic import BaseModel, HttpUrl
from sqlmodel import Field, SQLModel

class QRUrlRequest(BaseModel):
    qr_url: HttpUrl

class QRCodeModel(BaseModel):
    id_client: int
    id_vendeur: int
    id_commande: int

class QRCode(SQLModel, table=True):
    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        index=True,
    )
    url: str = Field(default=None, nullable=False)
    public_id: str = Field(default=None, nullable=False)

from typing import Optional
from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class SellerRequestModel(BaseModel):
    client: int


class SellerRequest(SQLModel, table=True):
    __tablename__ = "seller_request"
    id: Optional[int] = Field(primary_key=True, default=None)
    client: int = Field(nullable=False)
    accepted: Optional[bool] = Field(nullable=False, default=False)


class SellerRequestResponse(BaseModel):
    id: int
    client: int
    accepted: bool

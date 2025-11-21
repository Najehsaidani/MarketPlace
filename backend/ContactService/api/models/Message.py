from enum import Enum

from pydantic import BaseModel

class Sender(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"

class MessageModel(BaseModel):
    user_id: int
    sender: Sender
    title: str
    content: str

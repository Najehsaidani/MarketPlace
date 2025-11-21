from typing import Optional

from fastapi import APIRouter, HTTPException

from api.models.Message import MessageModel, Sender
from api.services.message_services import create_message, get_all_messages, get_messages_by_user_id

router = APIRouter(prefix="/messages")

@router.post("/send")
async def post_message(payload: MessageModel):
    return await create_message(payload)

@router.get("")
async def get_all():
    return await get_all_messages()

@router.get("/by_user/{id}")
async def get_by_user(id: int, sender: Optional[Sender] = None):
    return await get_messages_by_user_id(id, sender)


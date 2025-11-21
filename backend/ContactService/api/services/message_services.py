from datetime import datetime

from dns.e164 import query

from api.models.Message import MessageModel
from api.services.counter_services import get_next_msg_id
from db.engine import db

async def create_message(payload: MessageModel):
    msg_id = await get_next_msg_id()
    doc = {
        "msg_id": msg_id,
        "user_id": payload.user_id,
        "sender": payload.sender,
        "title": payload.title,
        "content": payload.content,
        "created_at": datetime.utcnow(),
    }
    result = await db["messages"].insert_one(doc)

    # remove Mongo _id completely and optionally add a string id
    doc.pop("_id", None)
    doc["id"] = str(result.inserted_id)

    return doc

async def get_all_messages():
    cursor = db["messages"].find().sort("msg_id", -1)
    out = []
    async for doc in cursor:
        out.append(_doc_to_out(doc))
    return out

def _doc_to_out(doc: dict):
    return {"id" : str(doc.get("_id")),
            "msg_id" : int(doc.get("msg_id")),
            "user_id" : int(doc.get("user_id")),
            "sender" : doc.get("sender"),
            "title" : doc.get("title"),
            "content" : doc.get("content"),
            "created_at" : doc.get("created_at")}

async def get_messages_by_user_id(id, sender):
    query = {"user_id": id}
    if sender:
        query["sender"] = sender

    cursor = db["messages"].find(query).sort("msg_id", -1)
    docs = await cursor.to_list()

    return [_doc_to_out(d) for d in docs]

from pymongo import ReturnDocument
from db.engine import db

async def get_next_msg_id() -> int:
    doc = await db["counters"].find_one_and_update(
        {"_id": "messages"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return int(doc["seq"])

from datetime import datetime
from pymongo.errors import PyMongoError
from pymongo import ReturnDocument
from envconfig import EnvFile
from .engine import sync_client, db

_models = ("messages", "counters")

def create_database_if_not_exists_sync():
    try:
        sync_client.admin.command("ping")
        sync_db = sync_client[EnvFile.DB_NAME]
        existing = sync_db.list_collection_names()
        for coll in _models:
            coll = coll.strip()
            if coll and coll not in existing:
                sync_db.create_collection(coll)
        print(f"Database '{EnvFile.DB_NAME}' checked/created successfully.")
    except PyMongoError as err:
        print("Failed to connect or create collections:", err)
        raise SystemExit(1)

async def init_db():
    create_database_if_not_exists_sync()

    await db["messages"].create_index("msg_id", unique=True)

    await db["counters"].update_one(
        {"_id": "messages"},
        {"$setOnInsert": {"seq": 0, "created_at": datetime.utcnow()}},
        upsert=True,
    )

    max_doc = await db["messages"].find().sort("msg_id", -1).limit(1).to_list(1)
    if max_doc:
        max_msg_id = max_doc[0].get("msg_id", 0) or 0
        cur = await db["counters"].find_one({"_id": "messages"})
        cur_seq = int(cur.get("seq", 0))
        if cur_seq < max_msg_id:
            await db["counters"].update_one(
                {"_id": "messages"},
                {"$set": {"seq": int(max_msg_id)}},
            )


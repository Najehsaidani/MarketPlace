from urllib.parse import quote_plus
import pymongo
from motor.motor_asyncio import AsyncIOMotorClient
from envconfig import EnvFile


def _build_uris():

    host = str(EnvFile.DB_HOST)
    port = str(EnvFile.DB_PORT)
    dbname = EnvFile.DB_NAME

    user = getattr(EnvFile, "DB_USER", None)
    pwd = getattr(EnvFile, "DB_PASS", None)

    if not user or not pwd or str(user).strip() == "" or str(pwd).strip() == "":
        sync_uri = f"mongodb://{host}:{port}/"
        async_uri = f"mongodb://{host}:{port}/"
    else:
        user_e = quote_plus(str(user))
        pwd_e = quote_plus(str(pwd))
        sync_uri = f"mongodb://{user_e}:{pwd_e}@{host}:{port}/admin?authSource=admin"
        async_uri = f"mongodb://{user_e}:{pwd_e}@{host}:{port}/?authSource=admin"

    return sync_uri, async_uri, dbname


sync_uri, async_uri, _DB_NAME = _build_uris()

sync_client = pymongo.MongoClient(sync_uri, serverSelectionTimeoutMS=5000)

_motor_client = AsyncIOMotorClient(async_uri)
db = _motor_client[_DB_NAME]

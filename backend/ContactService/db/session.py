from typing import AsyncGenerator, Callable
from .engine import db

async def get_database() -> AsyncGenerator:
    yield db

def get_collection_dependency(collection_name: str) -> Callable:
    async def _dep():
        return db[collection_name]
    return _dep

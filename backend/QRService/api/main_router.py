from fastapi import APIRouter
from api.routes import qr_routes

router = APIRouter()

router.include_router(qr_routes.router)
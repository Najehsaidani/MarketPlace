from fastapi import APIRouter

from api.routes import client_routes, admin_routes, seller_routes

router = APIRouter()

router.include_router(client_routes.router)
router.include_router(admin_routes.router)
router.include_router(seller_routes.router)

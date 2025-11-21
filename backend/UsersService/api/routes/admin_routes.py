from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from starlette import status

from api.models.Admin import AdminModel, AdminLoginModel
from api.services.admin_services import register_admin, activate_seller, get_clients, delete_client, admin_login
from db.session import get_session

router = APIRouter()

@router.post("/admin/register", status_code=status.HTTP_201_CREATED)
async def register(admin_model: AdminModel, session: AsyncSession = Depends(get_session)):
    return await register_admin(admin_model, session)

@router.patch("/admin/activate_seller/{request_id}", status_code=status.HTTP_200_OK)
async def activate(request_id: int, session: AsyncSession = Depends(get_session)):
    return await activate_seller(request_id, session)

@router.get("/admin/get_clients", status_code=status.HTTP_200_OK)
async def fetch_clients(session: AsyncSession = Depends(get_session)):
    return await get_clients(session)

@router.delete("/client/{id}/delete", status_code=status.HTTP_200_OK)
async def delete_user(id: int, session: AsyncSession = Depends(get_session)):
    return await delete_client(id, session)

@router.post("/admin/login", status_code=status.HTTP_200_OK)
async def login(client_model: AdminLoginModel, session: AsyncSession = Depends(get_session)):
    return await admin_login(client_model, session)
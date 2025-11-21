from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from starlette import status

from api.models.Client import ClientModel, ClientLoginModel
from api.models.Seller_Request import SellerRequestResponse
from api.services.client_services import get_client, register_client, modify_client, switch_role, client_login, get_seller_request_status, cancel_seller_request
from db.session import get_session

router = APIRouter()


@router.post("/client/register", status_code=status.HTTP_201_CREATED)
async def register(client_model: ClientModel, session: AsyncSession = Depends(get_session)):
    return await register_client(client_model, session)


@router.patch("/client/{id}/modify", status_code=status.HTTP_200_OK)
async def modify(id: int, client_model: ClientModel, session: AsyncSession = Depends(get_session)):
    return await modify_client(id, client_model, session)


@router.patch("/client/{id}/switch", status_code=status.HTTP_200_OK)
async def switch(id: int, session: AsyncSession = Depends(get_session)):
    return await switch_role(id, session)

@router.post("/client/login", status_code=status.HTTP_200_OK)
async def login(client_model: ClientLoginModel, session: AsyncSession = Depends(get_session)):
    return await client_login(client_model, session)

@router.get("/client/{id}")
async def read_client(id: int, session: AsyncSession = Depends(get_session)):
    return await get_client(id, session)


@router.get("/client/{id}/seller-request", status_code=status.HTTP_200_OK)
async def get_seller_status(id: int, session: AsyncSession = Depends(get_session)):
    return await get_seller_request_status(id, session)


@router.delete("/client/{id}/seller-request", status_code=status.HTTP_200_OK)
async def cancel_seller_req(id: int, session: AsyncSession = Depends(get_session)):
    return await cancel_seller_request(id, session)
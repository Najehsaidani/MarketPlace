from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from starlette import status

from api.models.Client import ClientModel
from api.services.client_services import get_client, get_seller_request_status
from db.session import get_session

router = APIRouter()


@router.get("/seller/{id}", status_code=status.HTTP_200_OK)
async def get_seller(id: int, session: AsyncSession = Depends(get_session)):
    """Get seller by ID - only returns client info if they are a seller"""
    client = await get_client(id, session)
    if not client.estVendeur:
        raise HTTPException(status_code=404, detail="Client is not a seller")
    return client


@router.get("/seller", status_code=status.HTTP_200_OK)
async def get_all_sellers(session: AsyncSession = Depends(get_session)):
    """Get all sellers"""
    from sqlmodel import select
    from api.models.Client import Client
    
    stmt = select(Client).where(Client.estVendeur == True)
    query = await session.execute(stmt)
    sellers = query.scalars().all()
    return sellers


@router.patch("/seller/{id}/modify", status_code=status.HTTP_200_OK)
async def modify_seller(id: int, client_model: ClientModel, session: AsyncSession = Depends(get_session)):
    """Modify seller information"""
    from api.services.client_services import modify_client
    
    client = await get_client(id, session)
    if not client.estVendeur:
        raise HTTPException(status_code=404, detail="Client is not a seller")
    
    return await modify_client(id, client_model, session)


@router.delete("/seller/{id}", status_code=status.HTTP_200_OK)
async def delete_seller(id: int, session: AsyncSession = Depends(get_session)):
    """Delete a seller (this will just remove their seller status)"""
    from api.services.client_services import switch_role
    
    client = await get_client(id, session)
    if not client.estVendeur:
        raise HTTPException(status_code=404, detail="Client is not a seller")
    
    # Switch their role back to client
    return await switch_role(id, session)
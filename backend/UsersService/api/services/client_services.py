from fastapi import HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from api.models.Client import ClientModel, Client, ClientLoginModel
from api.models.Seller_Request import SellerRequest
from exceptions import AlreadyExistsException, NotFoundException, UnauthorizedException
from utils import hash_password, verify_password

async def register_client(model: ClientModel, session: AsyncSession):
    stmt = select(Client).where(Client.email == model.email)
    query = await session.execute(stmt)
    result = query.scalars().first()

    if result:
        raise AlreadyExistsException("Un utilisateur possède déjà cette adresse e-mail.")

    hashed_pass = hash_password(model.motDePasse)
    model.nom = model.nom.title()
    model.email = model.email.lower()

    if model.adresse:
        model.adresse = model.adresse.lower()

    model.motDePasse = hashed_pass
    client = Client.model_validate(model)

    session.add(client)
    await session.commit()
    return client

async def modify_client(id: int, model: ClientModel, session: AsyncSession):
    client = await session.get(Client, id)
    if not client:
        raise NotFoundException("Ce client n'existe pas.")

    model.nom = model.nom.title()
    model.email = model.email.lower()
    if model.adresse:
        model.adresse = model.adresse.lower()

    client.nom = model.nom
    client.email = model.email
    client.adresse = model.adresse

    if not verify_password(model.motDePasse, client.motDePasse):
        model.motDePasse = hash_password(model.motDePasse)
        client.motDePasse = model.motDePasse

    await session.commit()
    return client

async def switch_role(id: int, session: AsyncSession):
    client = await session.get(Client, id)
    if not client:
        raise NotFoundException("Ce client n'existe pas.")

    if client.estVendeur == True:
        client.estVendeur = False
        await session.commit()
        return {"success": "L'utilisateur n'est plus un vendeur."}
    else:
        req = SellerRequest()
        req.client = id
        session.add(req)
        await session.commit()
        return {"success": "La demande pour devenir vendeur a été envoyée."}

async def client_login(model: ClientLoginModel, session: AsyncSession):
    stmt = select(Client).where(Client.email == model.email.lower())
    query = await session.execute(stmt)
    result = query.scalar_one_or_none()

    if not result:
        raise NotFoundException("Ce client n'existe pas.")

    if not verify_password(model.motDePasse, result.motDePasse):
        raise UnauthorizedException("Le mot de passe est incorrect.")

    return result

async def get_client(id: int, session: AsyncSession):
    client = await session.get(Client, id)
    if not client:
        raise NotFoundException("Ce client n'existe pas.")
    return client


async def get_seller_request_status(client_id: int, session: AsyncSession):
    stmt = select(SellerRequest).where(SellerRequest.client == client_id)
    query = await session.execute(stmt)
    result = query.scalars().first()
    
    if not result:
        raise NotFoundException("Aucune demande de vendeur trouvée pour ce client.")
    
    return result


async def cancel_seller_request(client_id: int, session: AsyncSession):
    stmt = select(SellerRequest).where(SellerRequest.client == client_id)
    query = await session.execute(stmt)
    result = query.scalars().first()
    
    if not result:
        raise NotFoundException("Aucune demande de vendeur trouvée pour ce client.")
    
    # If the request has already been accepted, we can't cancel it
    if result.accepted:
        raise HTTPException(status_code=400, detail="La demande a déjà été acceptée et ne peut pas être annulée.")
    
    await session.delete(result)
    await session.commit()
    
    # Also set the client's estVendeur flag back to False
    client = await session.get(Client, client_id)
    if client:
        client.estVendeur = False
        await session.commit()
    
    return {"success": "La demande de vendeur a été annulée."}

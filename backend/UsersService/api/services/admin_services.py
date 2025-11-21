from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from api.models.Admin import AdminModel, Admin, AdminLoginModel
from api.models.Client import Client
from api.models.Seller_Request import SellerRequest
from exceptions import NotFoundException, AlreadyExistsException, UnauthorizedException
from utils import hash_password, verify_password


async def register_admin(model: AdminModel, session: AsyncSession):
    stmt = select(Admin).where(Admin.email == model.email.lower())
    query = await session.execute(stmt)
    result = query.scalars().first()

    if result:
        raise AlreadyExistsException("Un administrateur possède déjà cette adresse e-mail.")


    model.nom = model.nom.title()
    model.email = model.email.lower()
    model.motDePasse = hash_password(model.motDePasse)

    admin: Admin = Admin.model_validate(model)

    session.add(admin)
    await session.commit()

    return admin

async def activate_seller(id: int, session: AsyncSession):
    request = await session.get(SellerRequest, id)
    if not request:
        raise NotFoundException("La requête est introuvable.")

    client = await session.get(Client, request.client)
    if not client:
        raise NotFoundException("Le client est introuvable.")

    request.accepted = True
    client.estVendeur = True

    session.add(client)
    session.add(request)

    await session.commit()

    return {"success": "La demande du client pour devenir vendeur a été acceptée."}

async def get_clients(session: AsyncSession):
    stmt = select(Client).where(Client.estVendeur == False)
    query = await session.execute(stmt)
    return query.scalars().all()

async def delete_client(id: int, session: AsyncSession):
    client = await session.get(Client, id)
    if not client:
        raise NotFoundException("Le client est introuvable.")

    await session.delete(client)
    await session.commit()
    return {"success": "Le client a été supprimé."}

async def admin_login(model: AdminLoginModel, session: AsyncSession):
    stmt = select(Admin).where(Admin.email == model.email.lower())
    query = await session.execute(stmt)
    result = query.scalar_one_or_none()

    if not result:
        raise NotFoundException("Ce admin n'existe pas.")

    if not verify_password(model.motDePasse, result.motDePasse):
        raise UnauthorizedException("Le mot de passe est incorrect.")

    return result

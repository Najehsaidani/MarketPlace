import jwt
from fastapi import APIRouter, Body

from api.models.user_model import UserModel
from api.services.token_services import create_access_token

router = APIRouter()

@router.post("/token/check", status_code=200)
async def check_token(token: str = Body(..., embed=True)):
    try:
        payload = jwt.decode(token, "DSI33", algorithms=['HS256'])
        # Extract role from payload and convert back to Role enum
        role = payload.get("role")
        return {"valid": True, "role": role}
    except jwt.ExpiredSignatureError:
        return {"valid": False}
    except Exception:
        return {"valid": False}

@router.post("/token/create/client", status_code=201)
async def create_token(user: UserModel):
    access_token = create_access_token(
        data={"sub": str(user.id), "role": "client"}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/token/create/admin", status_code=201)
async def create_token(user: UserModel):
    access_token = create_access_token(
        data={"sub": str(user.id), "role": "admin"}
    )
    return {"access_token": access_token, "token_type": "bearer"}
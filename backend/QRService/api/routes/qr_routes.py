from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from api.models.qrcode import QRCodeModel, QRCode, QRUrlRequest
from api.utils import generate_qrcode, scan_qr_from_url
from db_config.session import get_session

router = APIRouter()

@router.post('/generate', status_code=status.HTTP_201_CREATED)
async def generate_qr(model: QRCodeModel, session: AsyncSession = Depends(get_session)):
    qr_code = QRCode()

    result = generate_qrcode(model)

    qr_code.url = result["url"]
    qr_code.public_id = result["public_id"]

    session.add(qr_code)
    await session.commit()

    return {
        "qr_id": qr_code.id,
        "qr_url": result["url"],
        "public_id": result["public_id"]
    }

@router.post('/scan', status_code=status.HTTP_200_OK)
async def scan(payload: QRUrlRequest):
    return await scan_qr_from_url(str(payload.qr_url))
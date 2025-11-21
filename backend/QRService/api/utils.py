"""
Module for common helper functions used across the application.
"""
import base64
import hashlib
import io
import os
import time
from typing import Dict, Any

import cv2
import numpy as np
from fastapi import UploadFile
from pyzbar import pyzbar
from pyzbar.wrapper import ZBarSymbol
import requests

from api.cloudinary_config import cloudinary

from PIL import Image
from cloudinary.uploader import upload
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.colormasks import SolidFillColorMask
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.main import QRCode

from api.models.qrcode import QRCodeModel
from envconfig import EnvFile
from exceptions import UnprocessableEntityException


def clean_spaces(text: str) -> str:
    stripped = text.strip()
    cleaned = " ".join(stripped.split())
    return cleaned


def remove_spaces(text: str) -> str:
    return text.replace(" ", "")


def verif_str(input_str: str) -> bool:
    """
    Validate that a string is non-empty and contains only alphabetic characters.
    """
    stripped = input_str.replace(" ", "")
    if not stripped:
        return False
    if not stripped.isalpha():
        return False
    return True


def compress_img(src: str, dest: str):
    with Image.open(src) as img:
        img.save(
            dest,
            format="WEBP",
            lossless=True,
            quality=100,
        )

def get_key() -> bytes:
    """
    Converts and returns the encryption key.
    Key is fetched from .env file, converted to bytes then returned.
    """
    return hashlib.sha256(EnvFile.ENCRYPTION_KEY.encode()).digest()


def encrypt(model: QRCodeModel) -> str:
    """
    Encrypt the data to be suitable for QR Code usage.
    Encryption is in the AESGCM method using an encryption key.
    """
    data = f"{model.id_client}-{model.id_vendeur}-{model.id_commande}"
    aesgsm = AESGCM(get_key())

    # Generates a random 12-byte Initialization Vector (IV).
    iv = os.urandom(12)

    # Encrypts the data using AES-GCM (with no associated authenticated data).
    ciphertext = aesgsm.encrypt(iv, data.encode("utf-8"), None)

    # Prepends IV to the ciphertext and encodes the result in Base64 for transport.
    return base64.b64encode(iv + ciphertext).decode("utf-8")


def decrypt(data: str) -> str:
    """
    Decrypt the data read from the QR Code.
    """
    aesgcm = AESGCM(get_key())

    # Decodes the Base64-encoded string received
    decoded = base64.b64decode(data)

    # Extract 12-byte IV and ciphertext
    iv = decoded[:12]
    ciphertext = decoded[12:]

    # Decrypt and decode to UTF-8 string
    plaintext = aesgcm.decrypt(iv, ciphertext, None)
    return plaintext.decode("utf-8")


def generate_qrcode(data: QRCodeModel) -> dict[str, Any]:
    qr = QRCode(
        version=None,
        error_correction=QRCode.ERROR_CORRECT_H if hasattr(QRCode, "ERROR_CORRECT_H") else 3,
        box_size=10,
        border=1,
        image_factory=StyledPilImage,
        mask_pattern=None,
    )

    qr.add_data(encrypt(data))
    qr.make(fit=True)

    img = qr.make_image(
        color_mask=SolidFillColorMask(
            front_color=(0, 0, 0),
            back_color=(255, 255, 255),
        ),
        module_drawer=RoundedModuleDrawer(),
    )
    buffer = io.BytesIO()
    img.save(buffer, format="WEBP")
    buffer.seek(0)

    filename = f"QR-{data.id_commande}-{data.id_client}-{data.id_vendeur}-{int(time.time())}"

    res = upload(
        buffer,
        folder="qr_codes",
        public_id=filename,
        resource_type="image",
        format="webp"
    )

    return {
        "url": res["secure_url"],
        "public_id": res["public_id"]
    }


async def scan_qr_from_url(url: str):
    """
    Downloads an image from a Cloudinary URL and scans the QR code with
    the same preprocessing pipeline used for local uploads.
    """

    # Validate extension (optional but good)
    if not url.lower().startswith("http"):
        raise UnprocessableEntityException("URL invalide.")

    # Download image bytes
    resp = requests.get(url, timeout=30)
    if resp.status_code != 200:
        raise UnprocessableEntityException("Impossible de télécharger l’image.")

    img_bytes = resp.content

    # Convert to OpenCV image
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise UnprocessableEntityException("L'URL ne contient pas une image valide.")

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Resize large images
    max_size = 1600
    h, w = gray.shape
    if max(h, w) > max_size:
        scale = max_size / max(h, w)
        gray = cv2.resize(gray, (int(w * scale), int(h * scale)), cv2.INTER_CUBIC)

    # Preprocessing list
    preprocessed = [
        gray,
        cv2.GaussianBlur(gray, (5, 5), 0),
        cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                              cv2.THRESH_BINARY, 11, 2),
        cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
                              cv2.THRESH_BINARY, 11, 2),
    ]

    decoded = None

    # Try all variants
    for image in preprocessed:
        decoded = pyzbar.decode(image, symbols=[ZBarSymbol.QRCODE])
        if decoded:
            break

        # Try rotated
        for angle in [90, 180, 270]:
            rotated = cv2.rotate(image, _rotation(angle))
            decoded = pyzbar.decode(rotated, symbols=[ZBarSymbol.QRCODE])
            if decoded:
                break

        if decoded:
            break

    if not decoded:
        raise UnprocessableEntityException("Aucun code QR détecté.")

    # Decode & decrypt QR payload
    payload = decoded[0].data.decode("utf-8", errors="replace")
    data = decrypt(payload)

    return data

def _rotation(angle: int) -> int:
    """Maps angle to OpenCV rotation code"""
    return {
        90: cv2.ROTATE_90_CLOCKWISE,
        180: cv2.ROTATE_180,
        270: cv2.ROTATE_90_COUNTERCLOCKWISE,
    }[angle]
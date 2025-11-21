"""
Module for common helper functions used across the application.
"""

import re
import bcrypt

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

def validate_password(value: str) -> bool:
    allowed_chars = r"^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]+$"
    if not re.match(allowed_chars, value):
        return False
    return True

def verif_tel_number(input_num: str) -> bool:
    """
    Validates whether a string is a valid phone number.

    A valid phone number must:
      - Contain only digits
      - Be exactly 8 characters long
      - Not be empty
    """

    stripped = input_num.replace(" ", "")
    if not stripped:
        return False
    if not stripped.isdigit():
        return False
    if len(stripped) != 8:
        return False
    return True

def hash_password(password: str, rounds: int = 12) -> str:
    salt = bcrypt.gensalt(rounds)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except (ValueError, TypeError):
        # In case the stored hash is malformed or None
        return False
"""
Environment Variables configuration module,

Defines Environment Variables imported from the .env file.
"""

from pydantic_settings import BaseSettings


class EnvFile(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    DB_USER: str
    DB_USER_PASSWORD: str

    ENCRYPTION_KEY: str

    CLOUDINARY_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    EUREKA_SERVER_URL: str
    SERVICE_NAME: str
    SERVICE_HOST: str
    SERVICE_PORT: int

    class Config:
        env_file = ".env"


EnvFile = EnvFile()

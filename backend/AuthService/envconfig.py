"""
Environment Variables configuration module,

Defines Environment Variables imported from the .env file.
"""

from pydantic_settings import BaseSettings


class EnvFile(BaseSettings):
    EUREKA_SERVER_URL: str
    SERVICE_NAME: str
    SERVICE_HOST: str
    SERVICE_PORT: int

    class Config:
        env_file = ".env"


EnvFile = EnvFile()

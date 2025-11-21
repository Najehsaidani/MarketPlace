from pydantic_settings import BaseSettings

class EnvFile(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DB_USER: str
    DB_PASS: str

    EUREKA_SERVER_URL: str
    SERVICE_NAME: str
    SERVICE_HOST: str
    SERVICE_PORT: int

    class Config:
        env_file = ".env"

EnvFile = EnvFile()
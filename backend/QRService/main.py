from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from py_eureka_client import eureka_client

from db_config.db_initializer import init_db
from envconfig import EnvFile
from exception_handler import custom_app_exception_handler
from exceptions import AppException
import api.main_router as main_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handle the application's lifespan events.

    Initializes the database before the application starts accepting requests.
    """
    await init_db()
    await startup_event()
    yield
    eureka_client.stop()


app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)

app.add_exception_handler(AppException, custom_app_exception_handler)
app.include_router(main_router.router)

async def startup_event():
    await eureka_client.init_async(
        eureka_server=EnvFile.EUREKA_SERVER_URL,
        app_name=EnvFile.SERVICE_NAME,
        instance_port=EnvFile.SERVICE_PORT,
        instance_host=EnvFile.SERVICE_HOST,
        health_check_url=f"http://{EnvFile.SERVICE_HOST}:{EnvFile.SERVICE_PORT}/health",
        home_page_url=f"http://{EnvFile.SERVICE_HOST}:{EnvFile.SERVICE_PORT}/",
        status_page_url=f"http://{EnvFile.SERVICE_HOST}:{EnvFile.SERVICE_PORT}/status"
    )
    print("✅ QRService registered with Eureka")

@app.get("/health")
def health():
    return {"status": "UP"}

@app.get("/status")
def status():
    return {"status": "running"}

if __name__ == "__main__":
    uvicorn.run(app, host=EnvFile.SERVICE_HOST, port=EnvFile.SERVICE_PORT)

from contextlib import asynccontextmanager
from fastapi import FastAPI

import api.routes.message_routes
from db.db_initializer import init_db
from envconfig import EnvFile
from exception_handler import custom_app_exception_handler
from exceptions import AppException
from py_eureka_client import eureka_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()

    await eureka_client.init_async(
        eureka_server=EnvFile.EUREKA_SERVER_URL,
        app_name=EnvFile.SERVICE_NAME,
        instance_port=EnvFile.SERVICE_PORT,
        instance_host=EnvFile.SERVICE_HOST,
        health_check_url=f"http://{EnvFile.SERVICE_HOST}:{EnvFile.SERVICE_PORT}/health",
        home_page_url=f"http://{EnvFile.SERVICE_HOST}:{EnvFile.SERVICE_PORT}/",
        status_page_url=f"http://{EnvFile.SERVICE_HOST}:{EnvFile.SERVICE_PORT}/status"
    )
    print("✅ Service registered with Eureka")

    yield  # app stays running until shutdown


app = FastAPI(
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None,
    openapi_url=None
)

app.add_exception_handler(AppException, custom_app_exception_handler)
app.include_router(api.routes.message_routes.router)


@app.get("/health")
def health():
    return {"status": "UP"}


@app.get("/status")
def status():
    return {"status": "running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=EnvFile.SERVICE_HOST, port=EnvFile.SERVICE_PORT)

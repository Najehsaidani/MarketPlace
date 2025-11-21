from fastapi import FastAPI
import uvicorn
import router
from envconfig import EnvFile
from exception_handler import custom_app_exception_handler
from exceptions import AppException
from py_eureka_client import eureka_client

app = FastAPI()

app.add_exception_handler(AppException, custom_app_exception_handler)
app.include_router(router.router)

@app.on_event("startup")
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
    print("✅ AuthService registered with Eureka")

@app.get("/health")
def health():
    return {"status": "UP"}

@app.get("/status")
def status():
    return {"status": "running"}

if __name__ == "__main__":
    uvicorn.run(app, host=EnvFile.SERVICE_HOST, port=EnvFile.SERVICE_PORT)

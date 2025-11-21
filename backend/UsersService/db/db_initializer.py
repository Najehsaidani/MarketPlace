import mysql.connector
from mysql.connector import errorcode
from sqlmodel import SQLModel

from envconfig import EnvFile
from .engine import creator_engine

from api.models.Admin import Admin
from api.models.Client import Client



_models = (
    Client,
    Admin
)

def create_database_if_not_exists_sync():
    """
    Synchronously creates the MySQL database if it does not exist.
    """
    try:
        # Connect to MySQL server without a specific database name
        conn = mysql.connector.connect(
            host=EnvFile.DB_HOST,
            user=EnvFile.DB_USER,
            password=EnvFile.DB_PASS,
            port=EnvFile.DB_PORT
        )
        cursor = conn.cursor()

        try:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{EnvFile.DB_NAME}` DEFAULT CHARACTER SET utf8mb4")
            print(f"Database '{EnvFile.DB_NAME}' checked/created successfully.")
        except mysql.connector.Error as err:
            print(f"Failed to create database: {err}")
            exit(1)
        finally:
            cursor.close()
            conn.close()

    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your MySQL user name or password")
        else:
            print(f"Error connecting to MySQL server: {err}")
        exit(1)

async def init_db():
    """
    Initialize the database using the dedicated engine for table definition.
    After creation, the engine is disposed of to clean up resources.
    """
    create_database_if_not_exists_sync()
    async with creator_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    await creator_engine.dispose()

import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
    DB_NAME = os.getenv("DB_NAME", "ecommerce.db")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")
    CORS_ORIGINS = ["http://localhost:3000"]

settings = Settings()

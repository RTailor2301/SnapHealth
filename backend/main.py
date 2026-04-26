import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from routes.analyze import router as analyze_router
from routes.chat import router as chat_router
from routes.health import router as health_router

app = FastAPI(title="SnapHealth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://snaphealth.vercel.app/" 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(analyze_router)
app.include_router(chat_router)

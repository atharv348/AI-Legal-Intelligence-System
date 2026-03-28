from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from app.core.config import settings
from app.core.excel_db import init_db

app = FastAPI(
    title="AI Legal Intelligence System",
    description="An end-to-end AI platform for Indian legal assistance",
    version="0.1.0"
)

@app.on_event("startup")
async def startup_event():
    init_db()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Legal Intelligence System API"}

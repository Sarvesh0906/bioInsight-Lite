from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, data, predict, models, search

app = FastAPI(title="BioInsight Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bioinsight-lite.netlify.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(data.router)
app.include_router(predict.router)
app.include_router(models.router)
app.include_router(search.router)

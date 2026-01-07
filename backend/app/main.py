from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, data, predict, models, search

app = FastAPI(title="BioInsight Lite API")

# 👇 VERY IMPORTANT FOR FRONTEND CONNECTION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later we restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(data.router)
app.include_router(predict.router)
app.include_router(models.router)
app.include_router(search.router)

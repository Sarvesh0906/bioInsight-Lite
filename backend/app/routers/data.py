from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Bioactivity

router = APIRouter(prefix="/data", tags=["Data"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/bioactivity")
def get_bioactivity(db: Session = Depends(get_db)):
    return db.query(Bioactivity).limit(20000).all()

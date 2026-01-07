from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Bioactivity
from app.schemas.search import SearchQuery
from app.utils.nlq import parse_nlq

router = APIRouter(prefix="/search", tags=["Search"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("")
def search_compounds(
    query: SearchQuery,
    db: Session = Depends(get_db)
):
    # ✅ Apply NLQ FIRST
    if query.nlq:
        nlq_filters = parse_nlq(query.nlq)
        for key, value in nlq_filters.items():
            setattr(query, key, value)

    q = db.query(Bioactivity)

    if query.molwt_min is not None:
        q = q.filter(Bioactivity.mw_freebase >= query.molwt_min)

    if query.molwt_max is not None:
        q = q.filter(Bioactivity.mw_freebase <= query.molwt_max)

    if query.logp_min is not None:
        q = q.filter(Bioactivity.alogp >= query.logp_min)

    if query.logp_max is not None:
        q = q.filter(Bioactivity.alogp <= query.logp_max)

    if query.psa_max is not None:
        q = q.filter(Bioactivity.psa <= query.psa_max)

    if query.is_active is not None:
        q = q.filter(Bioactivity.is_active == query.is_active)

    return q.limit(500).all()

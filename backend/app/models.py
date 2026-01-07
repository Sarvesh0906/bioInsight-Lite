from sqlalchemy import Column, Integer, Float, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Bioactivity(Base):
    __tablename__ = "bioactivity_ml_view"

    activity_id = Column(Integer, primary_key=True)
    mw_freebase = Column(Float)
    alogp = Column(Float)
    psa = Column(Float)
    hbd = Column(Integer)
    hba = Column(Integer)
    rtb = Column(Integer)
    is_active = Column(Integer)
    compound_id = Column(String(20))
    target_name = Column(String(200))


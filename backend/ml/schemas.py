from pydantic import BaseModel
from typing import List

class PredictionInput(BaseModel):
    mw_freebase: float
    alogp: float
    psa: float
    hbd: int
    hba: int
    rtb: int


class PredictionOutput(BaseModel):
    model: str
    prediction: str
    probability: float


class ShapFeatureImpact(BaseModel):
    feature: str
    impact: float


class ExplainabilityOutput(BaseModel):
    explanation: List[ShapFeatureImpact]

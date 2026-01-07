from fastapi import APIRouter, HTTPException
from ml.schemas import PredictionInput, PredictionOutput
from ml.inference import (
    predict_with_logistic,
    predict_with_xgboost
)

router = APIRouter(prefix="/predict", tags=["Prediction"])

from ml.shap_utils import explain_prediction
from ml.schemas import ExplainabilityOutput


@router.post("/explain", response_model=ExplainabilityOutput)
def explain_model(data: PredictionInput):
    try:
        explanation = explain_prediction(data.dict())
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/logistic", response_model=PredictionOutput)
def predict_logistic(data: PredictionInput):
    try:
        result = predict_with_logistic(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/xgboost", response_model=PredictionOutput)
def predict_xgboost(data: PredictionInput):
    try:
        result = predict_with_xgboost(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/best")
def predict_best_model(data: PredictionInput):
    """
    Uses XGBoost as the best-performing model
    """
    try:
        return predict_with_xgboost(data.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

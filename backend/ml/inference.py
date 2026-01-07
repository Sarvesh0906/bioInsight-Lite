import numpy as np
from ml.load_models import logistic_model, xgboost_model, scaler

FEATURE_ORDER = [
    "mw_freebase",
    "alogp",
    "psa",
    "hbd",
    "hba",
    "rtb"
]

def predict_with_logistic(data: dict):
    values = np.array([[data[f] for f in FEATURE_ORDER]])
    values_scaled = scaler.transform(values)

    prob = logistic_model.predict_proba(values_scaled)[0][1]
    pred = "Active" if prob >= 0.5 else "Inactive"

    return {
        "model": "Logistic Regression",
        "prediction": pred,
        "probability": round(float(prob), 3)
    }

def predict_with_xgboost(data: dict):
    values = np.array([[data[f] for f in FEATURE_ORDER]])

    prob = xgboost_model.predict_proba(values)[0][1]
    pred = "Active" if prob >= 0.5 else "Inactive"

    return {
        "model": "XGBoost",
        "prediction": pred,
        "probability": round(float(prob), 3)
    }

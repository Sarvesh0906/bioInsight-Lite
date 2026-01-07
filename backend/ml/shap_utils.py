import shap
import numpy as np
from ml.load_models import xgboost_model

# Create SHAP explainer ONCE
explainer = shap.TreeExplainer(xgboost_model)

FEATURE_NAMES = [
    "mw_freebase",
    "alogp",
    "psa",
    "hbd",
    "hba",
    "rtb"
]


def explain_prediction(input_data: dict):
    """
    Returns SHAP values for a single prediction
    """
    values = np.array([[input_data[f] for f in FEATURE_NAMES]])

    shap_values = explainer.shap_values(values)[0]

    explanation = []

    for feature, value in zip(FEATURE_NAMES, shap_values):
        explanation.append({
            "feature": feature,
            "impact": round(float(value), 4)
        })

    return explanation

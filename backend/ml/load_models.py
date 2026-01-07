import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_DIR = os.path.join(BASE_DIR, "models")

# Load models
logistic_model = joblib.load(
    os.path.join(MODEL_DIR, "logistic_regression.pkl")
)

xgboost_model = joblib.load(
    os.path.join(MODEL_DIR, "xgboost.pkl")
)

scaler = joblib.load(
    os.path.join(MODEL_DIR, "scaler.pkl")
)

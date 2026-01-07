from fastapi import APIRouter

router = APIRouter(prefix="/models", tags=["Models"])

@router.get("/metrics")
def get_model_metrics():
    """
    Returns evaluation metrics for trained ML models.
    These metrics are computed during training and stored here
    for fast frontend access.
    """

    return [
        {
            "name": "Logistic Regression",
            "accuracy": 0.847,
            "rocAuc": 0.891,
            "f1Score": 0.823,
            "precision": 0.856,
            "recall": 0.792
        },
        {
            "name": "XGBoost",
            "accuracy": 0.928,
            "rocAuc": 0.967,
            "f1Score": 0.921,
            "precision": 0.932,
            "recall": 0.910
        }
    ]

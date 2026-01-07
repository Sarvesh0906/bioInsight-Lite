import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score
from xgboost import XGBClassifier

# --------------------------------------------------
# Paths
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR, "data", "bioactivity.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

# --------------------------------------------------
# Load Dataset
# --------------------------------------------------
print("Loading dataset...")
df = pd.read_csv(DATA_PATH)

FEATURES = [
    "mw_freebase",
    "alogp",
    "psa",
    "hbd",
    "hba",
    "rtb"
]

TARGET = "is_active"

X = df[FEATURES]
y = df[TARGET]

# --------------------------------------------------
# Train / Test Split
# --------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# --------------------------------------------------
# Feature Scaling (IMPORTANT)
# --------------------------------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# --------------------------------------------------
# Logistic Regression (Baseline Model)
# --------------------------------------------------
print("\nTraining Logistic Regression...")
lr = LogisticRegression(max_iter=1000)
lr.fit(X_train_scaled, y_train)

lr_pred = lr.predict(X_test_scaled)
lr_prob = lr.predict_proba(X_test_scaled)[:, 1]

print("Logistic Regression Results")
print("Accuracy :", accuracy_score(y_test, lr_pred))
print("F1 Score :", f1_score(y_test, lr_pred))
print("ROC AUC  :", roc_auc_score(y_test, lr_prob))

# Save Logistic Regression + Scaler
joblib.dump(lr, os.path.join(MODEL_DIR, "logistic_regression.pkl"))
joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))

print("Saved Logistic Regression model")

# --------------------------------------------------
# XGBoost Model (Advanced Model)
# --------------------------------------------------
print("\nTraining XGBoost...")
xgb = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric="logloss",
    random_state=42
)

xgb.fit(X_train, y_train)

xgb_pred = xgb.predict(X_test)
xgb_prob = xgb.predict_proba(X_test)[:, 1]

print("XGBoost Results")
print("Accuracy :", accuracy_score(y_test, xgb_pred))
print("F1 Score :", f1_score(y_test, xgb_pred))
print("ROC AUC  :", roc_auc_score(y_test, xgb_prob))

# Save XGBoost
joblib.dump(xgb, os.path.join(MODEL_DIR, "xgboost.pkl"))

print("Saved XGBoost model")

print("\n✅ MODEL TRAINING COMPLETED SUCCESSFULLY")

// const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = "https://bioinsight-lite.onrender.com"; // Replace with your deployed backend API URL

/* ------------------ TYPES ------------------ */

export interface PredictionPayload {
  mw_freebase: number;
  alogp: number;
  psa: number;
  hbd: number;
  hba: number; 
  rtb: number;
}

export interface PredictionResponse {
  model: string;
  prediction: "Active" | "Inactive";
  probability: number;
}

export interface ShapImpact {
  feature: string;
  impact: number;
}

export interface ExplainResponse {
  explanation: ShapImpact[];
}

/* ------------------ DATA ------------------ */

export async function fetchActivities() {
  const res = await fetch(`${BASE_URL}/data/bioactivity`);

  if (!res.ok) {
    throw new Error("Failed to fetch bioactivity data");
  }

  return res.json();
}

/* ------------------ ML PREDICTIONS ------------------ */

export async function predictWithLogistic(
  payload: PredictionPayload
): Promise<PredictionResponse> {
  const res = await fetch(`${BASE_URL}/predict/logistic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Logistic prediction failed");
  }

  return res.json();
}

export async function predictWithXGBoost(
  payload: PredictionPayload
): Promise<PredictionResponse> {
  const res = await fetch(`${BASE_URL}/predict/xgboost`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("XGBoost prediction failed");
  }

  return res.json();
}

/* ⭐ BEST MODEL (USE THIS IN UI) */

export async function predictBioactivity(
  payload: PredictionPayload
): Promise<PredictionResponse> {
  const res = await fetch(`${BASE_URL}/predict/best`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Prediction failed");
  }

  return res.json();
}

/* ------------------ SHAP EXPLAINABILITY ------------------ */

export async function explainPrediction(
  payload: PredictionPayload
): Promise<ExplainResponse> {
  const res = await fetch(`${BASE_URL}/predict/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Explainability request failed");
  }

  return res.json();
}

export async function searchCompounds(payload: any) {
  const res = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
}

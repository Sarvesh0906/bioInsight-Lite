import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PredictionForm, PredictionResult } from "@/components/predict/PredictionForm";
import { PredictionResultCard } from "@/components/predict/PredictionResult";
import { FeatureImportanceChart } from "@/components/dashboard/FeatureImportanceChart";
import { fetchActivities } from "@/services/api";

export default function Predict() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [bioactivityData, setBioactivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities()
      .then((response) => {
        setBioactivityData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch bioactivity data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <MainLayout title="Bioactivity Prediction" subtitle="Predict compound bioactivity using ML models">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Form */}
        <div className="space-y-6">
          <PredictionForm onPredict={setResult} />
          
          {/* Info Card */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">About Predictions</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Binary Classification:</strong> Compounds are classified as 
                Active (pChEMBL ≥ 6.5) or Inactive based on molecular descriptors.
              </p>
              <p>
                <strong className="text-foreground">Lipinski's Rule of Five:</strong> The models consider 
                drug-likeness rules including molecular weight, LogP, H-bond donors/acceptors.
              </p>
              <p>
                <strong className="text-foreground">SHAP Explanations:</strong> Feature contributions show 
                how each molecular property influences the prediction.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <PredictionResultCard result={result} />
          ) : (
            <div className="glass-card p-6 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧪</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Prediction Yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Enter molecular descriptors and click "Predict Bioactivity" to get a prediction with SHAP explanations.
                </p>
              </div>
            </div>
          )}

          {/* Global Feature Importance */}
          <FeatureImportanceChart />
        </div>
      </div>
    </MainLayout>
  );
}

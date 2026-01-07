import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModelMetrics {
  name: string;
  accuracy: number;
  rocAuc: number;
  f1Score: number;
  precision: number;
  recall: number;
}

const colors = {
  "Logistic Regression": "hsl(var(--chart-3))",
  "Random Forest": "hsl(var(--chart-2))",
  "XGBoost": "hsl(var(--primary))",
};

function getRankIcon(index: number) {
  switch (index) {
    case 0:
      return <Trophy className="h-6 w-6 text-warning" />;
    case 1:
      return <Medal className="h-6 w-6 text-muted-foreground" />;
    case 2:
      return <Award className="h-6 w-6 text-orange-400" />;
    default:
      return null;
  }
}

export function ModelComparison() {
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/models/metrics")
      .then((res) => res.json())
      .then((data) => {
        setModelMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load model metrics", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="glass-card p-6">Loading model metrics...</div>;
  }

  const rankedModels = [...modelMetrics].sort(
    (a, b) => b.rocAuc - a.rocAuc
  );

  const metricsComparison = [
    { metric: "Accuracy", ...Object.fromEntries(modelMetrics.map(m => [m.name, m.accuracy])) },
    { metric: "ROC-AUC", ...Object.fromEntries(modelMetrics.map(m => [m.name, m.rocAuc])) },
    { metric: "F1-Score", ...Object.fromEntries(modelMetrics.map(m => [m.name, m.f1Score])) },
    { metric: "Precision", ...Object.fromEntries(modelMetrics.map(m => [m.name, m.precision])) },
    { metric: "Recall", ...Object.fromEntries(modelMetrics.map(m => [m.name, m.recall])) },
  ];

  return (
    <div className="space-y-6">
      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rankedModels.map((model, index) => (
          <div
            key={model.name}
            className={cn(
              "glass-card p-6 animate-fade-in",
              index === 0 && "ring-2 ring-primary/50"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  #{index + 1}
                </p>
                <h3 className="text-lg font-semibold text-foreground">
                  {model.name}
                </h3>
              </div>
              {getRankIcon(index)}
            </div>

            <MetricRow label="Accuracy" value={model.accuracy} />
            <MetricRow label="ROC-AUC" value={model.rocAuc} highlight />
            <MetricRow label="F1-Score" value={model.f1Score} />
            <MetricRow label="Precision" value={model.precision} />
            <MetricRow label="Recall" value={model.recall} />
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">
          Metrics Comparison
        </h3>
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={metricsComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis domain={[0.7, 1]} />
              <Tooltip />
              <Legend />
              {modelMetrics.map((m) => (
                <Bar
                  key={m.name}
                  dataKey={m.name}
                  fill={colors[m.name as keyof typeof colors]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-mono",
          highlight ? "text-primary font-semibold" : ""
        )}
      >
        {value.toFixed(3)}
      </span>
    </div>
  );
}

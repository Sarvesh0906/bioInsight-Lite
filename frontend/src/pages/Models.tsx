import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ModelComparison } from "@/components/models/ModelComparison";
import { BarChart3, Code, FileText, GitBranch } from "lucide-react";
import { ModelMetrics } from "@/components/models/ModelComparison";

export default function Models() {
  const [models, setModels] = useState<ModelMetrics[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/models/metrics")
      .then((res) => res.json())
      .then(setModels)
      .catch(console.error);
  }, []);

  const bestModel =
    models.length > 0
      ? [...models].sort((a, b) => b.rocAuc - a.rocAuc)[0].name
      : "-";

  return (
    <MainLayout
      title="Model Comparison"
      subtitle="Compare ML model performance metrics"
    >
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <OverviewCard
            icon={<BarChart3 />}
            label="Models Trained"
            value={models.length}
          />
          <OverviewCard
            icon={<Code />}
            label="Best Model"
            value={bestModel}
          />
          <OverviewCard
            icon={<GitBranch />}
            label="Features Used"
            value="6"
          />
          <OverviewCard
            icon={<FileText />}
            label="Training Samples"
            value="20k+"
          />
        </div>

        <ModelComparison />
      </div>
    </MainLayout>
  );
}

function OverviewCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/20">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

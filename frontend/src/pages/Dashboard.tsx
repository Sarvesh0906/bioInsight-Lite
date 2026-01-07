import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DistributionChart } from "@/components/dashboard/DistributionChart";
import { ActivityPieChart } from "@/components/dashboard/ActivityPieChart";
import { FeatureImportanceChart } from "@/components/dashboard/FeatureImportanceChart";
import { CorrelationHeatmap } from "@/components/dashboard/CorrelationHeatmap";
import { fetchActivities } from "@/services/api";
import { Database, FlaskConical, Target, TrendingUp } from "lucide-react";

interface BioactivityData {
  activity_id: number;
  mw_freebase: number;
  alogp: number;
  psa: number;
  hbd: number;
  hba: number;
  rtb: number;
  is_active: number;
  compound_id: string;
  target_name: string;
}

export default function Dashboard() {
  const [data, setData] = useState<BioactivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities()
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch activities:", error);
        setLoading(false);
      });
  }, []);

  // Compute statistics from fetched data
  const activeCount = data.filter(d => d.is_active === 1).length;
  const uniqueTargets = new Set(data.map(d => d.target_name)).size;

  // Create distribution data
  const createHistogram = (values: number[], bins: number = 10) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const histogram = new Array(bins).fill(0).map((_, i) => ({
      range: `${(min + i * binWidth).toFixed(1)}-${(min + (i + 1) * binWidth).toFixed(1)}`,
      count: 0
    }));

    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[binIndex].count++;
    });

    return histogram;
  };

  const molWeightData = data.length > 0 ? createHistogram(data.map(d => d.mw_freebase)) : [];
  const logPData = data.length > 0 ? createHistogram(data.map(d => d.alogp)) : [];
  const tpsaData = data.length > 0 ? createHistogram(data.map(d => d.psa)) : [];
  
  const activityData = [
    { name: "Active", value: activeCount, fill: "#22c55e" },
    { name: "Inactive", value: data.length - activeCount, fill: "#ef4444" }
  ];

  if (loading) {
    return (
      <MainLayout title="Dashboard" subtitle="ChEMBL v36 Bioactivity Analysis">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard" subtitle="ChEMBL v36 Bioactivity Analysis">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Compounds"
          value={data.length.toLocaleString()}
          change="+12% from last import"
          changeType="positive"
          icon={Database}
        />
        <StatCard
          title="Active Compounds"
          value={activeCount}
          change={`${data.length > 0 ? ((activeCount / data.length) * 100).toFixed(1) : 0}% of total`}
          changeType="neutral"
          icon={FlaskConical}
          iconColor="text-success"
        />
        <StatCard
          title="Unique Targets"
          value={uniqueTargets.toString()}
          change="Across all assays"
          changeType="neutral"
          icon={Target}
          iconColor="text-accent"
        />
        <StatCard
          title="Best Model ROC-AUC"
          value="0.850"
          change="Random Forest"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-primary"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DistributionChart 
          title="Molecular Weight Distribution" 
          data={molWeightData}
          color="hsl(var(--primary))"
        />
        <DistributionChart 
          title="LogP Distribution" 
          data={logPData}
          color="hsl(var(--chart-2))"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ActivityPieChart data={activityData} />
        <div className="lg:col-span-2">
          <DistributionChart 
            title="TPSA Distribution" 
            data={tpsaData}
            color="hsl(var(--chart-4))"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureImportanceChart />
        <CorrelationHeatmap />
      </div>
    </MainLayout>
  );
}

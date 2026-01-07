import { useMemo } from "react";

const features = ["MolWt", "LogP", "TPSA", "HBD", "HBA", "pChEMBL"];

// Simulated correlation matrix
const correlations: Record<string, Record<string, number>> = {
  "MolWt": { "MolWt": 1, "LogP": 0.42, "TPSA": 0.67, "HBD": 0.38, "HBA": 0.56, "pChEMBL": -0.12 },
  "LogP": { "MolWt": 0.42, "LogP": 1, "TPSA": -0.54, "HBD": -0.48, "HBA": -0.23, "pChEMBL": 0.18 },
  "TPSA": { "MolWt": 0.67, "LogP": -0.54, "TPSA": 1, "HBD": 0.71, "HBA": 0.82, "pChEMBL": -0.08 },
  "HBD": { "MolWt": 0.38, "LogP": -0.48, "TPSA": 0.71, "HBD": 1, "HBA": 0.45, "pChEMBL": -0.05 },
  "HBA": { "MolWt": 0.56, "LogP": -0.23, "TPSA": 0.82, "HBA": 1, "HBD": 0.45, "pChEMBL": -0.03 },
  "pChEMBL": { "MolWt": -0.12, "LogP": 0.18, "TPSA": -0.08, "HBD": -0.05, "HBA": -0.03, "pChEMBL": 1 },
};

function getColor(value: number): string {
  if (value >= 0.7) return "bg-primary/90";
  if (value >= 0.4) return "bg-primary/60";
  if (value >= 0.1) return "bg-primary/30";
  if (value >= -0.1) return "bg-muted";
  if (value >= -0.4) return "bg-destructive/30";
  if (value >= -0.7) return "bg-destructive/60";
  return "bg-destructive/90";
}

export function CorrelationHeatmap() {
  const matrix = useMemo(() => {
    return features.map(row => 
      features.map(col => correlations[row]?.[col] ?? correlations[col]?.[row] ?? 0)
    );
  }, []);

  return (
    <div className="chart-container animate-fade-in">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Feature Correlation Matrix</h3>
      <div className="overflow-x-auto">
        <table className="mx-auto">
          <thead>
            <tr>
              <th className="p-2"></th>
              {features.map(f => (
                <th key={f} className="p-2 text-xs font-medium text-muted-foreground">
                  {f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((row, i) => (
              <tr key={row}>
                <td className="p-2 text-xs font-medium text-muted-foreground text-right">
                  {row}
                </td>
                {matrix[i].map((val, j) => (
                  <td key={j} className="p-1">
                    <div 
                      className={`w-12 h-12 flex items-center justify-center rounded-md ${getColor(val)} transition-all hover:scale-110`}
                      title={`${row} × ${features[j]}: ${val.toFixed(2)}`}
                    >
                      <span className="text-xs font-mono text-foreground/80">
                        {val.toFixed(2)}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="w-4 h-4 rounded bg-destructive/60"></span>
        <span>Negative</span>
        <span className="mx-2">→</span>
        <span className="w-4 h-4 rounded bg-muted"></span>
        <span>Zero</span>
        <span className="mx-2">→</span>
        <span className="w-4 h-4 rounded bg-primary/60"></span>
        <span>Positive</span>
      </div>
    </div>
  );
}

import { PredictionResult } from "./PredictionForm";
import { CheckCircle2, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";

interface PredictionResultProps {
  result: PredictionResult;
}

export function PredictionResultCard({ result }: PredictionResultProps) {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-6">Prediction Result</h3>

      {/* Main Result */}
      <div className={cn(
        "rounded-xl p-6 mb-6",
        result.isActive ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {result.isActive ? (
              <CheckCircle2 className="h-10 w-10 text-success" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
            <div>
              <p className="text-2xl font-bold text-foreground">
                {result.isActive ? "Active" : "Inactive"}
              </p>
              <p className="text-sm text-muted-foreground">
                Predicted using {result.model}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">
              {(result.confidence * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Confidence</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-4">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                result.isActive ? "bg-success" : "bg-destructive"
              )}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* SHAP Explanation */}
      <div>
        <h4 className="text-md font-semibold text-foreground mb-4">
          Feature Contributions (SHAP Values)
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={result.shapValues} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis 
                type="number" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                domain={[-0.3, 0.3]}
              />
              <YAxis 
                type="category" 
                dataKey="feature" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                width={70}
              />
              <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value > 0 ? '+' : ''}${value.toFixed(3)}`,
                  `Contribution (value: ${props.payload.value.toFixed(2)})`
                ]}
              />
              <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                {result.shapValues.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.contribution >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-muted-foreground">Positive contribution (→ Active)</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <span className="text-muted-foreground">Negative contribution (→ Inactive)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ActivityPieChartProps {
  data: { name: string; value: number; fill: string }[];
}

export function ActivityPieChart({ data }: ActivityPieChartProps) {
  return (
    <div className="chart-container animate-fade-in">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Activity Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend 
              formatter={(value) => <span className="text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center gap-6">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

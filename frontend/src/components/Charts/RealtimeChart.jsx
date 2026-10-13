import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * RealtimeChart - a dark-themed live line chart.
 * Props:
 *   data     - array of data points from metricsHistory
 *   dataKey  - string key to plot (e.g. 'bandwidth', 'latency')
 *   color    - hex color for the line
 *   title    - optional chart subtitle
 *   yAxisLabel - string label for y-axis
 *   height   - number, px height of chart
 */
export function RealtimeChart({ data = [], dataKey, color = '#22c55e', title, yAxisLabel = '', height = 250 }) {
  return (
    <div className="w-full" style={{ height }}>
      {title && <p className="text-xs text-gray-400 mb-2 font-medium">{title}</p>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#4b5563"
            fontSize={10}
            tickFormatter={(val) => `${val}s`}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#4b5563"
            fontSize={10}
            tickFormatter={(val) => `${Number(val).toFixed(1)}`}
            width={40}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 10 } : undefined}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
              fontSize: 12,
            }}
            itemStyle={{ color }}
            labelFormatter={(val) => `t = ${val}s`}
            formatter={(val) => [`${Number(val).toFixed(2)} ${yAxisLabel}`, dataKey]}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RealtimeChart;

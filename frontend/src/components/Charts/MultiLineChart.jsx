import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * MultiLineChart - dark-themed chart with multiple Y series.
 * Props:
 *   data    - metricsHistory array (each point has 'time' as integer index)
 *   lines   - [{dataKey, name, color}]
 *   height  - px
 */
export function MultiLineChart({ data = [], lines = [], title, height = 300 }) {
  return (
    <div className="w-full" style={{ height }}>
      {title && <p className="text-xs text-gray-400 mb-2 font-medium">{title}</p>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="time"
            tickFormatter={(val) => `${val}s`}
            stroke="#4b5563"
            fontSize={10}
            interval="preserveStartEnd"
          />
          <YAxis stroke="#4b5563" fontSize={10} width={38} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb', fontSize: 12 }}
            labelFormatter={(val) => `t = ${val}s`}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          {lines.map((line, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MultiLineChart;

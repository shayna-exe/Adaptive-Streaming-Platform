import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const QUALITY_MAP  = { '360p': 1, '480p': 2, '720p': 3, '1080p': 4 };
const REVERSE_MAP  = { 1: '360p', 2: '480p', 3: '720p', 4: '1080p' };

/**
 * QualityTimeline - step chart showing quality changes over time.
 * Data = array of QualityDecision objects from backend:
 *   {timestamp, previous_quality, new_quality, reason, ...}
 */
export function QualityTimeline({ data = [], height = 300 }) {
  // Build chart data from decisions - show a point for every decision
  const chartData = data.map((d, i) => ({
    time: i,
    label: d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : `t${i}`,
    qualityLevel: QUALITY_MAP[d.new_quality] || 1,
    quality: d.new_quality,
    reason: d.reason || '',
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-1">{point.label}</p>
          <p className="text-white font-bold text-lg mb-1">{point.quality}</p>
          {point.reason && <p className="text-gray-400 text-xs max-w-[200px]">{point.reason}</p>}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        No quality decisions recorded yet. Simulation must run to populate this chart.
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="time"
            tickFormatter={(val) => chartData[val]?.label || `${val}`}
            stroke="#4b5563"
            fontSize={10}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0.5, 4.5]}
            ticks={[1, 2, 3, 4]}
            tickFormatter={(val) => REVERSE_MAP[val] || val}
            stroke="#4b5563"
            fontSize={10}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="stepAfter"
            dataKey="qualityLevel"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#fff' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default QualityTimeline;

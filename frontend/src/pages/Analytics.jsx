import { useState, useEffect } from 'react';
import QualityTimeline from '../components/Analytics/QualityTimeline';
import DecisionLog from '../components/Analytics/DecisionLog';
import Card from '../components/common/Card';
import RealtimeChart from '../components/Charts/RealtimeChart';
import { api } from '../services/api';
import { useMetrics } from '../hooks/useMetrics';
import { Download, BarChart2 } from 'lucide-react';
import { CHART_COLORS } from '../utils/constants';

export default function Analytics() {
  const { metricsHistory, scores } = useMetrics();
  const [decisions, setDecisions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dData = await api.getDecisions();
        // API returns an array directly
        if (Array.isArray(dData)) setDecisions(dData);
      } catch (e) {}
    };
    const interval = setInterval(fetchData, 2000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  const downloadSession = async () => {
    try {
      const csv = await api.exportCsv();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `session_metrics_${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><BarChart2 size={24} /></div>
          <div>
            <h2 className="text-lg font-bold text-white">Advanced Analytics</h2>
            <p className="text-xs text-gray-400">Detailed view of stream decisions and network performance</p>
          </div>
        </div>
        <button
          onClick={downloadSession}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-colors border border-gray-700"
        >
          <Download size={16} /> Export Session CSV
        </button>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <p className="text-gray-400 text-sm font-medium mb-1">Network Health Score</p>
          <p className="text-4xl font-black text-green-400">
            {scores.network_health.toFixed(0)}<span className="text-lg text-gray-500 font-normal"> / 100</span>
          </p>
          <div className="mt-3 bg-gray-800 rounded-full h-2">
            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${scores.network_health}%` }} />
          </div>
        </Card>
        <Card>
          <p className="text-gray-400 text-sm font-medium mb-1">Quality Stability Score</p>
          <p className="text-4xl font-black text-blue-400">
            {scores.quality_stability.toFixed(0)}<span className="text-lg text-gray-500 font-normal"> / 100</span>
          </p>
          <div className="mt-3 bg-gray-800 rounded-full h-2">
            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${scores.quality_stability}%` }} />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Bandwidth Over Time">
          <RealtimeChart data={metricsHistory} dataKey="bandwidth" color={CHART_COLORS.bandwidth} yAxisLabel="Mbps" height={200} />
        </Card>
        <Card title="Buffer Level Over Time">
          <RealtimeChart data={metricsHistory} dataKey="buffer" color={CHART_COLORS.buffer} yAxisLabel="s" height={200} />
        </Card>
      </div>

      {/* Quality Timeline */}
      <Card title="Quality Transitions Timeline">
        <QualityTimeline data={decisions} height={250} />
      </Card>

      {/* Decision Log */}
      <Card title="Quality Decision Log">
        <DecisionLog decisions={decisions} />
      </Card>
    </div>
  );
}

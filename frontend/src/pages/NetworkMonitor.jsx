import { useMetrics } from '../hooks/useMetrics';
import MetricsCard from '../components/NetworkMetrics/MetricsCard';
import MultiLineChart from '../components/Charts/MultiLineChart';
import NetworkControls from '../components/NetworkControls/NetworkControls';
import Card from '../components/common/Card';
import RealtimeChart from '../components/Charts/RealtimeChart';
import { Activity, Wifi, Radio, Signal } from 'lucide-react';
import { CHART_COLORS } from '../utils/constants';

export default function NetworkMonitor() {
  const { metrics, metricsHistory } = useMetrics();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        {/* 4 metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Bandwidth"
            value={metrics.bandwidth_mbps.toFixed(2)}
            unit="Mbps"
            icon={Activity}
            color="text-green-400 bg-green-500/10 border-green-500/20"
          />
          <MetricsCard
            title="Latency"
            value={Math.round(metrics.latency_ms)}
            unit="ms"
            icon={Signal}
            color="text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
          />
          <MetricsCard
            title="Packet Loss"
            value={metrics.packet_loss_percent.toFixed(2)}
            unit="%"
            icon={Wifi}
            color="text-red-400 bg-red-500/10 border-red-500/20"
          />
          <MetricsCard
            title="Jitter"
            value={Math.round(metrics.jitter_ms)}
            unit="ms"
            icon={Radio}
            color="text-purple-400 bg-purple-500/10 border-purple-500/20"
          />
        </div>

        {/* Multi-line chart */}
        <Card title="Network Metrics Over Time">
          <MultiLineChart
            data={metricsHistory}
            lines={[
              { dataKey: 'bandwidth', name: 'Bandwidth (Mbps)', color: CHART_COLORS.bandwidth },
              { dataKey: 'latency',   name: 'Latency (ms)',     color: CHART_COLORS.latency },
              { dataKey: 'packetLoss', name: 'Packet Loss (%)', color: CHART_COLORS.packetLoss },
            ]}
            height={350}
          />
        </Card>

        {/* Buffer chart */}
        <Card title="Buffer Level Over Time">
          <RealtimeChart
            data={metricsHistory}
            dataKey="buffer"
            color={CHART_COLORS.buffer}
            yAxisLabel="seconds"
            height={200}
          />
        </Card>
      </div>

      {/* Controls panel */}
      <div className="space-y-4">
        <NetworkControls />

        {/* Current profile info */}
        <Card title="Current Profile">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Profile</span>
              <span className="text-white capitalize font-medium">{metrics.network_status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mode</span>
              <span className={`font-medium ${metrics.is_simulated ? 'text-blue-400' : 'text-green-400'}`}>
                {metrics.is_simulated ? 'Simulation' : 'Real Network'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bandwidth</span>
              <span className="text-white font-mono">{metrics.bandwidth_mbps.toFixed(2)} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Latency</span>
              <span className="text-white font-mono">{Math.round(metrics.latency_ms)} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Packet Loss</span>
              <span className="text-white font-mono">{metrics.packet_loss_percent.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Jitter</span>
              <span className="text-white font-mono">{Math.round(metrics.jitter_ms)} ms</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { useMetrics } from '../hooks/useMetrics';
import MetricsCard from '../components/NetworkMetrics/MetricsCard';
import NetworkStatusBadge from '../components/NetworkMetrics/NetworkStatusBadge';
import RealtimeChart from '../components/Charts/RealtimeChart';
import BufferBar from '../components/BufferMonitor/BufferBar';
import QualityIndicator from '../components/QualityIndicator/QualityIndicator';
import AlertPanel from '../components/Analytics/AlertPanel';
import Card from '../components/common/Card';
import { Activity, Wifi, Radio, Signal, Cpu } from 'lucide-react';

export default function Dashboard() {
  const { metrics, streamStatus, bufferStatus, scores, alerts, metricsHistory, connected } = useMetrics();

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-800">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Network Overview</h1>
          <p className="text-sm text-gray-400">
            {metrics.is_simulated ? '🔵 Simulation Mode' : '🟢 Real Network Mode'} 
            {' · '}
            Profile: <span className="text-blue-400 capitalize">{metrics.network_status}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${connected ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
            {connected ? 'LIVE' : 'OFFLINE'}
          </div>
          <NetworkStatusBadge status={metrics.network_status} score={scores.network_health} />
        </div>
      </div>

      {/* 4 metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Scores row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-full">
            <Cpu className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Network Health Score</p>
            <p className="text-2xl font-bold text-white">{scores.network_health.toFixed(0)}<span className="text-sm text-gray-400">/100</span></p>
          </div>
          <div className="flex-1">
            <div className="bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${scores.network_health > 60 ? 'bg-green-500' : scores.network_health > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${scores.network_health}%` }}
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 flex items-center gap-4">
          <div className="bg-cyan-500/10 p-3 rounded-full">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Quality Stability Score</p>
            <p className="text-2xl font-bold text-white">{scores.quality_stability.toFixed(0)}<span className="text-sm text-gray-400">/100</span></p>
          </div>
          <div className="flex-1">
            <div className="bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${scores.quality_stability > 60 ? 'bg-cyan-500' : scores.quality_stability > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${scores.quality_stability}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stream status + bandwidth chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Stream Status" className="lg:col-span-1">
          <QualityIndicator quality={streamStatus.current_quality} mode={streamStatus.mode} bitrate={streamStatus.current_bitrate_mbps} />
          <div className="mt-4 pt-4 border-t border-gray-800">
            <BufferBar
              bufferSeconds={bufferStatus.buffer_seconds}
              bufferState={bufferStatus.buffer_state}
              isBuffering={bufferStatus.is_buffering}
            />
          </div>
        </Card>

        <Card title="Bandwidth Over Time" className="lg:col-span-2">
          <RealtimeChart
            data={metricsHistory}
            dataKey="bandwidth"
            color="#22c55e"
            yAxisLabel="Mbps"
            height={220}
          />
        </Card>
      </div>

      {/* Alerts + latency chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="System Alerts" className="lg:col-span-1">
          <AlertPanel alerts={alerts} />
        </Card>
        <Card title="Latency Over Time" className="lg:col-span-2">
          <RealtimeChart
            data={metricsHistory}
            dataKey="latency"
            color="#f59e0b"
            yAxisLabel="ms"
            height={200}
          />
        </Card>
      </div>
    </div>
  );
}

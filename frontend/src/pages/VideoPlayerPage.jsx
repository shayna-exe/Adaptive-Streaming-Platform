import { useMetrics } from '../hooks/useMetrics';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import QualityIndicator from '../components/QualityIndicator/QualityIndicator';
import BufferBar from '../components/BufferMonitor/BufferBar';
import DecisionLog from '../components/Analytics/DecisionLog';
import Card from '../components/common/Card';
import NetworkControls from '../components/NetworkControls/NetworkControls';
import { api } from '../services/api';
import { useEffect, useState } from 'react';

export default function VideoPlayerPage() {
  const { streamStatus, bufferStatus, connected } = useMetrics();
  const [decisions, setDecisions] = useState([]);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const data = await api.getDecisions();
        if (Array.isArray(data)) setDecisions(data);
      } catch (e) {}
    };
    const interval = setInterval(fetchDecisions, 2000);
    fetchDecisions();
    return () => clearInterval(interval);
  }, []);

  const handleModeChange = async (mode) => {
    await api.setStreamMode(mode, mode === 'fixed' ? streamStatus.current_quality : null);
  };

  const handleQualityChange = async (quality) => {
    await api.setStreamMode('fixed', quality);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main video area */}
      <div className="xl:col-span-2 space-y-4">
        <VideoPlayer
          currentQuality={streamStatus.current_quality}
          isBuffering={bufferStatus.is_buffering}
          bufferLevel={bufferStatus.buffer_seconds}
          mode={streamStatus.mode}
          onModeChange={handleModeChange}
          onQualityChange={handleQualityChange}
        />

        {/* Mode selector */}
        <Card title="Stream Mode">
          <div className="flex gap-3">
            <button
              onClick={() => handleModeChange('adaptive')}
              className={`flex-1 py-3 font-bold rounded text-sm transition-colors ${
                streamStatus.mode === 'adaptive'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🔄 Adaptive Bitrate (ABR)
            </button>
            <button
              onClick={() => handleModeChange('fixed')}
              className={`flex-1 py-3 font-bold rounded text-sm transition-colors ${
                streamStatus.mode === 'fixed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              📌 Fixed Quality
            </button>
          </div>
          {streamStatus.mode === 'fixed' && (
            <div className="flex gap-2 mt-3">
              {['360p', '480p', '720p', '1080p'].map(q => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  className={`flex-1 py-2 text-xs font-bold rounded border transition-colors ${
                    streamStatus.current_quality === q
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : 'border-gray-700 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Side panel */}
      <div className="space-y-4">
        <Card>
          <QualityIndicator
            quality={streamStatus.current_quality}
            mode={streamStatus.mode}
            bitrate={streamStatus.current_bitrate_mbps}
          />
        </Card>

        <Card title="Buffer Monitor">
          <BufferBar
            bufferSeconds={bufferStatus.buffer_seconds}
            bufferState={bufferStatus.buffer_state}
            isBuffering={bufferStatus.is_buffering}
          />
        </Card>

        <Card title="Recent Quality Decisions">
          <DecisionLog decisions={decisions.slice(-8)} compact />
        </Card>
      </div>
    </div>
  );
}

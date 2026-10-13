import { useState } from 'react';
import { Card } from '../common/Card';
import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react';
import { api } from '../../services/api';

const profiles = [
  { id: 'excellent', label: 'EXCELLENT', color: 'bg-green-500' },
  { id: 'good', label: 'GOOD', color: 'bg-green-400' },
  { id: 'moderate', label: 'MODERATE', color: 'bg-yellow-500' },
  { id: 'poor', label: 'POOR', color: 'bg-orange-500' },
  { id: 'very_poor', label: 'VERY POOR', color: 'bg-red-500' },
  { id: 'random', label: 'RANDOM', color: 'bg-purple-500' }
];

export function NetworkControls() {
  const [activeProfile, setActiveProfile] = useState('excellent');
  const [status, setStatus] = useState('RUNNING'); // RUNNING, PAUSED, STOPPED
  const [isCustom, setIsCustom] = useState(false);
  const [customParams, setCustomParams] = useState({ bandwidth: 10, latency: 20, packetLoss: 0, jitter: 5 });

  const handleProfileClick = async (id) => {
    setActiveProfile(id);
    setIsCustom(false);
    await api.setProfile(id);
    if (status !== 'RUNNING') {
      await api.startSimulation();
      setStatus('RUNNING');
    }
  };

  const applyCustom = async () => {
    setIsCustom(true);
    setActiveProfile('');
    await api.setCustom({
      bandwidth_mbps: customParams.bandwidth,
      latency_ms: customParams.latency,
      packet_loss_percent: customParams.packetLoss,
      jitter_ms: customParams.jitter,
    });
  };

  const handleAction = async (action) => {
    if (action === 'start') { await api.startSimulation(); setStatus('RUNNING'); }
    if (action === 'pause') { await api.pauseSimulation(); setStatus('PAUSED'); }
    if (action === 'reset') { await api.resetSimulation(); setStatus('STOPPED'); setActiveProfile('excellent'); }
  };

  return (
    <Card title="Network Simulation Controls">
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Pre-defined Profiles</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => handleProfileClick(p.id)}
                className={`py-2 px-3 rounded-md text-xs font-bold transition-all border ${
                  activeProfile === p.id 
                    ? `${p.color} text-gray-900 border-transparent shadow-[0_0_10px_rgba(0,0,0,0.5)]` 
                    : `bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700`
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={14} /> Custom Parameters
            </h4>
            <button 
              onClick={applyCustom}
              className={`text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium ${isCustom ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-gray-900' : ''}`}
            >
              Apply Custom
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'bandwidth', label: 'Bandwidth (Mbps)', min: 0.1, max: 20, step: 0.1 },
              { id: 'latency', label: 'Latency (ms)', min: 0, max: 500, step: 1 },
              { id: 'packetLoss', label: 'Packet Loss (%)', min: 0, max: 15, step: 0.1 },
              { id: 'jitter', label: 'Jitter (ms)', min: 0, max: 100, step: 1 }
            ].map(field => (
              <div key={field.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{field.label}</span>
                  <span className="text-gray-200 font-mono">{customParams[field.id]}</span>
                </div>
                <input 
                  type="range" 
                  min={field.min} max={field.max} step={field.step} 
                  value={customParams[field.id]}
                  onChange={e => setCustomParams({...customParams, [field.id]: parseFloat(e.target.value)})}
                  className="w-full accent-blue-500 bg-gray-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 flex gap-2">
          <button 
            onClick={() => handleAction('start')}
            disabled={status === 'RUNNING'}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
          >
            <Play size={16} /> Start
          </button>
          <button 
            onClick={() => handleAction('pause')}
            disabled={status !== 'RUNNING'}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
          >
            <Pause size={16} /> Pause
          </button>
          <button 
            onClick={() => handleAction('reset')}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>
    </Card>
  );
}

export default NetworkControls;

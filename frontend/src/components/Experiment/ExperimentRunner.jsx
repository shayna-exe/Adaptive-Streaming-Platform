import { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Play, Square, Timer } from 'lucide-react';
import { api } from '../../services/api';
import { QUALITY_LEVELS } from '../../utils/constants';

export function ExperimentRunner({ onComplete }) {
  const [config, setConfig] = useState({
    duration: 60,
    scenario: 'stable',
    mode: 'adaptive',
    fixedQuality: '720p'
  });
  
  const [status, setStatus] = useState('idle'); // idle, running, completed
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [expId, setExpId] = useState(null);

  useEffect(() => {
    let timer;
    if (status === 'running' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          setProgress(((config.duration - newTime) / config.duration) * 100);
          if (newTime <= 0) {
            checkStatus(); // Should be done now
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, timeLeft, config.duration]);

  const checkStatus = async () => {
    try {
      const res = await api.getExperimentStatus();
      if (!res.is_running && status === 'running') {
        setStatus('completed');
        if (onComplete) onComplete(res.last_result_id);
      }
    } catch (e) { console.error(e); }
  };

  const startExperiment = async () => {
    try {
      const res = await api.startExperiment({
        duration_seconds: config.duration,
        scenario: config.scenario,
        mode: config.mode,
        fixed_quality: config.mode === 'fixed' ? config.fixedQuality : null,
      });
      setExpId(res.experiment_id);
      setStatus('running');
      setTimeLeft(config.duration);
      setProgress(0);
    } catch (e) { console.error("Failed to start", e); }
  };

  const stopExperiment = async () => {
    try {
      await api.stopExperiment();
      setStatus('completed');
      setTimeLeft(0);
      setProgress(100);
      if (onComplete) onComplete(expId);
    } catch (e) { console.error("Failed to stop", e); }
  };

  return (
    <Card title="Experiment Setup" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Duration</label>
            <div className="flex gap-2">
              {[30, 60, 120].map(d => (
                <button
                  key={d} onClick={() => setConfig({...config, duration: d})}
                  disabled={status === 'running'}
                  className={`flex-1 py-2 text-sm rounded border ${config.duration === d ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Scenario</label>
            <select 
              value={config.scenario} 
              onChange={e => setConfig({...config, scenario: e.target.value})}
              disabled={status === 'running'}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="stable">Stable Network</option>
              <option value="gradual_degradation">Gradual Degradation</option>
              <option value="sudden_drop">Sudden Drop (Spike)</option>
              <option value="recovery">Recovery</option>
              <option value="random">Random Fluctuation</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Stream Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setConfig({...config, mode: 'adaptive'})}
                disabled={status === 'running'}
                className={`flex-1 py-2 text-sm rounded border ${config.mode === 'adaptive' ? 'bg-green-600 text-white border-green-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
              >
                Adaptive (ABR)
              </button>
              <button
                onClick={() => setConfig({...config, mode: 'fixed'})}
                disabled={status === 'running'}
                className={`flex-1 py-2 text-sm rounded border ${config.mode === 'fixed' ? 'bg-purple-600 text-white border-purple-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
              >
                Fixed Quality
              </button>
            </div>
          </div>

          {config.mode === 'fixed' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Fixed Quality Level</label>
              <select 
                value={config.fixedQuality} 
                onChange={e => setConfig({...config, fixedQuality: e.target.value})}
                disabled={status === 'running'}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {QUALITY_LEVELS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-800 pt-6">
        {status === 'idle' || status === 'completed' ? (
          <button 
            onClick={startExperiment}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Play size={20} /> START EXPERIMENT
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-blue-400 flex items-center gap-2 animate-pulse">
                <Timer size={16} /> Experiment Running...
              </span>
              <span className="text-gray-400">{timeLeft}s remaining</span>
            </div>
            
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <button 
              onClick={stopExperiment}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Square size={20} /> STOP EARLY
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ExperimentRunner;

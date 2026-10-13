import { useState, useEffect } from 'react';
import ComparisonTable from '../components/Comparison/ComparisonTable';
import Card from '../components/common/Card';
import { api } from '../services/api';
import { Play, RefreshCw } from 'lucide-react';

export default function Comparison() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [runningMode, setRunningMode] = useState(null);

  const loadResults = async () => {
    try {
      const data = await api.getExperimentResults();
      // API returns array directly
      if (Array.isArray(data)) setResults(data.reverse ? data.reverse() : data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadResults(); }, []);

  const runQuickExperiment = async (mode) => {
    setLoading(true);
    setRunningMode(mode);
    try {
      await api.startExperiment({
        duration_seconds: 60,
        scenario: 'gradual_degradation',
        mode: mode,
        fixed_quality: mode === 'fixed' ? '1080p' : null,
      });
      // Poll until done
      const interval = setInterval(async () => {
        try {
          const status = await api.getExperimentStatus();
          if (!status.is_running) {
            clearInterval(interval);
            setLoading(false);
            setRunningMode(null);
            loadResults();
          }
        } catch (e) {
          clearInterval(interval);
          setLoading(false);
          setRunningMode(null);
        }
      }, 2000);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setRunningMode(null);
    }
  };

  const adaptiveResults = results.filter(r => r.mode === 'adaptive');
  const fixedResults    = results.filter(r => r.mode === 'fixed');
  const latestAdaptive  = adaptiveResults[0];
  const latestFixed     = fixedResults[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-2">Adaptive vs Fixed Quality Comparison</h2>
        <p className="text-gray-400 text-sm mb-6">
          Run both experiments under the same <strong>Gradual Degradation</strong> network scenario (60 seconds each)
          to generate a fair comparison. Adaptive streaming should show fewer buffering events and better buffer health.
        </p>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => runQuickExperiment('adaptive')}
            disabled={loading}
            className="flex-1 min-w-[200px] py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold rounded-lg flex justify-center items-center gap-2 transition-colors"
          >
            {loading && runningMode === 'adaptive' ? (
              <><RefreshCw size={18} className="animate-spin" /> Running Adaptive...</>
            ) : (
              <><Play size={18} /> Run Adaptive (60s)</>
            )}
          </button>
          <button
            onClick={() => runQuickExperiment('fixed')}
            disabled={loading}
            className="flex-1 min-w-[200px] py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-lg flex justify-center items-center gap-2 transition-colors"
          >
            {loading && runningMode === 'fixed' ? (
              <><RefreshCw size={18} className="animate-spin" /> Running Fixed 1080p...</>
            ) : (
              <><Play size={18} /> Run Fixed 1080p (60s)</>
            )}
          </button>
        </div>

        {loading && (
          <div className="mt-4 bg-gray-800 rounded-lg p-3 text-sm text-gray-300 animate-pulse">
            ⏳ Experiment in progress ({runningMode} mode)... This will take 60 seconds.
          </div>
        )}
      </div>

      {/* Results */}
      {latestAdaptive && latestFixed ? (
        <ComparisonTable adaptiveResult={latestAdaptive} fixedResult={latestFixed} />
      ) : (
        <Card>
          <div className="py-12 text-center space-y-3">
            <div className="text-4xl">📊</div>
            <p className="text-white font-medium">No comparison data yet</p>
            <p className="text-sm text-gray-400">
              Run both Adaptive and Fixed experiments above to generate comparison results.
            </p>
            <p className="text-xs text-gray-500">
              Status: Adaptive runs = {adaptiveResults.length}, Fixed runs = {fixedResults.length}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

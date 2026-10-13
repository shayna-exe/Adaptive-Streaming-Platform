import { useState, useEffect } from 'react';
import ExperimentRunner from '../components/Experiment/ExperimentRunner';
import Card from '../components/common/Card';
import { api } from '../services/api';
import { FileText, Download, CheckCircle } from 'lucide-react';

export default function Experiments() {
  const [results, setResults] = useState([]);

  const loadResults = async () => {
    try {
      const data = await api.getExperimentResults();
      // API returns array directly
      if (Array.isArray(data)) setResults([...data].reverse());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    loadResults();
    const interval = setInterval(loadResults, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = () => {
    loadResults();
  };

  const downloadCsv = async (id) => {
    try {
      const csv = await api.exportExperimentCsv(id);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `experiment_${id.slice(0, 8)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ExperimentRunner onComplete={handleComplete} />

      <Card title="Experiment History">
        {results.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <div className="text-4xl">🧪</div>
            <p className="text-white font-medium">No experiments yet</p>
            <p className="text-sm text-gray-400">Run an experiment above to see results here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((res, i) => (
              <div
                key={res.experiment_id || i}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400 mt-0.5">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">
                        {res.scenario?.replace(/_/g, ' ').toUpperCase()} — {res.mode?.toUpperCase()}
                        {res.mode === 'fixed' && res.fixed_quality ? ` (${res.fixed_quality})` : ''}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1">
                        <span>{new Date(res.start_time).toLocaleString()}</span>
                        <span>Duration: {res.duration_seconds}s</span>
                        <span>Avg BW: {Number(res.avg_bandwidth).toFixed(2)} Mbps</span>
                        <span>Buffer Events: {res.buffering_events}</span>
                        <span>Quality Switches: {res.quality_switches}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadCsv(res.experiment_id)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors border border-gray-600"
                    >
                      <Download size={14} /> CSV
                    </button>
                    <button
                      onClick={() => {
                        const json = JSON.stringify(res, null, 2);
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `experiment_${res.experiment_id?.slice(0, 8)}.json`;
                        a.click();
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors border border-gray-600"
                    >
                      <FileText size={14} /> JSON
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

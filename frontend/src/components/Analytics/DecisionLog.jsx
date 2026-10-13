import { useEffect, useRef } from 'react';
import { getQualityColor } from '../../utils/formatters';

/**
 * DecisionLog - displays a table of ABR quality decisions.
 * Props:
 *   decisions (array): from backend QualityDecision model
 *     {timestamp, previous_quality, new_quality, reason, bandwidth_mbps, buffer_seconds}
 *   compact (bool): show fewer columns in compact mode
 */
export function DecisionLog({ decisions = [], compact = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [decisions]);

  const formatTs = (ts) => {
    if (!ts) return '';
    try { return new Date(ts).toLocaleTimeString(); } catch { return ts; }
  };

  return (
    <div className="flex flex-col" style={{ maxHeight: compact ? '300px' : '400px' }}>
      <div className="flex-1 overflow-auto rounded-md border border-gray-800" ref={containerRef}>
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-900 sticky top-0 z-10 border-b border-gray-800 text-gray-400">
            <tr>
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Decision</th>
              <th className="px-3 py-2 font-medium">BW</th>
              <th className="px-3 py-2 font-medium">Buffer</th>
              {!compact && <th className="px-3 py-2 font-medium hidden sm:table-cell">Reason</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {decisions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-3 py-6 text-center text-gray-500">
                  No decisions recorded yet
                </td>
              </tr>
            ) : decisions.map((d, i) => {
              const isChange = d.previous_quality !== d.new_quality;
              const qColor = getQualityColor(d.new_quality).split(' ')[0];

              return (
                <tr key={i} className={`hover:bg-gray-800/50 transition-colors ${isChange ? 'bg-yellow-500/5' : ''}`}>
                  <td className="px-3 py-2 text-gray-400 whitespace-nowrap font-mono">
                    {formatTs(d.timestamp)}
                  </td>
                  <td className="px-3 py-2">
                    {isChange ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500">{d.previous_quality}</span>
                        <span className="text-gray-600">→</span>
                        <span className={`font-bold ${qColor}`}>{d.new_quality}</span>
                      </div>
                    ) : (
                      <span className={`font-medium ${qColor} opacity-60`}>
                        ≡ {d.new_quality}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-300">
                    {Number(d.bandwidth_mbps).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-300">
                    {Number(d.buffer_seconds).toFixed(1)}s
                  </td>
                  {!compact && (
                    <td className="px-3 py-2 text-gray-400 hidden sm:table-cell truncate max-w-[200px]" title={d.reason}>
                      {d.reason}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DecisionLog;

import Card from '../common/Card';

/**
 * ComparisonTable - side-by-side comparison of Adaptive vs Fixed experiment results.
 * Props:
 *   adaptiveResult: ExperimentResult (mode='adaptive')
 *   fixedResult:    ExperimentResult (mode='fixed')
 *
 * Backend ExperimentResult fields:
 *   avg_bandwidth, avg_latency, avg_packet_loss, avg_buffer,
 *   quality_switches, buffering_events, total_buffering_duration,
 *   avg_quality_score, network_health_score, quality_stability_score
 */
export function ComparisonTable({ adaptiveResult, fixedResult }) {
  if (!adaptiveResult || !fixedResult) return null;

  const metrics = [
    { label: 'Avg Quality Score (1=360p, 4=1080p)', key: 'avg_quality_score',         fmt: v => Number(v).toFixed(2), better: 'higher' },
    { label: 'Quality Switches',                     key: 'quality_switches',           fmt: v => v,                    better: 'lower'  },
    { label: 'Buffering Events',                     key: 'buffering_events',           fmt: v => v,                    better: 'lower'  },
    { label: 'Total Buffering Time (s)',              key: 'total_buffering_duration',   fmt: v => Number(v).toFixed(1), better: 'lower'  },
    { label: 'Avg Buffer Level (s)',                  key: 'avg_buffer',                 fmt: v => Number(v).toFixed(1), better: 'higher' },
    { label: 'Avg Bandwidth (Mbps)',                  key: 'avg_bandwidth',              fmt: v => Number(v).toFixed(2), better: 'higher' },
    { label: 'Avg Latency (ms)',                      key: 'avg_latency',                fmt: v => Number(v).toFixed(0), better: 'lower'  },
    { label: 'Avg Packet Loss (%)',                   key: 'avg_packet_loss',            fmt: v => Number(v).toFixed(2), better: 'lower'  },
    { label: 'Network Health Score',                  key: 'network_health_score',       fmt: v => Number(v).toFixed(1), better: 'higher' },
    { label: 'Quality Stability Score',               key: 'quality_stability_score',    fmt: v => Number(v).toFixed(1), better: 'higher' },
  ];

  const renderCell = (metric, result, isAdaptive) => {
    const aVal = Number(adaptiveResult[metric.key] || 0);
    const fVal = Number(fixedResult[metric.key] || 0);
    const val  = isAdaptive ? aVal : fVal;

    let isBetter = false;
    if (metric.better === 'higher') isBetter = isAdaptive ? aVal > fVal : fVal > aVal;
    if (metric.better === 'lower')  isBetter = isAdaptive ? aVal < fVal : fVal < aVal;
    if (aVal === fVal) isBetter = false;

    return (
      <td className={`px-4 py-3 text-center font-mono text-sm ${
        isBetter ? 'text-green-400 font-bold bg-green-500/5' : 'text-gray-300'
      }`}>
        {isBetter && <span className="mr-1">✓</span>}
        {metric.fmt(val)}
      </td>
    );
  };

  return (
    <Card title="Comparison Results — Adaptive vs Fixed">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-gray-400 font-medium text-sm w-1/2">Metric</th>
              <th className="px-4 py-3 text-center text-green-400 font-bold border-b-2 border-green-500">
                🔄 Adaptive (ABR)
              </th>
              <th className="px-4 py-3 text-center text-purple-400 font-bold border-b-2 border-purple-500">
                📌 Fixed {fixedResult.fixed_quality || '1080p'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {metrics.map((m, i) => (
              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-sm">{m.label}</td>
                {renderCell(m, adaptiveResult, true)}
                {renderCell(m, fixedResult, false)}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-3 px-1">
          ✓ = better value for this metric. Experiment scenario: <span className="text-gray-400">{adaptiveResult.scenario}</span>
        </p>
      </div>
    </Card>
  );
}

export default ComparisonTable;

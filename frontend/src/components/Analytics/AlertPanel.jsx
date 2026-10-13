import { AlertTriangle, Info, ShieldAlert, Bell } from 'lucide-react';

/**
 * AlertPanel - shows recent system alerts from the backend.
 * Props:
 *   alerts (array): AlertEvent objects with {timestamp, type, message, severity}
 */
export function AlertPanel({ alerts = [] }) {
  const formatTs = (ts) => {
    if (!ts) return '';
    try { return new Date(ts).toLocaleTimeString(); } catch { return ts; }
  };

  const getAlertStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return { colors: 'bg-red-500/10 border-red-500/30 text-red-400', Icon: ShieldAlert };
      case 'warning':
        return { colors: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400', Icon: AlertTriangle };
      default:
        return { colors: 'bg-blue-500/10 border-blue-500/30 text-blue-400', Icon: Info };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-gray-400" />
          <h3 className="text-sm font-medium text-gray-300">System Alerts</h3>
        </div>
        {alerts.length > 0 && (
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
            {alerts.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm border border-dashed border-gray-800 rounded-lg">
            <p>✅ No alerts</p>
            <p className="text-xs mt-1">Network is operating normally</p>
          </div>
        ) : (
          [...alerts].reverse().slice(0, 10).map((alert, i) => {
            const { colors, Icon } = getAlertStyle(alert.severity);
            return (
              <div
                key={i}
                className={`p-3 rounded-lg border flex gap-3 items-start ${colors}`}
              >
                <Icon size={16} className="shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-tight">{alert.message}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">
                    {formatTs(alert.timestamp)} · {alert.type}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AlertPanel;

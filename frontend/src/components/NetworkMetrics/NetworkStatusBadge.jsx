import { getNetworkStatusColor } from '../../utils/formatters';

export function NetworkStatusBadge({ status = 'GOOD', score = 100 }) {
  const bgColor = getNetworkStatusColor(status);
  
  return (
    <div className="flex items-center gap-3">
      <div className={`px-3 py-1 rounded-full text-xs font-bold text-gray-900 ${bgColor}`}>
        {status.toUpperCase()}
      </div>
      <div className="text-sm font-medium text-gray-400">
        Health Score: <span className="text-white">{score}/100</span>
      </div>
    </div>
  );
}

export default NetworkStatusBadge;

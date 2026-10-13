import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card } from '../common/Card';

export function MetricsCard({ title, value, unit, icon: Icon, color, trend }) {
  return (
    <Card className={`border-l-4 ${color.replace('text-', 'border-')}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="text-sm text-gray-500 font-medium">{unit}</span>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-gray-800/50 ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-1 text-xs font-medium">
        {trend === 'up' && <><ArrowUp size={14} className="text-red-400" /><span className="text-gray-500">Increasing</span></>}
        {trend === 'down' && <><ArrowDown size={14} className="text-green-400" /><span className="text-gray-500">Decreasing</span></>}
        {trend === 'stable' && <><Minus size={14} className="text-blue-400" /><span className="text-gray-500">Stable</span></>}
      </div>
    </Card>
  );
}

export default MetricsCard;

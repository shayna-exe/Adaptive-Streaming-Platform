import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Activity } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const { connected } = useWebSocket();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const routeNames = {
    '/': 'Dashboard',
    '/player': 'Video Player',
    '/monitor': 'Network Monitor',
    '/experiments': 'Experiments',
    '/comparison': 'Comparison',
    '/analytics': 'Analytics',
    '/about': 'About',
  };

  const title = routeNames[location.pathname] || 'AdaptiveStream';

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          SIMULATION MODE
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'} transition-colors`} />
          <span className="text-sm text-gray-400 font-medium">
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
        <div className="text-sm text-gray-400 font-mono font-medium">
          {time.toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
}

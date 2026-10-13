import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlaySquare, Activity, FlaskConical, GitCompare, BarChart2, Info, Wifi, WifiOff } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function Sidebar() {
  const { connected } = useWebSocket();
  
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/player', label: 'Video Player', icon: PlaySquare },
    { to: '/monitor', label: 'Network Monitor', icon: Activity },
    { to: '/experiments', label: 'Experiments', icon: FlaskConical },
    { to: '/comparison', label: 'Comparison', icon: GitCompare },
    { to: '/analytics', label: 'Analytics', icon: BarChart2 },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <aside className="w-64 bg-gray-900 flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Activity className="text-green-500" size={24} />
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          AdaptiveStream
        </h1>
      </div>
      
      <div className="p-4">
        <div className="px-3 py-1 text-xs font-semibold text-green-500 bg-green-500/10 rounded-full inline-block border border-green-500/20">
          SIMULATION MODE
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800 text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          {connected ? (
            <>
              <Wifi size={14} className="text-green-500" />
              <span>Connected to backend</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="text-red-500" />
              <span>Disconnected</span>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import VideoPlayerPage from './pages/VideoPlayerPage';
import NetworkMonitor from './pages/NetworkMonitor';
import Experiments from './pages/Experiments';
import Comparison from './pages/Comparison';
import Analytics from './pages/Analytics';
import About from './pages/About';

function App() {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-950">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/player" element={<VideoPlayerPage />} />
            <Route path="/monitor" element={<NetworkMonitor />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

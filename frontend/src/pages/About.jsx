import { Card } from '../components/common/Card';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-gray-300">
      <div className="text-center py-10 bg-gray-900 border border-gray-800 rounded-lg">
        <h1 className="text-4xl font-black text-white mb-4">AdaptiveStream</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A real-time network simulation and adaptive bitrate (ABR) streaming analysis platform.
        </p>
      </div>

      <Card title="Project Overview">
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong className="text-white">Problem Statement:</strong> Video streaming over unpredictable networks often results in buffering or poor quality. Fixed quality streams fail when bandwidth drops.
          </p>
          <p>
            <strong className="text-white">Solution Approach:</strong> AdaptiveStream demonstrates how Adaptive Bitrate (ABR) algorithms monitor network conditions in real-time and seamlessly switch video quality levels to maintain smooth playback without buffering.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Core Features">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Dynamic Network Simulation</li>
            <li>Real-time Metrics Dashboard</li>
            <li>Custom ABR Algorithm</li>
            <li>Interactive Video Player</li>
            <li>Experiment Runner & Comparison</li>
          </ul>
        </Card>
        <Card title="Technologies Used">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>React 18 & Vite</li>
            <li>Tailwind CSS v3</li>
            <li>Recharts & Lucide React</li>
            <li>FastAPI (Python Backend)</li>
            <li>WebSockets for Real-time Data</li>
          </ul>
        </Card>
      </div>

      <Card title="Team Information" className="border-l-4 border-l-blue-500">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Student Name</p>
            <p className="font-bold text-white">[EDIT THIS]</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Register Number</p>
            <p className="font-bold text-white">[EDIT THIS]</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Course</p>
            <p className="font-bold text-white">B.E. Computer Science</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Department & College</p>
            <p className="font-bold text-white">[EDIT THIS] - [EDIT THIS]</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

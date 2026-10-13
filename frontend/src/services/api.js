const API_BASE = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws/metrics';

export const api = {
  getNetworkStatus: () => fetch(`${API_BASE}/api/network/status`).then(r => r.json()),
  getNetworkHistory: () => fetch(`${API_BASE}/api/network/history`).then(r => r.json()),
  getAlerts: () => fetch(`${API_BASE}/api/network/alerts`).then(r => r.json()),
  getInterfaces: () => fetch(`${API_BASE}/api/network/interfaces`).then(r => r.json()),
  
  startSimulation: () => fetch(`${API_BASE}/api/simulation/start`, {method: 'POST'}).then(r => r.json()),
  stopSimulation: () => fetch(`${API_BASE}/api/simulation/stop`, {method: 'POST'}).then(r => r.json()),
  pauseSimulation: () => fetch(`${API_BASE}/api/simulation/pause`, {method: 'POST'}).then(r => r.json()),
  resetSimulation: () => fetch(`${API_BASE}/api/simulation/reset`, {method: 'POST'}).then(r => r.json()),
  setProfile: (profile) => fetch(`${API_BASE}/api/simulation/profile`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({profile})}).then(r => r.json()),
  setCustom: (params) => fetch(`${API_BASE}/api/simulation/custom`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(params)}).then(r => r.json()),
  getSimulationStatus: () => fetch(`${API_BASE}/api/simulation/status`).then(r => r.json()),
  
  getStreamStatus: () => fetch(`${API_BASE}/api/stream/status`).then(r => r.json()),
  setStreamMode: (mode, fixedQuality) => fetch(`${API_BASE}/api/stream/mode`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({mode, fixed_quality: fixedQuality})}).then(r => r.json()),
  getDecisions: () => fetch(`${API_BASE}/api/stream/decisions`).then(r => r.json()),
  getQualityConfig: () => fetch(`${API_BASE}/api/stream/quality_config`).then(r => r.json()),
  
  getCurrentMetrics: () => fetch(`${API_BASE}/api/metrics/current`).then(r => r.json()),
  getScores: () => fetch(`${API_BASE}/api/metrics/scores`).then(r => r.json()),
  exportCsv: () => fetch(`${API_BASE}/api/metrics/export/csv`).then(r => r.text()),
  exportJson: () => fetch(`${API_BASE}/api/metrics/export/json`).then(r => r.json()),
  
  startExperiment: (config) => fetch(`${API_BASE}/api/experiment/start`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(config)}).then(r => r.json()),
  stopExperiment: () => fetch(`${API_BASE}/api/experiment/stop`, {method: 'POST'}).then(r => r.json()),
  getExperimentStatus: () => fetch(`${API_BASE}/api/experiment/status`).then(r => r.json()),
  getExperimentResults: () => fetch(`${API_BASE}/api/experiment/results`).then(r => r.json()),
  getExperimentResult: (id) => fetch(`${API_BASE}/api/experiment/results/${id}`).then(r => r.json()),
  exportExperimentCsv: (id) => fetch(`${API_BASE}/api/experiment/results/${id}/csv`).then(r => r.text()),
};

export { WS_URL };

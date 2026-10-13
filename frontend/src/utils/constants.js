export const QUALITY_LEVELS = ['360p', '480p', '720p', '1080p'];
export const QUALITY_BITRATES = { '360p': 0.5, '480p': 1.0, '720p': 2.5, '1080p': 5.0 };
export const NETWORK_PROFILES = ['excellent', 'good', 'moderate', 'poor', 'very_poor', 'random'];
export const BUFFER_STATES = { SAFE: 'SAFE', WARNING: 'WARNING', CRITICAL: 'CRITICAL', BUFFERING: 'BUFFERING' };
export const CHART_COLORS = { 
  bandwidth: '#22c55e', 
  latency: '#f59e0b', 
  packetLoss: '#ef4444', 
  jitter: '#8b5cf6', 
  buffer: '#3b82f6', 
  quality: '#06b6d4' 
};

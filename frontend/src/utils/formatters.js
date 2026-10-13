export const formatBandwidth = (mbps) => `${Number(mbps).toFixed(2)} Mbps`;
export const formatLatency = (ms) => `${Math.round(ms)} ms`;
export const formatPacketLoss = (pct) => `${Number(pct).toFixed(1)}%`;
export const formatJitter = (ms) => `${Math.round(ms)} ms`;
export const formatBuffer = (secs) => `${Number(secs).toFixed(1)} sec`;

export const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour12: false });
};

export const getQualityColor = (quality) => {
  switch (quality) {
    case '1080p': return 'text-purple-500 border-purple-500 bg-purple-500/10';
    case '720p': return 'text-blue-500 border-blue-500 bg-blue-500/10';
    case '480p': return 'text-green-500 border-green-500 bg-green-500/10';
    case '360p': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
    default: return 'text-gray-500 border-gray-500 bg-gray-500/10';
  }
};

export const getBufferStateColor = (state) => {
  switch (state) {
    case 'SAFE': return 'text-green-500 bg-green-500/10';
    case 'WARNING': return 'text-yellow-500 bg-yellow-500/10';
    case 'CRITICAL': return 'text-red-500 bg-red-500/10';
    case 'BUFFERING': return 'text-orange-500 bg-orange-500/10';
    default: return 'text-gray-500 bg-gray-500/10';
  }
};

export const getNetworkStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'EXCELLENT': return 'bg-green-500';
    case 'GOOD': return 'bg-green-400';
    case 'MODERATE': return 'bg-yellow-500';
    case 'POOR': return 'bg-orange-500';
    case 'CRITICAL': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export const getQualityScore = (quality) => {
  switch (quality) {
    case '1080p': return 4;
    case '720p': return 3;
    case '480p': return 2;
    case '360p': return 1;
    default: return 0;
  }
};

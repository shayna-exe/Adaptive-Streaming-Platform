/**
 * QualityIndicator - shows current video quality and streaming mode.
 * Props:
 *   quality (string): '360p' | '480p' | '720p' | '1080p'
 *   mode (string): 'adaptive' | 'fixed'
 *   bitrate (number): current bitrate in Mbps
 */
export function QualityIndicator({ quality = '720p', mode = 'adaptive', bitrate = 0 }) {
  const qualityColors = {
    '1080p': 'text-purple-400',
    '720p':  'text-blue-400',
    '480p':  'text-green-400',
    '360p':  'text-yellow-400',
  };

  const colorClass = qualityColors[quality] || 'text-gray-400';

  return (
    <div className="flex flex-col items-center justify-center py-4 gap-2">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
        Current Quality
      </p>

      <div className={`text-5xl font-black transition-all duration-500 ${colorClass}`}>
        {quality}
      </div>

      <p className="text-gray-400 text-sm">
        {Number(bitrate).toFixed(1)} Mbps target bitrate
      </p>

      <div className={`px-3 py-1 rounded text-xs font-bold border mt-1 ${
        mode === 'adaptive'
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      }`}>
        {mode.toUpperCase()} MODE
      </div>
    </div>
  );
}

export default QualityIndicator;

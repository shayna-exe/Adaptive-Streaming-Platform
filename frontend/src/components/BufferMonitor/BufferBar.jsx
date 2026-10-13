import { getBufferStateColor } from '../../utils/formatters';

/**
 * BufferBar - visualizes the video playback buffer level.
 *
 * Props:
 *   bufferSeconds (float): current buffer in seconds
 *   bufferState (string): 'SAFE' | 'WARNING' | 'CRITICAL' | 'BUFFERING'
 *   isBuffering (bool): true when playback is stalled
 *   maxBuffer (float): maximum buffer capacity (default 30s)
 */
export function BufferBar({ bufferSeconds = 0, bufferState = 'SAFE', isBuffering = false, maxBuffer = 30 }) {
  const percentage = Math.min(100, Math.max(0, (bufferSeconds / maxBuffer) * 100));

  let barColor = 'bg-green-500';
  if (isBuffering || bufferState === 'BUFFERING')        barColor = 'bg-red-500 animate-pulse';
  else if (bufferState === 'CRITICAL' || percentage < 20) barColor = 'bg-red-500';
  else if (bufferState === 'WARNING'  || percentage < 40) barColor = 'bg-yellow-500';

  const badgeColor = getBufferStateColor(isBuffering ? 'BUFFERING' : bufferState);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">Buffer</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor} ${isBuffering ? 'animate-pulse' : ''}`}>
            {isBuffering ? 'BUFFERING' : bufferState}
          </span>
        </div>
        <div className="text-sm font-bold text-white font-mono">
          {Number(bufferSeconds).toFixed(1)}s <span className="text-gray-500 font-normal text-xs">/ {maxBuffer}s</span>
        </div>
      </div>

      <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-linear`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
        <span>0s</span>
        <span>15s</span>
        <span>30s</span>
      </div>

      {isBuffering && (
        <div className="mt-2 text-center text-xs text-red-400 animate-pulse font-medium">
          ⏳ Buffering — Waiting for data...
        </div>
      )}
    </div>
  );
}

export default BufferBar;

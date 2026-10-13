import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Loader2 } from 'lucide-react';
import { QUALITY_LEVELS, QUALITY_BITRATES } from '../../utils/constants';

export function VideoPlayer({ 
  currentQuality = '720p', 
  isBuffering = false, 
  bufferLevel = 0,
  mode = 'adaptive',
  onModeChange,
  onQualityChange
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // When quality changes, update source while maintaining time and play state
  useEffect(() => {
    if (videoRef.current && !videoError) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;
      
      videoRef.current.src = `/videos/video_${currentQuality}.mp4`;
      videoRef.current.load();
      videoRef.current.currentTime = currentTime;
      
      if (wasPlaying) {
        videoRef.current.play().catch(e => console.log("Play interrupted:", e));
      }
    }
  }, [currentQuality, videoError]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (isMuted && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group border border-gray-800 shadow-xl">
      {videoError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-center p-6">
          <Settings size={48} className="text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Video File Not Found</h3>
          <p className="text-gray-400 text-sm max-w-md">
            Please place sample video files in the <code className="bg-gray-800 px-1 py-0.5 rounded text-gray-300">public/videos/</code> directory.
            <br/><br/>Required files: <br/>
            video_360p.mp4, video_480p.mp4, video_720p.mp4, video_1080p.mp4
          </p>
        </div>
      ) : (
        <video 
          ref={videoRef}
          className="w-full h-full object-contain bg-black"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setVideoError(true)}
          src={`/videos/video_${currentQuality}.mp4`}
        />
      )}

      {/* Buffering Overlay */}
      {isBuffering && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <Loader2 size={48} className="text-white animate-spin" />
        </div>
      )}

      {/* Top info overlay */}
      {!videoError && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="flex flex-col gap-1">
            <span className="px-2 py-1 bg-gray-900/80 rounded text-xs font-bold text-white border border-gray-700 w-fit">
              {currentQuality} / {QUALITY_BITRATES[currentQuality]} Mbps
            </span>
            <span className="text-xs text-gray-300 font-medium drop-shadow-md">
              Buffer: {Number(bufferLevel).toFixed(1)}s
            </span>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold border uppercase
            ${mode === 'adaptive' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}
          `}>
            {mode}
          </span>
        </div>
      )}

      {/* Custom Controls */}
      {!videoError && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-green-400 transition-colors">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-green-400 transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                onChange={handleVolume}
                className="w-0 group-hover/vol:w-20 transition-all duration-300 accent-green-500 opacity-0 group-hover/vol:opacity-100 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <button onClick={() => setShowSettings(!showSettings)} className="text-white hover:text-green-400 transition-colors">
              <Settings size={20} />
            </button>

            {showSettings && (
              <div className="absolute bottom-full right-0 mb-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3 min-w-[200px]">
                <div className="mb-3">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Mode</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onModeChange && onModeChange('adaptive')}
                      className={`flex-1 py-1 px-2 text-xs font-medium rounded border ${mode === 'adaptive' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}
                    >
                      Adaptive
                    </button>
                    <button 
                      onClick={() => onModeChange && onModeChange('fixed')}
                      className={`flex-1 py-1 px-2 text-xs font-medium rounded border ${mode === 'fixed' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}
                    >
                      Fixed
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Quality</p>
                  <div className="flex flex-col gap-1">
                    {QUALITY_LEVELS.map(q => (
                      <button 
                        key={q}
                        disabled={mode === 'adaptive'}
                        onClick={() => onQualityChange && onQualityChange(q)}
                        className={`text-left px-2 py-1 text-sm rounded flex justify-between items-center
                          ${currentQuality === q ? 'bg-gray-800 text-white font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}
                          ${mode === 'adaptive' ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <span>{q}</span>
                        {currentQuality === q && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;

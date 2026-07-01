'use client';

import { useState, useRef, useEffect } from 'react';

export default function VideoPlayer({ src, onComplete, isCompleted = false }) {
  const videoRef = useRef(null);
  const maxTimeRef = useRef(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);

  // Auto-hide controls when playing and mouse is inactive
  useEffect(() => {
    if (isPlaying) {
      const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeout) clearTimeout(controlsTimeout);
        const timeout = setTimeout(() => {
          setShowControls(false);
        }, 2500);
        setControlsTimeout(timeout);
      };

      const container = videoRef.current?.parentNode;
      if (container) {
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('touchstart', handleMouseMove);
      }

      return () => {
        if (container) {
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('touchstart', handleMouseMove);
        }
        if (controlsTimeout) clearTimeout(controlsTimeout);
      };
    } else {
      setShowControls(true);
      if (controlsTimeout) clearTimeout(controlsTimeout);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime >= videoRef.current.duration) {
        videoRef.current.currentTime = 0;
        maxTimeRef.current = 0;
      }
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Playback failed", err);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);
    if (curr > maxTimeRef.current) {
      maxTimeRef.current = curr;
    }
  };

  const handleSeeking = () => {
    if (!videoRef.current) return;
    // Prevent forward skipping: if current time is greater than max allowed time + 0.5s tolerance, snap back
    if (videoRef.current.currentTime > maxTimeRef.current + 0.5) {
      videoRef.current.currentTime = maxTimeRef.current;
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
    if (onComplete) {
      onComplete();
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/10 group select-none"
      onClick={togglePlay}
    >
      {/* Actual HTML5 Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
      />

      {/* Play Overlay (Centered Large Button) */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center transition-all duration-300 cursor-pointer">
          <div className="w-20 h-20 flex items-center justify-center bg-white/95 text-teal-800 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95">
            {/* Play icon */}
            <svg className="w-9 h-9 ml-1.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Custom Control Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md px-5 py-4 flex flex-col gap-3 text-white border-t border-white/5 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent triggering play/pause when clicking controls
      >
        {/* Progress Bar (Display Only - Not Interactive to Prevent Skipping) */}
        <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-teal-500 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls Layout */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button 
              onClick={togglePlay}
              className="p-1 hover:text-teal-400 active:scale-95 transition-all"
              type="button"
            >
              {isPlaying ? (
                // Pause icon
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                // Play icon
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Mute/Volume Button */}
            <button 
              onClick={toggleMute}
              className="p-1 hover:text-teal-400 active:scale-95 transition-all"
              type="button"
            >
              {isMuted ? (
                // Muted icon
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                // Speaker icon
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25m0 13.5L6.75 12H3.75V7.5h3L12 5.25" />
                </svg>
              )}
            </button>

            {/* Time display */}
            <span className="text-xs font-mono text-slate-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

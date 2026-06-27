'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * AudioNarrator — Web Speech API wrapper for text-to-speech narration
 * Provides a floating mute/unmute button and programmatic speak() function
 */
export default function AudioNarrator({ text, autoPlay = false, enabled = true }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
    } else {
      const savedMuted = localStorage.getItem('gmi_audio_muted') === 'true';
      setIsMuted(savedMuted);
      window.gmi_audio_muted = savedMuted;
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (overrideText) => {
      if (!supported || isMuted) return;
      const speechText = overrideText || text;
      if (!speechText) return;

      stop();

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.lang = 'en-US';

      // Try to find a good English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith('en') && v.name.includes('Female')
      ) || voices.find(
        (v) => v.lang.startsWith('en')
      );
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported, isMuted, text, stop]
  );

  // Auto-play when text changes
  useEffect(() => {
    if (autoPlay && enabled && !isMuted && text) {
      // Small delay to let the scene render first
      const timer = setTimeout(() => speak(), 300);
      return () => clearTimeout(timer);
    }
  }, [text, autoPlay, enabled, isMuted, speak]);

  // Stop on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  const toggleMute = () => {
    setIsMuted((m) => {
      const nextMute = !m;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gmi_audio_muted', String(nextMute));
        window.gmi_audio_muted = nextMute;
      }
      if (nextMute) {
        stop();
      }
      return nextMute;
    });
  };

  if (!supported) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <button
        onClick={toggleMute}
        title={isMuted ? 'Enable narration' : 'Mute narration'}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '2px solid #e2e8f0',
          background: isMuted ? '#f1f5f9' : 'linear-gradient(135deg, #006764, #00897b)',
          color: isMuted ? '#94a3b8' : 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 200ms ease',
          fontSize: '20px',
        }}
      >
        {isMuted ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

      {isSpeaking && !isMuted && (
        <div
          style={{
            display: 'flex',
            gap: '3px',
            alignItems: 'flex-end',
            height: '16px',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: '3px',
                borderRadius: '2px',
                background: '#006764',
                animation: `audioBar 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      <span
        style={{
          fontSize: '0.65rem',
          color: '#94a3b8',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        {isMuted ? 'MUTED' : 'AUDIO'}
      </span>

      <style jsx>{`
        @keyframes audioBar {
          from { height: 4px; }
          to { height: 14px; }
        }
      `}</style>
    </div>
  );
}

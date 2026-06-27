'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * SpeechBubble — Animated text bubble with optional typing effect
 * Props:
 *   text: string — the text to display
 *   typing: boolean — whether to show typing animation
 *   typingSpeed: number — ms per character
 *   tailSide: 'left' | 'right' — which side the tail points to
 *   onComplete: () => void — called when typing finishes
 *   variant: 'default' | 'thought' — visual style
 */
export default function SpeechBubble({
  text = '',
  typing = true,
  typingSpeed = 25,
  tailSide = 'left',
  onComplete,
  variant = 'default',
  className = '',
}) {
  const [displayedText, setDisplayedText] = useState(typing ? '' : text);
  const [isComplete, setIsComplete] = useState(!typing);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!typing) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    // Reset on text change
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current <= text.length) {
        setDisplayedText(text.slice(0, indexRef.current));
      } else {
        clearInterval(intervalRef.current);
        setIsComplete(true);
        onComplete?.();
      }
    }, typingSpeed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, typing, typingSpeed, onComplete]);

  // Skip to end on click
  const handleClick = () => {
    if (!isComplete) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
    }
  };

  const isThought = variant === 'thought';

  return (
    <div
      className={`relative animate-fadeIn ${className}`}
      onClick={handleClick}
      style={{ cursor: isComplete ? 'default' : 'pointer' }}
    >
      <div
        style={{
          background: isThought
            ? 'linear-gradient(135deg, #f0f7f6, #e8f5e9)'
            : '#ffffff',
          border: isThought ? '2px dashed #80cbc4' : '1px solid #e2e8f0',
          borderRadius: isThought ? '24px' : '16px',
          padding: '20px 24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          position: 'relative',
          maxWidth: '560px',
          lineHeight: '1.8',
          fontSize: '1rem',
          color: '#1a202c',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {isThought && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              fontSize: '18px',
              opacity: 0.4,
            }}
          >
            💭
          </span>
        )}

        <span>{displayedText}</span>
        {!isComplete && (
          <span
            style={{
              display: 'inline-block',
              width: '2px',
              height: '1em',
              backgroundColor: '#006764',
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              animation: 'blink 0.8s step-end infinite',
            }}
          />
        )}

        {!isComplete && (
          <div
            style={{
              marginTop: '8px',
              fontSize: '0.75rem',
              color: '#94a3b8',
              textAlign: 'right',
            }}
          >
            Click to skip →
          </div>
        )}
      </div>

      {/* Tail / connector */}
      {!isThought && (
        <div
          style={{
            position: 'absolute',
            bottom: '-10px',
            [tailSide]: '40px',
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '12px solid #ffffff',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.04))',
          }}
        />
      )}

      {/* Thought dots */}
      {isThought && (
        <div
          style={{
            position: 'absolute',
            bottom: '-20px',
            [tailSide]: '30px',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#e0f2f1',
              border: '1.5px dashed #80cbc4',
            }}
          />
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#e0f2f1',
              border: '1.5px dashed #80cbc4',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { playClick, playSuccess, playError } from '@/utils/audioEffects';

/**
 * KnowledgeCheck — Interactive quiz component for module knowledge checks
 * Props:
 *   question: string
 *   options: { id: string, text: string }[]
 *   correctId: string
 *   feedbackCorrect: string
 *   feedbackIncorrect: string
 *   onComplete: (selectedId: string, wasCorrect: boolean, attempts: number) => void
 */
export default function KnowledgeCheck({
  question,
  options = [],
  correctId,
  feedbackCorrect = 'Correct!',
  feedbackIncorrect = 'Not quite. Please try again.',
  onComplete,
}) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleCheck = () => {
    if (!selected) return;
    const correct = selected === correctId;
    setSubmitted(true);
    setIsCorrect(correct);
    setAttempts((a) => a + 1);
    if (correct) {
      playSuccess();
      onComplete?.(selected, true, attempts + 1);
    } else {
      playError();
    }
  };

  const handleRetry = () => {
    playClick();
    setSelected(null);
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Question */}
      <h3
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#04284b',
          marginBottom: '20px',
          lineHeight: 1.6,
          fontFamily: 'var(--font-serif)',
        }}
      >
        {question}
      </h3>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = submitted && opt.id === correctId;
          const showWrong = submitted && isSelected && !isCorrect;

          let borderColor = '#e2e8f0';
          let bgColor = '#ffffff';
          let textColor = '#1a202c';

          if (showCorrect) {
            borderColor = '#22c55e';
            bgColor = '#f0fdf4';
            textColor = '#166534';
          } else if (showWrong) {
            borderColor = '#f59e0b';
            bgColor = '#fffbeb';
            textColor = '#92400e';
          } else if (isSelected && !submitted) {
            borderColor = '#006764';
            bgColor = '#f0f7f6';
            textColor = '#006764';
          }

          return (
            <label
              key={opt.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '16px 20px',
                borderRadius: '12px',
                border: `2px solid ${borderColor}`,
                background: bgColor,
                cursor: submitted ? 'default' : 'pointer',
                transition: 'all 200ms ease',
                opacity: submitted && !showCorrect && !showWrong ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!submitted && !isSelected) {
                  e.currentTarget.style.borderColor = '#006764';
                  e.currentTarget.style.background = '#fafffe';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitted && !isSelected) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#ffffff';
                }
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? '#006764' : '#cbd5e1'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  transition: 'all 200ms ease',
                  background: isSelected ? '#006764' : 'transparent',
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'white',
                    }}
                  />
                )}
              </div>
              <div>
                <span
                  style={{
                    fontWeight: 600,
                    color: '#64748b',
                    marginRight: '8px',
                    fontSize: '0.85rem',
                  }}
                >
                  {opt.id.toUpperCase()}.
                </span>
                <span
                  style={{
                    color: textColor,
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  {opt.text}
                </span>
                {showCorrect && (
                  <span style={{ marginLeft: '8px', fontSize: '1rem' }}>✓</span>
                )}
                {showWrong && (
                  <span style={{ marginLeft: '8px', fontSize: '1rem' }}>✗</span>
                )}
              </div>
              <input
                type="radio"
                name="knowledge-check"
                value={opt.id}
                checked={isSelected}
                disabled={submitted}
                onChange={() => {
                  playClick();
                  setSelected(opt.id);
                }}
                style={{ display: 'none' }}
              />
            </label>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            animation: 'fadeIn 0.3s ease',
            background: isCorrect
              ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
              : 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            border: `1px solid ${isCorrect ? '#86efac' : '#fcd34d'}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{isCorrect ? '🎉' : '💡'}</span>
            <span
              style={{
                fontWeight: 700,
                color: isCorrect ? '#166534' : '#92400e',
                fontSize: '0.95rem',
              }}
            >
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </span>
          </div>
          <p
            style={{
              color: isCorrect ? '#166534' : '#92400e',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {isCorrect ? feedbackCorrect : feedbackIncorrect}
          </p>
        </div>
      )}

      {/* Action button */}
      {!submitted ? (
        <button
          onClick={handleCheck}
          disabled={!selected}
          style={{
            padding: '12px 32px',
            borderRadius: '8px',
            border: 'none',
            background: selected
              ? 'linear-gradient(135deg, #006764, #00897b)'
              : '#e2e8f0',
            color: selected ? 'white' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'all 200ms ease',
            boxShadow: selected ? '0 4px 12px rgba(0,103,100,0.3)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (selected) e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Check Answer
        </button>
      ) : !isCorrect ? (
        <button
          onClick={handleRetry}
          style={{
            padding: '12px 32px',
            borderRadius: '8px',
            border: '2px solid #006764',
            background: 'white',
            color: '#006764',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f7f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}

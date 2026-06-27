'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NurseCharacter from '@/components/module/NurseCharacter';
import SpeechBubble from '@/components/module/SpeechBubble';
import SceneContainer from '@/components/module/SceneContainer';
import AudioNarrator from '@/components/module/AudioNarrator';
import { getParticipantId, setFlowState } from '@/lib/session';
import { playClick, playApplause } from '@/utils/audioEffects';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import ModuleStepper from '@/components/module/ModuleStepper';

const SCENES = [
  {
    id: 'prompt',
    pose: 'confident',
    narration:
      'Welcome to Learning Module 4. In this activity, you will apply what you have learned by offering a few encouraging words to a colleague.',
  },
  {
    id: 'feedback',
    pose: 'celebrating',
    narration:
      'Thank you for your response! Explaining a growth mindset perspective to others is a proven way to consolidate your own understanding.',
  },
];

const TOTAL_SCENES = SCENES.length;

const STYLES = {
  h2: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#04284b',
    marginBottom: '16px',
    lineHeight: 1.4,
  },
  sub: {
    fontSize: '1.05rem',
    color: '#64748b',
    fontWeight: 500,
    marginBottom: '16px',
    lineHeight: 1.6,
  },
  body: {
    fontSize: '1.05rem',
    color: '#334155',
    lineHeight: 1.7,
    marginBottom: '12px',
  },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' },
  cardText: { fontSize: '1.05rem', color: '#475569', lineHeight: 1.7 },
  innerTitle: { fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px' },
  innerText: { fontSize: '1.05rem', fontStyle: 'italic', lineHeight: 1.6 },
};

export default function Module4Page() {
  const router = useRouter();
  const [scene, setScene] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [adviceText, setAdviceText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [scene]);

  const currentScene = SCENES[scene];
  const isLastScene = scene === TOTAL_SCENES - 1;

  const handleTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  const isValidInput = adviceText.trim().length >= 30;

  const canProceed = () => {
    switch (currentScene.id) {
      case 'prompt':
        return typingDone && isValidInput;
      case 'feedback':
        return typingDone;
      default:
        return typingDone;
    }
  };

  const goNext = async () => {
    playClick();
    if (isLastScene) {
      if (submitting) return;
      setSubmitting(true);
      try {
        await fetch('/api/intervention', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participant_id: getParticipantId(),
            module_type: 'gmi',
            module_number: 4,
            started_at: startedAt,
            engagement_data: {
              scenes_viewed: TOTAL_SCENES,
              advice_text: adviceText.trim(),
            },
          }),
        });
      } catch (err) {
        console.error('Module 4 submission error:', err);
      }
      setFlowState('intervention');
      router.push('/module/gmi/5');
      return;
    }
    if (scene === TOTAL_SCENES - 2) {
      setTimeout(() => playApplause(), 300);
    }
    setScene((s) => s + 1);
    setTypingDone(false);
  };

  const goBack = () => {
    if (scene > 0) {
      playClick();
      setScene((s) => s - 1);
      setTypingDone(true);
    }
  };

  const renderPrompt = () => (
    <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <NurseCharacter pose="confident" size={260} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Learning Module 4</h2>
          <p style={{ ...STYLES.sub, color: '#006764', fontWeight: 600 }}>
            Short Advice to Another Early-Career Nurse
          </p>
          <SpeechBubble
            text={currentScene.narration}
            typing={!typingDone}
            onComplete={handleTypingComplete}
            tailSide="left"
          />
        </div>
      </div>

      <div
        style={{
          width: '100%',
          padding: '24px 28px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          border: '2px solid #006764',
          boxShadow: '0 4px 16px rgba(0, 103, 100, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1.5px dashed #cbd5e1', paddingBottom: '10px' }}>
          <span style={{ fontSize: '1.3rem' }}>✍️</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
            REFLECTION TASK
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#04284b', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>
          Write a Few Encouraging Words to a Peer
        </h3>

        <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
          Imagine another early-career nurse has just experienced a clinical difficulty—she might have received constructive feedback, felt overwhelmed during a busy shift, felt uncertain about a procedure, or started doubting her abilities.
        </p>

        <div style={{ padding: '14px 18px', backgroundColor: '#f0f7f6', border: '1px solid #99d6d3', borderRadius: '12px', marginBottom: '18px' }}>
          <p style={{ fontSize: '0.88rem', color: '#006764', fontWeight: 700, marginBottom: '4px' }}>
            💡 Writing Tips:
          </p>
          <ul style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: 0, paddingLeft: '18px', listStyleType: 'disc' }}>
            <li>Mention that difficulties do not mean a fixed lack of ability.</li>
            <li>Specific learning points can be identified from feedback.</li>
            <li>Skills develop gradually through practice, strategies, asking questions, and seeking support.</li>
            <li><em>Please write 2 to 3 supportive sentences (at least 30 characters). Do not include real identifiable names or places.</em></li>
          </ul>
        </div>

        <textarea
          value={adviceText}
          onChange={(e) => setAdviceText(e.target.value)}
          placeholder="Write your advice to a colleague here..."
          rows={4}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '2px solid #cbd5e1',
            fontSize: '1rem',
            color: '#1e293b',
            outline: 'none',
            transition: 'all 200ms ease',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#006764'; }}
          onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
        />

        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: isValidInput ? '#166534' : '#64748b', fontWeight: 600 }}>
            {adviceText.trim().length} characters (minimum 30 required)
          </span>
          {isValidInput && (
            <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, marginLeft: 'auto' }}>
              ✓ Ready to proceed
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 animate-fadeIn">
      <NurseCharacter pose="celebrating" size={360} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Thank You for Your Advice! 🎉</h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{ marginTop: '20px', padding: '20px 24px', background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)', border: '2px solid #99d6d3', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,103,100,0.08)' }}>
          <p style={{ ...STYLES.innerTitle, color: '#006764', marginBottom: '8px', fontSize: '1.1rem' }}>🌱 Consolidating Your Learning:</p>
          <p style={{ ...STYLES.body, color: '#004d40', margin: 0, fontSize: '1.02rem', lineHeight: 1.65 }}>
            Explaining an idea to someone else is one of the most effective ways to help yourself understand and remember it. Next, you will translate these insights into a practical clinical challenge action checklist in Module 5.
          </p>
        </div>
      </div>
    </div>
  );

  const SCENE_RENDERERS = [renderPrompt, renderFeedback];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      <main className="flex-grow flex flex-col items-center pt-6 pb-20 px-4 md:px-8">
        <ModuleStepper currentModule={4} />

        <div className="w-full max-w-4xl mb-6">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: '0.8rem', color: '#006764', fontWeight: 700 }}>
              Scene {scene + 1} of {TOTAL_SCENES}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {Math.round(((scene + 1) / TOTAL_SCENES) * 100)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{ width: `${((scene + 1) / TOTAL_SCENES) * 100}%` }}
            />
          </div>
        </div>

        <div className="w-full max-w-4xl" key={scene}>
          <SceneContainer sceneIndex={scene}>
            {SCENE_RENDERERS[scene]()}
          </SceneContainer>
        </div>

        <div className="w-full max-w-4xl mt-6 flex gap-4">
          {scene > 0 && (
            <button
              onClick={goBack}
              style={{
                flex: 1,
                padding: '14px 24px',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                background: 'white',
                color: '#64748b',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#006764'; e.currentTarget.style.color = '#006764'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
            >
              ← Previous
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!canProceed() || submitting}
            style={{
              flex: 2,
              padding: '14px 32px',
              borderRadius: '10px',
              border: 'none',
              background: canProceed() ? 'linear-gradient(135deg, #006764, #00897b)' : '#e2e8f0',
              color: canProceed() ? 'white' : '#94a3b8',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              transition: 'all 200ms ease',
              boxShadow: canProceed() ? '0 4px 16px rgba(0,103,100,0.25)' : 'none',
            }}
            onMouseEnter={(e) => { if (canProceed()) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {submitting ? 'Submitting...' : isLastScene ? 'Continue to Module 5 →' : 'Continue →'}
          </button>
        </div>

        {!canProceed() && (
          <div className="w-full max-w-4xl mt-3">
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              {currentScene.id === 'prompt' && !isValidInput
                ? '⚡ Please write at least 30 characters of advice to continue.'
                : ''}
            </p>
          </div>
        )}
      </main>

      <AppFooter />

      <AudioNarrator text={currentScene.narration} autoPlay={false} />
    </div>
  );
}

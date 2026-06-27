'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NurseCharacter from '@/components/module/NurseCharacter';
import TeacherCharacter from '@/components/module/TeacherCharacter';
import SpeechBubble from '@/components/module/SpeechBubble';
import SceneContainer from '@/components/module/SceneContainer';
import KnowledgeCheck from '@/components/module/KnowledgeCheck';
import AudioNarrator from '@/components/module/AudioNarrator';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import ModuleStepper from '@/components/module/ModuleStepper';
import BrainMapExplorer from '@/components/module/BrainMapExplorer';
import { getParticipantId, setFlowState } from '@/lib/session';
import { playClick, playSuccess, playApplause } from '@/utils/audioEffects';

const SCENES = [
  {
    id: 'welcome',
    pose: 'welcome',
    narration:
      'Welcome to Learning Module 1 of the Active Control program! In this module, we will explore basic brain structures, brain functions, and functional localization. This content focuses on neutral scientific knowledge about how different brain regions collaborate in daily activities.',
  },
  {
    id: 'precheck',
    pose: 'confident',
    narration:
      'Before we begin, please answer a quick question about your background knowledge regarding brain structures and functions.',
  },
  {
    id: 'structures',
    pose: 'speaking',
    narration:
      'The human brain is divided into distinct anatomical regions, each specializing in specific functions such as motor control, sensory processing, language, and executive planning.',
  },
  {
    id: 'explorer',
    pose: 'confident',
    narration:
      'Explore the interactive brain map below. Click each brain region to discover its primary functions and clinical significance.',
  },
  {
    id: 'myths',
    pose: 'uncertain',
    narration:
      'Let us examine a common myth in popular brain science and see what modern neuroscience reveals.',
  },
  {
    id: 'quiz',
    pose: 'uncertain',
    narration: 'Let us check your understanding with a quick question.',
  },
  {
    id: 'summary',
    pose: 'celebrating',
    narration:
      'Great job! You have completed Module 1 of the Active Control program. Different brain regions specialize in distinct functions while working collaboratively to support everyday life.',
  },
];

const PRECHECK_OPTIONS = [
  { id: 'a', text: 'Yes, I have studied them quite systematically.' },
  { id: 'b', text: 'I have studied some aspects of them.' },
  { id: 'c', text: 'I have rarely studied them.' },
  { id: 'd', text: 'Not sure.' },
];

const QUIZ_QUESTION =
  'Which brain region is primarily responsible for motor coordination, posture, and fine motor balance?';
const QUIZ_OPTIONS = [
  { id: 'a', text: 'Occipital Lobe' },
  { id: 'b', text: 'Cerebellum' },
  { id: 'c', text: 'Temporal Lobe' },
  { id: 'd', text: 'Hypothalamus' },
];
const QUIZ_CORRECT_ID = 'b';
const QUIZ_FEEDBACK_CORRECT =
  'Correct! The cerebellum is located at the back of the brain and plays a crucial role in coordinating voluntary movements, balance, and posture.';
const QUIZ_FEEDBACK_INCORRECT =
  'Not quite. Think about which region is specifically specialized for motor coordination and motor balance. Try again!';

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

export default function ControlModule1Page() {
  const router = useRouter();
  const [scene, setScene] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Interactive states
  const [precheckSelected, setPrecheckSelected] = useState('');
  const [explorerCompleted, setExplorerCompleted] = useState(false);
  const [mythRevealed, setMythRevealed] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizData, setQuizData] = useState(null);

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

  const canProceed = () => {
    switch (currentScene.id) {
      case 'precheck':
        return typingDone && precheckSelected !== '';
      case 'explorer':
        return typingDone && explorerCompleted;
      case 'myths':
        return typingDone && mythRevealed;
      case 'quiz':
        return typingDone && quizCompleted;
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
            module_type: 'control',
            module_number: 1,
            started_at: startedAt,
            engagement_data: {
              scenes_viewed: TOTAL_SCENES,
              precheck_answer: precheckSelected,
              quiz_answer: quizData?.selectedId,
              quiz_correct: quizData?.wasCorrect,
              quiz_attempts: quizData?.attempts,
            },
          }),
        });
      } catch (err) {
        console.error('Control Module 1 submission error:', err);
      }
      setFlowState('intervention');
      router.push('/module/control/2');
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

  const renderWelcome = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 animate-fadeIn">
      <NurseCharacter pose="welcome" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Control Module 1</h2>
        <p style={{ ...STYLES.sub, color: '#006764', fontWeight: 600 }}>
          Basic Brain Functions and Functional Localization
        </p>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{ marginTop: '20px', padding: '16px 20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
          <p style={{ ...STYLES.innerTitle, color: '#04284b', marginBottom: '4px' }}>
            📌 General Scientific Knowledge
          </p>
          <p style={{ ...STYLES.innerText, color: '#475569', fontStyle: 'normal', margin: 0, fontSize: '0.95rem' }}>
            This module provides general scientific learning. It does not evaluate your individual abilities, nor does it ask you to reflect on clinical performance, work stress, or coping strategies.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPrecheck = () => (
    <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <NurseCharacter pose="confident" size={260} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Pre-learning Check</h2>
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
          <span style={{ fontSize: '1.3rem' }}>❓</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
            WARM-UP QUESTION
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#04284b', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
          Have you previously systematically studied basic brain structures, brain functions, or functional localization?
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PRECHECK_OPTIONS.map((opt) => {
            const isSelected = precheckSelected === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => { playClick(); setPrecheckSelected(opt.id); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #006764' : '2px solid #e2e8f0',
                  backgroundColor: isSelected ? '#f0f7f6' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: isSelected ? '7px solid #006764' : '2px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '1rem', color: isSelected ? '#006764' : '#1e293b', fontWeight: isSelected ? 600 : 400 }}>
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStructures = () => (
    <div className="animate-fadeIn w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <TeacherCharacter pose="speaking" size={300} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Brain Structures & Functional Specialization</h2>
          <SpeechBubble
            text={currentScene.narration}
            typing={!typingDone}
            onComplete={handleTypingComplete}
            tailSide="left"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)', border: '2px solid #99d6d3' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🧠</div>
          <h3 style={{ ...STYLES.cardTitle, color: '#006764' }}>Anatomical Specialization</h3>
          <p style={{ ...STYLES.cardText, color: '#334155' }}>
            The cerebral cortex is divided into distinct lobes. Each region specializes in specific primary functions, such as visual processing in the occipital lobe or sensory integration in the parietal lobe.
          </p>
        </div>

        <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #fafaf9, #f1f5f9)', border: '2px solid #cbd5e1' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌐</div>
          <h3 style={{ ...STYLES.cardTitle, color: '#334155' }}>Network Collaboration</h3>
          <p style={{ ...STYLES.cardText, color: '#475569' }}>
            Although regions specialize, complex daily functions like conversation or motor movement require seamless neural network collaboration across multiple brain areas working together in real time.
          </p>
        </div>
      </div>
    </div>
  );

  const renderExplorer = () => (
    <div className="animate-fadeIn w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
        <NurseCharacter pose="confident" size={240} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Interactive Brain Map Explorer</h2>
          <SpeechBubble
            text={currentScene.narration}
            typing={!typingDone}
            onComplete={handleTypingComplete}
            tailSide="left"
          />
        </div>
      </div>

      <BrainMapExplorer onExploreComplete={() => setExplorerCompleted(true)} />
    </div>
  );

  const renderMyths = () => (
    <div className="animate-fadeIn w-full max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <NurseCharacter pose="uncertain" size={260} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Brain Science Myth-Busting</h2>
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
          <span style={{ fontSize: '1.3rem' }}>🔬</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
            COMMON MISCONCEPTION
          </span>
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#04284b', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>
          Myth vs. Neuroscientific Evidence
        </h3>

        <div style={{ padding: '18px 20px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', marginBottom: '16px' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '4px' }}>
            ⚠️ Popular Myth:
          </p>
          <p style={{ fontSize: '1.05rem', color: '#78350f', fontWeight: 600, margin: 0, fontStyle: 'italic' }}>
            &quot;Humans only use 10% of their brain capacity.&quot;
          </p>
        </div>

        {!mythRevealed ? (
          <button
            onClick={() => { playSuccess(); setMythRevealed(true); }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #006764, #00897b)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              boxShadow: '0 4px 12px rgba(0,103,100,0.2)',
            }}
            className="animate-pulse"
          >
            💡 Click to Reveal Neuroscientific Fact →
          </button>
        ) : (
          <div style={{ padding: '20px', backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', animation: 'fadeIn 0.4s ease' }}>
            <p style={{ fontSize: '0.88rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '6px' }}>
              ✓ Neuroscientific Fact:
            </p>
            <p style={{ fontSize: '1rem', color: '#14532d', lineHeight: 1.6, margin: 0 }}>
              Modern neuroimaging techniques such as fMRI and PET scans demonstrate that virtually <strong>100% of the brain is active</strong> over a 24-hour period. Even during quiet rest or sleep, complex neural circuits continuously monitor autonomic functions, consolidate memories, and maintain neural readiness.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="flex flex-col md:flex-row items-start gap-8 animate-fadeIn w-full max-w-4xl mx-auto">
      <div className="flex-none">
        <NurseCharacter pose="uncertain" size={280} />
      </div>
      <div className="flex-1">
        <h2 style={STYLES.h2}>Knowledge Check</h2>
        <p style={STYLES.sub}>Let&apos;s see what you&apos;ve learned. Select the best answer below.</p>
        <KnowledgeCheck
          question={QUIZ_QUESTION}
          options={QUIZ_OPTIONS}
          correctId={QUIZ_CORRECT_ID}
          feedbackCorrect={QUIZ_FEEDBACK_CORRECT}
          feedbackIncorrect={QUIZ_FEEDBACK_INCORRECT}
          onComplete={(selectedId, wasCorrect, attempts) => {
            setQuizCompleted(true);
            setQuizData({ selectedId, wasCorrect, attempts });
          }}
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 animate-fadeIn w-full max-w-4xl mx-auto">
      <NurseCharacter pose="celebrating" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Module 1 Complete! 🎉</h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{ marginTop: '20px', padding: '20px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)', border: '2px solid #99d6d3', boxShadow: '0 4px 12px rgba(0,103,100,0.08)' }}>
          <p style={{ ...STYLES.innerTitle, color: '#006764', marginBottom: '8px', fontSize: '1.1rem' }}>📌 Key Module Takeaways:</p>
          <ul style={{ fontSize: '1rem', color: '#004d40', margin: 0, paddingLeft: '20px', lineHeight: 1.65, listStyleType: 'disc' }}>
            <li>The brain is organized into anatomical regions with specialized sensory, motor, and cognitive functions.</li>
            <li>Complex daily tasks rely on coordinated network collaboration across multiple lobes.</li>
            <li>Neuroimaging confirms that all brain regions play essential roles throughout daily life.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const SCENE_RENDERERS = [
    renderWelcome,
    renderPrecheck,
    renderStructures,
    renderExplorer,
    renderMyths,
    renderQuiz,
    renderSummary,
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      <main className="flex-grow flex flex-col items-center pt-6 pb-20 px-4 md:px-8">
        <ModuleStepper currentModule={1} />

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
            {submitting ? 'Submitting...' : isLastScene ? 'Continue to Control Module 2 →' : 'Continue →'}
          </button>
        </div>

        {!canProceed() && (
          <div className="w-full max-w-4xl mt-3">
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              {currentScene.id === 'precheck' && precheckSelected === ''
                ? '⚡ Please select an option to continue.'
                : currentScene.id === 'explorer' && !explorerCompleted
                  ? '⚡ Please click and explore all 6 brain regions above to continue.'
                  : currentScene.id === 'myths' && !mythRevealed
                    ? '⚡ Please click the button to reveal the neuroscientific fact.'
                    : currentScene.id === 'quiz' && !quizCompleted
                      ? '⚡ Please answer the question correctly to continue.'
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

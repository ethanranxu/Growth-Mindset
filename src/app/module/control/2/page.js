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
import BrainSystemExplorer from '@/components/module/BrainSystemExplorer';
import { getParticipantId, setFlowState } from '@/lib/session';
import { playClick, playSuccess, playApplause } from '@/utils/audioEffects';

const SCENES = [
  {
    id: 'welcome',
    pose: 'welcome',
    narration:
      'Welcome to Learning Module 2! In this module, we will explore brain systems and functional localization, examining how different neural structures contribute to sensory processing, motor control, cognition, and vital life functions.',
  },
  {
    id: 'overview',
    pose: 'speaking',
    narration:
      'The human brain is involved in sensory processing, movement, language, attention, memory, planning, and vital life activities. A useful way to understand this is functional localization: while certain brain regions closely correlate with specific functions, most daily activities require coordinated participation across multiple systems.',
  },
  {
    id: 'hemispheres',
    pose: 'confident',
    narration:
      'The cerebral hemispheres play essential roles in sensory processing, motor control, language, strategic planning, memory, and complex decision-making judgment.',
  },
  {
    id: 'interactive-regions',
    pose: 'confident',
    narration:
      'Explore the specific brain regions below. Click each region card or map pin to review its specialized functional roles in everyday human activities.',
  },
  {
    id: 'quiz',
    pose: 'uncertain',
    narration: 'Let us check your understanding with a quick question based on today’s module.',
  },
  {
    id: 'summary',
    pose: 'celebrating',
    narration:
      'Great job! You have completed Learning Module 2. Understanding functional localization clarifies how specialized regions and interconnected systems work in harmony to support complex behaviors.',
  },
];

const QUIZ_QUESTION = 'Which of the following is primarily involved in visual information processing?';
const QUIZ_OPTIONS = [
  { id: 'a', text: 'A. Occipital Lobe' },
  { id: 'b', text: 'B. Cerebellum' },
  { id: 'c', text: 'C. Brainstem' },
  { id: 'd', text: 'D. Uncertain' },
];
const QUIZ_CORRECT_ID = 'a';
const QUIZ_FEEDBACK_CORRECT = 'Correct! The occipital lobe is primarily involved in visual information processing.';
const QUIZ_FEEDBACK_INCORRECT = 'Not quite right. Think about which region is specialized in receiving and interpreting visual signals from the eyes. Try again!';

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

export default function ControlModule2Page() {
  const router = useRouter();
  const [scene, setScene] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Interactive states
  const [explorerCompleted, setExplorerCompleted] = useState(false);
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
      case 'interactive-regions':
        return typingDone && explorerCompleted;
      case 'quiz':
        return quizCompleted;
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
            module_number: 2,
            started_at: startedAt,
            engagement_data: {
              scenes_viewed: TOTAL_SCENES,
              quiz_answer: quizData?.selectedId,
              quiz_correct: quizData?.wasCorrect,
              quiz_attempts: quizData?.attempts,
            },
          }),
        });
      } catch (err) {
        console.error('Control Module 2 submission error:', err);
      }
      setFlowState('intervention');
      router.push('/module/control/3');
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
        <h2 style={STYLES.h2}>Learning Module 2</h2>
        <p style={{ ...STYLES.sub, color: '#006764', fontWeight: 600 }}>
          Brain Systems &amp; Functional Localization
        </p>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{ marginTop: '20px', padding: '16px 20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
          <p style={{ ...STYLES.innerTitle, color: '#04284b', marginBottom: '4px' }}>
            📌 Module Focus
          </p>
          <p style={{ ...STYLES.innerText, color: '#475569', fontStyle: 'normal', margin: 0, fontSize: '0.95rem' }}>
            Building upon the previous module, this module explores the specific functional specialization of major brain regions and multi-system coordination during complex daily activities.
          </p>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="animate-fadeIn w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <TeacherCharacter pose="speaking" size={280} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Functional Localization &amp; Multi-System Coordination</h2>
          <SpeechBubble
            text={currentScene.narration}
            typing={!typingDone}
            onComplete={handleTypingComplete}
            tailSide="left"
          />
        </div>
      </div>

      <div style={{ padding: '24px 28px', borderRadius: '20px', background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)', border: '2px solid #99d6d3', boxShadow: '0 4px 16px rgba(0,103,100,0.06)' }}>
        <div className="flex items-center gap-3 mb-3">
          <span style={{ fontSize: '1.8rem' }}>🧩</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#006764', margin: 0, fontFamily: 'var(--font-serif)' }}>
            Core Principle of Functional Localization
          </h3>
        </div>
        <p style={{ fontSize: '1.05rem', color: '#04284b', lineHeight: 1.7, fontWeight: 600, marginBottom: '12px' }}>
          The human brain is involved in sensory processing, movement, language, attention, memory, planning, and vital life activities.
        </p>
        <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
          A useful way to understand this is <strong>functional localization</strong>: while certain brain regions closely correlate with specific functions, most daily activities require coordinated participation across multiple systems.
        </p>
      </div>
    </div>
  );

  const renderHemispheres = () => (
    <div className="animate-fadeIn w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <NurseCharacter pose="confident" size={260} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Cerebral Hemispheres</h2>
          <SpeechBubble
            text={currentScene.narration}
            typing={!typingDone}
            onComplete={handleTypingComplete}
            tailSide="left"
          />
        </div>
      </div>

      <div style={{ padding: '24px', borderRadius: '18px', backgroundColor: '#ffffff', border: '2px solid #006764', boxShadow: '0 4px 20px rgba(0,103,100,0.08)' }}>
        <div className="flex items-center gap-3 mb-4 border-b pb-3 border-slate-100">
          <span style={{ fontSize: '2rem' }}>🧠</span>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#04284b', margin: 0, fontFamily: 'var(--font-serif)' }}>
              Cerebral Hemispheres
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#006764', fontWeight: 700 }}>HIGH-LEVEL COGNITIVE &amp; CONTROL HUB</span>
          </div>
        </div>
        <p style={{ fontSize: '1.05rem', color: '#1e293b', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
          The cerebral hemispheres form the highest level of the central nervous system, playing essential roles in <strong>sensory processing, motor control, language, strategic planning, memory, and complex decision-making judgment</strong>.
        </p>
      </div>
    </div>
  );

  const renderInteractiveRegions = () => (
    <div className="animate-fadeIn w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
        <TeacherCharacter pose="speaking" size={240} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Brain System Map Explorer</h2>
          <SpeechBubble
            text={currentScene.narration}
            typing={!typingDone}
            onComplete={handleTypingComplete}
            tailSide="left"
          />
        </div>
      </div>

      <BrainSystemExplorer onExploreComplete={() => setExplorerCompleted(true)} />
    </div>
  );

  const renderQuiz = () => (
    <div className="flex flex-col md:flex-row items-start gap-8 animate-fadeIn w-full max-w-4xl mx-auto">
      <div className="flex-none">
        <NurseCharacter pose="uncertain" size={280} />
      </div>
      <div className="flex-1">
        <h2 style={STYLES.h2}>Knowledge Check</h2>
        <p style={STYLES.sub}>Select the best answer based on the knowledge learned in this module.</p>
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
        <h2 style={STYLES.h2}>Module 2 Complete! 🎉</h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{ marginTop: '20px', padding: '20px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)', border: '2px solid #99d6d3', boxShadow: '0 4px 12px rgba(0,103,100,0.08)' }}>
          <p style={{ ...STYLES.innerTitle, color: '#006764', marginBottom: '8px', fontSize: '1.1rem' }}>📌 Key Module Takeaways:</p>
          <ul style={{ fontSize: '0.95rem', color: '#004d40', margin: 0, paddingLeft: '20px', lineHeight: 1.7, listStyleType: 'disc' }}>
            <li><strong>Cerebral Hemispheres</strong>: Responsible for sensory processing, motor control, language, planning, memory, and judgment.</li>
            <li><strong>Frontal, Parietal, Temporal, and Occipital Lobes</strong>: Lead executive planning/attention, sensory integration, auditory/language memory, and visual processing.</li>
            <li><strong>Cerebellum and Brainstem</strong>: Maintain motor coordination, balance timing, respiration, heart rate, and essential autonomic reflexes.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const SCENE_RENDERERS = [
    renderWelcome,
    renderOverview,
    renderHemispheres,
    renderInteractiveRegions,
    renderQuiz,
    renderSummary,
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      <main className="flex-grow flex flex-col items-center pt-6 pb-20 px-4 md:px-8">
        <ModuleStepper currentModule={2} />

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
            onMouseLeave={(e) => { if (canProceed()) e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {submitting ? 'Submitting...' : isLastScene ? 'Continue to Module 3 →' : 'Continue →'}
          </button>
        </div>

        {!canProceed() && (
          <div className="w-full max-w-4xl mt-3">
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              {currentScene.id === 'interactive-regions' && !explorerCompleted
                ? '⚡ Please click and explore all 7 brain systems above to continue.'
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

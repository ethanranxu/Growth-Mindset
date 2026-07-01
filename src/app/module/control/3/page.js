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
import VideoPlayer from '@/components/module/VideoPlayer';
import { getParticipantId, setFlowState } from '@/lib/session';
import { playClick, playSuccess, playApplause } from '@/utils/audioEffects';

const SCENES = [
  {
    id: 'welcome',
    pose: 'welcome',
    narration:
      'Welcome to Learning Module 3! In this module, we will explore everyday brain function examples and common neuroscientific myths, examining how multiple brain networks collaborate seamlessly in daily life.',
  },
  {
    id: 'intro',
    pose: 'speaking',
    narration:
      'Brain functions are rarely performed by a single structure in isolation. Instead, multiple regions and interconnected networks work together simultaneously. Let us examine neutral daily examples and science myth discussions.',
  },
  {
    id: 'examples-video',
    pose: 'confident',
    narration: 'Let us watch a video explaining three everyday brain examples and myth discussions, and then complete the knowledge checks below.',
  },
  {
    id: 'summary',
    pose: 'celebrating',
    narration:
      'Great job! You have completed Learning Module 3. Brain functions are supported by interconnected systems working together. Understanding this foundation clarifies how daily sensory, motor, memory, and cognitive activities operate.',
  },
];

/* Example 1 Quiz */
const QUIZ1_QUESTION = 'Example 1 Question: Which functions are primarily involved in reading text and understanding its meaning?';
const QUIZ1_OPTIONS = [
  { id: 'a', text: 'A. Vision, language, and memory' },
  { id: 'b', text: 'B. Respiration only' },
  { id: 'c', text: 'C. Balance only' },
  { id: 'd', text: 'D. Uncertain' },
];
const QUIZ1_CORRECT_ID = 'a';
const QUIZ1_FEEDBACK_CORRECT = 'Correct! Reading text involves processing visual input, followed by language comprehension and memory access.';
const QUIZ1_FEEDBACK_INCORRECT = 'Not quite right. Think about what your brain needs to interpret written symbols and understand their meaning. Try again!';

/* Example 2 Quiz */
const QUIZ2_QUESTION = 'Example 2 Question: Which functions are primarily involved in turning your head toward a ringing sound?';
const QUIZ2_OPTIONS = [
  { id: 'a', text: 'A. Hearing, attention, and motor control' },
  { id: 'b', text: 'B. Vision only' },
  { id: 'c', text: 'C. Memory only' },
  { id: 'd', text: 'D. Uncertain' },
];
const QUIZ2_CORRECT_ID = 'a';
const QUIZ2_FEEDBACK_CORRECT = 'Correct! Hearing the sound, shifting your attention, locating the source in space, and turning your head require auditory, attentional, and motor networks.';
const QUIZ2_FEEDBACK_INCORRECT = 'Not quite right. Consider what systems are engaged when detecting a sound and physically moving toward it. Try again!';

/* Example 3 Myth Quiz */
const QUIZ3_QUESTION = 'Example 3 Question: What does this myth-busting analysis primarily demonstrate?';
const QUIZ3_OPTIONS = [
  { id: 'a', text: 'A. Daily activities involve many brain regions and networks at different times.' },
  { id: 'b', text: 'B. Most of the brain is never used.' },
  { id: 'c', text: 'C. Daily activities require only a tiny brain area.' },
  { id: 'd', text: 'D. Uncertain' },
];
const QUIZ3_CORRECT_ID = 'a';
const QUIZ3_FEEDBACK_CORRECT = 'Correct! Neuroimaging confirms that daily tasks recruit widespread neural circuits across different times rather than leaving large areas unused.';
const QUIZ3_FEEDBACK_INCORRECT = 'Not quite right. Review the neuroscientific evidence regarding brain network activity during everyday tasks. Try again!';

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

export default function ControlModule3Page() {
  const router = useRouter();
  const [scene, setScene] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Interactive quiz states
  const [quiz1Completed, setQuiz1Completed] = useState(false);
  const [quiz2Completed, setQuiz2Completed] = useState(false);
  const [quiz3Completed, setQuiz3Completed] = useState(false);

  // Video completion state
  const [videoCompleted, setVideoCompleted] = useState(false);

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
      case 'examples-video':
        return videoCompleted && quiz1Completed && quiz2Completed && quiz3Completed;
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
            module_number: 3,
            started_at: startedAt,
            engagement_data: {
              scenes_viewed: TOTAL_SCENES,
              video_completed: videoCompleted,
              quiz1_completed: quiz1Completed,
              quiz2_completed: quiz2Completed,
              quiz3_completed: quiz3Completed,
            },
          }),
        });
      } catch (err) {
        console.error('Control Module 3 submission error:', err);
      }
      setFlowState('intervention');
      router.push('/module/control/4');
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
        <h2 style={STYLES.h2}>Learning Module 3</h2>
        <p style={{ ...STYLES.sub, color: '#006764', fontWeight: 600 }}>
          Everyday Brain Function Examples
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
            Brain functions are rarely performed by a single structure in isolation, but by coordinated networks. Below are neutral everyday examples and science myth discussions.
          </p>
        </div>
      </div>
    </div>
  );

  const renderIntro = () => (
    <div className="animate-fadeIn w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <TeacherCharacter pose="speaking" size={280} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Multi-System Coordinated Collaboration</h2>
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
          <span style={{ fontSize: '1.8rem' }}>⚙️</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#006764', margin: 0, fontFamily: 'var(--font-serif)' }}>
            Coordinated Neural Participation
          </h3>
        </div>
        <p style={{ fontSize: '1.05rem', color: '#04284b', lineHeight: 1.7, fontWeight: 600, marginBottom: '12px' }}>
          Brain functions are usually not accomplished by a single isolated structure, but by multiple regions and systems participating together.
        </p>
        <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
          Below, we will explore three neutral everyday examples to illustrate how specialized brain networks collaborate during familiar activities.
        </p>
      </div>
    </div>
  );

  const renderExamplesVideo = () => (
    <div className="animate-fadeIn w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Intro/Header */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <TeacherCharacter pose="speaking" size={200} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Module 3: Coordinated Brain Networks</h2>
          <SpeechBubble
            text={currentScene.narration}
            typing={!typingDone}
            onComplete={handleTypingComplete}
            tailSide="left"
          />
        </div>
      </div>

      {/* Video Card */}
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
        <div className="flex items-center gap-2 mb-4 border-b pb-3 border-slate-100">
          <span style={{ fontSize: '1.3rem' }}>🎬</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
            BRAIN NETWORKS & MYTHS (VIDEO)
          </span>
        </div>
        <div className="w-full mt-4">
          <VideoPlayer 
            src="/Video/B1.mp4" 
            onComplete={() => setVideoCompleted(true)} 
            isCompleted={videoCompleted} 
          />
        </div>
      </div>

      {/* Quiz Section */}
      <div className="flex flex-col gap-6">
        
        {/* Quiz 1 */}
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">Knowledge Check 1</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Reading comprehension</span>
          </div>
          <KnowledgeCheck
            question={QUIZ1_QUESTION}
            options={QUIZ1_OPTIONS}
            correctId={QUIZ1_CORRECT_ID}
            feedbackCorrect={QUIZ1_FEEDBACK_CORRECT}
            feedbackIncorrect={QUIZ1_FEEDBACK_INCORRECT}
            onComplete={() => setQuiz1Completed(true)}
          />
        </div>

        {/* Quiz 2 */}
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">Knowledge Check 2</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sensory orienting</span>
          </div>
          <KnowledgeCheck
            question={QUIZ2_QUESTION}
            options={QUIZ2_OPTIONS}
            correctId={QUIZ2_CORRECT_ID}
            feedbackCorrect={QUIZ2_FEEDBACK_CORRECT}
            feedbackIncorrect={QUIZ2_FEEDBACK_INCORRECT}
            onComplete={() => setQuiz2Completed(true)}
          />
        </div>

        {/* Quiz 3 */}
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">Knowledge Check 3</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Debunking myths</span>
          </div>
          <KnowledgeCheck
            question={QUIZ3_QUESTION}
            options={QUIZ3_OPTIONS}
            correctId={QUIZ3_CORRECT_ID}
            feedbackCorrect={QUIZ3_FEEDBACK_CORRECT}
            feedbackIncorrect={QUIZ3_FEEDBACK_INCORRECT}
            onComplete={() => setQuiz3Completed(true)}
          />
        </div>

      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 animate-fadeIn w-full max-w-4xl mx-auto">
      <NurseCharacter pose="celebrating" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Module 3 Complete! 🎉</h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{ marginTop: '20px', padding: '20px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)', border: '2px solid #99d6d3', boxShadow: '0 4px 12px rgba(0,103,100,0.08)' }}>
          <p style={{ ...STYLES.innerTitle, color: '#006764', marginBottom: '8px', fontSize: '1.1rem' }}>📌 Key Module Takeaways:</p>
          <ul style={{ fontSize: '0.95rem', color: '#004d40', margin: 0, paddingLeft: '20px', lineHeight: 1.7, listStyleType: 'disc' }}>
            <li>Brain functions are typically supported by multiple regions and systems working together simultaneously.</li>
            <li>Understanding basic structures and functional localization clarifies how the brain manages everyday sensory, motor, attentional, memory, and language activities.</li>
            <li>Brief myth-busting examples serve as neutral neuroscientific knowledge content.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const SCENE_RENDERERS = [
    renderWelcome,
    renderIntro,
    renderExamplesVideo,
    renderSummary,
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      <main className="flex-grow flex flex-col items-center pt-6 pb-20 px-4 md:px-8">
        <ModuleStepper currentModule={3} />

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
            {submitting ? 'Submitting...' : isLastScene ? 'Continue to Module 4 →' : 'Continue →'}
          </button>
        </div>

        {!canProceed() && (
          <div className="w-full max-w-4xl mt-3">
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              {currentScene.id === 'examples-video' && (
                !videoCompleted
                  ? '⚡ Please watch the video to the end to continue.'
                  : (!quiz1Completed || !quiz2Completed || !quiz3Completed)
                    ? '⚡ Please answer all questions correctly to continue.'
                    : ''
              )}
            </p>
          </div>
        )}
      </main>

      <AppFooter />

      <AudioNarrator text={currentScene.narration} autoPlay={false} />
    </div>
  );
}

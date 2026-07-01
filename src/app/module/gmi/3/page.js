'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NurseCharacter from '@/components/module/NurseCharacter';
import TeacherCharacter from '@/components/module/TeacherCharacter';
import SpeechBubble from '@/components/module/SpeechBubble';
import SceneContainer from '@/components/module/SceneContainer';
import KnowledgeCheck from '@/components/module/KnowledgeCheck';
import AudioNarrator from '@/components/module/AudioNarrator';
import { getParticipantId, setFlowState } from '@/lib/session';
import { playClick, playSuccess, playError, playApplause } from '@/utils/audioEffects';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import ModuleStepper from '@/components/module/ModuleStepper';
import VideoPlayer from '@/components/module/VideoPlayer';

/* ================================================================
   Scene content — Module 3: Peer Stories
   ================================================================ */
const SCENES = [
  {
    id: 'welcome',
    pose: 'welcome',
    narration:
      'Welcome to Learning Module 3. In this module, we will explore peer stories from early-career nurses. You will see how they navigated clinical challenges, reframed setbacks, and used a growth mindset to develop their skills.',
  },
  {
    id: 'disclaimer',
    pose: 'speaking',
    narration:
      'Note: The following stories do not describe real individuals or hospitals. They are anonymous, fictionalized peer stories based on common experiences in early-career nursing. As you read, pay attention to how each nurse initially understood their difficulties, and how they later reframed them using a growth mindset.',
  },
  {
    id: 'story1',
    pose: 'uncertain',
    narration: "Let's read our first peer story about receiving feedback on handovers.",
  },
  {
    id: 'story2',
    pose: 'uncertain',
    narration: 'Our second story explores how to handle unfamiliar clinical procedures.',
  },
  {
    id: 'story3',
    pose: 'anxious',
    narration: "Let's read the third story about managing stress and heavy workloads.",
  },
  {
    id: 'summary',
    pose: 'confident',
    narration: "Let's summarize the key insights from these peer stories.",
  },
  {
    id: 'complete',
    pose: 'celebrating',
    narration: 'Excellent! You have completed Learning Module 3. You are now ready to proceed to the post-study survey.',
  },
];

const QUIZ1_QUESTION = 'How did this nurse reframe the preceptor\'s feedback?';
const QUIZ1_OPTIONS = [
  { id: 'a', text: 'As proof that they would never be suited for nursing.' },
  { id: 'b', text: 'As useful learning information indicating a specific area for improvement.' },
  { id: 'c', text: 'As a subjective opinion that should be completely ignored.' },
  { id: 'd', text: 'As a sign that they just needed to work harder without changing their method.' },
];
const QUIZ1_CORRECT_ID = 'b';
const QUIZ1_FEEDBACK_CORRECT =
  'Correct! Reframing feedback as learning information rather than a permanent evaluation of ability is a core aspect of a growth mindset.';
const QUIZ1_FEEDBACK_INCORRECT =
  'Not quite. Think about how the nurse used the preceptor\'s comment to build a new handover checklist. Try again!';

const QUIZ2_QUESTION = 'How did a growth mindset help this nurse approach the unfamiliar procedure?';
const QUIZ2_OPTIONS = [
  { id: 'a', text: 'By interpreting unfamiliarity as a signal to learn and verify key steps.' },
  { id: 'b', text: 'By proving that they did not have the required ability.' },
  { id: 'c', text: 'By keeping them from seeking help from others.' },
  { id: 'd', text: 'By convincing them that stress does not affect performance.' },
];
const QUIZ2_CORRECT_ID = 'a';
const QUIZ2_FEEDBACK_CORRECT =
  'Correct! A growth mindset helps us view unfamiliarity or confusion as a natural trigger for learning, preparation, and proactive verification.';
const QUIZ2_FEEDBACK_INCORRECT =
  'Not quite. Think about how the nurse\'s attitude toward asking questions and verifying steps changed. Try again!';

const QUIZ3_QUESTION = 'What does this story emphasize about managing clinical stress?';
const QUIZ3_OPTIONS = [
  { id: 'a', text: 'All forms of stress are inherently beneficial.' },
  { id: 'b', text: 'The greater the workload and pressure, the better the nurse learns.' },
  { id: 'c', text: 'Stress and challenges can be analyzed to identify specific areas for learning, communication, or support.' },
  { id: 'd', text: 'Individual nurses must bear all systemic work pressures on their own.' },
];
const QUIZ3_CORRECT_ID = 'c';
const QUIZ3_FEEDBACK_CORRECT =
  'Correct! Analyzing stress helps us separate systemic workload from actionable areas where we can learn, adjust, or seek support.';
const QUIZ3_FEEDBACK_INCORRECT =
  'Not quite. The nurse learned to break down stress into parts they could act on. Try again!';

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

export default function Module3Page() {
  const router = useRouter();
  const [scene, setScene] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Quiz states
  const [quiz1Completed, setQuiz1Completed] = useState(false);
  const [quiz1Data, setQuiz1Data] = useState(null);

  const [quiz2Completed, setQuiz2Completed] = useState(false);
  const [quiz2Data, setQuiz2Data] = useState(null);

  const [quiz3Completed, setQuiz3Completed] = useState(false);
  const [quiz3Data, setQuiz3Data] = useState(null);

  // Video completion states
  const [video1Completed, setVideo1Completed] = useState(false);
  const [video2Completed, setVideo2Completed] = useState(false);
  const [video3Completed, setVideo3Completed] = useState(false);

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
      case 'story1':
        return video1Completed && quiz1Completed;
      case 'story2':
        return video2Completed && quiz2Completed;
      case 'story3':
        return video3Completed && quiz3Completed;
      case 'summary':
        return true;
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
            module_number: 3,
            started_at: startedAt,
            engagement_data: {
              scenes_viewed: TOTAL_SCENES,
              video1_completed: video1Completed,
              video2_completed: video2Completed,
              video3_completed: video3Completed,
              quiz1_answer: quiz1Data?.selectedId,
              quiz1_correct: quiz1Data?.wasCorrect,
              quiz1_attempts: quiz1Data?.attempts,
              quiz2_answer: quiz2Data?.selectedId,
              quiz2_correct: quiz2Data?.wasCorrect,
              quiz2_attempts: quiz2Data?.attempts,
              quiz3_answer: quiz3Data?.selectedId,
              quiz3_correct: quiz3Data?.wasCorrect,
              quiz3_attempts: quiz3Data?.attempts,
            },
          }),
        });
      } catch (err) {
        console.error('Module 3 submission error:', err);
      }
      setFlowState('intervention');
      router.push('/module/gmi/4');
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

  const renderStoryCard = (title, storyText, label, character) => (
    <div
      style={{
        width: '100%',
        padding: '24px 28px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        border: '2px solid #006764',
        boxShadow: '0 4px 16px rgba(0, 103, 100, 0.08)',
        position: 'relative',
        overflow: 'visible',
      }}
      className="animate-fadeIn"
    >
      {character && (
        <div style={{
          position: 'absolute',
          right: '24px',
          top: '-45px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          zIndex: 10,
        }}>
          {character}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1.5px dashed #cbd5e1', paddingBottom: '12px', marginRight: character ? '110px' : '0' }}>
        <span style={{ fontSize: '1.3rem' }}>📝</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#04284b', marginBottom: '12px', fontFamily: 'var(--font-serif)', marginRight: character ? '110px' : '0' }}>
        {title}
      </h3>
      <p style={{ fontSize: '1.02rem', color: '#1e293b', lineHeight: 1.7, margin: 0, fontStyle: 'italic', marginRight: character ? '20px' : '0' }}>
        &quot;{storyText}&quot;
      </p>
    </div>
  );

  const renderStoryVideoCard = (title, videoSrc, label, character, onComplete, isCompleted) => (
    <div
      style={{
        width: '100%',
        padding: '24px 28px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        border: '2px solid #006764',
        boxShadow: '0 4px 16px rgba(0, 103, 100, 0.08)',
        position: 'relative',
        overflow: 'visible',
      }}
      className="animate-fadeIn"
    >
      {character && (
        <div style={{
          position: 'absolute',
          right: '24px',
          top: '-45px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          zIndex: 10,
        }}>
          {character}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1.5px dashed #cbd5e1', paddingBottom: '12px', marginRight: character ? '110px' : '0' }}>
        <span style={{ fontSize: '1.3rem' }}>🎬</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#04284b', marginBottom: '12px', fontFamily: 'var(--font-serif)', marginRight: character ? '110px' : '0' }}>
        {title}
      </h3>
      <div className="w-full mt-4">
        <VideoPlayer src={videoSrc} onComplete={onComplete} isCompleted={isCompleted} />
      </div>
    </div>
  );

  /* =============== Scene renderers =============== */

  const renderWelcome = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <NurseCharacter pose="welcome" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Learning Module 3</h2>
        <p style={{ ...STYLES.sub, color: '#006764', fontWeight: 600 }}>
          Peer Stories: Learning from Challenges
        </p>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
      </div>
    </div>
  );

  const renderDisclaimer = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <TeacherCharacter pose="speaking" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>A Note on These Stories</h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
      </div>
    </div>
  );

  const renderStory1 = () => (
    <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-3xl mx-auto" style={{ paddingTop: '25px' }}>
      {/* Story Card at full row width with video */}
      {renderStoryVideoCard(
        "Story 1: After Being Corrected",
        "/Video/A1.mp4",
        "PEER REFLECTION (VIDEO)",
        <>
          <NurseCharacter pose={quiz1Completed ? 'celebrating' : 'uncertain'} size={145} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '-8px', zIndex: 5 }}>
            Peer Nurse
          </span>
        </>,
        () => setVideo1Completed(true),
        video1Completed
      )}

      {/* Bottom: Knowledge Check */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">Knowledge Check</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Single Choice</span>
        </div>
        <KnowledgeCheck
          question={QUIZ1_QUESTION}
          options={QUIZ1_OPTIONS}
          correctId={QUIZ1_CORRECT_ID}
          feedbackCorrect={QUIZ1_FEEDBACK_CORRECT}
          feedbackIncorrect={QUIZ1_FEEDBACK_INCORRECT}
          onComplete={(selectedId, wasCorrect, attempts) => {
            setQuiz1Completed(true);
            setQuiz1Data({ selectedId, wasCorrect, attempts });
          }}
        />
      </div>
    </div>
  );

  const renderStory2 = () => (
    <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-3xl mx-auto" style={{ paddingTop: '25px' }}>
      {/* Story Card at full row width with video */}
      {renderStoryVideoCard(
        "Story 2: An Unfamiliar Procedure",
        "/Video/A2.mp4",
        "PEER REFLECTION (VIDEO)",
        <>
          <NurseCharacter pose={quiz2Completed ? 'celebrating' : 'uncertain'} size={145} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '-8px', zIndex: 5 }}>
            Peer Nurse
          </span>
        </>,
        () => setVideo2Completed(true),
        video2Completed
      )}

      {/* Bottom: Knowledge Check */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">Knowledge Check</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Single Choice</span>
        </div>
        <KnowledgeCheck
          question={QUIZ2_QUESTION}
          options={QUIZ2_OPTIONS}
          correctId={QUIZ2_CORRECT_ID}
          feedbackCorrect={QUIZ2_FEEDBACK_CORRECT}
          feedbackIncorrect={QUIZ2_FEEDBACK_INCORRECT}
          onComplete={(selectedId, wasCorrect, attempts) => {
            setQuiz2Completed(true);
            setQuiz2Data({ selectedId, wasCorrect, attempts });
          }}
        />
      </div>
    </div>
  );

  const renderStory3 = () => (
    <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-3xl mx-auto" style={{ paddingTop: '25px' }}>
      {/* Story Card at full row width with video */}
      {renderStoryVideoCard(
        "Story 3: Pressure in a Busy Shift",
        "/Video/A3.mp4",
        "PEER REFLECTION (VIDEO)",
        <>
          <NurseCharacter pose={quiz3Completed ? 'celebrating' : 'anxious'} size={145} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '-8px', zIndex: 5 }}>
            Peer Nurse
          </span>
        </>,
        () => setVideo3Completed(true),
        video3Completed
      )}

      {/* Bottom: Knowledge Check */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">Knowledge Check</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Single Choice</span>
        </div>
        <KnowledgeCheck
          question={QUIZ3_QUESTION}
          options={QUIZ3_OPTIONS}
          correctId={QUIZ3_CORRECT_ID}
          feedbackCorrect={QUIZ3_FEEDBACK_CORRECT}
          feedbackIncorrect={QUIZ3_FEEDBACK_INCORRECT}
          onComplete={(selectedId, wasCorrect, attempts) => {
            setQuiz3Completed(true);
            setQuiz3Data({ selectedId, wasCorrect, attempts });
          }}
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <NurseCharacter pose="confident" size={340} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Module 3 Summary</h2>
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)', border: '2px solid #99d6d3', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,103,100,0.08)' }}>
          <p style={{ ...STYLES.body, color: '#004d40', fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
            Difficulties, feedback, and pressure do not automatically prove that your abilities are fixed or lacking. Instead, they act as signals pointing to a specific skill, strategy, or source of support that needs development. Stress itself is not inherently beneficial; what matters is identifying—within safe and realistic boundaries—the concrete next steps where you can learn, adjust, or seek support.
          </p>
        </div>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <NurseCharacter pose="celebrating" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Module 3 Complete! 🎉</h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{ marginTop: '20px', padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
          <p style={{ ...STYLES.innerTitle, color: '#166534', marginBottom: '8px', fontSize: '1.1rem' }}>🌱 Keep in Mind:</p>
          <p style={{ ...STYLES.body, color: '#166534', margin: 0, fontSize: '1.02rem', lineHeight: 1.6 }}>
            Every challenge you face is an opportunity to learn, adjust your strategies, or request support. Shift your focus from proving your ability to developing your skills.
          </p>
        </div>
      </div>
    </div>
  );

  const SCENE_RENDERERS = [
    renderWelcome,
    renderDisclaimer,
    renderStory1,
    renderStory2,
    renderStory3,
    renderSummary,
    renderComplete,
  ];

  /* =============== Layout =============== */

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      <main className="flex-grow flex flex-col items-center pt-6 pb-20 px-4 md:px-8">
        <ModuleStepper currentModule={3} />

        {/* Progress */}
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

        {/* Scene */}
        <div className="w-full max-w-4xl" key={scene}>
          <SceneContainer sceneIndex={scene}>
            {SCENE_RENDERERS[scene]()}
          </SceneContainer>
        </div>

        {/* Navigation */}
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

        {/* Hint when blocked */}
        {!canProceed() && (
          <div className="w-full max-w-4xl mt-3">
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              {currentScene.id === 'story1' && (!video1Completed ? '⚡ Please watch the video to the end to continue.' : !quiz1Completed ? '⚡ Please answer the question correctly to continue.' : '')}
              {currentScene.id === 'story2' && (!video2Completed ? '⚡ Please watch the video to the end to continue.' : !quiz2Completed ? '⚡ Please answer the question correctly to continue.' : '')}
              {currentScene.id === 'story3' && (!video3Completed ? '⚡ Please watch the video to the end to continue.' : !quiz3Completed ? '⚡ Please answer the question correctly to continue.' : '')}
            </p>
          </div>
        )}
      </main>

      <AppFooter />

      <AudioNarrator text={currentScene.narration} autoPlay={false} />
    </div>
  );
}

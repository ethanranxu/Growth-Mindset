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
import { playClick, playSuccess, playApplause } from '@/utils/audioEffects';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import ModuleStepper from '@/components/module/ModuleStepper';

/* ================================================================
   Scene content — Module 2: Why Abilities and Professional Skills Can Develop
   ================================================================ */
const SCENES = [
  {
    id: 'welcome',
    pose: 'welcome',
    narration:
      'Welcome back. This module explores why nursing abilities and professional skills are not fixed — and how they can develop through practice, feedback, strategy, and support.',
  },
  {
    id: 'ability-intro',
    pose: 'confident',
    narration:
      'Learning is not simply storing information in your brain. When you practise repeatedly, receive feedback, try more effective approaches, and seek support when needed — your understanding, responses, and clinical skills gradually change.',
  },
  {
    id: 'annie-scenario-step1',
    pose: 'uncertain',
    narration:
      'Annie thinks: It is my third shift. I still feel uncertain about how to quickly prioritise patient needs when things get busy. Am I just not fast enough?',
  },
  {
    id: 'annie-scenario-step2',
    pose: 'looking-up',
    narration:
      'Annie pauses. She hesitates — she worries that asking for help might make her look incompetent. But then she remembers: seeking support is part of professional development, not a sign of weakness. Click the button below to ask for guidance.',
  },
  {
    id: 'annie-scenario-step3',
    pose: 'celebrating',
    narration:
      'Annie reflects: Looking back, I realize that the reason I used to avoid asking for help was my fear of exposing my own limitations. But once I finally allowed myself to seek guidance, I found that it actually gave me clearer direction and more concrete steps to move forward. Skill development has never been about pushing through alone — it grows through practice, feedback, support, and the courage to let myself be seen.',
  },
  {
    id: 'four-factors',
    pose: 'confident',
    narration:
      'Research and clinical experience suggest that professional skill development usually requires four key elements working together. Click each card to explore them.',
  },
  {
    id: 'knowledge-check',
    pose: 'uncertain',
    narration: 'Let us check your understanding with a quick question.',
  },
  {
    id: 'summary',
    pose: 'celebrating',
    narration:
      'Excellent! You have completed Learning Module 2. Professional skills are not fixed at the start of your career. With practice, strategy, feedback, and support — they can develop, and so can you.',
  },
];

const QUIZ_QUESTION =
  'Professional skill development in nursing most commonly depends on which group of factors?';
const QUIZ_OPTIONS = [
  { id: 'a', text: 'Innate ability that can hardly change.' },
  { id: 'b', text: 'Practice, effective strategies, feedback, and support.' },
  { id: 'c', text: 'Simply working harder, without needing any method.' },
  { id: 'd', text: 'Avoiding all difficulties.' },
];
const QUIZ_CORRECT_ID = 'b';
const QUIZ_FEEDBACK_CORRECT =
  'Correct! A growth mindset emphasises that abilities can develop — but development typically requires practice, effective strategies, feedback, and support working together.';
const QUIZ_FEEDBACK_INCORRECT =
  'Not quite. Think about the four elements we just explored — abilities develop through deliberate practice, strategic approaches, feedback, and support. Try again!';

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

const FOUR_FACTORS = [
  {
    icon: '🏃',
    title: 'Practice',
    text: 'Deliberate, repeated practice consolidates skills and builds procedural memory over time.',
  },
  {
    icon: '🗺️',
    title: 'Effective Strategy',
    text: 'Using structured approaches (e.g., clinical checklists, SBAR) provides scaffolding for complex clinical decisions.',
  },
  {
    icon: '💬',
    title: 'Feedback',
    text: 'Feedback — whether from preceptors, peers, or self-reflection — reveals what to adjust and how to improve.',
  },
  {
    icon: '🤝',
    title: 'Support',
    text: 'Team support, mentorship, and a psychologically safe environment enable meaningful learning to occur.',
  },
];

// Ward patients for Scene 3 interactive assessment
const WARD_PATIENTS = [
  { id: 'p1', label: 'Bed 1', x: 30, note: 'Patient requesting pain relief' },
  { id: 'p2', label: 'Bed 2', x: 190, note: 'Patient feels short of breath' },
  { id: 'p3', label: 'Bed 3', x: 350, note: 'Patient needs wound dressing' },
];

export default function Module2Page() {
  const router = useRouter();
  const [scene, setScene] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Scene 3: ward patient assessment interaction
  const [patientsAssessed, setPatientsAssessed] = useState(new Set());
  // Scene 4: guidance interaction
  const [askedForGuidance, setAskedForGuidance] = useState(false);
  // Scene 6: sequential card reveal (same as Module 1)
  const [fourFactorsRevealed, setFourFactorsRevealed] = useState(0);

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
      case 'annie-scenario-step3':
        return true;
      case 'annie-scenario-step1':
        return patientsAssessed.size >= WARD_PATIENTS.length;
      case 'annie-scenario-step2':
        return askedForGuidance;
      case 'four-factors':
        return fourFactorsRevealed >= FOUR_FACTORS.length;
      case 'knowledge-check':
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
            module_type: 'gmi',
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
        console.error('Module 2 submission error:', err);
      }
      setFlowState('intervention');
      router.push('/module/gmi/3');
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

  /* ========================================================
     Ward Interactive SVG — Scene 3
     User clicks each patient bed to "assess" them.
     After all 3 assessed, Continue unlocks.
     Thematic link: trying to prioritise without a strategy yet.
     ======================================================== */
  const renderWardInteractiveSVG = () => {
    const allAssessed = patientsAssessed.size >= WARD_PATIENTS.length;
    return (
      <div style={{ width: '100%' }}>
        <svg
          viewBox="0 0 510 240"
          className="w-full max-w-[600px] mx-auto h-auto border-2 border-[#cbd5e1] rounded-2xl bg-white shadow-md select-none"
        >
          {/* Room */}
          <rect width="510" height="240" fill="#F8FAFC" />
          <rect x="0" y="155" width="510" height="85" fill="#E2E8F0" />
          <line x1="0" y1="155" x2="510" y2="155" stroke="#CBD5E1" strokeWidth="2" />

          {WARD_PATIENTS.map((p) => {
            const assessed = patientsAssessed.has(p.id);
            const bx = p.x;
            return (
              <g
                key={p.id}
                onClick={() => {
                  if (!assessed) {
                    playClick();
                    setPatientsAssessed((prev) => new Set([...prev, p.id]));
                  }
                }}
                style={{ cursor: assessed ? 'default' : 'pointer' }}
              >
                {/* Call light */}
                <circle
                  cx={bx + 60}
                  cy={30}
                  r={11}
                  fill={assessed ? '#4ade80' : '#FCD34D'}
                  stroke={assessed ? '#16a34a' : '#d97706'}
                  strokeWidth="2"
                  className={!assessed ? 'animate-pulse' : ''}
                />
                <text
                  x={bx + 60}
                  y={34}
                  fontSize="10"
                  textAnchor="middle"
                  fill={assessed ? 'white' : '#92400E'}
                  fontWeight="bold"
                >
                  {assessed ? '✓' : '!'}
                </text>

                {/* Bed label */}
                <text
                  x={bx + 60}
                  y={55}
                  fontSize="9.5"
                  fill={assessed ? '#166534' : '#64748B'}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {p.label}
                </text>

                {/* Bed frame */}
                <rect
                  x={bx}
                  y={65}
                  width={120}
                  height={85}
                  rx="8"
                  fill="#FFFFFF"
                  stroke={assessed ? '#22c55e' : '#CBD5E1'}
                  strokeWidth={assessed ? 2.5 : 1.5}
                />
                {/* Mattress */}
                <rect
                  x={bx + 6}
                  y={72}
                  width={108}
                  height={71}
                  rx="6"
                  fill={assessed ? '#dcfce7' : '#E0F2F1'}
                />
                {/* Pillow */}
                <rect x={bx + 10} y={78} width={36} height={24} rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                {/* Patient silhouette */}
                <ellipse cx={bx + 70} cy={114} rx={37} ry={17} fill="#FFF5F0" opacity="0.9" />
                <circle cx={bx + 35} cy={105} r={11} fill="#FFF5F0" stroke="#F3D2C1" strokeWidth="1.5" />

                {/* Assess button / status */}
                {!assessed ? (
                  <>
                    <rect x={bx + 12} y={166} width={96} height={24} rx="7" fill="#006764" />
                    <text x={bx + 60} y={182} fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">
                      Assess →
                    </text>
                  </>
                ) : (
                  <text x={bx + 60} y={182} fontSize="10" fill="#166534" fontWeight="bold" textAnchor="middle">
                    Assessed ✓
                  </text>
                )}
              </g>
            );
          })}

          {/* Status bar */}
          <rect x="10" y="202" width="490" height="26" rx="6" fill={allAssessed ? '#dcfce7' : '#FEF3C7'} />
          <text
            x="255"
            y="219"
            fontSize="9.5"
            fill={allAssessed ? '#166534' : '#92400E'}
            fontWeight="bold"
            textAnchor="middle"
          >
            {allAssessed
              ? '✓ All patients assessed — Annie went to each bed, but is still unsure of the right order.'
              : `Assessed ${patientsAssessed.size}/${WARD_PATIENTS.length} patients. Click each bed call light to assess.`}
          </text>
        </svg>

        {/* Per-patient notes revealed progressively */}
        {patientsAssessed.size > 0 && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {WARD_PATIENTS.filter((p) => patientsAssessed.has(p.id)).map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  animation: 'fadeIn 0.3s ease',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>{p.label}:</span>
                <span style={{ fontSize: '0.85rem', color: '#334155' }}>{p.note}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ========================================================
     Ward Display SVG — Scene 5
     Shows same ward but all organised, call lights green.
     ======================================================== */
  const renderWardDisplaySVG = () => (
    <svg
      viewBox="0 0 510 240"
      className="w-full max-w-[600px] mx-auto h-auto border-2 border-[#86efac] rounded-2xl bg-white shadow-md select-none"
    >
      <rect width="510" height="240" fill="#F0FDF4" />
      <rect x="0" y="155" width="510" height="85" fill="#DCFCE7" />
      <line x1="0" y1="155" x2="510" y2="155" stroke="#86EFAC" strokeWidth="2" />

      {/* Priority badges & clinical items */}
      {[
        { x: 30, label: 'Bed 1', pri: 'Priority 2', condition: 'Pain relief request' },
        { x: 190, label: 'Bed 2', pri: 'Priority 1 ⚠️', condition: 'Shortness of breath' },
        { x: 350, label: 'Bed 3', pri: 'Priority 3', condition: 'Wound dressing' },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x + 60} cy={30} r={11} fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
          <text x={p.x + 60} y={34} fontSize="10" textAnchor="middle" fill="white" fontWeight="bold">✓</text>
          <rect x={p.x} y={65} width={120} height={85} rx="8" fill="#FFFFFF" stroke="#22c55e" strokeWidth="2.5" />
          <rect x={p.x + 6} y={72} width={108} height={71} rx="6" fill="#DCFCE7" />
          <rect x={p.x + 10} y={78} width={36} height={24} rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <ellipse cx={p.x + 70} cy={114} rx={37} ry={17} fill="#FFF5F0" opacity="0.9" />
          <circle cx={p.x + 35} cy={105} r={11} fill="#FFF5F0" stroke="#F3D2C1" strokeWidth="1.5" />
          <text x={p.x + 60} y={55} fontSize="9.5" fill="#166534" fontWeight="bold" textAnchor="middle">{p.label}</text>
          <text x={p.x + 60} y={173} fontSize="9.5" fill={i === 1 ? '#dc2626' : '#166534'} fontWeight="bold" textAnchor="middle">{p.pri}</text>
          <text x={p.x + 60} y={187} fontSize="8.5" fill={i === 1 ? '#991b1b' : '#334155'} fontWeight={i === 1 ? 'bold' : '500'} textAnchor="middle">{p.condition}</text>
        </g>
      ))}

      <text x="255" y="219" fontSize="9.5" fill="#166534" fontWeight="bold" textAnchor="middle">
        With clear guidance, Annie now has an effective prioritisation strategy.
      </text>
    </svg>
  );

  /* =============== Scene renderers =============== */

  const renderWelcome = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <NurseCharacter pose="welcome" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Learning Module 2</h2>
        <p style={{ ...STYLES.sub, color: '#006764', fontWeight: 600 }}>
          Why Abilities and Professional Skills Can Develop
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

  const renderAbilityIntro = () => (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <NurseCharacter pose="confident" size={320} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>How Abilities Develop</h2>
          <SpeechBubble
            text={currentScene.narration}
            typing={!typingDone}
            onComplete={handleTypingComplete}
            tailSide="left"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)', border: '2px solid #99d6d3' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🧠</div>
          <h3 style={{ ...STYLES.cardTitle, color: '#006764' }}>Learning is Dynamic</h3>
          <p style={{ ...STYLES.cardText, color: '#334155' }}>
            Human learning and professional capability development is not static. When you practise, receive feedback, try more effective approaches, and seek support — your understanding and skills gradually change.
          </p>
        </div>
        <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #fafaf9, #f1f5f9)', border: '2px solid #cbd5e1' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🏥</div>
          <h3 style={{ ...STYLES.cardTitle, color: '#334155' }}>Context Also Matters</h3>
          <p style={{ ...STYLES.cardText, color: '#475569' }}>
            This does not mean everyone can solve all problems alone. Clinical environment, staffing, training opportunities, and team support also play important roles in professional development.
          </p>
        </div>
      </div>
    </div>
  );

  const renderAnnieScenarioStep1 = () => {
    const allAssessed = patientsAssessed.size >= WARD_PATIENTS.length;
    return (
      <div className="animate-fadeIn">
        <h2 style={STYLES.h2}>Clinical Scenario: Priority Assessment</h2>
        <p style={STYLES.sub}>
          The ward is busy. Click each patient bed to assess who needs attention — Annie must check all three before she can decide.
        </p>
        <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-stretch justify-between gap-6 min-h-[380px] animate-fadeIn">
          <div className="w-full md:w-[15%] flex-none flex flex-col justify-center items-start pl-0 min-h-[320px] md:-ml-6">
            <div className="flex flex-col items-center gap-2 -ml-16">
              <NurseCharacter pose="uncertain" size={330} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                Annie
              </span>
            </div>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center w-full py-4 md:pl-6">
            {renderWardInteractiveSVG()}
          </div>
        </div>
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">Step 1 of 3</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Busy Ward, Uncertain Mind</span>
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>An Uncertain Moment</h3>
          <p style={STYLES.body}>
            It is Annie&apos;s third shift. Multiple patients have their call lights on, and she is unsure which needs to be seen first.
          </p>
          <div style={{ padding: '20px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px' }}>
            <p style={{ ...STYLES.innerTitle, color: '#b45309' }}>Annie (Inner Monologue):</p>
            <p style={{ ...STYLES.innerText, color: '#b45309', margin: 0 }}>
              {allAssessed
                ? '"I went to each bed... but I am still not sure if I got the right order. There must be a better approach. Am I just not fast enough?"'
                : '"I still feel uncertain about how to quickly prioritise patient needs when things get busy. Am I just not fast enough?"'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAnnieScenarioStep2 = () => (
    <div className="animate-fadeIn">
      <h2 style={STYLES.h2}>Clinical Scenario: Priority Assessment</h2>
      <p style={STYLES.sub}>Follow the instructions on the screen to interact with the scenario.</p>
      <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col gap-4 animate-fadeIn">
        <div className="flex items-end justify-center">
          <div className="flex flex-col items-center">
            <NurseCharacter pose={askedForGuidance ? 'confident' : 'looking-up'} size={300} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
              Annie
            </span>
          </div>
          <div className="flex flex-col items-center" style={{ marginLeft: '-2.5rem' }}>
            <TeacherCharacter pose={askedForGuidance ? 'speaking' : 'default'} size={320} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
              Preceptor
            </span>
          </div>
        </div>
        {askedForGuidance && (
          <div style={{ padding: '16px 20px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', animation: 'fadeIn 0.4s ease' }}>
            <p style={{ ...STYLES.innerTitle, color: '#166534', marginBottom: '6px' }}>Preceptor says:</p>
            <p style={{ ...STYLES.innerText, color: '#166534', margin: 0 }}>
              &quot;That&apos;s a good question. Let&apos;s talk through how to prioritise patients effectively — it takes practice, but it will become second nature.&quot;
            </p>
          </div>
        )}
      </div>
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">Step 2 of 3</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Seeking Guidance</span>
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>The Decision to Ask for Help</h3>
        <p style={STYLES.body}>
          Annie pauses. She hesitates — she worries that asking for help might make her look incompetent. But then she remembers: seeking support is part of professional development, not a sign of weakness.
        </p>
        {!askedForGuidance ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div style={{ padding: '20px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px' }}>
              <p style={{ ...STYLES.innerTitle, color: '#b45309' }}>Annie (Inner Monologue):</p>
              <p style={{ ...STYLES.innerText, color: '#b45309', margin: 0 }}>&quot;Will she think I&apos;m not capable enough if I ask?&quot;</p>
            </div>
            <div className="flex items-center justify-center" style={{ padding: '20px', backgroundColor: '#f0fdf4', border: '2px dashed #86efac', borderRadius: '12px' }}>
              <div className="text-center">
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💡</div>
                <p style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 600, margin: 0 }}>What should Annie do?</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', marginBottom: '16px', animation: 'fadeIn 0.4s ease' }}>
            <p style={{ ...STYLES.innerTitle, color: '#166534' }}>Annie (Inner Monologue):</p>
            <p style={{ ...STYLES.innerText, color: '#166534', margin: 0 }}>&quot;She didn&apos;t judge me. And now I have a clearer strategy to try next time.&quot;</p>
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (!askedForGuidance) {
                playSuccess();
                setAskedForGuidance(true);
              }
            }}
            disabled={askedForGuidance}
            className={!askedForGuidance ? 'animate-pulse' : ''}
            style={{
              padding: '14px 32px',
              borderRadius: '12px',
              border: 'none',
              background: askedForGuidance
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #006764, #00897b)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: askedForGuidance ? 'default' : 'pointer',
              transition: 'all 300ms ease',
              boxShadow: askedForGuidance ? '0 4px 16px rgba(34,197,94,0.25)' : '0 4px 16px rgba(0,103,100,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {askedForGuidance
              ? <><span>✓</span> Guidance Requested</>
              : <><span>🤝</span> Ask for Guidance</>}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnnieScenarioStep3 = () => (
    <div className="animate-fadeIn">
      <h2 style={STYLES.h2}>Clinical Scenario: Priority Assessment</h2>
      <p style={STYLES.sub}>Follow along with Annie during her third shift.</p>
      <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-stretch justify-between gap-6 min-h-[380px] animate-fadeIn">
        <div className="w-full md:w-[15%] flex-none flex flex-col justify-center items-start pl-0 min-h-[320px] md:-ml-6">
          <div className="flex flex-col items-center gap-2 -ml-16">
            <NurseCharacter pose="celebrating" size={330} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              Annie
            </span>
          </div>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center w-full py-4 md:pl-6">
          <div className="w-full flex flex-col items-center gap-4">
            {renderWardDisplaySVG()}
            
            {/* Structured clinical items priority list */}
            <div className="w-full max-w-[600px] flex flex-col gap-2.5 mt-1">
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold text-red-700 bg-red-100 border border-red-300">Priority 1 ⚠️</span>
                  <span className="text-xs font-bold text-red-900">Bed 2</span>
                </div>
                <span className="text-sm font-bold text-red-800">Patient feels short of breath</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300">Priority 2</span>
                  <span className="text-xs font-bold text-emerald-900">Bed 1</span>
                </div>
                <span className="text-sm font-semibold text-emerald-900">Patient requesting pain relief</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300">Priority 3</span>
                  <span className="text-xs font-bold text-emerald-900">Bed 3</span>
                </div>
                <span className="text-sm font-semibold text-emerald-900">Patient needs wound dressing</span>
              </div>
            </div>

            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', backgroundColor: 'white', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '4px' }}>
              With Clear Prioritisation Strategy
            </span>
          </div>
        </div>
      </div>
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">Step 3 of 3</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Reflection &amp; Growth</span>
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>Learning Summary</h3>
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '16px' }}>
          <p style={{ ...STYLES.innerTitle, color: '#334155' }}>Annie (Inner Monologue):</p>
          <p style={{ ...STYLES.innerText, color: '#334155', margin: 0 }}>
            &quot;Looking back, I realise I was avoiding asking for help because I feared it would expose my limitations. But seeking guidance gave me a concrete, structured strategy. That&apos;s how skills develop — not alone, but with practice, feedback, and support.&quot;
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#e6f4f1', border: '1px solid #b2dfdb', borderRadius: '12px' }}>
          <p style={{ ...STYLES.innerTitle, color: '#006064', marginBottom: '8px' }}>🌱 Growth Mindset Tip:</p>
          <p style={{ ...STYLES.body, color: '#004d40', margin: 0 }}>
            Seeking guidance is not a sign of incapability — it is a professional skill. Every experienced nurse once asked the same questions you are asking now.
          </p>
        </div>
      </div>
    </div>
  );

  const renderFourFactors = () => (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <NurseCharacter pose="confident" size={280} />
        <div>
          <h2 style={STYLES.h2}>Four Elements of Skill Development</h2>
          <p style={STYLES.sub}>
            Click each card to explore them ({fourFactorsRevealed}/{FOUR_FACTORS.length} revealed).
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FOUR_FACTORS.map((factor, i) => {
          const revealed = i < fourFactorsRevealed;
          return (
            <button
              key={i}
              onClick={() => {
                playClick();
                if (i === fourFactorsRevealed) setFourFactorsRevealed((v) => v + 1);
              }}
              disabled={i > fourFactorsRevealed}
              style={{
                textAlign: 'left',
                padding: '24px',
                borderRadius: '16px',
                border: revealed ? '2px solid #006764' : '2px solid #e2e8f0',
                background: revealed
                  ? 'linear-gradient(135deg, #f0f7f6, #e0f2f1)'
                  : i === fourFactorsRevealed ? '#ffffff' : '#f8fafc',
                cursor: i <= fourFactorsRevealed ? 'pointer' : 'not-allowed',
                opacity: i > fourFactorsRevealed ? 0.4 : 1,
                transition: 'all 300ms ease',
                boxShadow: revealed ? '0 4px 16px rgba(0,103,100,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: revealed ? '14px' : '0' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: revealed ? '#e0f2f1' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: revealed ? '1px solid #99d6d3' : '1px solid #e2e8f0',
                  fontSize: '1.6rem',
                  flexShrink: 0,
                }}>
                  {revealed ? factor.icon : '❓'}
                </div>
                <h3 style={{ ...STYLES.cardTitle, color: revealed ? '#006764' : '#94a3b8', marginBottom: 0 }}>
                  {revealed ? factor.title : (i === fourFactorsRevealed ? 'Click to reveal' : 'Locked')}
                </h3>
                {revealed && (
                  <span style={{ marginLeft: 'auto', color: '#006764', fontSize: '0.9rem', fontWeight: 600 }}>✓</span>
                )}
              </div>
              {revealed && (
                <p style={{ ...STYLES.cardText, color: '#334155', margin: 0, animation: 'fadeIn 0.3s ease' }}>
                  {factor.text}
                </p>
              )}
              {!revealed && i === fourFactorsRevealed && (
                <p style={{ ...STYLES.cardText, color: '#94a3b8', margin: 0 }}>
                  Click to reveal →
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderKnowledgeCheck = () => (
    <div className="flex flex-col md:flex-row items-start gap-8">
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
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <NurseCharacter pose="celebrating" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Module 2 Complete! 🎉</h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{ marginTop: '20px', padding: '20px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac' }}>
          <p style={{ ...STYLES.innerTitle, color: '#166534', marginBottom: '12px' }}>Key Takeaways</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FOUR_FACTORS.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }}>{f.icon}</span>
                <span style={{ fontSize: '1rem', color: '#166534', lineHeight: 1.6 }}>
                  <strong>{f.title}</strong> — {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SCENE_RENDERERS = [
    renderWelcome,
    renderAbilityIntro,
    renderAnnieScenarioStep1,
    renderAnnieScenarioStep2,
    renderAnnieScenarioStep3,
    renderFourFactors,
    renderKnowledgeCheck,
    renderSummary,
  ];

  /* =============== Layout =============== */

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      <main className="flex-grow flex flex-col items-center pt-6 pb-20 px-4 md:px-8">
        <ModuleStepper currentModule={2} />

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
            {submitting ? 'Submitting...' : isLastScene ? 'Continue to Module 3 →' : 'Continue →'}
          </button>
        </div>

        {/* Hint when blocked */}
        {!canProceed() && (
          <div className="w-full max-w-4xl mt-3">
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              {currentScene.id === 'annie-scenario-step1'
                ? `⚡ Please assess all ${WARD_PATIENTS.length} patients above to continue.`
                : currentScene.id === 'annie-scenario-step2'
                  ? '⚡ Please click "Ask for Guidance" above to continue.'
                  : currentScene.id === 'four-factors'
                    ? `⚡ Please explore all ${FOUR_FACTORS.length} elements above to continue.`
                    : currentScene.id === 'knowledge-check'
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

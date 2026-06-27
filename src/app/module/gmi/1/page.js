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

/* ================================================================
   Scene content — faithful to the approved intervention script
   ================================================================ */
const SCENES = [
  {
    id: 'welcome',
    pose: 'welcome',
    narration:
      'Welcome to this learning module. This module explores how early-career nurses understand learning, ability, and clinical challenges.',
  },
  {
    id: 'clinical-case-step1',
    pose: 'welcome',
    narration:
      'You have just finished inserting the peripheral IV cannula, secured the dressing with tape, tidied the IV tubing, and covered the patient with a blanket. The procedure appears to be complete. Annie thinks: Everything is done, looks perfect.',
  },
  {
    id: 'clinical-case-step2',
    pose: 'looking-up',
    narration:
      "You look up toward the preceptor. She has been observing the procedure, and suddenly she furrows her brow, her gaze settling near the patient's arm. Annie thinks: Why is she frowning? Did I miss something? I feel so nervous... am I not capable enough? Click on the forgotten tourniquet in the diagram to remove it.",
  },
  {
    id: 'clinical-case-step3',
    pose: 'anxious',
    narration:
      "Annie reflects: Most steps went well, but a small detail was still missed. It makes me wonder whether my abilities are insufficient, or whether I’m not suited for clinical work. Growth Mindset Tip: Clinical feedback does not mean you lack ability — it helps you notice easily missed details and provides a learning opportunity for next time.",
  },
  {
    id: 'clinical-moment',
    pose: 'uncertain',
    narration:
      'In clinical work, early-career nurses often encounter moments of unfamiliarity, tension, being corrected, making small errors, or not knowing what to do next. These experiences can easily trigger a thought: Am I not capable enough? Am I not suited for clinical work?',
  },
  {
    id: 'two-perspectives',
    pose: 'confident',
    narration:
      'There are two ways of looking at ability and difficulty. Let us explore both perspectives.',
  },
  {
    id: 'growth-mindset-detail',
    pose: 'confident',
    narration:
      'A growth mindset does not mean difficulties do not exist, nor does it mean that effort alone guarantees success. It emphasises that difficulties, feedback, and unfamiliar tasks can provide learning information — helping you see what to practise next, what to adjust, and whom to seek support from.',
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
      'Great work! You have completed Learning Module 1. Remember: challenges and feedback are not signs of failure — they are signals that point you toward your next step in professional growth.',
  },
];

const QUIZ_QUESTION =
  'Which of the following statements best reflects a growth mindset?';

const QUIZ_OPTIONS = [
  {
    id: 'a',
    text: 'If you are good at something, you should not need much effort.',
  },
  {
    id: 'b',
    text: 'Encountering difficulties can be part of the process of learning a new skill.',
  },
  {
    id: 'c',
    text: 'If you fail at something, it likely means you do not have the talent for it.',
  },
  {
    id: 'd',
    text: 'Feedback from supervisors mainly shows what you are doing wrong.',
  },
];

const QUIZ_CORRECT_ID = 'b';

const QUIZ_FEEDBACK_CORRECT =
  'A growth mindset is not about denying difficulty, nor about placing all responsibility on personal effort. It is about understanding difficulty as information in the process of learning and ability development.';

const QUIZ_FEEDBACK_INCORRECT =
  'That is not quite right. Think about it this way: a growth mindset sees challenges and feedback as useful information for development, rather than as evidence of fixed limitations. Try again!';

/* ================================================================ */

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
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '8px',
  },
  cardText: {
    fontSize: '1.05rem',
    color: '#475569',
    lineHeight: 1.7,
  },
  innerTitle: {
    fontWeight: 700,
    fontSize: '1.05rem',
    marginBottom: '6px',
  },
  innerText: {
    fontSize: '1.05rem',
    fontStyle: 'italic',
    lineHeight: 1.6,
  }
};

/* Icons */
const IconLock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconSeedling = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12" />
    <path d="M12 12C12 8 8 4 4 4c0 4 4 8 8 8z" />
    <path d="M12 12c0-4 4-8 8-8-0 4-4 8-8 8z" />
    <path d="M7 20c0-2.8 2.2-5 5-5s5 2.2 5 5" />
  </svg>
);

export default function Module1Page() {
  const router = useRouter();
  const [scene, setScene] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [perspectivesRead, setPerspectivesRead] = useState({ fixed: false, growth: false });
  const [infoCardsRevealed, setInfoCardsRevealed] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Scroll to top on scene change with a slight layout delay
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [scene]);

  // Clinical case interactive state
  const [caseStep, setCaseStep] = useState(1);
  const [caseTaped, setCaseTaped] = useState(false);
  const [caseTubing, setCaseTubing] = useState(false);
  const [caseBlanket, setCaseBlanket] = useState(false);
  const [caseLookedUp, setCaseLookedUp] = useState(false);
  const [caseHoveredTeacher, setCaseHoveredTeacher] = useState(false);
  const [caseClickedItems, setCaseClickedItems] = useState({
    cannula: false,
    tubing: false,
    patient: false,
    sharps: false,
    tourniquet: false,
  });
  const [caseTourniquetRemoved, setCaseTourniquetRemoved] = useState(false);
  const [caseSearchFeedback, setCaseSearchFeedback] = useState('');

  const currentScene = SCENES[scene];
  const isLastScene = scene === TOTAL_SCENES - 1;

  const handleTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  const INFO_CARDS = [
    {
      icon: '🔍',
      title: 'Difficulties as information',
      text: 'They help you see what to practise next.',
    },
    {
      icon: '🔄',
      title: 'Feedback as direction',
      text: 'They show what to adjust in your approach.',
    },
    {
      icon: '🤝',
      title: 'Support as resource',
      text: 'They highlight whom to seek support from.',
    },
  ];

  const canProceed = () => {
    switch (currentScene.id) {
      case 'clinical-case-step1':
      case 'clinical-case-step3':
        return true;
      case 'two-perspectives':
        return perspectivesRead.fixed && perspectivesRead.growth;
      case 'growth-mindset-detail':
        return infoCardsRevealed >= INFO_CARDS.length;
      case 'clinical-case-step2':
        return caseTourniquetRemoved;
      case 'knowledge-check':
        return quizCompleted;
      default:
        return typingDone;
    }
  };



  const goNext = async () => {
    playClick();
    if (isLastScene) {
      // Submit completion data
      if (submitting) return;
      setSubmitting(true);
      try {
        await fetch('/api/intervention', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participant_id: getParticipantId(),
            module_type: 'gmi',
            module_number: 1,
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
        console.error('Module 1 submission error:', err);
      }
      // Advance to next module
      router.push('/module/gmi/2');
      return;
    }

    // If next scene is the final summary, play applause sound
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
      setTypingDone(true); // Don't replay typing for visited scenes
    }
  };

  /* =============== Scene renderers =============== */

  const renderWelcome = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <NurseCharacter pose="welcome" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>
          Learning Module 1
        </h2>
        <p style={{ ...STYLES.sub, color: '#006764', fontWeight: 600 }}>
          How Early-Career Nurses Understand Clinical Challenges
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

  const renderClinicalMoment = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <NurseCharacter pose="uncertain" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>
          A Familiar Moment in Clinical Work
        </h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          variant="thought"
          tailSide="left"
        />
      </div>
    </div>
  );

  const renderTwoPerspectives = () => (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <NurseCharacter pose="confident" size={280} />
        <div>
          <h2 style={STYLES.h2}>
            Two Ways of Understanding Ability
          </h2>
          <p style={STYLES.sub}>
            Click each card below to explore both perspectives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Fixed mindset card */}
        <button
          onClick={() => {
            playClick();
            setPerspectivesRead((p) => ({ ...p, fixed: true }));
          }}
          style={{
            textAlign: 'left',
            padding: '24px',
            borderRadius: '16px',
            border: perspectivesRead.fixed ? '2px solid #f59e0b' : '2px solid #e2e8f0',
            background: perspectivesRead.fixed
              ? 'linear-gradient(135deg, #fffbeb, #fef3c7)'
              : '#ffffff',
            cursor: 'pointer',
            transition: 'all 300ms ease',
            boxShadow: perspectivesRead.fixed ? '0 4px 16px rgba(245,158,11,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #fcd34d',
            }}>
              <IconLock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 style={{ ...STYLES.cardTitle, color: '#92400e', marginBottom: 0 }}>Fixed View</h3>
            {perspectivesRead.fixed && <span style={{ marginLeft: 'auto', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 600 }}>✓ Read</span>}
          </div>
          {perspectivesRead.fixed ? (
            <p style={{ ...STYLES.cardText, color: '#92400e', animation: 'fadeIn 0.3s ease' }}>
              One view holds that a person&apos;s ability is basically fixed — encountering difficulty means you are &quot;not good enough.&quot;
            </p>
          ) : (
            <p style={{ ...STYLES.cardText, color: '#94a3b8' }}>Click to explore this perspective →</p>
          )}
        </button>

        {/* Growth mindset card */}
        <button
          onClick={() => {
            playClick();
            setPerspectivesRead((p) => ({ ...p, growth: true }));
          }}
          style={{
            textAlign: 'left',
            padding: '24px',
            borderRadius: '16px',
            border: perspectivesRead.growth ? '2px solid #22c55e' : '2px solid #e2e8f0',
            background: perspectivesRead.growth
              ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
              : '#ffffff',
            cursor: 'pointer',
            transition: 'all 300ms ease',
            boxShadow: perspectivesRead.growth ? '0 4px 16px rgba(34,197,94,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #86efac',
            }}>
              <IconSeedling className="w-6 h-6 text-green-600" />
            </div>
            <h3 style={{ ...STYLES.cardTitle, color: '#166534', marginBottom: 0 }}>Growth View</h3>
            {perspectivesRead.growth && <span style={{ marginLeft: 'auto', color: '#22c55e', fontSize: '0.9rem', fontWeight: 600 }}>✓ Read</span>}
          </div>
          {perspectivesRead.growth ? (
            <p style={{ ...STYLES.cardText, color: '#166534', animation: 'fadeIn 0.3s ease' }}>
              Another view holds that ability and professional skills can gradually develop through practice, feedback, strategy adjustment, and support. This is often called a <strong>growth mindset</strong>.
            </p>
          ) : (
            <p style={{ ...STYLES.cardText, color: '#94a3b8' }}>Click to explore this perspective →</p>
          )}
        </button>
      </div>
    </div>
  );

  const renderGrowthDetail = () => (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <NurseCharacter pose="confident" size={320} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>
            What Growth Mindset Means
          </h2>
          <SpeechBubble
            text={currentScene.narration}
            typing={!typingDone}
            onComplete={handleTypingComplete}
            tailSide="left"
          />
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ ...STYLES.sub, marginBottom: '12px', fontWeight: 600 }}>
          Click each card to reveal ({infoCardsRevealed}/{INFO_CARDS.length} revealed):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INFO_CARDS.map((card, i) => {
            const revealed = i < infoCardsRevealed;
            return (
              <button
                key={i}
                onClick={() => {
                  playClick();
                  if (i === infoCardsRevealed) setInfoCardsRevealed((v) => v + 1);
                }}
                disabled={i > infoCardsRevealed}
                style={{
                  textAlign: 'center',
                  padding: '20px 16px',
                  borderRadius: '12px',
                  border: revealed ? '2px solid #006764' : '2px solid #e2e8f0',
                  background: revealed
                    ? 'linear-gradient(135deg, #f0f7f6, #e0f2f1)'
                    : i === infoCardsRevealed
                      ? '#ffffff'
                      : '#f8fafc',
                  cursor: i <= infoCardsRevealed ? 'pointer' : 'not-allowed',
                  opacity: i > infoCardsRevealed ? 0.4 : 1,
                  transition: 'all 300ms ease',
                  boxShadow: revealed ? '0 4px 12px rgba(0,103,100,0.1)' : 'none',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                  {revealed ? card.icon : '❓'}
                </div>
                {revealed ? (
                  <>
                    <h4 style={{ ...STYLES.cardTitle, color: '#006764', marginBottom: '6px' }}>
                      {card.title}
                    </h4>
                    <p style={{ ...STYLES.cardText, color: '#334155', margin: 0 }}>
                      {card.text}
                    </p>
                  </>
                ) : (
                  <p style={{ ...STYLES.cardText, color: '#94a3b8', margin: 0 }}>
                    {i === infoCardsRevealed ? 'Click to reveal' : 'Locked'}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCaseSVG = (step) => {
    return (
      <svg
        viewBox="0 0 400 250"
        className="w-full max-w-[580px] h-auto border-2 border-[#cbd5e1] rounded-2xl bg-white shadow-md select-none"
      >
        {/* Bed Sheet (Light background) */}
        <rect width="400" height="250" fill="#ECEFF1" />

        {/* Patient's Arm (Flesh tone cylindrical pathway - stretched from 0 to 400) */}
        <path d="M0,110 Q200,95 400,110 L400,190 Q200,205 0,190 Z" fill="#FFF0E5" />

        {/* Patient Sleeve (Hospital scrub pattern on the left of arm) */}
        <path d="M0,90 L90,90 L95,210 L0,210 Z" fill="#90A4AE" />
        <path d="M90,90 L100,90 L105,210 L95,210 Z" fill="#78909C" />

        {/* Tourniquet (Orange strap around the arm - near sleeve) */}
        {!caseTourniquetRemoved && (
          <g
            onClick={() => {
              if (step === 2) {
                playSuccess();
                setCaseTourniquetRemoved(true);
              }
            }}
            style={{ cursor: step === 2 ? 'pointer' : 'default' }}
            className={step === 2 ? 'animate-pulse' : ''}
          >
            {/* Tourniquet band */}
            <rect x="120" y="100" width="20" height="100" fill="#FF8F00" rx="4" stroke="#E65100" strokeWidth="2" />
            {/* Buckle */}
            <rect x="117" y="140" width="26" height="20" fill="#37474F" rx="3" />
            {/* Highlight boundary for search step */}
            {step === 2 && (
              <rect x="116" y="96" width="28" height="108" fill="none" stroke="#EF5350" strokeWidth="3" rx="6" strokeDasharray="4,4" />
            )}
          </g>
        )}

        {/* IV Cannula / Indwelling Needle (Fixed on the forearm) */}
        <g>
          {/* The needle wing hub */}
          <path d="M230,140 L260,140 L250,152 L240,152 Z" fill="#29B6F6" />
          <circle cx="245" cy="140" r="5" fill="#0288D1" />
          {/* Clear plastic dressing adhesive */}
          <rect x="210" y="115" width="70" height="60" rx="6" fill="#FFFFFF" fillOpacity="0.45" stroke="#B0BEC5" strokeWidth="1.5" />

          {/* Tapes */}
          <rect x="215" y="105" width="12" height="80" fill="#FFFDE7" fillOpacity="0.95" stroke="#CFD8DC" strokeWidth="1" rx="2" />
          <rect x="263" y="105" width="12" height="80" fill="#FFFDE7" fillOpacity="0.95" stroke="#CFD8DC" strokeWidth="1" rx="2" />
        </g>

        {/* IV Tubing / Extension Line */}
        <path
          d="M245,140 Q285,175 320,175 T370,140 L400,140"
          fill="none"
          stroke="#B0BEC5"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Labels Group for Infographic Clarity */}
        <g opacity="0.95">
          {/* Tourniquet label (only if not removed) */}
          {!caseTourniquetRemoved && (
            <g>
              <line x1="130" y1="98" x2="110" y2="52" stroke="#EF5350" strokeWidth="1.5" />
              <circle cx="130" cy="98" r="3" fill="#EF5350" />
              <rect x="45" y="28" width="130" height="24" rx="4" fill="#FFEBEE" stroke="#EF5350" strokeWidth="1" />
              <text x="110" y="44" fontSize="11" fill="#C62828" fontWeight="bold" textAnchor="middle">
                {step === 1 ? 'Tourniquet' : 'Tourniquet (Forgotten)'}
              </text>
            </g>
          )}

          {/* IV Dressing label */}
          <g>
            <line x1="245" y1="103" x2="245" y2="52" stroke="#0288D1" strokeWidth="1.5" />
            <circle cx="245" cy="103" r="3" fill="#0288D1" />
            <rect x="185" y="28" width="120" height="24" rx="4" fill="#E1F5FE" stroke="#0288D1" strokeWidth="1" />
            <text x="245" y="44" fontSize="11" fill="#0277BD" fontWeight="bold" textAnchor="middle">IV Cannula & Tape</text>
          </g>
        </g>
      </svg>
    );
  };

  const renderClinicalCaseStep1 = () => (
    <div className="animate-fadeIn">
      <h2 style={STYLES.h2}>
        Interactive Clinical Scenario: Tourniquet Omission
      </h2>
      <p style={STYLES.sub}>
        Experience a typical clinical moment. Follow the instructions on the screen to interact with the scenario.
      </p>

      {/* Graphics Panel */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-stretch justify-between gap-6 min-h-[380px] animate-fadeIn">
        <div className="w-full md:w-[15%] flex-none flex flex-col justify-center items-start pl-0 min-h-[320px] md:-ml-6">
          <div className="flex flex-col items-center gap-2 -ml-16">
            <NurseCharacter pose="welcome" size={330} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              Annie
            </span>
          </div>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center w-full py-4 md:pl-6">
          <div className="w-full flex flex-col items-center gap-4">
            {renderCaseSVG(1)}
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', backgroundColor: 'white', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              Patient&apos;s Arm Infographic
            </span>
          </div>
        </div>
      </div>

      {/* Description & Inner Monologue */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">
            Step 1 of 3
          </span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Completing Procedure
          </span>
        </div>
        <div className="space-y-4">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
            Completing the Procedure
          </h3>
          <p style={STYLES.body}>
            You have just finished inserting the peripheral IV cannula, secured the dressing with tape, tidied the IV tubing, and covered the patient with a blanket. The procedure appears to be complete.
          </p>

          <div style={{
            padding: '20px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
          }}>
            <p style={{ ...STYLES.innerTitle, color: '#166534' }}>
              Annie (Inner Monologue):
            </p>
            <p style={{ ...STYLES.innerText, color: '#166534', margin: 0 }}>
              &quot;Everything is done, looks perfect.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClinicalCaseStep2 = () => (
    <div className="animate-fadeIn">
      <h2 style={STYLES.h2}>
        Interactive Clinical Scenario: Tourniquet Omission
      </h2>
      <p style={STYLES.sub}>
        Experience a typical clinical moment. Follow the instructions on the screen to interact with the scenario.
      </p>

      {/* Graphics Panel */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col gap-4 animate-fadeIn">
        <div className="flex items-end justify-center">
          <div className="flex flex-col items-center">
            <NurseCharacter pose={caseTourniquetRemoved ? 'confident' : 'looking-up'} size={300} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
              Annie
            </span>
          </div>
          <div className="flex flex-col items-center" style={{ marginLeft: '-2.5rem' }}>
            <TeacherCharacter pose={caseTourniquetRemoved ? 'speaking' : 'frown'} size={320} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
              Preceptor
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          {renderCaseSVG(2)}
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', backgroundColor: 'white', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            Patient&apos;s Arm Infographic
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">
            Step 2 of 3
          </span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Preceptor&apos;s Gaze &amp; Pressure
          </span>
        </div>

        <div className="space-y-4">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
            Preceptor&apos;s Gaze &amp; Pressure
          </h3>
          <p style={STYLES.body}>
            You look up toward the preceptor. She has been observing the procedure, and suddenly she furrows her brow, her gaze settling near the patient&apos;s arm.
          </p>

          {!caseTourniquetRemoved ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div style={{
                padding: '20px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '12px',
              }}>
                <p style={{ ...STYLES.innerTitle, color: '#b45309' }}>
                  Annie (Inner Monologue):
                </p>
                <p style={{ ...STYLES.innerText, color: '#b45309', margin: 0 }}>
                  &quot;Why is she frowning? Did I miss something? I feel so nervous&hellip; am I not capable enough?&quot;
                </p>
              </div>
              <div className="flex items-center justify-center animate-pulse" style={{
                padding: '20px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
              }}>
                <p style={{ ...STYLES.innerText, color: '#b91c1c', fontWeight: 700, margin: 0, textAlign: 'center' }}>
                  🔍 Click on the forgotten tourniquet in the diagram to remove it.
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '20px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
            }}>
              <p style={{ ...STYLES.innerTitle, color: '#166534' }}>
                Preceptor calmly says:
              </p>
              <p style={{ ...STYLES.innerText, color: '#166534', margin: 0 }}>
                &quot;Before finishing, always do a final check.&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderClinicalCaseStep3 = () => (
    <div className="animate-fadeIn">
      <h2 style={STYLES.h2}>
        Interactive Clinical Scenario: Tourniquet Omission
      </h2>
      <p style={STYLES.sub}>
        Experience a typical clinical moment. Follow the instructions on the screen to interact with the scenario.
      </p>

      {/* Graphics Panel */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-stretch justify-between gap-6 min-h-[380px] animate-fadeIn">
        <div className="w-full md:w-[15%] flex-none flex flex-col justify-center items-start pl-0 min-h-[320px] md:-ml-6">
          <div className="flex flex-col items-center gap-2 -ml-16">
            <NurseCharacter pose="anxious" size={330} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              Annie
            </span>
          </div>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center w-full py-4 md:pl-6">
          <div className="w-full flex flex-col items-center gap-4">
            {renderCaseSVG(3)}
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', backgroundColor: 'white', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              Patient&apos;s Arm Infographic
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200">
            Step 3 of 3
          </span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Reflective Learning
          </span>
        </div>

        <div className="space-y-4">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
            Learning Summary
          </h3>

          <div style={{
            padding: '20px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
          }}>
            <p style={{ ...STYLES.innerTitle, color: '#334155' }}>
              Annie (Inner Monologue):
            </p>
            <p style={{ ...STYLES.innerText, color: '#334155', margin: 0 }}>
              &quot;Most steps went well, but a small detail was still missed. It makes me wonder whether my abilities are insufficient, or whether I’m not suited for clinical work.&quot;
            </p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#e6f4f1',
            border: '1px solid #b2dfdb',
            borderRadius: '12px',
          }}>
            <p style={{ ...STYLES.innerTitle, color: '#006764' }}>
              Growth Mindset Tip:
            </p>
            <p style={{ ...STYLES.innerText, color: '#004d40', fontStyle: 'normal', margin: 0 }}>
              Clinical feedback does not mean you lack ability &mdash; it helps you notice easily missed details and provides a learning opportunity for next time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKnowledgeCheck = () => (
    <div>
      <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
        <NurseCharacter pose="uncertain" size={280} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>
            Knowledge Check
          </h2>
          <p style={STYLES.sub}>
            Let&apos;s see what you&apos;ve learned. Select the best answer below.
          </p>
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
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <NurseCharacter pose="celebrating" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>
          Module 1 Complete! 🎉
        </h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{
          marginTop: '20px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          border: '1px solid #86efac',
        }}>
          <p style={{ ...STYLES.innerTitle, color: '#166534', marginBottom: '4px' }}>
            Key Takeaway
          </p>
          <p style={{ ...STYLES.innerText, color: '#166534', fontStyle: 'normal', margin: 0 }}>
            Challenges and feedback are not signs of failure — they are signals that point you toward your next step in professional growth.
          </p>
        </div>
      </div>
    </div>
  );

  const SCENE_RENDERERS = [
    renderWelcome,
    renderClinicalCaseStep1,
    renderClinicalCaseStep2,
    renderClinicalCaseStep3,
    renderClinicalMoment,
    renderTwoPerspectives,
    renderGrowthDetail,
    renderKnowledgeCheck,
    renderSummary,
  ];

  /* =============== Layout =============== */

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      {/* Main */}
      <main className="flex-grow flex flex-col items-center pt-6 pb-20 px-4 md:px-8">
        <ModuleStepper currentModule={1} />

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
              background: canProceed()
                ? 'linear-gradient(135deg, #006764, #00897b)'
                : '#e2e8f0',
              color: canProceed() ? 'white' : '#94a3b8',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              transition: 'all 200ms ease',
              boxShadow: canProceed() ? '0 4px 16px rgba(0,103,100,0.25)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (canProceed()) e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {submitting
              ? 'Submitting...'
              : isLastScene
                ? 'Continue to Module 2 →'
                : 'Continue →'}
          </button>
        </div>

        {/* Hint when blocked */}
        {!canProceed() && (
          <div className="w-full max-w-4xl mt-3">
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              {currentScene.id === 'two-perspectives'
                ? '⚡ Please read both perspectives above to continue.'
                : currentScene.id === 'growth-mindset-detail'
                  ? `⚡ Please reveal all ${INFO_CARDS.length} cards above to continue.`
                  : currentScene.id === 'clinical-case-step2'
                    ? '⚡ Please click the forgotten tourniquet in the diagram to remove it.'
                    : currentScene.id === 'knowledge-check'
                      ? '⚡ Please answer the question correctly to continue.'
                      : ''}
            </p>
          </div>
        )}
      </main>

      <AppFooter />

      {/* Audio Narrator */}
      <AudioNarrator text={currentScene.narration} autoPlay={false} />
    </div>
  );
}

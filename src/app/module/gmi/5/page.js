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
    id: 'checklist',
    pose: 'confident',
    narration:
      'Welcome to Learning Module 5. Over the next two weeks, you may encounter clinical stress, feedback, unfamiliar tasks, or busy shifts. A growth mindset does not make difficulties disappear, nor does it ask you to carry all work stress alone. It helps you choose a concrete, safe next step.',
  },
  {
    id: 'focus',
    pose: 'uncertain',
    narration:
      "Now, let's select your primary focus and reflect on your confidence level.",
  },
  {
    id: 'complete',
    pose: 'celebrating',
    narration:
      'Thank you for completing this learning activity! You have successfully finished all 5 learning modules.',
  },
];

const CHECKLIST_OPTIONS = [
  { id: 'opt1', text: 'When encountering an unfamiliar task, verify the key steps first.' },
  { id: 'opt2', text: 'After receiving feedback, note down one specific area for improvement.' },
  { id: 'opt3', text: 'Ask an experienced colleague or preceptor a clear, specific question.' },
  { id: 'opt4', text: 'After completing a task, take 2 minutes to debrief: what became clearer, and what needs more practice.' },
  { id: 'opt5', text: 'When stress becomes excessive or unsafe, seek appropriate support or escalate according to protocol promptly.' },
];

const CONFIDENCE_LEVELS = [
  { value: 1, label: '1 - Not confident at all' },
  { value: 2, label: '2 - Low confidence' },
  { value: 3, label: '3 - Moderate confidence' },
  { value: 4, label: '4 - Confident' },
  { value: 5, label: '5 - Very confident' },
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

export default function Module5Page() {
  const router = useRouter();
  const [scene, setScene] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Selections
  const [selectedItems, setSelectedItems] = useState([]);
  const [primaryFocus, setPrimaryFocus] = useState('');
  const [confidenceRating, setConfidenceRating] = useState(null);

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

  const toggleChecklistItem = (id) => {
    playClick();
    if (selectedItems.includes(id)) {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
      if (primaryFocus === id) setPrimaryFocus('');
    } else {
      if (selectedItems.length < 3) {
        setSelectedItems((prev) => [...prev, id]);
      }
    }
  };

  const canProceed = () => {
    switch (currentScene.id) {
      case 'checklist':
        return typingDone && selectedItems.length >= 1 && selectedItems.length <= 3;
      case 'focus':
        return typingDone && primaryFocus !== '' && confidenceRating !== null;
      case 'complete':
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
            module_number: 5,
            started_at: startedAt,
            engagement_data: {
              scenes_viewed: TOTAL_SCENES,
              selected_actions: selectedItems,
              primary_focus: primaryFocus,
              confidence_rating: confidenceRating,
            },
          }),
        });
      } catch (err) {
        console.error('Module 5 submission error:', err);
      }
      setFlowState('intervention');
      router.push('/posttest');
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

  const renderChecklist = () => (
    <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <NurseCharacter pose="confident" size={260} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Learning Module 5</h2>
          <p style={{ ...STYLES.sub, color: '#006764', fontWeight: 600 }}>
            My Next Clinical Challenge Checklist
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
          <span style={{ fontSize: '1.3rem' }}>📋</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
            ACTION CHECKLIST
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#04284b', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
          Select 1 to 3 Micro-Actions
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '18px' }}>
          Please choose 1 to 3 actions below that you are willing to try in your clinical practice over the coming weeks:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CHECKLIST_OPTIONS.map((opt) => {
            const isSelected = selectedItems.includes(opt.id);
            const disabled = !isSelected && selectedItems.length >= 3;
            return (
              <div
                key={opt.id}
                onClick={() => !disabled && toggleChecklistItem(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #006764' : '2px solid #e2e8f0',
                  backgroundColor: isSelected ? '#f0f7f6' : '#ffffff',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                  transition: 'all 200ms ease',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid #006764' : '2px solid #cbd5e1',
                    backgroundColor: isSelected ? '#006764' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {isSelected ? '✓' : ''}
                </div>
                <span style={{ fontSize: '1rem', color: isSelected ? '#006764' : '#1e293b', fontWeight: isSelected ? 600 : 400, lineHeight: 1.5 }}>
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: selectedItems.length >= 1 && selectedItems.length <= 3 ? '#166534' : '#f59e0b', fontWeight: 600 }}>
            {selectedItems.length} of 3 selected (1–3 required)
          </span>
        </div>
      </div>
    </div>
  );

  const renderFocus = () => {
    const selectedOptionsList = CHECKLIST_OPTIONS.filter((opt) => selectedItems.includes(opt.id));
    return (
      <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <NurseCharacter pose="uncertain" size={240} />
          <div className="flex-1">
            <h2 style={STYLES.h2}>Primary Focus & Confidence</h2>
            <SpeechBubble
              text={currentScene.narration}
              typing={!typingDone}
              onComplete={handleTypingComplete}
              tailSide="left"
            />
          </div>
        </div>

        {/* Primary Action Choice */}
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
            <span style={{ fontSize: '1.3rem' }}>🎯</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
              STEP 1: PRIMARY ACTION
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#04284b', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
            Select the ONE action you are most willing to try first:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
            {selectedOptionsList.map((opt) => {
              const isChosen = primaryFocus === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => { playClick(); setPrimaryFocus(opt.id); }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: isChosen ? '2px solid #006764' : '2px solid #e2e8f0',
                    backgroundColor: isChosen ? '#f0f7f6' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isChosen ? '6px solid #006764' : '2px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <span style={{ fontSize: '0.98rem', color: isChosen ? '#006764' : '#1e293b', fontWeight: isChosen ? 600 : 400, lineHeight: 1.5 }}>
                    {opt.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confidence Rating Scale */}
        <div
          style={{
            width: '100%',
            padding: '24px 28px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '2px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1.5px dashed #cbd5e1', paddingBottom: '10px' }}>
            <span style={{ fontSize: '1.3rem' }}>🌟</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
              STEP 2: CONFIDENCE RATING
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#04284b', marginBottom: '14px', fontFamily: 'var(--font-serif)' }}>
            How confident do you feel about trying this action?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {CONFIDENCE_LEVELS.map((lvl) => {
              const selected = confidenceRating === lvl.value;
              return (
                <button
                  key={lvl.value}
                  onClick={() => { playClick(); setConfidenceRating(lvl.value); }}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: selected ? '2px solid #006764' : '2px solid #e2e8f0',
                    backgroundColor: selected ? '#006764' : '#ffffff',
                    color: selected ? '#ffffff' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    textAlign: 'center',
                  }}
                >
                  {lvl.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderComplete = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 animate-fadeIn">
      <NurseCharacter pose="celebrating" size={360} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>Learning Intervention Complete! 🎉</h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div style={{ marginTop: '20px', padding: '20px 24px', background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)', border: '2px solid #99d6d3', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,103,100,0.08)' }}>
          <p style={{ ...STYLES.innerTitle, color: '#006764', marginBottom: '8px', fontSize: '1.1rem' }}>🎉 Next Steps:</p>
          <p style={{ ...STYLES.body, color: '#004d40', margin: 0, fontSize: '1.02rem', lineHeight: 1.65 }}>
            Thank you for completing this learning activity. Next, you will proceed to the post-intervention survey.
          </p>
        </div>
      </div>
    </div>
  );

  const SCENE_RENDERERS = [renderChecklist, renderFocus, renderComplete];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      <main className="flex-grow flex flex-col items-center pt-6 pb-20 px-4 md:px-8">
        <ModuleStepper currentModule={5} />

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
            {submitting ? 'Submitting...' : isLastScene ? 'Continue to Post-test Survey →' : 'Continue →'}
          </button>
        </div>

        {!canProceed() && (
          <div className="w-full max-w-4xl mt-3">
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              {currentScene.id === 'checklist' && (selectedItems.length < 1 || selectedItems.length > 3)
                ? '⚡ Please select between 1 and 3 micro-actions to continue.'
                : currentScene.id === 'focus' && (primaryFocus === '' || confidenceRating === null)
                  ? '⚡ Please select your primary action and confidence rating to continue.'
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

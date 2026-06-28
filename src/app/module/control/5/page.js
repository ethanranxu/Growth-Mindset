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
    id: 'review',
    pose: 'confident',
    narration:
      'Welcome to Learning Module 5! You have completed the basic brain functions and functional localization modules. Please complete the review below based on the previous content.',
  },
  {
    id: 'complete',
    pose: 'celebrating',
    narration:
      'Thank you for completing this learning activity! Next, you will proceed to the post-intervention survey.',
  },
];

const CHECKLIST_OPTIONS = [
  { id: 'hemispheres', text: 'Cerebral Hemispheres' },
  { id: 'lobes', text: 'Frontal, Parietal, Temporal, and Occipital Lobes' },
  { id: 'cerebellum', text: 'Cerebellum' },
  { id: 'brainstem', text: 'Brainstem' },
  { id: 'daily_functions', text: 'Everyday brain functions such as sensory, motor, attention, memory, and language' },
  { id: 'none', text: 'None of the above' },
];

const UNDERSTANDING_LEVELS = [
  { value: 1, label: '1 = Not understood at all' },
  { value: 2, label: '2 = Poorly understood' },
  { value: 3, label: '3 = Moderate' },
  { value: 4, label: '4 = Well understood' },
  { value: 5, label: '5 = Thoroughly understood' },
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

export default function ControlModule5Page() {
  const router = useRouter();
  const [scene, setScene] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Review states
  const [selectedItems, setSelectedItems] = useState([]);
  const [understandingRating, setUnderstandingRating] = useState(null);

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
    if (id === 'none') {
      setSelectedItems(selectedItems.includes('none') ? [] : ['none']);
    } else {
      if (selectedItems.includes(id)) {
        setSelectedItems((prev) => prev.filter((item) => item !== id));
      } else {
        setSelectedItems((prev) => [...prev.filter((item) => item !== 'none'), id]);
      }
    }
  };

  const canProceed = () => {
    switch (currentScene.id) {
      case 'review':
        return typingDone && selectedItems.length >= 1 && understandingRating !== null;
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
            module_type: 'control',
            module_number: 5,
            started_at: startedAt,
            engagement_data: {
              scenes_viewed: TOTAL_SCENES,
              reviewed_topics: selectedItems,
              understanding_rating: understandingRating,
            },
          }),
        });
      } catch (err) {
        console.error('Control Module 5 submission error:', err);
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

  const renderReview = () => (
    <div className="flex flex-col gap-6 animate-fadeIn w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <NurseCharacter pose="confident" size={260} />
        <div className="flex-1">
          <h2 style={STYLES.h2}>Learning Module 5</h2>
          <p style={{ ...STYLES.sub, color: '#006764', fontWeight: 600 }}>
            Basic Brain Function Review Checklist
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
        {/* Section 1: Multiple Choice Review Checklist */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1.5px dashed #cbd5e1', paddingBottom: '10px' }}>
          <span style={{ fontSize: '1.3rem' }}>📋</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
            REVIEW CHECKLIST (MULTIPLE CHOICE)
          </span>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#04284b', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
          Please select the topics covered in these learning modules:
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', fontStyle: 'italic' }}>
          (Multiple selections allowed; if selecting &quot;None of the above&quot;, please do not select other options)
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {CHECKLIST_OPTIONS.map((opt) => {
            const isChecked = selectedItems.includes(opt.id);
            return (
              <div
                key={opt.id}
                onClick={() => toggleChecklistItem(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: isChecked ? '2px solid #006764' : '2px solid #e2e8f0',
                  backgroundColor: isChecked ? '#f0f7f6' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: isChecked ? '2px solid #006764' : '2px solid #cbd5e1',
                    backgroundColor: isChecked ? '#006764' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  {isChecked && '✓'}
                </div>
                <span style={{ fontSize: '0.95rem', color: isChecked ? '#006764' : '#1e293b', fontWeight: isChecked ? 600 : 400 }}>
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Section 2: Understanding Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1.5px dashed #cbd5e1', paddingBottom: '10px' }}>
          <span style={{ fontSize: '1.3rem' }}>⭐</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#006764', letterSpacing: '0.05em' }}>
            SELF-ASSESSMENT RATING
          </span>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#04284b', marginBottom: '14px', fontFamily: 'var(--font-serif)' }}>
          How would you rate your overall understanding of the basic brain functions and functional localization content covered in these modules?
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {UNDERSTANDING_LEVELS.map((lvl) => {
            const isSelected = understandingRating === lvl.value;
            return (
              <div
                key={lvl.value}
                onClick={() => { playClick(); setUnderstandingRating(lvl.value); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #006764' : '2px solid #e2e8f0',
                  backgroundColor: isSelected ? '#f0f7f6' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isSelected ? '6px solid #006764' : '2px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.95rem', color: isSelected ? '#006764' : '#1e293b', fontWeight: isSelected ? 600 : 400 }}>
                  {lvl.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 animate-fadeIn w-full max-w-4xl mx-auto">
      <NurseCharacter pose="celebrating" size={380} />
      <div className="flex-1">
        <h2 style={STYLES.h2}>All 5 Modules Completed! 🎉</h2>
        <SpeechBubble
          text={currentScene.narration}
          typing={!typingDone}
          onComplete={handleTypingComplete}
          tailSide="left"
        />
        <div
          style={{
            marginTop: '20px',
            padding: '20px 24px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f0f7f6, #e0f2f1)',
            border: '2px solid #99d6d3',
            boxShadow: '0 4px 12px rgba(0,103,100,0.08)',
          }}
        >
          <p style={{ ...STYLES.innerTitle, color: '#006764', marginBottom: '8px', fontSize: '1.1rem' }}>
            📌 Completion Feedback:
          </p>
          <p style={{ fontSize: '1rem', color: '#004d40', margin: 0, lineHeight: 1.7 }}>
            Thank you for completing this learning activity! Next, you will proceed to the post-intervention survey.
          </p>
        </div>
      </div>
    </div>
  );

  const SCENE_RENDERERS = [renderReview, renderComplete];

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
            {submitting ? 'Submitting...' : isLastScene ? 'Continue to Post-Study Survey →' : 'Continue →'}
          </button>
        </div>

        {!canProceed() && (
          <div className="w-full max-w-4xl mt-3">
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
              {currentScene.id === 'review' && (selectedItems.length === 0 || understandingRating === null)
                ? '⚡ Please select at least one topic and rate your understanding level to continue.'
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FlowGuard from '@/components/FlowGuard';
import { getParticipantId, setFlowState } from '@/lib/session';

const controlSections = [
  {
    id: 'intro',
    title: 'Basic Brain Anatomy',
    content: 'The human brain is one of the most complex organs in the body. It consists of approximately 86 billion neurons divided into different regions, each responsible for specific functions. For example, the frontal lobe handles decision-making and planning, the temporal lobe relates to language comprehension and memory, and the occipital lobe processes visual input. Understanding basic brain structure clarifies physical neural processes.',
  },
  {
    id: 'functions',
    title: 'Memory Formation Processes',
    content: 'When learning new information, the brain processes input through encoding. Information enters sensory memory, then shifts to working memory through attentional focus. If sufficiently processed (e.g., through rehearsal or linking to existing knowledge), it consolidates into long-term memory. Sleep also plays a vital role in memory consolidation.',
  },
  {
    id: 'reflection',
    title: 'Learning Habit Reflection',
    content: 'Please take a few moments to reflect on the following prompt.',
    hasReflection: true,
    reflectionPrompt: 'Please describe one of your daily learning habits and the environment in which you learn most effectively.',
  },
];

export default function ControlModulePage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [reflections, setReflections] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // Redirect to Module 1 of Control Arm
  useEffect(() => {
    setFlowState('intervention');
    router.push('/module/control/1');
  }, [router]);

  const section = controlSections[currentSection];
  const isLastSection = controlSections.length > 0 && currentSection === controlSections.length - 1;

  const canProceed = () => {
    if (section.hasReflection) {
      return (reflections[section.id] || '').trim().length >= 10;
    }
    return true;
  };

  const handleNext = async () => {
    if (!isLastSection) {
      setCurrentSection((prev) => prev + 1);
      window.scrollTo(0, 0);
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/intervention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: getParticipantId(),
          module_type: 'control',
          started_at: startedAt,
          engagement_data: { reflections, sections_viewed: controlSections.length },
        }),
      });

      if (!res.ok) {
        console.warn('Intervention API notice: proceeding with local session flow');
      }

      setFlowState('intervention');
      router.push('/posttest');
    } catch (err) {
      setFlowState('intervention');
      router.push('/posttest');
    }
  };

  return (
    <FlowGuard requiredState="intervention">
      <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-8">
        <div className="text-center">
          <p className="text-slate-600 text-base font-semibold">Redirecting to Learning Module 1...</p>
        </div>
      </div>
    </FlowGuard>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FlowStepper from '@/components/FlowStepper';
import FlowGuard from '@/components/FlowGuard';
import { getParticipantId, setFlowState } from '@/lib/session';

/* Placeholder control content — replace with approved attention-matched materials */
const controlSections = [
  {
    id: 'intro',
    title: '大脑的基本结构',
    content: '人类的大脑是身体中最复杂的器官之一。大脑由大约860亿个神经元组成，分为不同的区域，每个区域负责不同的功能。例如，前额叶负责决策 and 计划，颞叶与语言理解和记忆相关，枕叶则负责视觉处理。了解大脑的基本结构有助于我们理解学习过程中发生的生理变化。',
  },
  {
    id: 'functions',
    title: '记忆的形成过程',
    content: '当我们学习新信息时，大脑会通过一个称为"编码"的过程来处理这些信息。信息首先进入感觉记忆，然后通过注意力进入工作记忆。如果信息被充分加工（例如通过复述 or 关联已有知识），它就可能被转移到长期记忆中存储。睡眠在记忆巩固中也扮演着重要角色。',
  },
  {
    id: 'reflection',
    title: '学习习惯思考',
    content: '请花几分钟思考以下问题。',
    hasReflection: true,
    reflectionPrompt: '请描述您日常的一个学习习惯，以及您通常在什么样的环境中学习效果最好。',
  },
];

export default function ControlModulePage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [reflections, setReflections] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  // ==========================================
  // 【临时开发调试】直接跳转至 Post-study survey 研究后调查
  // ==========================================
  useEffect(() => {
    setFlowState('intervention');
    router.push('/posttest');
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

      if (!res.ok) throw new Error('提交失败');

      setFlowState('intervention');
      router.push('/posttest');
    } catch (err) {
      alert('提交失败，请重试。');
      setSubmitting(false);
    }
  };

  return (
    <FlowGuard requiredState="intervention">
      <div className="page-container">
        <FlowStepper currentStep={4} />

        <div className="progress-info">
          <span>学习活动 {currentSection + 1} / {controlSections.length}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${((currentSection + 1) / controlSections.length) * 100}%` }} />
        </div>

        <div className="page-content animate-fadeIn" key={currentSection}>
          <div className="card">
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--color-primary-dark)' }}>
              {section.title}
            </h2>
            <p style={{ lineHeight: 2, color: 'var(--color-text-secondary)' }}>
              {section.content}
            </p>

            {section.hasReflection && (
              <div style={{ marginTop: 'var(--space-xl)' }}>
                <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)' }}>{section.reflectionPrompt}</p>
                <textarea
                  className="form-textarea"
                  placeholder="请在此写下您的想法（至少10个字）..."
                  value={reflections[section.id] || ''}
                  onChange={(e) => setReflections((prev) => ({ ...prev, [section.id]: e.target.value }))}
                  rows={5}
                />
                <p className="form-hint">已输入 {(reflections[section.id] || '').length} 字</p>
              </div>
            )}
          </div>
        </div>

        <div className="page-footer" style={{ display: 'flex', gap: 'var(--space-md)' }}>
          {currentSection > 0 && (
            <button className="btn btn--secondary" onClick={() => { setCurrentSection((prev) => prev - 1); window.scrollTo(0, 0); }} style={{ flex: 1 }}>
              上一步
            </button>
          )}
          <button
            className="btn btn--primary btn--lg"
            disabled={!canProceed() || submitting}
            onClick={handleNext}
            style={{ flex: 2 }}
          >
            {submitting ? '提交中...' : isLastSection ? '完成学习活动' : '继续'}
          </button>
        </div>
      </div>
    </FlowGuard>
  );
}

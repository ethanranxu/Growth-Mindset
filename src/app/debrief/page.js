'use client';

import { useRouter } from 'next/navigation';
import FlowStepper from '@/components/FlowStepper';
import FlowGuard from '@/components/FlowGuard';
import { setFlowState } from '@/lib/session';

export default function DebriefPage() {
  const router = useRouter();

  const handleContact = () => {
    setFlowState('debrief');
    router.push('/contact');
  };

  const handleFinish = () => {
    setFlowState('completed');
    router.push('/thankyou');
  };

  return (
    <FlowGuard requiredState="debrief">
      <div className="page-container">
        <FlowStepper currentStep={6} />

        <div className="page-header">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎉</div>
          <h1>感谢您的参与</h1>
          <p>您已完成所有学习活动和评估</p>
        </div>

        <div className="page-content">
          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-primary-dark)' }}>关于本研究</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              本研究旨在探讨学习心态对大学生学业表现的影响。您刚才参与的在线学习活动是本研究的核心内容之一。
              您的回答将帮助我们更好地理解学习心态的作用机制，为未来的教育实践提供科学依据。
            </p>
          </div>

          <div className="card" style={{ background: 'var(--color-primary-bg)', borderColor: 'var(--color-primary-light)' }}>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-primary-dark)' }}>支持资源</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 2 }}>
              如果您在参与过程中感到任何不适，以下资源可以为您提供帮助：
            </p>
            <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--space-lg)', marginTop: 'var(--space-sm)' }}>
              <li><strong>您所在学校的心理咨询中心</strong></li>
            </ul>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-primary-dark)' }}>联系方式</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 2 }}>
              <strong>研究者：</strong>XXX（ajhz590@aucklanduni.ac.nz）<br />
              <strong>导　师：</strong>XXX 教授（supervisor@university.ac.xx）
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-primary-dark)' }}>数据退出</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              如果您希望撤回数据，请记录您的参与者编号并联系研究者。由于数据不包含身份信息，我们需要通过参与者编号来定位您的数据。
            </p>
          </div>

          <div className="notice notice--info" style={{ marginTop: 'var(--space-lg)' }}>
            <span>📋</span>
            <span>我们正在招募部分参与者进行简短的后续访谈。如果您有兴趣，请点击下方按钮留下联系方式。</span>
          </div>
        </div>

        <div className="page-footer" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <button className="btn btn--primary btn--block btn--lg" onClick={handleContact}>
            我愿意参与后续访谈
          </button>
          <button className="btn btn--ghost btn--block" onClick={handleFinish}>
            直接完成，不留联系方式
          </button>
        </div>
      </div>
    </FlowGuard>
  );
}

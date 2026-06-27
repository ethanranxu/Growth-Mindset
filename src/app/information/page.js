'use client';

import { useRouter } from 'next/navigation';
import FlowStepper from '@/components/FlowStepper';

const sections = [
  {
    title: '研究目的',
    content: '本研究旨在探讨学习心态如何影响大学生的学业表现和心理健康。通过了解不同学习心态的作用，我们希望为教育实践和学生支持提供科学依据。',
  },
  {
    title: '参与内容',
    content: '您将被邀请完成一系列简短的在线问卷，并参与一个约15分钟的在线学习活动。整个过程预计需要20-30分钟，您可以在任何方便的时间和地点通过手机或电脑完成。',
  },
  {
    title: '自愿参与',
    content: '参与本研究完全自愿。您可以在任何时候决定不参与或退出研究，无需提供任何理由，这不会对您产生任何负面影响。',
  },
  {
    title: '保密性',
    content: '本研究不收集您的姓名、学号等直接身份信息。您的回答将使用随机编号进行标识，所有数据将被安全存储，仅用于学术研究目的。研究结果将以汇总形式呈现，不会涉及任何个人信息。',
  },
  {
    title: '可能的不适与支持',
    content: '本研究涉及的问卷和活动内容不预期会引起明显不适。如果您在参与过程中感到不适，可以随时停止。如需支持，请联系您所在学校的心理咨询中心。',
  },
  {
    title: '退出与数据删除',
    content: '如果您在完成前退出，已提交的数据可能会被保留用于分析，但您可以联系研究者要求删除您的数据。由于数据不包含身份信息，请保留您的参与者编号以便后续联系。',
  },
];

export default function InformationPage() {
  const router = useRouter();

  return (
    <div className="page-container">
      <FlowStepper currentStep={0} />

      <div className="page-header">
        <h1>参与者信息</h1>
        <p>请在同意参与前仔细阅读以下信息</p>
      </div>

      <div className="page-content">
        {sections.map((section, i) => (
          <div key={section.title} className="card animate-fadeIn" style={{ animationDelay: `${i * 0.08}s` }}>
            <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
              {section.title}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              {section.content}
            </p>
          </div>
        ))}

        <div className="card" style={{ background: 'var(--color-primary-bg)', borderColor: 'var(--color-primary-light)' }}>
          <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
            联系方式
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-sm)' }}>
            如果您对本研究有任何疑问，请联系：
          </p>
          <p style={{ lineHeight: 2 }}>
            <strong>研究者：</strong>XXX（ajhz590@aucklanduni.ac.nz）<br />
            <strong>导　师：</strong>XXX 教授（supervisor@university.ac.xx）
          </p>
        </div>
      </div>

      <div className="page-footer">
        <button
          className="btn btn--primary btn--block btn--lg"
          onClick={() => router.push('/consent')}
          id="btn-to-consent"
        >
          继续到知情同意
        </button>
      </div>
    </div>
  );
}

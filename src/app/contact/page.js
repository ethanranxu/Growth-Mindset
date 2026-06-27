'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FlowGuard from '@/components/FlowGuard';
import { getParticipantId, setFlowState } from '@/lib/session';

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({ preferred_name: '', email: '', phone: '', wechat: '', consent_to_contact: false });
  const [submitting, setSubmitting] = useState(false);

  const isValid = form.preferred_name.trim() && (form.email || form.phone || form.wechat) && form.consent_to_contact;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, participant_id: getParticipantId() }),
      });

      if (!res.ok) throw new Error('提交失败');

      setFlowState('completed');
      router.push('/thankyou');
    } catch (err) {
      alert('提交失败，请重试。');
      setSubmitting(false);
    }
  };

  return (
    <FlowGuard requiredState="contact">
      <div className="page-container page-container--narrow">
        <div className="page-header">
          <h1>后续访谈联系方式</h1>
          <p>以下信息将单独存储，不与您的问卷回答关联</p>
        </div>

        <div className="page-content">
          <div className="notice notice--info">
            <span>🔒</span>
            <span>您的联系方式将存储在独立的数据库中，仅用于安排后续访谈。</span>
          </div>

          <div className="card">
            <div className="form-group">
              <label className="form-label" htmlFor="preferred_name">称呼 *</label>
              <input className="form-input" id="preferred_name" placeholder="您希望被如何称呼" value={form.preferred_name} onChange={(e) => handleChange('preferred_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">邮箱</label>
              <input className="form-input" id="email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">手机号码</label>
              <input className="form-input" id="phone" type="tel" placeholder="138xxxx8888" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wechat">微信号</label>
              <input className="form-input" id="wechat" placeholder="您的微信号" value={form.wechat} onChange={(e) => handleChange('wechat', e.target.value)} />
            </div>
            <p className="form-hint mb-md">请至少填写一种联系方式</p>

            <div className="checkbox-item" onClick={() => handleChange('consent_to_contact', !form.consent_to_contact)}>
              <input type="checkbox" checked={form.consent_to_contact} onChange={() => handleChange('consent_to_contact', !form.consent_to_contact)} />
              <label>我同意研究团队通过上述方式联系我安排后续访谈 *</label>
            </div>
          </div>
        </div>

        <div className="page-footer" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <button className="btn btn--primary btn--block btn--lg" disabled={!isValid || submitting} onClick={handleSubmit}>
            {submitting ? '提交中...' : '提交联系方式'}
          </button>
          <button className="btn btn--ghost btn--block" onClick={() => { setFlowState('completed'); router.push('/thankyou'); }}>
            返回，不留联系方式
          </button>
        </div>
      </div>
    </FlowGuard>
  );
}

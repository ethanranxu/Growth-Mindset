'use client';

import { useEffect, useState } from 'react';
import { getParticipantId } from '@/lib/session';

export default function ThankYouPage() {
  const [pid, setPid] = useState('');

  useEffect(() => {
    const id = getParticipantId() || '';
    if (id) {
      Promise.resolve().then(() => setPid(id));
    }
  }, []);

  return (
    <div className="page-container page-container--narrow" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div className="animate-slideUp">
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>✨</div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-md)' }}>
          参与已完成
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
          感谢您花费宝贵时间参与本研究！您的回答将为教育科学研究做出重要贡献。
        </p>

        {pid && (
          <div className="card" style={{ textAlign: 'left', marginBottom: 'var(--space-lg)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>您的参与者编号</p>
            <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{pid}</p>
            <p className="form-hint">如需退出研究或删除数据，请保存此编号并联系研究者。</p>
          </div>
        )}

        <div className="card" style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
            联系与支持
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 2 }}>
            研究者：ajhz590@aucklanduni.ac.nz<br />
            导　师：supervisor@university.ac.xx
          </p>
        </div>
      </div>
    </div>
  );
}

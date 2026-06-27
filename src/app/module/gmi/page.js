'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FlowGuard from '@/components/FlowGuard';
import { setFlowState } from '@/lib/session';

/**
 * GMI Module Hub — redirects to Module 1 (the only module built so far)
 * When additional modules (2–5) are built, this page becomes a progress hub.
 */
export default function GMIModulePage() {
  const router = useRouter();

  useEffect(() => {
    // Route directly to Module 1 for now
    router.replace('/module/gmi/1');
  }, [router]);

  return (
    <FlowGuard requiredState="intervention">
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Loading learning activity...</p>
        </div>
      </div>
    </FlowGuard>
  );
}

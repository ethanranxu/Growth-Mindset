'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFlowState, canAccessState, getPathForState } from '@/lib/session';

/**
 * HOC wrapper that guards pages based on flow state.
 * Redirects if participant hasn't reached this step yet.
 */
export default function FlowGuard({ requiredState, children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (canAccessState(requiredState)) {
      Promise.resolve().then(() => setAllowed(true));
    } else {
      // Redirect to current valid state
      const currentState = getFlowState();
      router.replace(getPathForState(currentState));
    }
  }, [requiredState, router]);

  if (!allowed) {
    return (
      <div className="loading-state">
        <div className="spinner" />
      </div>
    );
  }

  return children;
}

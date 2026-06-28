'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FlowGuard from '@/components/FlowGuard';
import { getParticipantId, setFlowState } from '@/lib/session';

/* ====== Reusable Icons ====== */
const IconCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconInfo = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
    <path d="M12 16v-4m0-4h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDatabase = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const IconUser = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconShieldCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconLock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconCheckCircleSolid = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.177-5.177L6.47 12.47a.75.75 0 111.06-1.06l3.293 3.293 5.646-6.353a.75.75 0 111.122 1.001l-6.25 7.031a.75.75 0 01-1.04.052z" clipRule="evenodd" />
  </svg>
);

const IconDottedCircle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2.5" strokeDasharray="4 4" />
  </svg>
);

const IconProfileSquare = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
    <circle cx="12" cy="10" r="3" strokeWidth="1.5" />
    <path d="M7 21v-2a4 4 0 014-4h2a4 4 0 014 4v2" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function RandomisePage() {
  const router = useRouter();
  const [allocationUrl, setAllocationUrl] = useState(null);
  const [hasClickedContinue, setHasClickedContinue] = useState(false);
  const [participantIdDisplay, setParticipantIdDisplay] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    const participantId = getParticipantId();
    setParticipantIdDisplay(participantId);

    const storageKey = `gm_allocation_${participantId}`;
    let allocated = localStorage.getItem(storageKey);

    // Instant synchronous 50/50 allocation lock upon mount
    if (!allocated) {
      allocated = Math.random() < 0.5 ? 'gmi' : 'control';
      localStorage.setItem(storageKey, allocated);
    }

    setFlowState('randomisation');
    const targetUrl = allocated === 'gmi' ? '/module/gmi/1' : '/module/control/1';
    setAllocationUrl(targetUrl);

    // Background silent sync to API
    fetch('/api/randomise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant_id: participantId }),
    }).catch((err) => console.log('Sync log notice:', err));

    // Auto redirect after 3 seconds
    timeoutRef.current = setTimeout(() => {
      router.push(targetUrl);
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router]);

  const handleContinue = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const participantId = getParticipantId();
    const allocated = localStorage.getItem(`gm_allocation_${participantId}`) || 'gmi';
    const target = allocated === 'gmi' ? '/module/gmi/1' : '/module/control/1';
    router.push(target);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">

      {/* ===== HEADER ===== */}
      <header className="bg-bg-main py-4 px-8 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-300 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="font-medium text-gray-800">Academic Research Project</span>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8 text-sm font-medium text-gray-700">
              <li><a className="hover:text-teal-custom transition-colors" href="/">Home</a></li>
              <li><a className="hover:text-teal-custom transition-colors" href="/team">Research Team</a></li>
              <li><a className="hover:text-teal-custom transition-colors" href="/contact-us">Contact</a></li>
              <li><a className="hover:text-teal-custom transition-colors" href="/faqs">FAQs</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-20 px-4 md:px-8">

        {/* Logo & Titles */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Growth Mindset Logo" className="w-30 h-30 object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#04284b] mb-4 tracking-wide">
            Preparing Your Online Learning Activity
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-[#006764] mb-4">
            Please wait while the system prepares the next step.
          </h2>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-10 relative">
          <div className="absolute top-[30px] left-[10%] right-[10%] border-t-2 border-dotted border-gray-300 z-0" />
          {[
            { num: 1, label: 'Information & Consent', active: false },
            { num: 2, label: 'Eligibility', active: false },
            { num: 3, label: 'Baseline survey', active: false },
            { num: 4, label: 'Online activity', active: true },
            { num: 5, label: 'Post-study survey', active: false }
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center w-1/5 relative z-10">
              <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center font-bold text-2xl mb-2 shadow-sm ${step.active ? 'bg-[#006764] text-white border-2 border-white ring-4 ring-[#eaf4f0]' : 'bg-[#f4f6f8] text-[#04284b] border border-gray-200'}`}>
                {step.num}
              </div>
              <span className={`text-sm font-semibold text-center ${step.active ? 'text-[#006764]' : 'text-[#04284b]'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Cards Area */}
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left Card: Progress Status */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10">

              {/* Circular Progress (Static visual spinner) */}
              <div className="flex flex-col items-center justify-center shrink-0 w-48 h-48 relative self-center">
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="6" />
                  <path d="M50 5 a45 45 0 0 1 45 45" fill="none" stroke="#006764" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <img src="/logo.png" alt="Logo" className="w-28 h-28 mb-0" />
                <span className="text-[#006764] font-bold -mt-4">Preparing...</span>
              </div>

              {/* Timeline */}
              <div className="flex-grow py-2 relative">
                {/* Vertical dotted line behind icons */}
                <div className="absolute left-3.5 top-5 bottom-8 w-0.5 border-l-2 border-dotted border-gray-300 -z-10" />

                {/* Step 1 */}
                <div className="flex items-start mb-6">
                  <div className="bg-white shrink-0">
                    <IconCheckCircleSolid className="w-7 h-7 text-[#006764]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-[#04284b] font-bold text-base mb-1">Baseline responses saved</h3>
                    <p className="text-gray-600 text-sm leading-snug">All baseline questionnaire responses have been securely received.</p>
                  </div>
                </div>

                {/* Separator line for visual rhythm (optional, design has faint lines) */}
                <div className="ml-11 border-t border-gray-100 mb-6 w-full max-w-sm" />

                {/* Step 2 */}
                <div className="flex items-start mb-6">
                  <div className="bg-white shrink-0">
                    <IconCheckCircleSolid className="w-7 h-7 text-[#006764]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-[#04284b] font-bold text-base mb-2">Study ID generated</h3>
                    <div className="flex items-center bg-[#eef6f3] text-[#006764] font-medium text-[13.5px] px-3 py-2 rounded-md border border-[#d5ebe1] mb-2 w-full max-w-[340px]">
                      <IconProfileSquare className="w-5 h-5 mr-2 shrink-0" />
                      <span className="truncate">{participantIdDisplay}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-snug">This ID does not contain your name, email, phone number, WeChat ID, or hospital name.</p>
                  </div>
                </div>

                <div className="ml-11 border-t border-gray-100 mb-6 w-full max-w-sm" />

                {/* Step 3 */}
                <div className="flex items-start">
                  <div className="bg-white shrink-0">
                    <IconDottedCircle className="w-7 h-7 text-[#006764]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-[#04284b] font-bold text-base mb-1">Online learning activity being assigned</h3>
                    <p className="text-gray-600 text-sm leading-snug">The system assigns one of two online learning activities automatically. Participants cannot choose or change this assignment.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Alert box in Left Card */}
            <div className="mt-8 bg-[#f8f9fa] rounded-lg p-5 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <IconInfo className="w-6 h-6 text-[#006764] mr-3 shrink-0" />
                <div>
                  <div className="font-bold text-[#04284b] text-sm">You will be redirected automatically.</div>
                  <div className="text-gray-600 text-sm">Please do not close this page.</div>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="px-6 py-2 border-2 border-[#04284b] text-[#04284b] rounded font-bold hover:bg-[#04284b] hover:text-white transition-colors"
              >
                {hasClickedContinue && !allocationUrl ? 'Loading...' : 'Continue'}
              </button>
            </div>
          </div>

          {/* Right Card: Info list */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col p-6">

            <div className="flex-grow">
              {/* Item 1 */}
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#f4f6f8] flex items-center justify-center text-[#006764] mr-4 border border-gray-100">
                  <IconDatabase className="w-6 h-6" />
                </div>
                <div className="mt-0.5">
                  <h4 className="text-[#04284b] font-bold text-sm mb-1">Allocation is recorded</h4>
                  <p className="text-gray-600 text-xs leading-snug">Allocation is recorded with participant ID and timestamp.</p>
                </div>
              </div>

              <div className="border-t border-gray-100 mb-6 w-full" />

              {/* Item 2 */}
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#f4f6f8] flex items-center justify-center text-[#006764] mr-4 border border-gray-100">
                  <IconUser className="w-6 h-6" />
                </div>
                <div className="mt-0.5">
                  <h4 className="text-[#04284b] font-bold text-sm mb-1">Participant-facing wording remains neutral</h4>
                  <p className="text-gray-600 text-xs leading-snug">All materials use neutral wording about the activities.</p>
                </div>
              </div>

              <div className="border-t border-gray-100 mb-6 w-full" />

              {/* Item 3 */}
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#f4f6f8] flex items-center justify-center text-[#006764] mr-4 border border-gray-100">
                  <IconShieldCheck className="w-6 h-6" />
                </div>
                <div className="mt-0.5">
                  <h4 className="text-[#04284b] font-bold text-sm mb-1">No group result is shown on this page</h4>
                  <p className="text-gray-600 text-xs leading-snug">This page does not reveal any information about other participants or activity allocation results.</p>
                </div>
              </div>
            </div>

            {/* Bottom Box in Right Card */}
            <div className="mt-auto bg-[#f4f6f8] p-4 rounded border border-gray-200 flex items-center">
              <IconLock className="w-5 h-5 text-[#006764] shrink-0 mr-3" />
              <span className="text-gray-600 text-xs leading-tight font-medium">No research data are collected on this page.</span>
            </div>
          </div>

        </div>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-footer-bg py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300 leading-relaxed">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-white overflow-hidden">
                  <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                </div>
                <span className="font-medium text-white leading-tight">Academic Research Project</span>
              </div>
              <p className="mb-0">
                For enquiries regarding this research: <a href="mailto:ajhz590@aucklanduni.ac.nz" className="text-white hover:underline">ajhz590@aucklanduni.ac.nz</a>
              </p>
              <p className="mb-4 text-gray-400">
                This website does not provide medical advice or clinical diagnosis.
              </p>
              <p className="text-gray-500">
                © 2026 University of Auckland PhD Research Project. All rights reserved.
              </p>
            </div>
            <div className="pt-2"> {/* 稍微加点 padding 保证和左边文字行高对齐 */}
              <p className="mb-4">
                Developed for a doctoral research project at the School of Nursing,<br />
                Faculty of Medical and Health Sciences,<br />
                University of Auckland, New Zealand.
              </p>
              <p>
                This platform supports academic research and participant engagement activities.<br />
                All information collected through this website is handled confidentially<br />
                and used solely for approved research purposes.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Tailwinds Custom CSS specifically for spinning animation if not in global */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setSessionToken, generateSessionToken, setFlowState } from '@/lib/session';

// --- Icons ---
const IconDocument = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconTarget = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" strokeWidth="2" fill="currentColor" />
  </svg>
);
const IconListCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const IconClock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconRandom = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);
const IconHeart = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const IconUser = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconLock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconMail = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconChevronDown = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
const IconClipboardCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);
const IconInfo = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconUserShield = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconLockOpen = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

// --- Data ---
const consentCheckboxes = [
  { id: 'read', text: 'I have read and understood the study information.' },
  { id: 'voluntary', text: 'I am taking part voluntarily.' },
  { id: 'stop', text: 'I know I may stop at any time.' },
  { id: 'activities', text: 'I know I will complete questionnaires and be allocated to one of two online activities.' },
  { id: 'deidentified', text: 'I know the main research data will be de-identified.' },
  { id: 'interview', text: 'I know interview email contact is separate and voluntary.' },
  { id: 'discomfort', text: 'I know some questions may cause mild discomfort and support resources will be provided.' },
];

const studyInfoItems = [
  {
    id: 'purpose',
    title: 'Study purpose',
    description: 'This study explores learning beliefs and student development.',
    icon: IconTarget
  },
  {
    id: 'involves',
    title: 'What participation involves',
    description: 'You will complete questionnaires and take part in one of two online activities, then a short follow-up survey.',
    icon: IconListCheck
  },
  {
    id: 'time',
    title: 'Approximate time',
    description: 'The total time required is approximately 30-40 minutes.',
    icon: IconClock
  },
  {
    id: 'random',
    title: 'Random allocation',
    description: 'If eligible, you will be randomly allocated to one of two online learning activities.',
    icon: IconRandom
  },
  {
    id: 'discomfort',
    title: 'Possible discomfort and support',
    description: 'Some questions may cause mild discomfort. Support resources are provided.',
    icon: IconHeart
  },
  {
    id: 'voluntary',
    title: 'Voluntary participation and withdrawal',
    description: 'Participation is voluntary. You may stop at any time without giving a reason.',
    icon: IconUser
  },
  {
    id: 'data',
    title: 'Data storage and confidentiality',
    description: 'Your responses are stored securely and used for research only. No identifying information is kept with the main data.',
    icon: IconLock
  },
  {
    id: 'contact',
    title: 'Researcher and supervisor contacts',
    description: (
      <>
        Researcher email: <span className="text-[#006764] font-medium ml-2">ajhz590@aucklanduni.ac.nz</span><br />
        Supervisor email: <span className="text-[#006764] font-medium ml-2">s.jacobs@auckland.ac.nz</span>
      </>
    ),
    icon: IconMail
  }
];

export default function ConsentPage() {
  const router = useRouter();
  const [checked, setChecked] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const allChecked = consentCheckboxes.every((item) => checked[item.id]);

  const handleCheckAll = () => {
    if (allChecked) {
      setChecked({});
    } else {
      const newChecked = {};
      consentCheckboxes.forEach((item) => {
        newChecked[item.id] = true;
      });
      setChecked(newChecked);
    }
  };

  const handleCheck = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConsent = async () => {
    if (!allChecked || submitting) return;
    setSubmitting(true);

    try {
      const token = generateSessionToken();
      setSessionToken(token);

      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: token,
          consent_given: true,
          consent_version: 'v1.0',
        }),
      });

      if (!res.ok) {
        console.warn('Backend API returned an error, but proceeding with UI flow for testing.');
      }

      setFlowState('consent');
      router.push('/eligibility');
    } catch (err) {
      console.warn('Fetch failed, proceeding with UI flow:', err);
      setFlowState('consent');
      router.push('/eligibility');
    }
  };

  const handleDecline = () => {
    router.push('/exit/no-consent');
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
              <li><a className="hover:text-teal-custom transition-colors" href="#">Home</a></li>
              <li><a className="hover:text-teal-custom transition-colors" href="#">Research Team</a></li>
              <li><a className="hover:text-teal-custom transition-colors" href="#">Contact</a></li>
              <li><a className="hover:text-teal-custom transition-colors" href="#">FAQs</a></li>
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
            Participant Information & Consent
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-[#006764] mb-4">
            Please read the study information before deciding whether to take part.
          </h2>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-10 relative">
          <div className="absolute top-[30px] left-[10%] right-[10%] border-t-2 border-dotted border-gray-300 z-0" />
          {[
            { num: 1, label: 'Information & Consent', active: true },
            { num: 2, label: 'Eligibility', active: false },
            { num: 3, label: 'Baseline survey', active: false },
            { num: 4, label: 'Online activity', active: false },
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

        {/* 2-Column Content Area */}
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* LEFT COLUMN: Study Information (60%) */}
          <div className="md:col-span-3 flex flex-col space-y-4">

            {/* Left Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
              <div className="w-14 h-14 rounded-md bg-[#006764] flex items-center justify-center shrink-0 mr-5 shadow-sm">
                <IconDocument className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-[#04284b] font-bold text-xl mb-1">Study information</h3>
                <p className="text-gray-600 text-sm">Please review each section below. Click a section title to learn more.</p>
              </div>
            </div>

            {/* Accordion List */}
            {studyInfoItems.map((item) => {
              const isOpen = openSections[item.id];
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => toggleSection(item.id)}
                >
                  <div className="p-5 flex items-start justify-between">
                    <div className="flex items-start mr-4">
                      <div className="mt-0.5 shrink-0 text-[#006764]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-[#04284b] font-bold text-[15px] mb-1 leading-snug">{item.title}</h4>
                        <div className="text-gray-600 text-[13.5px] leading-relaxed">
                          {item.description}
                        </div>
                        {isOpen && (
                          <div className="mt-3 text-gray-500 text-sm border-t border-gray-100 pt-3">
                            More detailed information about this section can be provided here.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-gray-400 mt-1">
                      <IconChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Notice Box */}
            <div className="bg-[#f4f6f8] rounded-xl border border-gray-200 p-5 flex items-start mt-2">
              <IconInfo className="w-5 h-5 text-[#006764] shrink-0 mr-3 mt-0.5" />
              <p className="text-gray-600 text-sm font-medium leading-snug">
                If you have questions, please contact the research team using the emails above.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Electronic Consent (40%) */}
          <div className="md:col-span-2 flex flex-col">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col h-full">

              {/* Right Header */}
              <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#d5ebe1] bg-[#eef6f3] flex items-center justify-center mb-4">
                  <IconClipboardCheck className="w-10 h-10 text-[#006764]" />
                </div>
                <h3 className="text-[#04284b] font-bold text-2xl mb-3 font-serif">Electronic Consent</h3>
                <p className="text-gray-600 text-sm">Please tick all boxes below to indicate your consent.</p>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col space-y-5 mb-6">
                {consentCheckboxes.map((item) => (
                  <div key={item.id} className="flex items-start group cursor-pointer" onClick={() => handleCheck(item.id)}>
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={!!checked[item.id]}
                        onChange={() => { }} // handled by parent onClick
                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-300 checked:border-[#006764] checked:bg-[#006764] transition-all"
                      />
                      <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="text-[#04284b] text-[14.5px] leading-snug">{item.text}</p>
                    </div>
                  </div>
                ))}

                {/* Select All Checkbox */}
                <div className="flex items-start group cursor-pointer mt-4 pt-4 border-t border-gray-100" onClick={handleCheckAll}>
                  <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={() => { }}
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-300 checked:border-[#006764] checked:bg-[#006764] transition-all"
                    />
                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="text-[#04284b] text-[14.5px] font-bold leading-snug">I agree to all of the above statements.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row space-x-4 mb-4">
                <button
                  onClick={handleConsent}
                  disabled={!allChecked || submitting}
                  className="flex-1 py-2.5 rounded-lg font-bold text-white bg-[#04284b] hover:bg-[#0a355c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'I agree'}
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 py-2.5 rounded-lg font-bold text-[#04284b] bg-white border-2 border-[#04284b] hover:bg-gray-50 transition-colors text-base"
                >
                  I do not agree
                </button>
              </div>

              {/* Right Notice Box (Moved below buttons) */}
              <div className="bg-[#f4f6f8] rounded-xl border border-gray-200 p-4 flex items-start">
                <IconInfo className="w-5 h-5 text-[#006764] shrink-0 mr-3 mt-0.5" />
                <p className="text-gray-600 text-sm font-medium leading-snug">
                  The main dataset does not record name, phone, WeChat, or email.
                </p>
              </div>

              {/* Decorative SVG Illustration (Fills the remaining bottom space) */}
              <div className="mt-8 flex justify-center items-center w-full grow bg-[#f4f7f6] rounded-xl overflow-hidden border border-gray-100 min-h-[160px]">
                <svg className="w-full h-full opacity-90" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  {/* Background soft shapes */}
                  <circle cx="50" cy="120" r="80" fill="#e0ebe9" opacity="0.6"/>
                  <circle cx="350" cy="20" r="100" fill="#eaf1f0" opacity="0.6"/>
                  <path d="M-20,160 Q100,80 200,160 T420,160 L420,160 L-20,160 Z" fill="#d5ebe1" opacity="0.4"/>
                  
                  {/* Nodes and connections representing data */}
                  <line x1="120" y1="60" x2="280" y2="100" stroke="#006764" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                  <line x1="280" y1="100" x2="330" y2="50" stroke="#04284b" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
                  <circle cx="120" cy="60" r="6" fill="#006764" />
                  <circle cx="280" cy="100" r="6" fill="#04284b" />
                  <circle cx="330" cy="50" r="5" fill="#006764" />

                  {/* Document / Consent Icon */}
                  <g transform="translate(140, 35)">
                    <rect x="0" y="0" width="45" height="55" rx="4" fill="white" stroke="#04284b" strokeWidth="3.5" />
                    <line x1="12" y1="15" x2="33" y2="15" stroke="#04284b" strokeWidth="3" strokeLinecap="round" />
                    <line x1="12" y1="25" x2="25" y2="25" stroke="#04284b" strokeWidth="3" strokeLinecap="round" />
                    <path d="M15,40 L22,46 L35,32" fill="none" stroke="#006764" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </g>

                  {/* Shield / Security Icon */}
                  <g transform="translate(225, 45)">
                    <path d="M18,0 L36,8 L36,22 C36,32 28,42 18,48 C8,42 0,32 0,22 L0,8 L18,0 Z" fill="#006764" />
                    <path d="M18,12 L24,12 A6,6 0 0,1 24,24 L12,24 A6,6 0 0,1 12,12 Z" fill="#white" opacity="0" />
                    <circle cx="18" cy="20" r="6" fill="white" />
                    <path d="M16,20 L16,28 L20,28 L20,20 Z" fill="white" />
                  </g>
                </svg>
              </div>

            </div>
          </div>

        </div>

        {/* Info Cards Row (Bottom) */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center">
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center shrink-0 mr-4">
              <IconUserShield className="w-6 h-6 text-[#006764]" />
            </div>
            <span className="text-[#04284b] font-bold text-sm leading-snug">Participation is voluntary</span>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center">
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center shrink-0 mr-4">
              <IconLockOpen className="w-6 h-6 text-[#006764]" />
            </div>
            <span className="text-[#04284b] font-bold text-sm leading-snug">You may stop at any time</span>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center">
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center shrink-0 mr-4">
              <IconHeart className="w-6 h-6 text-[#006764]" />
            </div>
            <span className="text-[#04284b] font-bold text-sm leading-snug">Confidentiality and support details are provided</span>
          </div>
        </div>

        {/* Global Page Notice */}
        <div className="max-w-6xl w-full flex items-center justify-center mt-2">
          <IconInfo className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-500 text-sm font-medium">No research data are collected on this page.</span>
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
            <div className="pt-2">
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
    </div>
  );
}

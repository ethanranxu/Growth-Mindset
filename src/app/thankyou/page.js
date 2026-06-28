'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { getParticipantId } from '@/lib/session';

// --- SVG Icons ---
const IconCheckBadge = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconShieldCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconAcademic = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const IconMail = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function ThankYouPage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState('');

  useEffect(() => {
    const id = getParticipantId() || '';
    if (id) {
      Promise.resolve().then(() => setParticipantId(id));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-20 px-4 md:px-8">
        {/* Hero Banner */}
        <div className="text-center mb-8 max-w-3xl">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Growth Mindset Logo" className="w-28 h-28 object-contain" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#04284b] mb-3 tracking-wide">
            Study Completed Successfully
          </h1>
          <p className="text-lg font-medium text-[#006764]">
            Thank you for your valuable participation in this research study!
          </p>
        </div>

        {/* Flow Stepper (All Completed ✓) */}
        <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-10 relative select-none">
          <div className="absolute top-[30px] left-[10%] right-[10%] border-t-2 border-dotted border-emerald-300 z-0" />
          {[
            { num: 1, label: 'Information & Consent' },
            { num: 2, label: 'Eligibility' },
            { num: 3, label: 'Baseline survey' },
            { num: 4, label: 'Online activity' },
            { num: 5, label: 'Study Completed' },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center w-1/5 relative z-10">
              <div className="w-[54px] h-[54px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center font-bold text-xl md:text-2xl mb-2 shadow-sm bg-[#006764] text-white border-2 border-white ring-4 ring-[#eaf4f0]">
                ✓
              </div>
              <span className="text-xs md:text-sm font-bold text-[#006764] text-center">
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Central Content Cards */}
        <div className="max-w-3xl w-full flex flex-col space-y-6">
          {/* Main Thank You Message */}
          <div className="bg-white rounded-2xl p-8 border-2 border-emerald-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
              <IconCheckBadge className="w-10 h-10" />
            </div>
            <h2 className="text-[#04284b] text-2xl font-bold font-serif mb-3">
              Your Contributions Make a Difference
            </h2>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-2xl">
              Your responses have been recorded confidentially. The insights provided by early-career nurses like you will help advance educational science and support future nursing professional development strategies.
            </p>
          </div>

          {/* Participant ID Reference Card */}
          {participantId && (
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <IconShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[#04284b] text-lg font-bold font-serif">
                    Your Unique Participant Reference
                  </h3>
                  <p className="text-xs text-slate-500">Keep this ID for your personal records</p>
                </div>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">Participant ID</span>
                  <span className="font-mono text-xl text-[#006764] font-bold tracking-wider">{participantId}</span>
                </div>
                <div className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  If you ever need to inquire about your submission or request data withdrawal, please reference this ID when contacting the researchers.
                </div>
              </div>
            </div>
          )}

          {/* Research Support Card */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4f0] text-[#006764] flex items-center justify-center shrink-0">
                <IconAcademic className="w-5 h-5" />
              </div>
              <h3 className="text-[#04284b] text-lg font-bold font-serif">
                Research Contact &amp; Academic Support
              </h3>
            </div>

            <div className="text-sm text-slate-700 space-y-2 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="flex items-center gap-2">
                <IconMail className="w-4 h-4 text-[#006764] shrink-0" />
                <span><strong>Principal Investigator:</strong> Doctoral Candidate, School of Nursing (<a href="mailto:ajhz590@aucklanduni.ac.nz" className="text-[#006764] hover:underline font-semibold">ajhz590@aucklanduni.ac.nz</a>)</span>
              </p>
              <p className="flex items-center gap-2">
                <IconAcademic className="w-4 h-4 text-[#006764] shrink-0" />
                <span><strong>Institution:</strong> Faculty of Medical and Health Sciences, University of Auckland</span>
              </p>
            </div>
          </div>

          {/* Home Action */}
          <div className="pt-2 text-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3.5 rounded-xl bg-[#04284b] hover:bg-[#093d72] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Return to Study Homepage
            </button>
            <p className="text-xs text-slate-400 mt-3">
              You may now safely close this browser window.
            </p>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

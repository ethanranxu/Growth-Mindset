'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { setSessionToken, generateSessionToken, setFlowState, getSessionToken } from '@/lib/session';
import { playClick } from '@/utils/audioEffects';

// --- SVG Icons ---
const IconShieldCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconX = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CONSENT_STATEMENTS = [
  "I confirm that I have read and understood the Participant Information Sheet for this study.",
  "I understand that taking part is voluntary and unpaid.",
  "I understand that I may stop participating at any time before completing the online study by closing the website.",
  "I understand that my decision to participate or not participate will not affect my employment, professional registration, training, relationship with any hospital or employer, or relationship with the University of Auckland.",
  "I understand that I will complete online questionnaires before and after one allocated online educational activity.",
  "I understand that after baseline questionnaires, the website will randomly allocate me to either the Growth Mindset Intervention or an attention-matched educational control activity, and that I cannot choose my group.",
  "I understand that the main questionnaire dataset will not collect my name, phone number, WeChat ID, email address, hospital name, staff number, precise workplace identifier, patient information, clinical records, employer records, or professional performance data.",
  "I understand that coded research data, including before-and-after questionnaire responses linked by a non-identifying participant identifier, will be stored securely.",
  "I understand that the website developer will not be permitted to view, download, analyse, copy, reuse, disclose, or otherwise use raw participant data.",
  "I understand that if I am allocated to the GMI group and complete the online study pathway, I may be invited to optionally provide an email address for possible future interview contact. Providing an email address is voluntary and is not consent to participate in an interview.",
  "I understand that findings may be used in a doctoral thesis, academic publications, conference presentations, and related scholarly outputs, and will be reported only in aggregate or de-identified form.",
  "I confirm that I am aged 18 years or older."
];

export default function ConsentPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null); // 'consent' | 'noconsent' | null
  const [submitting, setSubmitting] = useState(false);

  const handleSelectOption = (option) => {
    playClick();
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    if (!selectedOption || submitting) return;
    playClick();
    setSubmitting(true);

    let token = getSessionToken();
    if (!token) {
      token = generateSessionToken();
      setSessionToken(token);
    }

    const consentGiven = selectedOption === 'consent';

    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: token,
          consent_given: consentGiven,
          consent_version: '2.0',
        }),
      });
    } catch (err) {
      console.warn('Consent API notice: proceeding with local flow');
    }

    if (consentGiven) {
      setFlowState('consent');
      router.push('/eligibility');
    } else {
      router.push('/exit/no-consent');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-20 px-4 md:px-8">
        {/* Hero Header */}
        <div className="text-center mb-8 max-w-3xl">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Growth Mindset Logo" className="w-28 h-28 object-contain" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#04284b] mb-3 tracking-wide">
            Participant Consent Form
          </h1>
          <p className="text-lg font-medium text-[#006764]">
            Please review the statements below and indicate your consent decision.
          </p>
        </div>

        {/* Stepper (Step 1 Active) */}
        <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-10 relative select-none">
          <div className="absolute top-[30px] left-[10%] right-[10%] border-t-2 border-dotted border-gray-300 z-0" />
          {[
            { num: 1, label: 'Information & Consent' },
            { num: 2, label: 'Eligibility' },
            { num: 3, label: 'Baseline survey' },
            { num: 4, label: 'Online activity' },
            { num: 5, label: 'Post-study survey' },
          ].map((step, index) => {
            const isCurrent = step.num === 1;
            return (
              <div key={index} className="flex flex-col items-center w-1/5 relative z-10">
                <div
                  className={`w-[54px] h-[54px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center font-bold text-xl md:text-2xl mb-2 shadow-sm ${
                    isCurrent
                      ? 'bg-[#006764] text-white border-2 border-white ring-4 ring-[#eaf4f0]'
                      : 'bg-[#f4f6f8] text-[#04284b] border border-gray-200'
                  }`}
                >
                  {step.num}
                </div>
                <span
                  className={`text-xs md:text-sm font-semibold text-center ${
                    isCurrent ? 'text-[#006764]' : 'text-[#04284b]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="max-w-4xl w-full flex flex-col space-y-8">
          
          {/* Full PIS Prompt */}
          <div className="bg-[#f0f7f6] p-5 rounded-2xl border border-[#99d6d3] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="text-[#04284b] font-bold text-sm md:text-base">
                  Need to review the Full Participant Information Sheet (PIS)?
                </p>
                <p className="text-slate-600 text-xs">
                  Read complete details on ethics approvals, AWS data security, and withdrawal rights.
                </p>
              </div>
            </div>
            <Link
              href="/information/full"
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#006764] text-[#006764] hover:text-white font-bold text-xs md:text-sm transition-all border border-[#99d6d3] shrink-0 text-center shadow-2xs"
            >
              View Full PIS →
            </Link>
          </div>

          {/* Section 1: Consent Statements */}
          <div className="bg-white rounded-2xl p-7 md:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4f0] text-[#006764] flex items-center justify-center shrink-0">
                <IconShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-[#04284b] text-xl md:text-2xl font-bold font-serif">
                  Consent Statements
                </h2>
                <p className="text-slate-500 text-xs md:text-sm">
                  Please read each confirmation statement carefully before making your selection.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {CONSENT_STATEMENTS.map((statement, idx) => (
                <div key={idx} className="flex items-start gap-3 text-slate-700 text-sm md:text-base leading-relaxed">
                  <span className="font-bold text-[#006764] shrink-0 w-6 text-right">
                    {idx + 1}.
                  </span>
                  <p className="flex-1">
                    {statement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Consent Options */}
          <div className="bg-white rounded-2xl p-7 md:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-[#04284b] text-xl md:text-2xl font-bold font-serif mb-2">
              Consent Options
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mb-6">
              Select your choice below to proceed with or exit the study.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option 1: Consent */}
              <div
                onClick={() => handleSelectOption('consent')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 relative overflow-hidden ${
                  selectedOption === 'consent'
                    ? 'bg-[#f0f7f6] border-[#006764] ring-4 ring-[#eaf4f0] shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    selectedOption === 'consent'
                      ? 'border-[#006764] bg-[#006764] text-white'
                      : 'border-slate-400 bg-white'
                  }`}
                >
                  {selectedOption === 'consent' && <IconCheck className="w-4 h-4" />}
                </div>
                <div>
                  <span className="font-bold text-[#04284b] text-base md:text-lg block mb-1">
                    I consent
                  </span>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                    I consent to take part in this online research study.
                  </p>
                </div>
              </div>

              {/* Option 2: Do not consent */}
              <div
                onClick={() => handleSelectOption('noconsent')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 relative overflow-hidden ${
                  selectedOption === 'noconsent'
                    ? 'bg-slate-50 border-slate-700 ring-4 ring-slate-100 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    selectedOption === 'noconsent'
                      ? 'border-slate-700 bg-slate-700 text-white'
                      : 'border-slate-400 bg-white'
                  }`}
                >
                  {selectedOption === 'noconsent' && <IconX className="w-4 h-4" />}
                </div>
                <div>
                  <span className="font-bold text-[#04284b] text-base md:text-lg block mb-1">
                    I do not consent
                  </span>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                    I do not consent to take part in this study.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSubmit}
                disabled={!selectedOption || submitting}
                className={`w-full sm:w-auto px-12 py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-md ${
                  selectedOption
                    ? 'bg-[#006764] hover:bg-[#005250] text-white cursor-pointer hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {submitting ? 'Processing...' : 'Submit & Proceed →'}
              </button>
            </div>
          </div>

          {/* Institutional Ethics Clearance Card */}
          <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-2xl p-6 border border-slate-300 text-center shadow-2xs">
            <p className="text-xs md:text-sm font-semibold text-[#04284b] leading-relaxed">
              Approved by the relevant University of Auckland ethics committee on 01-07-2026. <br className="hidden sm:inline" />
              <span className="text-[#006764]">Reference Number: ABC-123456.</span>
            </p>
          </div>

        </div>
      </main>

      <AppFooter />
    </div>
  );
}

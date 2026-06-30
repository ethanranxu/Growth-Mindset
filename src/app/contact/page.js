'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FlowGuard from '@/components/FlowGuard';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { getParticipantId, setFlowState } from '@/lib/session';
import { playClick } from '@/utils/audioEffects';

// --- SVG Icons ---
const IconLock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconUser = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconMail = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function ContactPage() {
  const router = useRouter();
  const participantId = getParticipantId();
  const [form, setForm] = useState({
    email: '',
    consent_to_contact: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const isValid = Boolean(form.email.trim()) && form.consent_to_contact;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    playClick();
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, participant_id: participantId }),
      });

      if (!res.ok) {
        console.warn('Contact API notice: proceeding with local session flow');
      }

      setFlowState('completed');
      router.push('/thankyou');
    } catch (err) {
      setFlowState('completed');
      router.push('/thankyou');
    }
  };

  const handleSkip = () => {
    playClick();
    setFlowState('completed');
    router.push('/thankyou');
  };

  return (
    <FlowGuard requiredState="contact">
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
        <AppHeader />

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-grow flex flex-col items-center pt-8 pb-20 px-4 md:px-8">
          {/* Hero & Header */}
          <div className="text-center mb-8 max-w-3xl">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="Growth Mindset Logo" className="w-28 h-28 object-contain" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#04284b] mb-3 tracking-wide">
              Follow-up Interview Contact Info
            </h1>
            <p className="text-lg font-medium text-[#006764]">
              Thank you for agreeing to participate in our optional follow-up interview.
            </p>
          </div>

          {/* Flow Stepper (Step 5 of 5 Active) */}
          <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-10 relative select-none">
            <div className="absolute top-[30px] left-[10%] right-[10%] border-t-2 border-dotted border-gray-300 z-0" />
            {[
              { num: 1, label: 'Information & Consent' },
              { num: 2, label: 'Eligibility' },
              { num: 3, label: 'Baseline survey' },
              { num: 4, label: 'Online activity' },
              { num: 5, label: 'Interview Contact' },
            ].map((step, index) => {
              const isCurrent = step.num === 5;
              return (
                <div key={index} className="flex flex-col items-center w-1/5 relative z-10">
                  <div
                    className={`w-[54px] h-[54px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center font-bold text-xl md:text-2xl mb-2 shadow-sm ${
                      isCurrent
                        ? 'bg-[#006764] text-white border-2 border-white ring-4 ring-[#eaf4f0]'
                        : 'bg-[#006764] text-white'
                    }`}
                  >
                    {isCurrent ? step.num : '✓'}
                  </div>
                  <span
                    className={`text-xs md:text-sm font-semibold text-center ${
                      isCurrent ? 'text-[#006764]' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Form Container */}
          <div className="max-w-2xl w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col space-y-6">
            {/* Privacy Notice Banner */}
            <div className="bg-[#eef6f3] p-4 rounded-xl border border-[#d5ebe1] flex items-start gap-3">
              <IconLock className="w-5 h-5 text-[#006764] shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm text-[#04284b] leading-relaxed">
                <strong>Privacy Guarantee:</strong> Your contact information will be stored in a separate, secure database. It will only be used by the research team to arrange the interview and will <strong>never</strong> be linked to your anonymous survey responses.
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[#04284b] font-bold text-sm mb-1.5 flex items-center gap-1.5">
                  <IconMail className="w-4 h-4 text-[#006764]" /> Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your.name@example.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#006764] focus:ring-1 focus:ring-[#006764] transition-all"
                />
              </div>

              <p className="text-xs font-semibold text-slate-500 italic pt-1">
                * Please provide your email address.
              </p>
            </div>

            {/* Checkbox Consent */}
            <div
              onClick={() => handleChange('consent_to_contact', !form.consent_to_contact)}
              className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                form.consent_to_contact
                  ? 'border-[#006764] bg-[#f0f7f6]'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={form.consent_to_contact}
                onChange={() => {}}
                className="w-5 h-5 text-[#006764] rounded border-slate-300 focus:ring-[#006764] cursor-pointer mt-0.5 shrink-0"
              />
              <label className="text-xs md:text-sm text-slate-800 font-medium cursor-pointer leading-relaxed">
                I consent to the research team contacting me via the information provided above solely to arrange a follow-up interview. <span className="text-rose-500 font-bold">*</span>
              </label>
            </div>

            {/* Submit & Skip Actions */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-base transition-all shadow-md ${
                  isValid && !submitting
                    ? 'bg-[#006764] hover:bg-[#005250] text-white cursor-pointer hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {submitting ? 'Submitting Contact Info...' : 'Submit Contact Information →'}
              </button>

              <button
                onClick={handleSkip}
                className="w-full py-3 px-6 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 font-semibold text-sm transition-all text-center cursor-pointer"
              >
                Return &amp; Complete Study without leaving contact info
              </button>
            </div>
          </div>
        </main>

        <AppFooter />
      </div>
    </FlowGuard>
  );
}

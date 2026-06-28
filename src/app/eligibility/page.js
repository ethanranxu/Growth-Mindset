'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// --- Icons ---
const IconCheck = ({ className, stroke = 2 }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconX = ({ className, stroke = 2 }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconInfoCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
  </svg>
);
const IconUserX = ({ className, stroke = 1.5 }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 8l5 5m0-5l-5 5" />
  </svg>
);
const IconMenu2 = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IconChevronLeft = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const IconChevronRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);


const screeningQuestions = [
  { id: 'nurse', question: 'Are you a registered nurse?', eligibleAnswer: 'yes' },
  { id: 'clinical', question: 'Are you currently working in clinical nursing in China?', eligibleAnswer: 'yes' },
  { id: 'experience', question: 'Are you within your first five years of clinical work?', eligibleAnswer: 'yes' },
  { id: 'age', question: 'Are you aged 18 years or older?', eligibleAnswer: 'yes' },
  { id: 'language', question: 'Are you able to read Chinese?', eligibleAnswer: 'yes' },
  { id: 'not_previous', question: 'Have you not previously taken part in a structured Growth Mindset Intervention?', eligibleAnswer: 'yes' },
  { id: 'not_participated', question: 'Have you not already participated in this study?', eligibleAnswer: 'yes' }
];

const stepperSteps = [
  { num: 1, label: 'Home', active: false },
  { num: 2, label: 'Information & Consent', active: false },
  { num: 3, label: 'Eligibility', active: true },
  { num: 4, label: 'Baseline', active: false },
  { num: 5, label: 'Online Activity', active: false }
];

const IS_DEBUG = true; // Toggle debug mode here

export default function EligibilityPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState(() => {
    if (IS_DEBUG) {
      const debugAnswers = {};
      screeningQuestions.forEach((q) => {
        debugAnswers[q.id] = q.eligibleAnswer;
      });
      return debugAnswers;
    }
    return {};
  });
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = screeningQuestions.every((q) => answers[q.id] !== undefined);

  // Calculate if currently eligible (all answered questions must match the eligibleAnswer)
  const isCurrentlyEligible = screeningQuestions.every((q) => {
    if (answers[q.id] === undefined) return true; // Ignore unanswered
    return answers[q.id] === q.eligibleAnswer;
  });

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);

    const isEligible = screeningQuestions.every(
      (q) => answers[q.id] === q.eligibleAnswer
    );

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (isEligible) {
      router.push('/baseline');
    } else {
      router.push('/exit/ineligible'); // Route for ineligible participants
    }
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
            Eligibility Screening
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-[#006764] mb-4">
            Please answer the following questions to confirm whether you are eligible to take part.
          </h2>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-10 relative">
          <div className="absolute top-[30px] left-[10%] right-[10%] border-t-2 border-dotted border-gray-300 z-0" />
          {[
            { num: 1, label: 'Information & Consent', active: false },
            { num: 2, label: 'Eligibility', active: true },
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
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* LEFT COLUMN: Main Form (60%) */}
          <div className="md:col-span-3 flex flex-col space-y-6">

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

              {/* Top Info Box */}
              <div className="bg-[#f4f6f8] rounded-xl border border-gray-200 p-5 flex items-start mb-8">
                <IconInfoCircle className="w-6 h-6 text-[#006764] shrink-0 mr-4 mt-0.5" />
                <p className="text-[#04284b] text-[14px] font-medium leading-relaxed">
                  These questions are used only to check eligibility.<br />
                  Please do not enter your name, phone number, WeChat ID, or hospital name.
                </p>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {screeningQuestions.map((q, i) => (
                  <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start mb-4 sm:mb-0 sm:pr-8">
                      <div className="w-7 h-7 rounded-full bg-[#006764] flex items-center justify-center text-white font-bold text-sm shrink-0 mr-4 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-[#04284b] text-[14.5px] font-semibold leading-snug pt-1">
                        {q.question}
                      </p>
                    </div>
                    <div className="flex shrink-0 w-full sm:w-[140px]">
                      <button
                        onClick={() => handleAnswer(q.id, 'yes')}
                        className={`flex-1 py-1.5 border-y border-l rounded-l-md font-bold text-sm transition-all focus:outline-none ${answers[q.id] === 'yes'
                            ? 'bg-[#006764] text-white border-[#006764] shadow-inner relative z-10'
                            : 'bg-white text-[#04284b] border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer(q.id, 'no')}
                        className={`flex-1 py-1.5 border rounded-r-md font-bold text-sm transition-all focus:outline-none ${answers[q.id] === 'no'
                            ? 'bg-[#006764] text-white border-[#006764] shadow-inner relative z-10'
                            : 'bg-white text-[#04284b] border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-between mt-10 pt-6 border-t border-gray-100 gap-4">
                <button
                  onClick={() => router.push('/consent')}
                  className="flex items-center justify-center py-3.5 px-8 rounded-lg font-bold text-[#04284b] bg-white border-2 border-[#04284b] hover:bg-gray-50 transition-colors text-base min-w-[160px] sm:min-w-[200px]"
                >
                  <IconChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className="flex items-center justify-center py-3.5 px-8 rounded-lg font-bold text-white bg-[#04284b] hover:bg-[#0a355c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base min-w-[240px] sm:min-w-[280px] shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit eligibility screening'}
                  <IconChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Results & Preview (40%) */}
          <div className="md:col-span-2 flex flex-col space-y-6">

            {/* Screening Result Box */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-[#04284b] text-lg font-bold mb-6">Screening result</h2>

              <div className="space-y-4 relative">
                {/* Eligible Box */}
                <div className={`p-4 rounded-lg border-2 flex items-center transition-opacity ${(allAnswered && isCurrentlyEligible) ? 'bg-[#f0f8f6] border-[#cae6dc]' : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 ${(allAnswered && isCurrentlyEligible) ? 'border-[#006764] bg-white' : 'border-gray-300 bg-white'
                    }`}>
                    <IconCheck className={`w-6 h-6 ${(allAnswered && isCurrentlyEligible) ? 'text-[#006764]' : 'text-gray-400'}`} stroke={3} />
                  </div>
                  <div>
                    <div className={`font-bold text-[15px] leading-tight ${(allAnswered && isCurrentlyEligible) ? 'text-[#006764]' : 'text-gray-500'}`}>Eligible</div>
                    <div className={`text-sm mt-0.5 ${(allAnswered && isCurrentlyEligible) ? 'text-[#006764]' : 'text-gray-400'}`}>Baseline questionnaire</div>
                  </div>
                </div>

                {/* Not Eligible Box */}
                <div className={`p-4 rounded-lg border-2 flex items-center transition-opacity ${(allAnswered && !isCurrentlyEligible) ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 ${(allAnswered && !isCurrentlyEligible) ? 'border-[#dc2626] bg-white' : 'border-gray-300 bg-white'
                    }`}>
                    <IconX className={`w-6 h-6 ${(allAnswered && !isCurrentlyEligible) ? 'text-[#dc2626]' : 'text-gray-400'}`} stroke={3} />
                  </div>
                  <div>
                    <div className={`font-bold text-[15px] leading-tight ${(allAnswered && !isCurrentlyEligible) ? 'text-[#dc2626]' : 'text-gray-500'}`}>Not eligible</div>
                    <div className={`text-sm mt-0.5 ${(allAnswered && !isCurrentlyEligible) ? 'text-[#dc2626]' : 'text-gray-400'}`}>Thank-you exit page</div>
                  </div>
                </div>
              </div>

              {(allAnswered && !isCurrentlyEligible) && (
                <>
                  <hr className="border-t border-dashed border-gray-300 my-8" />

                  <h2 className="text-[#04284b] text-lg font-bold mb-4">Not eligible preview</h2>

                  {/* Not eligible preview box */}
                  <div className="bg-[#fef2f2] rounded-xl border border-[#fecaca] p-5 flex items-start mb-6">
                    <div className="shrink-0 mr-4 relative mt-1">
                      <IconUserX className="w-10 h-10 text-[#04284b]" stroke={1.5} />
                    </div>
                    <p className="text-[#04284b] text-[13.5px] font-medium leading-relaxed">
                      Thank you for your interest.<br />
                      Based on the information provided, you are not currently eligible to take part.
                    </p>
                  </div>
                </>
              )}

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.close();
                    setTimeout(() => {
                      window.location.href = 'about:blank';
                    }, 100);
                  }
                }}
                className={`w-full py-2.5 rounded-lg font-bold text-[#04284b] bg-white border-2 border-[#04284b] hover:bg-gray-50 transition-colors text-sm ${(allAnswered && !isCurrentlyEligible) ? '' : 'mt-8'}`}
              >
                Close page
              </button>
            </div>

            {/* Bottom Info Box */}
            <div className="bg-[#f4f6f8] rounded-xl border border-gray-200 p-5 flex items-start">
              <IconInfoCircle className="w-5 h-5 text-[#006764] shrink-0 mr-3 mt-0.5" />
              <p className="text-gray-600 text-[13px] font-medium leading-relaxed">
                If a participant is deemed ineligible, none of their information will be recorded or retained.
              </p>
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

    </div>
  );
}

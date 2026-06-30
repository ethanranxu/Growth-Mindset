'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- Icons ---
const IconClipboardList = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);
const IconInfoCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
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
const IconXCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

const backgroundQuestions = [
  {
    id: 'gender',
    label: 'What is your gender?',
    options: [
      'Select your gender',
      'Female',
      'Male',
      'Other / prefer to self-describe',
      'Prefer not to answer'
    ]
  },
  {
    id: 'ageGroup',
    label: 'What is your age group?',
    options: [
      'Select your age group',
      '18-24',
      '25-29',
      '30-34',
      '35 or above',
      'Prefer not to answer'
    ]
  },
  {
    id: 'qualification',
    label: 'What is your highest nursing-related education level?',
    options: [
      'Select your highest education level',
      'Diploma/college',
      'Bachelor',
      'Master or above',
      'Other',
      'Prefer not to answer'
    ]
  },
  {
    id: 'experience',
    label: 'How long have you worked in clinical nursing practice?',
    options: [
      'Select your years of practice',
      'Less than 1 year',
      '1 to less than 2 years',
      '2 to less than 3 years',
      '3 to less than 4 years',
      '4 to 5 years'
    ]
  },
  {
    id: 'hospitalLevel',
    label: 'What is the level of the hospital or health service where you mainly work?',
    options: [
      'Select your hospital level',
      'Tertiary hospital',
      'Secondary hospital',
      'Primary/community health service',
      'Other',
      'Not sure',
      'Prefer not to answer'
    ]
  },
  {
    id: 'workArea',
    label: 'What is your main clinical work area?',
    options: [
      'Select your main clinical work area',
      'Internal medicine-related',
      'Surgical-related',
      'Emergency/ICU/operating room',
      'Specialty nursing-related',
      'Aged care/rehabilitation/community/outpatient',
      'Other',
      'Prefer not to answer'
    ]
  }
];

const cmisQuestions = [
  "My intelligence level is fixed, and I can hardly change it.",
  "My intelligence is my basic characteristic, and I can hardly change it.",
  "I can learn new things, but I can hardly change my basic intelligence.",
  "Through effort, I can significantly change my level of intelligence.",
  "I am able to change how smart I am.",
  "No matter what my current intelligence level is, I can change it a lot."
];

const stressMindsetQuestions = [
  "The effects of this stress are negative and should be avoided.",
  "Experiencing this stress helps me learn and grow.",
  "Experiencing this stress depletes my health and vitality.",
  "Experiencing this stress enhances my performance and productivity.",
  "Experiencing this stress inhibits my learning and growth.",
  "Experiencing this stress enhances my health and vitality.",
  "Experiencing this stress decreases my performance and productivity.",
  "The effects of this stress are positive and should be utilized."
];

const copingEfficacyQuestions = [
  "Difficulties in getting along with patients",
  "Difficulties in getting along with managers",
  "Unclear work procedures",
  "Difficulties in getting along with patients' families",
  "Not being able to easily decide how to perform your work",
  "Physical fatigue",
  "Performing multiple tasks at the same time",
  "Difficulties in getting along with colleagues",
  "Difficulties in getting along with other healthcare professionals, such as doctors"
];

const IS_DEBUG = true; // Toggle debug mode here

export default function BaselinePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState(() => {
    if (IS_DEBUG) {
      const debugAnswers = {};
      
      // 1. Background questions
      backgroundQuestions.forEach(q => {
        debugAnswers[q.id] = q.options[1];
      });

      // 2. Section 2
      cmisQuestions.forEach((_, idx) => {
        debugAnswers[`section2_${idx}`] = 4;
      });

      // 3. Section 3
      stressMindsetQuestions.forEach((_, idx) => {
        debugAnswers[`section3_${idx}`] = 3;
      });

      // 4. Section 4
      copingEfficacyQuestions.forEach((_, idx) => {
        debugAnswers[`section4_${idx}`] = 3;
      });

      return debugAnswers;
    }
    return {};
  });
  const [submitting, setSubmitting] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const totalQuestions = backgroundQuestions.length + cmisQuestions.length + stressMindsetQuestions.length + copingEfficacyQuestions.length;
  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== '').length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const getUnansweredQuestions = () => {
    const unanswered = [];
    
    // Background questions
    backgroundQuestions.forEach(q => {
      if (!answers[q.id]) {
        unanswered.push({ section: 'Background', id: q.id });
      }
    });

    // Section 2
    cmisQuestions.forEach((_, idx) => {
      if (!answers[`section2_${idx}`]) {
        unanswered.push({ section: 'Section 2', id: `section2_${idx}` });
      }
    });

    // Section 3
    stressMindsetQuestions.forEach((_, idx) => {
      if (!answers[`section3_${idx}`]) {
        unanswered.push({ section: 'Section 3', id: `section3_${idx}` });
      }
    });

    // Section 4
    copingEfficacyQuestions.forEach((_, idx) => {
      if (!answers[`section4_${idx}`]) {
        unanswered.push({ section: 'Section 4', id: `section4_${idx}` });
      }
    });

    return unanswered;
  };

  // Close the validation error banner if the user completes all answers
  useEffect(() => {
    if (showErrorBanner) {
      const unanswered = getUnansweredQuestions();
      if (unanswered.length === 0) {
        setShowErrorBanner(false);
      }
    }
  }, [answers, showErrorBanner]);

  const handleAnswer = (section, index, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${section}_${index}`]: value
    }));
  };

  const handleSelect = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async () => {
    const unanswered = getUnansweredQuestions();
    if (unanswered.length > 0) {
      setShowErrorBanner(true);
      
      const firstUnanswered = unanswered[0];
      let elementId = '';
      if (firstUnanswered.section === 'Background') {
        elementId = 'section-background';
      } else if (firstUnanswered.section === 'Section 2') {
        elementId = 'section-2';
      } else if (firstUnanswered.section === 'Section 3') {
        elementId = 'section-3';
      } else if (firstUnanswered.section === 'Section 4') {
        elementId = 'section-4';
      }

      if (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setShowErrorBanner(false);
    setSubmitting(true);
    // Mock API call
    await new Promise(r => setTimeout(r, 600));
    router.push('/randomise');
  };

  const renderLikertTable = (sectionId, subtitle, questions, customHeaders = null, hasError = false) => {
    const headers = customHeaders || [
      <>Strongly<br />disagree</>,
      <>Disagree</>,
      <>Neither agree<br />nor disagree</>,
      <>Agree</>,
      <>Strongly<br />agree</>
    ];
    return (
      <div id={`section-${sectionId}`} className={`bg-white rounded-xl shadow-sm border p-8 w-full transition-all duration-300 ${
        hasError ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2 className="text-[#04284b] text-2xl font-bold font-serif">
            {sectionId}. {subtitle}
          </h2>
          {hasError && (
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center">
              <IconXCircle className="w-3.5 h-3.5 mr-1" />
              Incomplete
            </span>
          )}
        </div>

        <div className="mb-4">
          <div className="font-bold text-[#04284b] text-sm leading-relaxed">{
            sectionId === 2 ? 'Please indicate the extent to which you agree with the following statements based on your genuine opinions. There are no right or wrong answers.' :
              sectionId === 3 ? (
                <>
                  Please interpret “this stress” in the following questions as the work-related stress that you, as an early-career nurse, experience or may experience in clinical nursing practice.
                  <br />
                  Please rate the following statements according to the extent to which you agree or disagree with them. There are no right or wrong answers; please respond based on your genuine views and experiences.
                </>
              ) : 'The following are stressful situations that nurses may encounter in their work. Based on your genuine feelings, please indicate how confident you are in your ability to cope with each situation effectively and with ease when you encounter it.'
          }</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-2 font-medium text-gray-500 w-[50%]"></th>
                {headers.map((h, i) => (
                  <th key={i} className="py-4 px-2 text-center font-bold text-[#04284b] text-[11px] leading-tight" style={{ width: `${50 / headers.length}%` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => {
                const isRowUnanswered = showErrorBanner && !answers[`section${sectionId}_${idx}`];
                return (
                  <tr key={idx} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                    isRowUnanswered ? 'bg-red-50/35' : ''
                  }`}>
                    <td className={`py-5 px-2 font-medium pr-8 leading-snug transition-colors ${
                      isRowUnanswered ? 'text-red-900 font-bold' : 'text-[#04284b]'
                    }`}>{q}</td>
                    {headers.map((_, i) => {
                      const val = i + 1;
                      return (
                        <td key={val} className="py-5 px-2 text-center align-middle">
                          <input
                            type="radio"
                            name={`section${sectionId}_${idx}`}
                            className="w-5 h-5 text-[#006764] border-gray-300 focus:ring-[#006764] cursor-pointer"
                            onChange={() => handleAnswer(`section${sectionId}`, idx, val)}
                            checked={answers[`section${sectionId}_${idx}`] === val}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
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
            Baseline Questionnaire
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-[#006764] mb-4">
            Please complete the baseline questions before the online learning activity is assigned.
          </h2>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-10 relative">
          <div className="absolute top-[30px] left-[10%] right-[10%] border-t-2 border-dotted border-gray-300 z-0" />
          {[
            { num: 1, label: 'Information & Consent', active: false },
            { num: 2, label: 'Eligibility', active: false },
            { num: 3, label: 'Baseline survey', active: true },
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

        <div className="max-w-5xl w-full flex flex-col space-y-6">

          {/* Progress Banner */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-center sm:items-stretch sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-14 h-14 rounded-full bg-[#eaf4f0] text-[#006764] flex items-center justify-center shrink-0 mr-4">
                <IconClipboardList className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#04284b] font-bold text-lg leading-tight mb-1">Baseline questionnaire</h3>
                <p className="text-gray-500 text-sm">Complete each section in order.</p>
              </div>
            </div>

            <div className="flex flex-col justify-center sm:items-end w-full sm:w-[250px]">
              <div className="flex justify-between w-full mb-2">
                <span className="text-[#04284b] font-semibold text-sm">{answeredCount} of {totalQuestions} answered</span>
                <span className="text-gray-500 text-sm">{progressPercent}% complete</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#006764] rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Section 1: Background */}
          {(() => {
            const hasBackgroundError = showErrorBanner && backgroundQuestions.some(q => !answers[q.id]);
            return (
              <div id="section-background" className={`bg-white rounded-xl shadow-sm border p-8 w-full transition-all duration-300 ${
                hasBackgroundError ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
                  <h2 className="text-[#04284b] text-2xl font-bold font-serif">
                    1. Background
                  </h2>
                  {hasBackgroundError && (
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center">
                      <IconXCircle className="w-3.5 h-3.5 mr-1" />
                      Incomplete
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {backgroundQuestions.map((q) => {
                    const isFieldUnanswered = showErrorBanner && !answers[q.id];
                    return (
                      <div key={q.id}>
                        <label className="block text-[#04284b] font-bold text-[14.5px] mb-2 sm:min-h-[44px]">{q.label}</label>
                        <select
                          className={`w-full border rounded-md py-2.5 px-3 text-[#04284b] text-sm focus:outline-none focus:border-[#006764] focus:ring-1 focus:ring-[#006764] appearance-none bg-white transition-colors ${
                            isFieldUnanswered ? 'border-red-300 bg-red-50/20' : 'border-gray-300'
                          }`}
                          onChange={(e) => handleSelect(q.id, e.target.value)}
                          value={answers[q.id] || ''}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem' }}
                        >
                          {q.options.map((opt, i) => (
                            <option key={i} value={i === 0 ? '' : opt} disabled={i === 0}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Render Likert Scales */}
          {(() => {
            const hasSec2Error = showErrorBanner && cmisQuestions.some((_, idx) => !answers[`section2_${idx}`]);
            const hasSec3Error = showErrorBanner && stressMindsetQuestions.some((_, idx) => !answers[`section3_${idx}`]);
            const hasSec4Error = showErrorBanner && copingEfficacyQuestions.some((_, idx) => !answers[`section4_${idx}`]);
            return (
              <>
                {renderLikertTable(2, 'Chinese Mindsets of Intelligence Scale', cmisQuestions, [
                  <>Strongly<br />disagree</>,
                  <>Disagree</>,
                  <>Slightly<br />disagree</>,
                  <>Slightly<br />agree</>,
                  <>Agree</>,
                  <>Strongly<br />agree</>
                ], hasSec2Error)}
                {renderLikertTable(3, 'Chinese Stress Mindset Measure', stressMindsetQuestions, null, hasSec3Error)}
                {renderLikertTable(4, 'Chinese Occupational Coping Self-Efficacy Scale for Nurses', copingEfficacyQuestions, [
                  <>Cannot cope<br />easily</>,
                  <>Hardly cope<br />easily</>,
                  <>Neutral</>,
                  <>Cope<br />easily</>,
                  <>Cope completely<br />easily</>
                ], hasSec4Error)}
              </>
            );
          })()}

          {/* Notice Box */}
          <div className="bg-[#f0f5f4] rounded-xl p-5 flex items-start mb-2 border border-[#d6e8e2]">
            <IconInfoCircle className="w-6 h-6 text-[#006764] shrink-0 mr-4 mt-0.5" />
            <p className="text-[#04284b] text-sm font-medium leading-relaxed">
              Your responses are linked by a study ID rather than by name. Please do not enter direct identifiers.
            </p>
          </div>

          {/* Validation Error Banner */}
          {showErrorBanner && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 flex items-start text-red-800 animate-fadeIn">
              <IconXCircle className="w-6 h-6 text-red-600 shrink-0 mr-4 mt-0.5" />
              <div>
                <h4 className="font-bold text-[15px] mb-1 font-serif">Incomplete Questionnaire</h4>
                <p className="text-sm leading-relaxed">
                  Please answer all questions before submitting. You have left <span className="font-bold font-mono">{getUnansweredQuestions().length}</span> question(s) unanswered.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
            <button
              onClick={() => router.push('/eligibility')}
              className="flex items-center justify-center py-3.5 px-8 rounded-lg font-bold text-[#04284b] bg-white border-2 border-[#04284b] hover:bg-gray-50 transition-colors text-base min-w-[200px]"
            >
              <IconChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center justify-center py-3.5 px-8 rounded-lg font-bold text-white bg-[#04284b] hover:bg-[#0a355c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base min-w-[280px]"
            >
              {submitting ? 'Submitting...' : 'Submit baseline questionnaire'}
              <IconChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Bottom Info */}
          <div className="flex justify-center items-center text-gray-500 pt-6">
            <IconInfoCircle className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium">Baseline responses, timestamp, and completion status are recorded.</span>
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

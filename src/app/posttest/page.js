'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FlowGuard from '@/components/FlowGuard';
import { getParticipantId, setFlowState } from '@/lib/session';

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

const backgroundQuestions = [
  { id: 'gender', label: 'Gender', options: ['Select your gender', 'Female', 'Male', 'Other / Prefer not to say'] },
  { id: 'experience', label: 'Years of clinical nursing experience', options: ['Select your years of clinical experience', 'Less than 1 year', '1 to less than 2 years', '2 to less than 3 years', '3 to less than 4 years', '4 to 5 years'] },
  { id: 'hospitalGrade', label: 'Grade of your current healthcare institution', options: ['Select your healthcare institution grade', 'Tertiary hospital (Grade 3)', 'Secondary hospital (Grade 2)', 'Primary hospital (Grade 1)', 'Other', 'Unsure'] },
  { id: 'qualification', label: 'Highest educational qualification', options: ['Select your highest education', 'Secondary vocational school / Technical school', 'Junior college diploma', 'Bachelor\'s degree', 'Master\'s degree or above'] }
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

export default function PostTestPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  const totalQuestions = backgroundQuestions.length + cmisQuestions.length + stressMindsetQuestions.length + copingEfficacyQuestions.length;
  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== '').length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

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
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/posttest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: getParticipantId(),
          responses: answers,
          started_at: startedAt,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      setFlowState('posttest');
      router.push('/debrief');
    } catch (err) {
      console.error('Posttest error:', err);
      // Fallback for mock/local development:
      setFlowState('posttest');
      router.push('/debrief');
    }
  };

  const renderLikertTable = (sectionId, subtitle, questions, customHeaders = null) => {
    const headers = customHeaders || [
      <>Strongly<br />disagree</>,
      <>Disagree</>,
      <>Neither agree<br />nor disagree</>,
      <>Agree</>,
      <>Strongly<br />agree</>
    ];
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
        <div className="flex items-center mb-6">
          <h2 className="text-[#04284b] text-2xl font-bold font-serif">
            {sectionId}. {subtitle}
          </h2>
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
              {questions.map((q, idx) => (
                <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-2 text-[#04284b] font-medium pr-8 leading-snug">{q}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <FlowGuard requiredState="posttest">
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
              Post-Study Questionnaire
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-[#006764] mb-4">
              Please complete the post-study questions to evaluate your learning and experience.
            </h2>
          </div>

          {/* Stepper */}
          <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-10 relative">
            <div className="absolute top-[30px] left-[10%] right-[10%] border-t-2 border-dotted border-gray-300 z-0" />
            {[
              { num: 1, label: 'Information & Consent', active: false },
              { num: 2, label: 'Eligibility', active: false },
              { num: 3, label: 'Baseline survey', active: false },
              { num: 4, label: 'Online activity', active: false },
              { num: 5, label: 'Post-study survey', active: true }
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
                  <h3 className="text-[#04284b] font-bold text-lg leading-tight mb-1">Post-study questionnaire</h3>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full">
              <div className="flex items-center mb-8">
                <h2 className="text-[#04284b] text-2xl font-bold font-serif">
                  1. Background
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {backgroundQuestions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-[#04284b] font-bold text-[14.5px] mb-2">{q.label}</label>
                    <select
                      className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-[#04284b] text-sm focus:outline-none focus:border-[#006764] focus:ring-1 focus:ring-[#006764] appearance-none bg-white"
                      onChange={(e) => handleSelect(q.id, e.target.value)}
                      value={answers[q.id] || ''}
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem' }}
                    >
                      {q.options.map((opt, i) => (
                        <option key={i} value={i === 0 ? '' : opt} disabled={i === 0}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Render Likert Scales */}
            {renderLikertTable(2, 'Chinese Mindsets of Intelligence Scale', cmisQuestions, [
              <>Strongly<br />disagree</>,
              <>Disagree</>,
              <>Slightly<br />disagree</>,
              <>Slightly<br />agree</>,
              <>Agree</>,
              <>Strongly<br />agree</>
            ])}
            {renderLikertTable(3, 'Chinese Stress Mindset Measure', stressMindsetQuestions)}
            {renderLikertTable(4, 'Chinese Occupational Coping Self-Efficacy Scale for Nurses', copingEfficacyQuestions, [
              <>Cannot cope<br />easily</>,
              <>Hardly cope<br />easily</>,
              <>Neutral</>,
              <>Cope<br />easily</>,
              <>Cope completely<br />easily</>
            ])}

            {/* Notice Box */}
            <div className="bg-[#f0f5f4] rounded-xl p-5 flex items-start mb-2 border border-[#d6e8e2]">
              <IconInfoCircle className="w-6 h-6 text-[#006764] shrink-0 mr-4 mt-0.5" />
              <p className="text-[#04284b] text-sm font-medium leading-relaxed">
                Your responses are linked by a study ID rather than by name. Please do not enter direct identifiers.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
              <button
                onClick={() => router.push('/module')}
                className="flex items-center justify-center py-3.5 px-8 rounded-lg font-bold text-[#04284b] bg-white border-2 border-[#04284b] hover:bg-gray-50 transition-colors text-base min-w-[200px]"
              >
                <IconChevronLeft className="w-5 h-5 mr-2" />
                Back to Online Activity
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center justify-center py-3.5 px-8 rounded-lg font-bold text-white bg-[#04284b] hover:bg-[#0a355c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base min-w-[280px]"
              >
                {submitting ? 'Submitting...' : 'Submit post-study questionnaire'}
                <IconChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Bottom Info */}
            <div className="flex justify-center items-center text-gray-500 pt-6">
              <IconInfoCircle className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium">Post-study responses, timestamp, and completion status are recorded.</span>
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
    </FlowGuard>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { playClick } from '@/utils/audioEffects';

const sections = [
  {
    title: 'Study Purpose',
    content: 'This study examines whether a brief online educational activity can influence nurses\' beliefs about learning and development, their understanding of work- related stress, and their confidence in coping with occupational challenges.',
  },
  {
    title: 'What Participation Involves',
    content: 'The full online pathway is expected to take approximately 40 - 50 minutes, which you can complete on your smartphone or computer at any convenient time and location.',
  },
  {
    title: 'Voluntary Participation',
    content: 'Participation in this study is strictly voluntary. You may choose not to participate or to withdraw at any time without giving a reason, and without any penalty or impact on your professional standing.',
  },
  {
    title: 'Confidentiality & Data Protection',
    content: 'This study does not collect direct personal identification such as your name or employee ID. Your responses are identified solely by a randomly assigned Participant ID. All data are stored securely on encrypted servers and used strictly for academic research. Findings will be reported in aggregated formats only.',
  },
  {
    title: 'Potential Risks & Support Resources',
    content: 'The questionnaires and learning content are designed to be safe and non-invasive. However, if reflecting on work experiences causes any discomfort, you may pause or withdraw at any time. Free and confidential support is available through your institution employee assistance program or local counseling services.',
  },
  {
    title: 'Withdrawal & Data Deletion',
    content: 'If you decide to withdraw before completion, previously submitted data may be retained for aggregate analysis. However, you may contact the research team to request complete data deletion by providing your unique Participant ID.',
  },
];

export default function InformationPage() {
  const router = useRouter();

  const handleProceed = () => {
    playClick();
    router.push('/consent');
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
            Participant Information Sheet
          </h1>
          <p className="text-lg font-medium text-[#006764]">
            Please read the following information carefully before agreeing to participate.
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
                  className={`w-[54px] h-[54px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center font-bold text-xl md:text-2xl mb-2 shadow-sm ${isCurrent
                    ? 'bg-[#006764] text-white border-2 border-white ring-4 ring-[#eaf4f0]'
                    : 'bg-[#f4f6f8] text-[#04284b] border border-gray-200'
                    }`}
                >
                  {step.num}
                </div>
                <span
                  className={`text-xs md:text-sm font-semibold text-center ${isCurrent ? 'text-[#006764]' : 'text-[#04284b]'
                    }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Cards */}
        <div className="max-w-4xl w-full flex flex-col space-y-6">

          {/* Full PIS Banner Prompt */}
          <div className="bg-gradient-to-r from-[#f0f7f6] via-[#eaf4f0] to-[#f0f7f6] p-6 rounded-2xl border-2 border-[#99d6d3] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-[#006764] font-bold text-base md:text-lg mb-1">
                📄 Full Participant Information Sheet
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Please read the Participant Information Sheet carefully before deciding whether to take part.
              </p>
            </div>
            <Link
              href="/information/full"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#006764] text-[#006764] hover:text-white font-bold text-xs md:text-sm transition-all border border-[#99d6d3] shadow-xs shrink-0 text-center"
            >
              Read Full PIS →
            </Link>
          </div>

          {sections.map((section, i) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs transition-all hover:shadow-md"
            >
              <h2 className="text-[#04284b] text-xl font-bold font-serif mb-3">
                {i + 1}. {section.title}
              </h2>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          {/* Research Contact Card */}
          <div className="bg-gradient-to-br from-[#f0f7f6] to-[#e0f2f1] rounded-2xl p-7 border-2 border-[#99d6d3] shadow-sm">
            <h2 className="text-[#006764] text-xl font-bold font-serif mb-3">
              Research Team &amp; Inquiries
            </h2>
            <p className="text-[#04284b] text-sm md:text-base leading-relaxed mb-3">
              If you have any questions regarding this study or your rights as a participant, please contact the research team:
            </p>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#99d6d3] text-sm text-[#04284b] space-y-1.5">
              <p><strong>Principal Researcher:</strong> Doctoral Candidate, School of Nursing (<a href="mailto:ajhz590@aucklanduni.ac.nz" className="text-[#006764] font-bold hover:underline">ajhz590@aucklanduni.ac.nz</a>)</p>
              <p><strong>Research Supervisor:</strong> School of Nursing, University of Auckland</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/information/full"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-base transition-all shadow-xs text-center"
            >
              📄 Read Full Information Sheet
            </Link>
            <button
              onClick={handleProceed}
              id="btn-to-consent"
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#006764] hover:bg-[#005250] text-white font-bold text-base transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Continue to Informed Consent →
            </button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

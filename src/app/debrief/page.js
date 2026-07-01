'use client';

import { useRouter } from 'next/navigation';
import FlowGuard from '@/components/FlowGuard';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { getParticipantId, setFlowState } from '@/lib/session';
import { playClick } from '@/utils/audioEffects';

// --- SVG Icons ---
const IconCheckCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconInfo = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
  </svg>
);

const IconHeartHand = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const IconMail = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconShieldCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function DebriefPage() {
  const router = useRouter();
  const participantId = getParticipantId();
  const allocation = typeof window !== 'undefined' ? localStorage.getItem(`gm_allocation_${participantId}`) : null;
  const isIntervention = allocation !== 'control';

  const handleContact = () => {
    playClick();
    setFlowState('debrief');
    router.push('/contact');
  };

  const handleFinish = () => {
    playClick();
    setFlowState('completed');
    router.push('/thankyou');
  };

  return (
    <FlowGuard requiredState="debrief">
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
              Study Debriefing &amp; Completion
            </h1>
            <p className="text-lg font-medium text-[#006764]">
              Thank you for completing all activities in this research study.
            </p>
          </div>

          {/* Stepper (Step 5 Active / Complete) */}
          <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-10 relative select-none">
            <div className="absolute top-[30px] left-[10%] right-[10%] border-t-2 border-slate-300 z-0" />
            {[
              { num: 1, label: 'Information & Consent' },
              { num: 2, label: 'Eligibility' },
              { num: 3, label: 'Baseline survey' },
              { num: 4, label: 'Online activity' },
              { num: 5, label: 'Post-study survey' },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center w-1/5 relative z-10">
                <div className="w-[54px] h-[54px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center font-bold text-xl md:text-2xl mb-2 shadow-sm bg-[#006764] text-white border-2 border-white ring-4 ring-[#eaf4f0]">
                  ✓
                </div>
                <span className="text-xs md:text-sm font-semibold text-center text-[#006764]">
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Main Container Cards */}
          <div className="max-w-4xl w-full flex flex-col space-y-6">
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#eaf4f0] text-[#006764] flex items-center justify-center shrink-0">
                  <IconInfo className="w-5 h-5" />
                </div>
                <h3 className="text-[#04284b] text-xl font-bold font-serif">
                  1. Study Purpose &amp; Debriefing Information
                </h3>
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-3">
                This academic research project investigates the influence of structured online learning modules on psychological mindsets, professional development, and clinical practice experiences among early-career nurses.
              </p>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                During this study, participants were randomly allocated to receive either a growth mindset intervention module or a general neuroscience educational control module. This randomization ensures rigorous scientific evaluation. All collected data will be analyzed anonymously to inform future nursing education programs and support strategies.
              </p>
            </div>

            {/* Card 2: Support Resources */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <IconHeartHand className="w-5 h-5" />
                </div>
                <h3 className="text-[#04284b] text-xl font-bold font-serif">
                  2. Support Resources &amp; Well-being
                </h3>
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-4">
                Participation in this learning activity is designed to be educational and safe. However, if reflecting on clinical experiences or work-related scenarios has raised any personal distress or emotional concerns, we encourage you to access professional support resources:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-[#006764] font-bold">•</span>
                  <span><strong>Psychological Support:</strong> You may contact local psychological support services or call 12356 for psychological support where available.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#006764] font-bold">•</span>
                  <span><strong>Research Team Assistance:</strong> You may also reach out to the research team if you require guidance on connecting with appropriate support channels.</span>
                </div>
              </div>
            </div>

            {/* Card 3: Research Contact & Data Withdrawal */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <IconShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-[#04284b] text-xl font-bold font-serif">
                  3. Research Team &amp; Data Withdrawal Rights
                </h3>
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-4">
                If you have any questions regarding your rights as a participant, or if you wish to withdraw your data from this study, please contact the research team within two weeks of completion.
              </p>
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-2">
                <p className="font-bold text-[#04284b] mb-1">Contact Details:</p>
                <p><strong>Student Researcher:</strong> Doctoral Candidate, School of Nursing (<a href="mailto:ajhz590@aucklanduni.ac.nz" className="text-[#006764] hover:underline font-semibold">ajhz590@aucklanduni.ac.nz</a>)</p>
                <p><strong>Your Study Participant ID:</strong> <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-800 font-bold">{participantId}</span></p>
                <p className="text-xs text-slate-500 italic mt-2">
                  * Note: Because data are stored without personal identifying names, your unique Participant ID above is required if you request data withdrawal.
                </p>
              </div>
            </div>

            {isIntervention ? (
              /* Card 4: Optional Follow-up Interview Invitation */
              <div className="bg-gradient-to-br from-[#f0f7f6] to-[#e0f2f1] rounded-2xl p-7 border-2 border-[#99d6d3] shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#006764] flex items-center justify-center shrink-0 shadow-xs">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <h3 className="text-[#006764] text-xl font-bold font-serif">
                    Optional Follow-up Interview Invitation
                  </h3>
                </div>
                <p className="text-[#04284b] text-sm md:text-base leading-relaxed font-medium mb-6">
                  We are currently recruiting a small group of participants for brief, individual follow-up interviews (approx. 20-30 minutes) to share deeper insights on their learning experience. If you are interested in sharing your views, please click the button below to provide your preferred contact information.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleContact}
                    className="flex-1 px-6 py-3.5 rounded-xl bg-[#006764] hover:bg-[#005250] text-white font-bold text-sm md:text-base transition-all shadow-md hover:shadow-lg text-center cursor-pointer"
                  >
                    Yes, I am willing to participate in a follow-up interview
                  </button>
                  <button
                    onClick={handleFinish}
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-sm transition-all text-center cursor-pointer"
                  >
                    Complete Study without leaving contact info
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleFinish}
                  className="w-full sm:w-auto px-12 py-4 rounded-xl bg-[#006764] hover:bg-[#005250] text-white font-bold text-base md:text-lg transition-all shadow-md hover:shadow-lg text-center cursor-pointer"
                >
                  Complete Study &amp; Submit →
                </button>
              </div>
            )}
          </div>
        </main>

        <AppFooter />
      </div>
    </FlowGuard>
  );
}

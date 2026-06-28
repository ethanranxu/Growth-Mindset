'use client';

import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

// --- SVG Icons ---
const IconAcademic = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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

const IconShieldCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function ResearchTeamPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      <main className="flex-grow flex flex-col items-center pt-10 pb-20 px-4 md:px-8">
        {/* Hero Banner */}
        <div className="text-center mb-12 max-w-3xl">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Growth Mindset Logo" className="w-28 h-28 object-contain" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#04284b] mb-3 tracking-wide">
            Research Team &amp; Faculty
          </h1>
          <p className="text-lg font-medium text-[#006764]">
            Meet the doctoral researchers and academic supervisors leading this study at the University of Auckland.
          </p>
        </div>

        <div className="max-w-4xl w-full flex flex-col space-y-8">
          {/* Principal Researcher Card */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#eaf4f0] text-[#006764] flex items-center justify-center shrink-0 shadow-xs border border-[#d5ebe1]">
                <IconUser className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-[#f0f7f6] text-[#006764] text-xs font-bold uppercase tracking-wider mb-2">
                  Principal Investigator
                </div>
                <h2 className="text-[#04284b] text-2xl font-bold font-serif mb-1">
                  Doctoral Research Fellow
                </h2>
                <p className="text-slate-500 text-sm mb-4 font-medium">
                  School of Nursing, Faculty of Medical and Health Sciences, University of Auckland
                </p>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-4">
                  This study forms part of a doctoral research project exploring educational science, psychological mindsets, and professional adaptation strategies among early-career nurses in clinical settings.
                </p>
                <div className="flex items-center gap-2 text-sm text-[#006764] font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200 inline-flex">
                  <IconMail className="w-4 h-4" />
                  <span>Contact: <a href="mailto:ajhz590@aucklanduni.ac.nz" className="hover:underline">ajhz590@aucklanduni.ac.nz</a></span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Supervisory Team Card */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <IconAcademic className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[#04284b] text-xl font-bold font-serif">
                  Academic Supervisory Committee
                </h2>
                <p className="text-slate-500 text-xs">University of Auckland Academic Governance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-[#04284b] text-base mb-1">Senior Academic Supervisors</h3>
                <p className="text-xs text-[#006764] font-semibold mb-3">School of Nursing Faculty</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Providing academic oversight, methodological rigor, and ensuring clinical research ethical compliance throughout the design and execution of the digital learning intervention.
                </p>
              </div>
              <div className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-[#04284b] text-base mb-1">Methodological Advisory</h3>
                <p className="text-xs text-[#006764] font-semibold mb-3">Educational Psychology Specialists</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Guiding quantitative survey design, randomized control protocols, and psychological measurement validity to assess mindset interventions effectively.
                </p>
              </div>
            </div>
          </div>

          {/* Institutional Integrity Card */}
          <div className="bg-gradient-to-br from-[#f0f7f6] to-[#e0f2f1] rounded-2xl p-8 border-2 border-[#99d6d3] shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#006764] flex items-center justify-center shrink-0 shadow-xs">
                <IconShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-[#006764] text-xl font-bold font-serif">
                Institutional Ethics &amp; Integrity
              </h2>
            </div>
            <p className="text-[#04284b] text-sm md:text-base leading-relaxed mb-4">
              This academic research adheres strictly to the ethical guidelines established by the University of Auckland. Participation is voluntary, confidential, and dedicated solely to advancing educational science and healthcare workforce support.
            </p>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

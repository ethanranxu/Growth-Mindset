'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

/* ====== Reusable SVG Icons ====== */
const IconCheck = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" />
  </svg>
);

const IconInfo = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconUser = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

const IconDatabase = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

const IconLock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

const IconUsers = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

const IconMail = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconHeart = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconDocInfo = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconClipboardCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const IconUserCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    <circle cx="12" cy="11.5" r="2.2" strokeWidth="1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.5 17c0-1.2 1.5-2 3.5-2s3.5.8 3.5 2" />
  </svg>
);

const IconLaptopLeaf = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="1.5" strokeLinecap="round" />
    <polygon points="10 7 15 10 10 13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconClipboardList = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    <path d="M9 11.5l1.5 1.5 2.5-2.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="15" y1="11.5" x2="17" y2="11.5" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 16.5l1.5 1.5 2.5-2.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="15" y1="16.5" x2="17" y2="16.5" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ====== Process Step Data ====== */
const flowSteps = [
  { num: 1, label: 'Information & Consent', Icon: IconDocInfo, bg: 'bg-[#f0f7f6]', color: 'text-[#04284b]' },
  { num: 2, label: 'Eligibility', Icon: IconClipboardCheck, bg: 'bg-[#f0f7f6]', color: 'text-[#04284b]' },
  { num: 3, label: 'Baseline survey', Icon: IconUserCheck, bg: 'bg-[#eaf4f0]', color: 'text-[#006764]' },
  { num: 4, label: 'Online activity', Icon: IconLaptopLeaf, bg: 'bg-[#f0f7f6]', color: 'text-[#04284b]' },
  { num: 5, label: 'Post-study survey', Icon: IconClipboardList, bg: 'bg-[#f0f7f6]', color: 'text-[#04284b]' },
];

/* ====== Privacy Items ====== */
const privacyItems = [
  { Icon: IconUser, title: 'Responses are linked by a study ID rather than by name.', desc: 'The main research data do not include direct identifiers such as your name, email, phone number, or WeChat ID.' },
  { Icon: IconDatabase, title: 'Contact details, if provided, are stored separately from questionnaire responses.', desc: 'They will only be used for follow-up interviews if you agree to be contacted.' },
  { Icon: IconLock, title: 'The website uses HTTPS encryption and secure servers.', desc: 'Only the research team has access to the research data for monitoring and analysis.' },
  { Icon: IconUsers, title: 'The study is conducted in accordance with University ethics and data protection requirements.', desc: 'You can withdraw at any time without penalty.' },
];

/* ====== "Before you decide" Items ====== */
const decideItems = [
  { title: 'Participation is voluntary.', desc: 'Taking part is your choice.' },
  { title: 'You may stop at any time.', desc: 'You can withdraw at any point without giving a reason.' },
  { title: 'Your responses are confidential.', desc: 'Data are stored securely and used for research only.' },
  { title: 'Some questions may ask about study experiences.', desc: 'Support information is provided at the end.' },
  { title: 'Please read the participant information sheet before deciding whether to take part.', desc: 'It describes the study in detail, including risks, benefits, and contacts.' },
];

export default function LandingPage() {
  const router = useRouter();

  const goToInfo = () => router.push('/consent');

  return (
    <>
      {/* ===== HEADER ===== */}
      <header className="bg-bg-main py-4 px-8 border-b border-gray-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-300 overflow-hidden shadow-xs">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            </div>
            <span className="font-medium text-gray-800 tracking-wide">Academic Research Project</span>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8 text-sm font-medium text-gray-700">
              <li><a className="hover:text-teal-custom transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-custom after:scale-x-0 hover:after:scale-x-100 after:transition-transform duration-300" href="#">Home</a></li>
              <li><a className="hover:text-teal-custom transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-custom after:scale-x-0 hover:after:scale-x-100 after:transition-transform duration-300" href="#">Research Team</a></li>
              <li><a className="hover:text-teal-custom transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-custom after:scale-x-0 hover:after:scale-x-100 after:transition-transform duration-300" href="#">Contact</a></li>
              <li><a className="hover:text-teal-custom transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-custom after:scale-x-0 hover:after:scale-x-100 after:transition-transform duration-300" href="#">FAQs</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* ===== HERO & PROCESS STEPS ===== */}
        <section className="relative bg-white overflow-hidden pt-8 pb-20 px-4 md:px-8">
          {/* Background Wavy Lines */}
          <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center opacity-40">
            <svg width="1440" height="600" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-w-full">
              <path d="M-100,100 C300,300 800,-100 1540,200" stroke="#E0F2F1" strokeWidth="1" fill="none" />
              <path d="M-100,150 C400,350 900,-50 1540,250" stroke="#E0F2F1" strokeWidth="2" fill="none" />
              <path d="M-100,200 C500,400 1000,0 1540,300" stroke="#E0F2F1" strokeWidth="1.5" fill="none" />
              <path d="M-100,250 C600,450 1100,50 1540,350" stroke="#E0F2F1" strokeWidth="0.5" fill="none" />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* Logo */}
            <div className="flex justify-center mb-4 transition-transform duration-500 hover:scale-105">
              <Image src="/logo.png" alt="Growth Mindset Logo" width={120} height={120} className="w-30 h-30 object-contain" />
            </div>

            {/* Titles */}
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#04284b] mb-4 md:whitespace-nowrap tracking-wide animate-fadeIn">
              Growth Mindset Online Study
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-[#006764] mb-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              A University of Auckland research study
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700 text-lg md:text-xl mb-8 leading-relaxed animate-fadeIn" style={{ animationDelay: '200ms' }}>
              Explore your mindset, discover your potential, and contribute to psychological research in this brief, confidential online study.
            </p>

            {/* Button */}
            <button
              onClick={goToInfo}
              className="inline-flex justify-center items-center px-8 py-3 bg-[#04284b] text-white font-medium rounded-md hover:bg-[#0b355c] hover:scale-[1.03] transition-all duration-300 mb-8 shadow-md hover:shadow-lg text-base cursor-pointer"
            >
              View Participant Information
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center mb-10">
              <div className="h-px bg-gray-300 flex-grow max-w-[200px]" />
              <span className="px-6 text-lg font-medium text-[#006764]">What participation involves</span>
              <div className="h-px bg-gray-300 flex-grow max-w-[200px]" />
            </div>

            {/* Steps Flow */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative mb-16 px-4 md:px-0 gap-6 md:gap-0">
              {/* Dotted line behind steps (desktop only) */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] border-t-2 border-dotted border-gray-300 z-0" />

              {flowSteps.map((step) => {
                const StepIcon = step.Icon;
                return (
                  <div key={step.num} className="flex flex-col items-center relative z-10 px-2 w-full md:w-1/5 group transition-transform duration-300 hover:-translate-y-1">
                    <div className={`w-24 h-24 rounded-full border-4 border-white ${step.bg} flex items-center justify-center mb-3 relative z-20 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md`}>
                      <StepIcon className={`w-14 h-14 ${step.color} transition-transform duration-300 group-hover:rotate-3`} />
                    </div>
                    <span className="text-sm font-semibold text-[#04284b] text-center leading-tight transition-colors duration-300 group-hover:text-teal-custom">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Info Boxes */}
            <div className="w-full md:w-[calc(80%+6rem)] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <div className="flex items-center bg-[#eef6f3] rounded-lg p-5 border border-[#d5ebe1] transition-transform duration-300 hover:scale-[1.02] shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#006764] flex items-center justify-center text-white flex-shrink-0 mr-4 shadow-sm">
                  <IconLock className="w-6 h-6" />
                </div>
                <span className="text-sm text-[#006764] font-medium leading-relaxed">
                  Ethics, privacy, and support information are provided before participation.
                </span>
              </div>
              <div className="flex items-center bg-[#f4f6f8] rounded-lg p-5 border border-[#e5e7eb] transition-transform duration-300 hover:scale-[1.02] shadow-xs">
                <div className="w-12 h-12 rounded-full border-2 border-[#04284b] flex items-center justify-center text-[#04284b] flex-shrink-0 mr-4 shadow-sm">
                  <IconInfo className="w-6 h-6" />
                </div>
                <span className="text-sm text-[#04284b] font-medium">
                  No research data are collected on this page.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRIVACY & BEFORE YOU DECIDE ===== */}
        <section className="bg-bg-main py-16 px-8 border-t border-gray-200">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative">
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[2px] bg-gray-200 -translate-x-1/2" />

            {/* Privacy & Security */}
            <div className="pr-0 md:pr-8">
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-8 tracking-wide">Privacy &amp; security</h2>
              <div className="space-y-6">
                {privacyItems.map((item, i) => (
                  <div key={i} className="flex items-start p-3 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-xs">
                    <item.Icon className="w-6 h-6 text-teal-custom mt-1 mr-4 flex-shrink-0 transition-transform duration-300 hover:scale-110" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Before you decide */}
            <div className="pl-0 md:pl-8">
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-8 tracking-wide">Before you decide</h2>
              <ul className="space-y-6">
                {decideItems.map((item, i) => (
                  <li key={i} className="flex items-start p-3 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-xs">
                    <IconCheck className="w-5 h-5 text-teal-custom mt-0.5 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== SUPPORT ===== */}
        <section className="bg-white py-12 px-8 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gray-300 w-16 mr-4" />
              <h2 className="text-2xl font-bold text-gray-900 font-serif tracking-wide">Support</h2>
              <div className="h-px bg-gray-300 w-16 ml-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch bg-teal-bg rounded-lg p-6 shadow-xs border border-teal-border mb-6">
              {/* Researcher */}
              <div className="flex justify-center items-center space-x-4 p-4 mb-4 md:mb-0 md:border-r md:border-teal-border/40 transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-12 h-12 bg-teal-custom rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <IconMail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">Researcher contact</div>
                  <a className="text-sm text-teal-custom hover:text-teal-dark font-medium transition-colors" href="mailto:ajhz590@aucklanduni.ac.nz">ajhz590@aucklanduni.ac.nz</a>
                </div>
              </div>
              {/* Supervisor */}
              <div className="flex justify-center items-center space-x-4 p-4 mb-4 md:mb-0 md:border-r md:border-teal-border/40 transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-12 h-12 bg-teal-custom rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <IconUser className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">Supervisor contact</div>
                  <a className="text-sm text-teal-custom hover:text-teal-dark font-medium transition-colors" href="mailto:s.jacobs@auckland.ac.nz">s.jacobs@auckland.ac.nz</a>
                </div>
              </div>
              {/* Support resources */}
              <div className="flex justify-center items-center space-x-4 p-4 transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-12 h-12 bg-teal-custom rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <IconHeart className="w-6 h-6" />
                </div>
                <div className="max-w-[220px]">
                  <div className="font-bold text-sm text-gray-900 leading-tight mb-1">Support resources are provided before and after participation.</div>
                  <div className="text-xs text-gray-600 leading-tight">Information about support services is provided in the study materials.</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 py-3 px-6 rounded border border-gray-200 max-w-3xl mx-auto shadow-xs">
              <IconInfo className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" />
              If you experience discomfort, you can withdraw at any time and access support resources.
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-footer-bg py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300 leading-relaxed">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-white overflow-hidden shadow-xs">
                  <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
                </div>
                <span className="font-medium text-white leading-tight tracking-wide">Academic Research Project</span>
              </div>
              <p className="mb-2">
                For enquiries regarding this research: <a href="mailto:ajhz590@aucklanduni.ac.nz" className="text-white hover:underline transition-colors">ajhz590@aucklanduni.ac.nz</a>
              </p>
              <p className="mb-4 text-gray-400">
                This website does not provide medical advice or clinical diagnosis.
              </p>
              <p className="text-gray-500">
                © 2026 University of Auckland PhD Research Project. All rights reserved.
              </p>
            </div>
            <div className="pt-2 md:pl-8">
              <p className="mb-4 text-gray-300">
                Developed for a doctoral research project at the School of Nursing,<br />
                Faculty of Medical and Health Sciences,<br />
                University of Auckland, New Zealand.
              </p>
              <p className="text-gray-400">
                This platform supports academic research and participant engagement activities.<br />
                All information collected through this website is handled confidentially<br />
                and used solely for approved research purposes.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

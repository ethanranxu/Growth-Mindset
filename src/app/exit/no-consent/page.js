'use client';

import { useRouter } from 'next/navigation';

// --- Icons ---
const IconHeart = ({ className, stroke = 1.5 }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={stroke}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default function NoConsentPage() {
  const router = useRouter();

  const handleExit = () => {
    if (typeof window !== 'undefined') {
      window.close();
      setTimeout(() => {
        router.push('/');
      }, 150);
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
      <main className="flex-grow flex flex-col items-center justify-center py-16 px-4 md:px-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center animate-fadeIn">
          {/* Card Icon */}
          <div className="mx-auto w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-8 border border-teal-100 shadow-xs">
            <IconHeart className="w-10 h-10 text-teal-600" stroke={1.5} />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#04284b] mb-6 tracking-wide">
            Thank You for Your Time
          </h1>

          {/* Subtitle / Description */}
          <p className="text-gray-600 text-base md:text-[17px] font-medium leading-relaxed mb-8 max-w-lg mx-auto">
            Thank you for taking the time to learn about our study. We fully understand and respect your decision not to participate at this time.
          </p>

          {/* Support Information Box */}
          <div className="bg-[#fcfdfd] rounded-xl border border-teal-100/50 p-6 text-left mb-8 max-w-md mx-auto shadow-2xs">
            <h3 className="text-[#04284b] font-bold text-sm mb-3 flex items-center tracking-wide uppercase">
              <IconHeart className="w-4.5 h-4.5 text-teal-600 mr-2" stroke={2} />
              Support Resources
            </h3>
            <div className="text-gray-600 text-sm leading-relaxed space-y-2">
              <div>
                <span className="font-semibold text-gray-700">Researcher Email:</span>{' '}
                <a href="mailto:ajhz590@aucklanduni.ac.nz" className="text-[#006764] hover:underline font-medium">
                  ajhz590@aucklanduni.ac.nz
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <button
              onClick={handleExit}
              className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-lg font-bold text-white bg-[#04284b] hover:bg-[#0a355c] transition-all hover:shadow-md cursor-pointer text-base"
            >
              Exit Study
            </button>
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
                For enquiries regarding this research: <a href="mailto:ajhz590@aucklanduni.ac.nz" className="text-white hover:underline font-mono">ajhz590@aucklanduni.ac.nz</a>
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

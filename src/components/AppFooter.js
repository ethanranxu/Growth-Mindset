'use client';

import Image from 'next/image';

export default function AppFooter() {
  return (
    <footer className="bg-footer-bg py-12 px-8 mt-auto">
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
  );
}

'use client';

import Image from 'next/image';

export default function AppHeader() {
  return (
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
            <li><a className="hover:text-teal-custom transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-custom after:scale-x-0 hover:after:scale-x-100 after:transition-transform duration-300" href="/">Home</a></li>
            <li><a className="hover:text-teal-custom transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-custom after:scale-x-0 hover:after:scale-x-100 after:transition-transform duration-300" href="#">Research Team</a></li>
            <li><a className="hover:text-teal-custom transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-custom after:scale-x-0 hover:after:scale-x-100 after:transition-transform duration-300" href="#">Contact</a></li>
            <li><a className="hover:text-teal-custom transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-custom after:scale-x-0 hover:after:scale-x-100 after:transition-transform duration-300" href="#">FAQs</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

'use client';

import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { playClick } from '@/utils/audioEffects';

// --- SVG Icons ---
const IconChevronDown = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const IconQuestionMark = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
  </svg>
);

const FAQS_DATA = [
  {
    question: 'What is the purpose of this research study?',
    answer: 'This study aims to evaluate how structured online learning activities influence psychological mindsets, learning adaptation, and resilience among early-career nurses during their professional transition into clinical practice.',
  },
  {
    question: 'How is my privacy and personal data protected?',
    answer: 'Your privacy is strictly protected. We do not collect direct identifying information such as your real name, employee ID, or hospital ward name. All data are identified solely using an anonymous Participant ID and stored on encrypted servers in compliance with university research protocols.',
  },
  {
    question: 'What does the online learning activity involve?',
    answer: 'Participants complete brief baseline questionnaires followed by an interactive online learning module lasting approximately 15 minutes. The module covers either neuroscience concepts or growth mindset strategies. The entire study takes about 20-30 minutes.',
  },
  {
    question: 'Can I withdraw from the study at any time?',
    answer: 'Yes. Participation is entirely voluntary. You may stop participating or close your browser at any time without giving a reason and without any negative consequences. If you wish to delete your submitted data later, simply email the research team with your unique Participant ID.',
  },
  {
    question: 'Will my responses or performance be shared with my employer or hospital management?',
    answer: 'No. Neither your hospital management, nurse educators, nor colleagues will ever have access to your individual responses or performance data. All findings are reported in aggregated scientific summaries only.',
  },
  {
    question: 'Who has reviewed and approved this research project?',
    answer: 'This research project has been formally reviewed and approved by the University of Auckland Human Participants Ethics Committee (UAHPEC), ensuring strict adherence to ethical standards and participant protection.',
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    playClick();
    setOpenIndex(openIndex === index ? -1 : index);
  };

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
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-lg font-medium text-[#006764]">
            Find answers to common questions about participation, privacy, and research procedures.
          </p>
        </div>

        {/* FAQs Accordion Container */}
        <div className="max-w-3xl w-full space-y-4">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                  isOpen ? 'border-[#006764] ring-2 ring-[#eaf4f0]' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left px-7 py-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${isOpen ? 'bg-[#006764] text-white' : 'bg-slate-100 text-slate-500'}`}>
                      Q{idx + 1}
                    </div>
                    <span className="text-[#04284b] font-bold text-base md:text-lg font-serif">
                      {faq.question}
                    </span>
                  </div>
                  <IconChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#006764]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-7 pb-6 pt-1 text-slate-700 text-sm md:text-base leading-relaxed border-t border-slate-100 bg-[#fdfefe]">
                    <p className="pl-11 border-l-2 border-[#006764]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Prompt */}
        <div className="mt-12 text-center bg-white p-8 rounded-2xl border border-slate-200 max-w-xl w-full shadow-xs">
          <div className="w-12 h-12 bg-[#eaf4f0] text-[#006764] rounded-full flex items-center justify-center mx-auto mb-3">
            <IconQuestionMark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#04284b] text-lg mb-1">Still have questions?</h3>
          <p className="text-slate-600 text-xs md:text-sm mb-4">
            If you could not find the answer you were looking for, feel free to contact our research team directly.
          </p>
          <a
            href="/contact-us"
            className="inline-block px-6 py-3 rounded-xl bg-[#006764] hover:bg-[#005250] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
          >
            Contact Research Team →
          </a>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

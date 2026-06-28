'use client';

import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { playClick } from '@/utils/audioEffects';

// --- SVG Icons ---
const IconMail = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconLocation = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconSend = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default function GeneralContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    playClick();
    setSubmitted(true);
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
            Contact Us &amp; Research Inquiries
          </h1>
          <p className="text-lg font-medium text-[#006764]">
            Have questions about this academic study or need assistance? We are here to help.
          </p>
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Direct Contact Details */}
          <div className="md:col-span-5 flex flex-col space-y-6">
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
              <div>
                <h2 className="text-[#04284b] text-xl font-bold font-serif mb-6 border-b border-slate-100 pb-3">
                  Direct Inquiries
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#eaf4f0] text-[#006764] flex items-center justify-center shrink-0">
                      <IconMail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-0.5">Research Email</span>
                      <a href="mailto:ajhz590@aucklanduni.ac.nz" className="text-sm font-bold text-[#006764] hover:underline">
                        ajhz590@aucklanduni.ac.nz
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <IconLocation className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-0.5">Faculty Address</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        School of Nursing, Grafton Campus,<br />
                        Faculty of Medical and Health Sciences,<br />
                        University of Auckland, New Zealand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-[#f8fafc] p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong>Data Withdrawal:</strong> If you are a study participant requesting data deletion, please include your unique Participant ID in your message.
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Message Form */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-[#04284b] text-xl font-bold font-serif mb-2">
                Send Us a Message
              </h2>
              <p className="text-slate-500 text-xs mb-6">
                Please fill in the form below and our research team will respond promptly.
              </p>

              {submitted ? (
                <div className="bg-[#eef6f3] p-6 rounded-xl border border-[#d5ebe1] text-center space-y-2 animate-fadeIn">
                  <span className="text-3xl">✉️</span>
                  <h3 className="font-bold text-[#006764] text-lg">Thank You for Your Message!</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Your inquiry has been sent to the research team. We will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#04284b] uppercase tracking-wider mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#006764] focus:ring-1 focus:ring-[#006764]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#04284b] uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#006764] focus:ring-1 focus:ring-[#006764]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#04284b] uppercase tracking-wider mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Inquiry subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#006764] focus:ring-1 focus:ring-[#006764]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#04284b] uppercase tracking-wider mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Type your message or research inquiry here..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#006764] focus:ring-1 focus:ring-[#006764] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#006764] hover:bg-[#005250] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <IconSend className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

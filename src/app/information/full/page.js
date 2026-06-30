'use client';

import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

// --- SVG Icons ---
const IconDocumentText = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconArrowLeft = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const IconCheckCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function FullPISPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <AppHeader />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-20 px-4 md:px-8">

        {/* Back Link & Top Bar */}
        <div className="max-w-4xl w-full mb-6 flex justify-between items-center">
          <Link
            href="/information"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#006764] hover:text-[#005250] transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" /> Back to Summary Information
          </Link>
          <span className="text-xs text-slate-500 font-mono">Document ID: PIS-FULL-2026</span>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-10 max-w-3xl">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#eaf4f0] text-[#006764] flex items-center justify-center shadow-xs border border-[#c2e2d8]">
              <IconDocumentText className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#04284b] mb-3 tracking-wide">
            Participant Information Sheet (Full Protocol)
          </h1>
          <p className="text-base md:text-lg font-medium text-[#006764]">
            Comprehensive Study Details &amp; Ethical Statement
          </p>
        </div>

        {/* Full Document Container */}
        <div className="max-w-4xl w-full bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-sm text-slate-700 text-sm md:text-base leading-relaxed space-y-8">

          {/* Intro Banner */}
          <div className="bg-[#f0f7f6] p-5 rounded-xl border-l-4 border-[#006764] text-[#04284b] font-medium text-sm md:text-base leading-relaxed">
            You are invited to take part in this research study. Please read this information carefully before deciding whether to participate. Taking part is voluntary and unpaid.
          </div>

          {/* 1. What is this study about? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              1. What is this study about?
            </h2>
            <p>
              This doctoral research study is evaluating a brief online educational activity for early-career nurses in China. The activity is related to learning, professional development, and coping with work-related challenges. The study examines whether a brief online educational activity can influence nurses' beliefs about learning and development, their understanding of work-related stress, and their confidence in coping with occupational challenges, compared with an attention-matched educational control activity.
            </p>
            <p className="font-semibold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs md:text-sm">
              Note: This is a research study, not a clinical service, counselling programme, employment programme, professional training requirement, or professional performance assessment.
            </p>
          </section>

          {/* 2. Why have I been invited? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              2. Why have I been invited?
            </h2>
            <p>You may be eligible to participate if you meet all of the following criteria:</p>
            <ul className="space-y-2 pl-2">
              {[
                "are aged 18 years or older;",
                "are a registered nurse in China;",
                "are within the first five years of clinical nursing practice;",
                "are currently engaged in clinical nursing work in China;",
                "can read Chinese and complete online study materials; and",
                "have not previously completed a structured growth mindset intervention, such as a course, training workshop, structured online module, or formal intervention explicitly focused on growth mindset or growth-oriented beliefs."
              ].map((criterion, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base">
                  <IconCheckCircle className="w-5 h-5 text-[#006764] shrink-0 mt-0.5" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Do I have to take part? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              3. Do I have to take part?
            </h2>
            <p>
              <strong>No. Participation is entirely voluntary and unpaid.</strong> Your decision will not affect your employment, professional registration, training, relationship with any hospital or employer, or relationship with the University of Auckland. Recruitment will not be conducted through hospital management, ward managers, direct supervisors, or employer-controlled channels.
            </p>
          </section>

          {/* 4. What will happen if I take part? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              4. What will happen if I take part?
            </h2>
            <div className="space-y-2 pt-1">
              {[
                "Read this Participant Information Sheet.",
                "Complete the online consent form.",
                "Answer eligibility screening questions.",
                "Complete baseline questionnaires and background questions.",
                "Receive a non-identifying participant identifier, which allows your before-activity and after-activity questionnaire responses to be matched for analysis. The website will display this participant identifier so that you may record or save it if you wish.",
                "Be randomly allocated by the website to either the Growth Mindset Intervention or an attention-matched educational control activity.",
                "Complete the allocated online activity.",
                "Complete immediate post-intervention questionnaires.",
                "View support information and researcher/supervisor contact details."
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                  <span className="font-bold text-[#006764] shrink-0 w-6 text-right">{idx + 1}.</span>
                  <span className="flex-1 text-sm md:text-base">{step}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#eaf4f0] p-4 rounded-xl text-[#006764] font-bold text-sm text-center mt-4 border border-[#c2e2d8]">
              ⏱️ The full online pathway is expected to take approximately 40-50 minutes.
            </div>
          </section>

          {/* 5. What does random allocation mean? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              5. What does random allocation mean?
            </h2>
            <p>
              After baseline questionnaires, the website will randomly allocate you to one of two groups. You cannot choose your group. One group will receive the Growth Mindset Intervention. The other group will receive an attention-matched educational activity about general brain structure and brain function, such as basic brain regions, attention, memory, and everyday brain functions. The control activity will not include growth mindset, ability malleability, stress reappraisal, or learning-from-setbacks content.
            </p>
            <p className="text-slate-600 text-xs md:text-sm italic">
              After Stage 1 data collection has closed, the GMI materials may be made publicly available on the study website for optional educational access. This later access will not involve collection of further research data.
            </p>
          </section>

          {/* 6. Optional future contact email */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              6. Optional future contact email
            </h2>
            <p>
              At the end of the Stage 1 online pathway, participants allocated to the GMI group may optionally provide an email address if they are willing to be contacted about a possible future follow-up interview. Providing an email address is voluntary, separate from Stage 1 participation, and is not consent to take part in an interview. Any future interview study would require separate ethics approval and a separate information and consent process.
            </p>
            <p className="text-slate-600 text-xs md:text-sm">
              If the future interview study is not approved, does not proceed, or contact is complete, the separate email contact file will be securely deleted and a deletion record kept.
            </p>
          </section>

          {/* 7. Are there any risks or discomforts? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              7. Are there any risks or discomforts?
            </h2>
            <p>
              This study is expected to involve low risk. Some people may feel mild discomfort when reflecting on work-related stress, setbacks, learning, coping, or early career professional development. You may stop at any time by closing the website.
            </p>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-xs md:text-sm leading-relaxed">
              <strong>Support Hotline:</strong> If you feel upset or need support, you may contact appropriate local support services, including the Chinese national mental health support hotline <strong>12356</strong> where available. If you are in immediate danger or need urgent help, please contact local emergency services.
            </div>
          </section>

          {/* 8. What information will be collected? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              8. What information will be collected?
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm md:text-base">
              <li>responses to eligibility screening questions;</li>
              <li>baseline background variables: gender, age group, highest education level, years of nursing clinical practice, hospital level, and broad clinical work area;</li>
              <li>questionnaire responses at baseline and immediately after the online activity;</li>
              <li>study group allocation and non-identifying participant identifier; and</li>
              <li>system-generated process information such as consent completion, eligibility outcome, module access and completion, completion time where technically available, and broad attrition point.</li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-xs md:text-sm leading-relaxed">
              <strong>Data Protection Guarantee:</strong> The main questionnaire dataset will not collect your name, phone number, WeChat ID, email address, hospital name, staff number, precise workplace identifier, patient information, clinical records, employer records, or professional performance data.
            </div>
          </section>

          {/* 9. How will my information be protected? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              9. How will my information be protected?
            </h2>
            <p>
              The study website is hosted using Amazon Web Services (AWS) in the Asia Pacific (Sydney) region and acts solely as a secure collection interface. Data will be exported from the website environment to University-approved secure storage during active data collection, normally monthly, with a final export after Stage 1 closes.
            </p>
            <p>
              The website developer will not be permitted to view, download, analyse, copy, reuse, disclose, or otherwise use raw participant data. Development and testing use dummy data only.
            </p>
            <p className="font-semibold text-slate-800">
              🤖 AI Policy: Generative AI tools will not be used to collect, screen, randomise, analyse, interpret, or make decisions about participant data. Participant responses and optional contact email addresses will not be entered into generative AI tools.
            </p>
          </section>

          {/* 10. How long will data be kept? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              10. How long will data be kept?
            </h2>
            <p>
              The main research dataset will be retained for 10 years after completion of the research activity, in accordance with University of Auckland requirements for adult health-related research data, unless the approved ethics protocol or University requirements specify a longer period. Optional future contact email addresses will be stored separately and securely deleted when contact is complete.
            </p>
          </section>

          {/* 11. Can I withdraw? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              11. Can I withdraw?
            </h2>
            <p>
              You may stop participating at any time before completing the online study by closing the website. If you have submitted responses and wish to request withdrawal of your data, you should contact the research team and provide your participant identifier. Because the main dataset does not contain direct contact details, the research team may not be able to identify or remove your submitted responses without this identifier.
            </p>
          </section>

          {/* 12. How will the results be used? */}
          <section className="space-y-3 border-b border-slate-100 pb-6">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              12. How will the results be used?
            </h2>
            <p>
              The findings may be used in a doctoral thesis, academic publications, conference presentations, and related scholarly outputs. Findings will be reported in aggregate or de-identified form. No individual participant, hospital, employer, workplace, online community, or ward/unit will be identifiable.
            </p>
          </section>

          {/* 13. Research Team Contacts & Ethics Approvals */}
          <section className="space-y-4 pt-2">
            <h2 className="text-[#04284b] text-xl font-bold font-serif">
              13. Research Team &amp; Ethical Contacts
            </h2>
            <p>For questions about the study, please contact the student researcher or principal investigator:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f8fafc] p-5 rounded-xl border border-slate-200 text-xs md:text-sm">
              <div>
                <p className="font-bold text-[#04284b]">Student Researcher:</p>
                <p className="text-slate-700">Ji Zhang</p>
                <a href="mailto:ajhz590@aucklanduni.ac.nz" className="text-[#006764] font-semibold hover:underline">ajhz590@aucklanduni.ac.nz</a>
              </div>
              <div>
                <p className="font-bold text-[#04284b]">Lead Supervisor / Principal Investigator:</p>
                <p className="text-slate-700">Dr Stephen Jacobs</p>
                <a href="mailto:s.jacobs@auckland.ac.nz" className="text-[#006764] font-semibold hover:underline">s.jacobs@auckland.ac.nz</a>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              <strong>Supervisory Committee:</strong> Dr Stephen Jacobs, Associate Professor Lixin Jiang, and Associate Professor Marcus Henning.
            </p>

            <div className="bg-[#f0f7f6] p-5 rounded-xl border border-[#99d6d3] text-xs md:text-sm space-y-1">
              <p className="font-bold text-[#006764]">Human Participants Ethics Committee Approval:</p>
              <p>For any queries regarding ethical concerns, you may contact the Chair, The University of Auckland Human Participants Ethics Committee, Office of Research Strategy and Integrity, The University of Auckland, Private Bag 92019, Auckland 1142. Telephone 09 373-7599 ext. 83711. Email: <a href="mailto:humanethics@auckland.ac.nz" className="underline font-semibold">humanethics@auckland.ac.nz</a></p>
              <p className="pt-2 font-semibold text-[#04284b]">This project was approved by the University of Auckland Human Participants Ethics Committee on **-**-2026. Reference Number: ABC***.</p>
            </div>
          </section>

          {/* Bottom Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
            <Link
              href="/information"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
            >
              ← Back to Summary
            </Link>
            <Link
              href="/consent"
              className="px-8 py-3.5 rounded-xl bg-[#006764] hover:bg-[#005250] text-white font-bold text-sm md:text-base transition-all shadow-md hover:shadow-lg"
            >
              Continue to Informed Consent →
            </Link>
          </div>

        </div>
      </main>

      <AppFooter />
    </div>
  );
}

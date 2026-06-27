const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'app', 'module', 'gmi', '1', 'page.js');
let content = fs.readFileSync(file, 'utf8');

// ── Simple string replacements (Chinese → English) ──────────────────────────

const replacements = [
  // Preceptor label
  ['Preceptor (带教老师)', 'Preceptor'],
  // Infographic label
  ["Patient&apos;s Arm Infographic (患者手臂固定图示)", "Patient&apos;s Arm Infographic"],
  // Step 1 title
  ['场景一：完成操作 (Completing the Procedure)', 'Completing the Procedure'],
  // Step 1 description
  ['您已完成外周静脉导管的置入，用胶带固定敷料，整理好输液管，并为患者盖好被子。整个操作似乎已全部完成。',
   "You have just finished inserting the peripheral IV cannula, secured the dressing with tape, tidied the IV tubing, and covered the patient with a blanket. The procedure appears to be complete."],
  // Step 1 inner monologue label (appears multiple times)
  ['米娅 (内心独白) ：', 'Mia (Inner Monologue):'],
  // Step 1 inner monologue text
  ['&quot;一切都完成了，看起来没有问题。&quot; (Everything is done, looks perfect.)',
   '&quot;Everything is done, looks perfect.&quot;'],
  // Step 2 title
  ["场景二：老师的目光与无声压力 (Preceptor&apos;s Gaze &amp; Pressure)", "Preceptor&apos;s Gaze &amp; Pressure"],
  // Step 2 description
  ['您抬头看向老师。带教老师正注视着整个操作过程，突然她皱起眉头，目光停留在患者手臂附近。',
   "You look up toward the preceptor. She has been observing the procedure, and suddenly she furrows her brow, her gaze settling near the patient&apos;s arm."],
  // Step 2 Mia inner monologue
  ['&quot;老师为什么皱眉？我是不是遗漏了什么？感觉好紧张……是不是我能力不够？&quot;',
   '&quot;Why is she frowning? Did I miss something? I feel so nervous&hellip; am I not capable enough?&quot;'],
  // Step 2 action prompt
  ['🔍 请点击右侧画面中被遗忘的止血带，将其取下。',
   '🔍 Click on the forgotten tourniquet in the diagram to remove it.'],
  // Step 2 teacher response label
  ['带教老师平静地说道:', 'Preceptor calmly says:'],
  // Step 2 teacher response text (curly quotes in original)
  ['\u201c完成操作前，记得再检查一遍。\u201d', '&quot;Before finishing, always do a final check.&quot;'],
  // Step 3 title
  ['学习总结 (Learning Summary)', 'Learning Summary'],
  // Step 3 Mia monologue
  ['&quot;大部分操作都完成得很好，但一个小细节仍然可能被忽略。以后完成操作前，我会再做一次最后检查。&quot; (Most steps were fine, but a tiny detail was missed. Next time, I will always do a final sweep.)',
   '&quot;Most steps went well, but a small detail was still missed. From now on, I will always do a final check before finishing a procedure.&quot;'],
  // Step 3 growth mindset tip label
  ['学习提示 (Growth Mindset Tip):', 'Growth Mindset Tip:'],
  // Step 3 growth mindset tip text
  ['临床反馈并不意味着能力不足，它可以帮助我们发现容易忽略的细节，并为下一次实践提供学习机会。',
   'Clinical feedback does not mean you lack ability &mdash; it helps you notice easily missed details and provides a learning opportunity for next time.'],
  // Nav buttons
  ['抬头看向老师 (Look Up &amp; Continue) →', 'Look Up &amp; Continue →'],
  ['继续 (Continue) →', 'Continue →'],
];

for (const [from, to] of replacements) {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    console.log(`✓ Replaced: "${from.slice(0, 40)}..."`);
  } else {
    console.warn(`⚠ Not found: "${from.slice(0, 40)}..."`);
  }
}

// ── Layout restructure: Step 2 characters above SVG ─────────────────────────
// Replace the old single-panel div (steps 1/2/3 all in same flex-row)
// with a conditional that gives step 2 a flex-col layout

const oldPanel = `        {/* Top Row: Integrated Graphics Panel (Characters Left, SVG Right in one card) */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-stretch justify-between gap-6 min-h-[380px] animate-fadeIn">
          {/* Left Area: Characters */}
          <div className="w-full md:w-[15%] flex-none flex flex-col justify-center items-start pl-0 min-h-[320px] md:-ml-6">
            {caseStep === 1 && (
              <div className="flex flex-col items-center gap-2 -ml-16">
                <NurseCharacter pose="welcome" size={330} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  Mia
                </span>
              </div>
            )}
            {caseStep === 2 && (
              <div className="flex items-center justify-start gap-4 w-full md:-ml-12">
                <div className="flex flex-col items-center flex-none">
                  <NurseCharacter pose={caseTourniquetRemoved ? 'confident' : 'uncertain'} size={190} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
                    Mia
                  </span>
                </div>
                <div className="flex flex-col items-center flex-none -ml-10">
                  <TeacherCharacter pose={caseTourniquetRemoved ? 'speaking' : 'frown'} size={210} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
                    Preceptor
                  </span>
                </div>
              </div>
            )}
            {caseStep === 3 && (
              <div className="flex flex-col items-center gap-2 -ml-16">
                <NurseCharacter pose="confident" size={330} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  Mia
                </span>
              </div>
            )}
          </div>

          {/* Right Area: SVG Diagram */}
          <div className="flex-grow flex flex-col items-center justify-center w-full py-4 md:pl-6">
            <div className="w-full flex flex-col items-center gap-4">
              {renderCaseSVG()}
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', backgroundColor: 'white', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                Patient&apos;s Arm Infographic
              </span>
            </div>
          </div>
        </div>`;

const newPanel = `        {/* Top Row: Integrated Graphics Panel */}
        {caseStep === 2 ? (
          /* Step 2: Characters displayed above SVG for full-size visibility */
          <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col gap-4 animate-fadeIn">
            <div className="flex items-end justify-center">
              <div className="flex flex-col items-center">
                <NurseCharacter pose={caseTourniquetRemoved ? 'confident' : 'uncertain'} size={300} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
                  Mia
                </span>
              </div>
              <div className="flex flex-col items-center" style={{ marginLeft: '-2.5rem' }}>
                <TeacherCharacter pose={caseTourniquetRemoved ? 'speaking' : 'frown'} size={320} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
                  Preceptor
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              {renderCaseSVG()}
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', backgroundColor: 'white', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                Patient&apos;s Arm Infographic
              </span>
            </div>
          </div>
        ) : (
          /* Steps 1 & 3: Character on left, SVG on right */
          <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-stretch justify-between gap-6 min-h-[380px] animate-fadeIn">
            <div className="w-full md:w-[15%] flex-none flex flex-col justify-center items-start pl-0 min-h-[320px] md:-ml-6">
              {caseStep === 1 && (
                <div className="flex flex-col items-center gap-2 -ml-16">
                  <NurseCharacter pose="welcome" size={330} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    Mia
                  </span>
                </div>
              )}
              {caseStep === 3 && (
                <div className="flex flex-col items-center gap-2 -ml-16">
                  <NurseCharacter pose="confident" size={330} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', backgroundColor: 'white', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    Mia
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow flex flex-col items-center justify-center w-full py-4 md:pl-6">
              <div className="w-full flex flex-col items-center gap-4">
                {renderCaseSVG()}
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', backgroundColor: 'white', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  Patient&apos;s Arm Infographic
                </span>
              </div>
            </div>
          </div>
        )}`;

if (content.includes(oldPanel)) {
  content = content.replace(oldPanel, newPanel);
  console.log('✓ Layout restructured: step-2 characters now above SVG at 300/320px');
} else {
  console.warn('⚠ Old panel not found — may have already been changed or text mismatch');
}

fs.writeFileSync(file, content, 'utf8');
console.log('\nDone. File saved.');

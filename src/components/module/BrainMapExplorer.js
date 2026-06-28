'use client';

import { useState } from 'react';
import { playClick } from '@/utils/audioEffects';

const BRAIN_REGIONS = [
  {
    id: 'frontal',
    name: 'Frontal Lobe',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    icon: '💡',
    role: 'Executive Function & Motor Control',
    desc: 'Primary area for decision-making, problem-solving, planning, emotional regulation, and voluntary motor execution.',
    overlay: { cx: 130, cy: 110, rx: 60, ry: 50, rotate: -20 },
  },
  {
    id: 'parietal',
    name: 'Parietal Lobe',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#c4b5fd',
    icon: '🖐️',
    role: 'Somatosensory Processing & Spatial Awareness',
    desc: 'Processes touch, temperature, pain, spatial navigation, and integrates sensory inputs from across the body.',
    overlay: { cx: 320, cy: 90, rx: 50, ry: 40, rotate: 10 },
  },
  {
    id: 'occipital',
    name: 'Occipital Lobe',
    color: '#db2777',
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
    icon: '👁️',
    role: 'Visual Processing Center',
    desc: 'Dedicated center for visual perception, color recognition, shape interpretation, and motion processing.',
    overlay: { cx: 410, cy: 180, rx: 40, ry: 38, rotate: 0 },
  },
  {
    id: 'temporal',
    name: 'Temporal Lobe',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    icon: '🎧',
    role: 'Hearing, Memory & Language Comprehension',
    desc: 'Houses Wernicke’s area for speech understanding and the hippocampus for long-term memory formation.',
    overlay: { cx: 270, cy: 200, rx: 55, ry: 32, rotate: 0 },
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    icon: '⚖️',
    role: 'Motor Balance, Coordination & Posture',
    desc: 'Finetunes motor activity, maintains posture, and ensures smooth, precise muscle coordination.',
    overlay: { cx: 355, cy: 265, rx: 45, ry: 30, rotate: -5 },
  },
  {
    id: 'brainstem',
    name: 'Brainstem',
    color: '#475569',
    bgColor: '#f8fafc',
    borderColor: '#cbd5e1',
    icon: '🫀',
    role: 'Autonomic & Life-Sustaining Functions',
    desc: 'Controls essential involuntary functions including heart rate, respiration, blood pressure, and swallowing.',
    overlay: { cx: 260, cy: 310, rx: 25, ry: 45, rotate: 25 },
  },
];

export default function BrainMapExplorer({ onExploreComplete }) {
  const [explored, setExplored] = useState(new Set());
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleSelect = (region) => {
    playClick();
    setSelectedRegion(region);
    const nextExplored = new Set([...explored, region.id]);
    setExplored(nextExplored);
    if (nextExplored.size >= BRAIN_REGIONS.length && onExploreComplete) {
      onExploreComplete();
    }
  };

  const allExplored = explored.size >= BRAIN_REGIONS.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fadeIn">
      {/* Unified Single Interactive Container Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
        
        {/* 2-Column Layout: Left (8 cols for Brain Diagram) + Right (4 cols for Vertical Buttons) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left Side (8 cols): HD Brain Diagram + SVG Dynamic Highlight Overlay */}
          <div className="md:col-span-8 flex flex-col items-center justify-center relative p-0">
            <div className="relative w-full flex items-center justify-center">
              <img
                src="/brain_anatomy_diagram.png"
                alt="Anatomical Brain Diagram"
                className="w-full h-auto object-contain rounded-xl transition-all duration-300"
              />

              {/* SVG Dynamic Highlight Overlay */}
              <svg
                viewBox="0 0 500 400"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Draw highlight for selected region */}
                {selectedRegion && selectedRegion.overlay && (
                  <g className="transition-all duration-500 animate-fadeIn">
                    {/* Outer glowing halo */}
                    <ellipse
                      cx={selectedRegion.overlay.cx}
                      cy={selectedRegion.overlay.cy}
                      rx={selectedRegion.overlay.rx + 12}
                      ry={selectedRegion.overlay.ry + 12}
                      fill={selectedRegion.color}
                      fillOpacity="0.25"
                      transform={`rotate(${selectedRegion.overlay.rotate} ${selectedRegion.overlay.cx} ${selectedRegion.overlay.cy})`}
                      filter="url(#glow)"
                    />

                    {/* Core highlight area */}
                    <ellipse
                      cx={selectedRegion.overlay.cx}
                      cy={selectedRegion.overlay.cy}
                      rx={selectedRegion.overlay.rx}
                      ry={selectedRegion.overlay.ry}
                      fill={selectedRegion.color}
                      fillOpacity="0.4"
                      stroke={selectedRegion.color}
                      strokeWidth="3.5"
                      strokeDasharray="6 3"
                      transform={`rotate(${selectedRegion.overlay.rotate} ${selectedRegion.overlay.cx} ${selectedRegion.overlay.cy})`}
                      className="animate-pulse"
                    />

                    {/* Center pin badge indicator */}
                    <circle
                      cx={selectedRegion.overlay.cx}
                      cy={selectedRegion.overlay.cy}
                      r="16"
                      fill={selectedRegion.color}
                      stroke="white"
                      strokeWidth="3"
                      className="shadow-md"
                    />
                    <text
                      x={selectedRegion.overlay.cx}
                      y={selectedRegion.overlay.cy + 4}
                      fontSize="13"
                      textAnchor="middle"
                      fill="white"
                      fontWeight="bold"
                    >
                      {selectedRegion.icon}
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Right Side (4 cols): Stack of 6 Region Buttons */}
          <div className="md:col-span-4 flex flex-col justify-center gap-3">
            <div className="flex items-center justify-between mb-1 border-b border-slate-100 pb-2">
              <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider margin-0">
                SELECT REGION:
              </p>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {explored.size}/{BRAIN_REGIONS.length}
              </span>
            </div>
            {BRAIN_REGIONS.map((region) => {
              const isSelected = selectedRegion?.id === region.id;
              const isVisited = explored.has(region.id);
              return (
                <button
                  key={region.id}
                  onClick={() => handleSelect(region)}
                  style={{
                    backgroundColor: isSelected ? region.color : isVisited ? region.bgColor : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    borderColor: isSelected ? region.color : region.borderColor,
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'shadow-md font-bold ring-2 ring-offset-1'
                      : 'hover:border-slate-400 hover:shadow-xs font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg shrink-0">{region.icon}</span>
                    <span className="text-sm font-bold truncate">{region.name}</span>
                  </div>
                  {isVisited && (
                    <span className={`text-sm font-extrabold ml-1 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-600'}`}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Integrated Bottom Section: Selected Region Functional Details */}
        {selectedRegion ? (
          <div
            style={{
              padding: '22px 24px',
              borderRadius: '20px',
              backgroundColor: selectedRegion.bgColor,
              border: `1.5px solid ${selectedRegion.borderColor}`,
            }}
            className="animate-fadeIn w-full transition-all duration-300 mt-0"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5 border-b pb-3 border-slate-200/60">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-white p-2 rounded-xl shadow-xs border border-slate-100">{selectedRegion.icon}</span>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#04284b', margin: 0, fontFamily: 'var(--font-serif)' }}>
                    {selectedRegion.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight 800, color: selectedRegion.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    FUNCTIONAL ZONE DETAILS
                  </span>
                </div>
              </div>
              {explored.has(selectedRegion.id) && (
                <span className="self-start md:self-center px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
                  <span>✓</span> Region Explored &amp; Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              <div className="md:col-span-5 bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/60 flex flex-col justify-center">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">🎯 PRIMARY CLINICAL ROLE</p>
                <p className="text-sm font-bold text-slate-800 leading-snug">{selectedRegion.role}</p>
              </div>
              <div className="md:col-span-7 bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/60 flex flex-col justify-center">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">📚 FUNCTIONAL DESCRIPTION</p>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">{selectedRegion.desc}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center animate-fadeIn">
            <span className="text-3xl mb-2 block">🧠</span>
            <h3 className="font-bold text-[#04284b] text-base mb-1 font-serif">
              Interactive Brain Region Exploration
            </h3>
            <p className="text-slate-600 text-xs md:text-sm">
              Click any region button on the right to view its anatomical location and functional specialization.
            </p>
          </div>
        )}

      </div>

      {/* Completion Banner */}
      {allExplored && (
        <div className="w-full bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <span className="text-sm font-bold text-emerald-900">
              All 6 major brain regions explored! You now have a clear overview of functional localization.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

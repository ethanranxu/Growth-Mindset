'use client';

import { useState } from 'react';
import { playClick } from '@/utils/audioEffects';

const BRAIN_REGIONS = [
  {
    id: 'frontal',
    name: 'Frontal Lobe',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    icon: '💡',
    x: 130,
    y: 110,
    r: 45,
    role: 'Executive Function & Motor Control',
    desc: 'Primary area for decision-making, problem-solving, planning, emotional regulation, and voluntary motor execution.',
  },
  {
    id: 'parietal',
    name: 'Parietal Lobe',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    borderColor: '#c4b5fd',
    icon: '🖐️',
    x: 250,
    y: 90,
    r: 40,
    role: 'Somatosensory Processing & Spatial Awareness',
    desc: 'Processes touch, temperature, pain, spatial navigation, and integrates sensory inputs from across the body.',
  },
  {
    id: 'occipital',
    name: 'Occipital Lobe',
    color: '#ec4899',
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
    icon: '👁️',
    x: 350,
    y: 130,
    r: 35,
    role: 'Visual Processing',
    desc: 'Dedicated center for visual perception, color recognition, shape interpretation, and motion processing.',
  },
  {
    id: 'temporal',
    name: 'Temporal Lobe',
    color: '#10b981',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    icon: '🎧',
    x: 230,
    y: 175,
    r: 40,
    role: 'Hearing, Memory Consolidation & Language Comprehension',
    desc: 'Houses Wernicke’s area for speech understanding and the hippocampus for memory formation.',
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    icon: '⚖️',
    x: 330,
    y: 220,
    r: 35,
    role: 'Motor Balance, Coordination & Posture',
    desc: 'Finetunes motor activity, maintains posture, and ensures smooth, precise muscle coordination.',
  },
  {
    id: 'brainstem',
    name: 'Brainstem',
    color: '#64748b',
    bgColor: '#f8fafc',
    borderColor: '#cbd5e1',
    icon: '🫀',
    x: 230,
    y: 250,
    r: 28,
    role: 'Autonomic & Life-Sustaining Functions',
    desc: 'Controls essential involuntary functions including heart rate, respiration, blood pressure, and swallowing.',
  },
];

export default function BrainMapExplorer({ onExploreComplete }) {
  const [explored, setExplored] = useState(new Set());
  const [selectedRegion, setSelectedRegion] = useState(BRAIN_REGIONS[0]);

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
      {/* Interactive Diagram & Region Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* SVG Map (7 columns) */}
        <div className="md:col-span-7 bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-between min-h-[340px]">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              ANATOMICAL EXPLORER
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Explored: {explored.size}/{BRAIN_REGIONS.length} regions
            </span>
          </div>

          <svg
            viewBox="0 0 440 300"
            className="w-full h-auto max-h-[300px] select-none"
          >
            {/* Brain outer contour background */}
            <path
              d="M 120 70 C 180 30, 320 30, 380 90 C 420 130, 400 200, 360 250 C 320 280, 260 290, 220 280 C 170 270, 100 230, 90 170 C 80 120, 90 90, 120 70 Z"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="3"
              strokeDasharray="4 4"
            />

            {/* Connecting fibers / neural pathways SVG background effects */}
            <line x1="130" y1="110" x2="250" y2="90" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="250" y1="90" x2="350" y2="130" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="130" y1="110" x2="230" y2="175" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="250" y1="90" x2="230" y2="175" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="350" y1="130" x2="330" y2="220" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="230" y1="175" x2="230" y2="250" stroke="#E2E8F0" strokeWidth="2" />

            {/* Brain Regions */}
            {BRAIN_REGIONS.map((region) => {
              const isSelected = selectedRegion?.id === region.id;
              const isVisited = explored.has(region.id);
              return (
                <g
                  key={region.id}
                  onClick={() => handleSelect(region)}
                  className="cursor-pointer transition-all duration-300"
                >
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={region.r}
                    fill={isSelected ? region.color : isVisited ? region.bgColor : '#FFFFFF'}
                    stroke={region.color}
                    strokeWidth={isSelected ? 3.5 : 2}
                    className={`transition-all duration-300 ${!isVisited ? 'animate-pulse' : ''}`}
                    style={{ filter: isSelected ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))' : 'none' }}
                  />
                  <text
                    x={region.x}
                    y={region.y - 4}
                    fontSize="16"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {region.icon}
                  </text>
                  <text
                    x={region.x}
                    y={region.y + 14}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#334155'}
                  >
                    {region.name.split(' ')[0]}
                  </text>
                  {isVisited && (
                    <circle
                      cx={region.x + region.r - 8}
                      cy={region.y - region.r + 8}
                      r="7"
                      fill="#22c55e"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          <p className="text-xs text-slate-400 text-center mt-2 font-medium">
            💡 Click each region node to view functional specialization.
          </p>
        </div>

        {/* Selected Region Details (5 columns) */}
        <div className="md:col-span-5 flex flex-col justify-between">
          {selectedRegion ? (
            <div
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: selectedRegion.bgColor,
                border: `2px solid ${selectedRegion.borderColor}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'between',
              }}
              className="animate-fadeIn"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{selectedRegion.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#04284b', margin: 0 }}>
                      {selectedRegion.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: selectedRegion.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Functional Zone
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    🎯 Primary Role:
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.4 }}>
                    {selectedRegion.role}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    📚 Functional Description:
                  </p>
                  <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
                    {selectedRegion.desc}
                  </p>
                </div>
              </div>

              {explored.has(selectedRegion.id) && (
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '0.8rem', fontWeight: 700 }}>
                  <span>✓ Region explored</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 h-full flex items-center justify-center">
              Click a brain region on the map to inspect its details.
            </div>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {allExplored && (
        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between animate-fadeIn shadow-xs">
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

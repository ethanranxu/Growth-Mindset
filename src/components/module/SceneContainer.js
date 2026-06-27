'use client';

/**
 * SceneContainer — Layout wrapper for each module scene
 * Provides hospital-themed background, responsive layout, and scene transition
 */
export default function SceneContainer({ children, sceneIndex, className = '' }) {
  return (
    <div
      className={`relative w-full min-h-[420px] rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(160deg, #f7fafa 0%, #eef6f3 40%, #f0f4f8 100%)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        animation: 'sceneEnter 0.5s ease forwards',
      }}
      key={sceneIndex}
    >
      {/* Subtle hospital corridor illustration in background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.06 }}
      >
        {/* Minimalist Ceiling Panel Lights */}
        <g opacity="0.08" stroke="#006764" fill="none">
          <rect x="180" y="15" width="100" height="12" rx="6" fill="#006764" fillOpacity="0.1" strokeWidth="1.5" />
          <rect x="520" y="15" width="100" height="12" rx="6" fill="#006764" fillOpacity="0.1" strokeWidth="1.5" />
        </g>

        {/* Minimalist IV Stand with Infusion Bags (Left Side) */}
        <g transform="translate(85, 140)" stroke="#006764" fill="none" opacity="0.14" strokeLinejoin="round">
          {/* Main stand pole */}
          <line x1="0" y1="0" x2="0" y2="280" strokeWidth="2.5" />
          <path d="M-15,280 L0,270 L15,280" strokeWidth="2.5" />
          {/* Hangers */}
          <path d="M-12,-10 Q0,-5 0,0 Q0,-5 12,-10" strokeWidth="2" />
          {/* IV Bag 1 */}
          <g transform="translate(-16, -34)">
            <rect x="-6" y="0" width="12" height="24" rx="3" fill="#006764" fillOpacity="0.15" strokeWidth="1.5" />
            <line x1="-6" y1="12" x2="6" y2="12" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M0,24 Q-2,34 -8,46" strokeWidth="1" />
          </g>
          {/* IV Bag 2 */}
          <g transform="translate(16, -38)">
            <rect x="-6" y="0" width="12" height="26" rx="3" fill="#006764" fillOpacity="0.15" strokeWidth="1.5" />
            <line x1="-6" y1="14" x2="6" y2="14" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M0,26 Q2,34 6,48" strokeWidth="1" />
          </g>
        </g>

        {/* Minimalist ECG Patient Monitor (Right Side) */}
        <g transform="translate(640, 200)" opacity="0.14" stroke="#006764" fill="none">
          {/* Monitor body */}
          <rect x="0" y="0" width="85" height="65" rx="6" strokeWidth="2.5" fill="#006764" fillOpacity="0.06" />
          {/* Monitor base/stand */}
          <rect x="32" y="65" width="20" height="8" fill="#006764" fillOpacity="0.1" strokeWidth="1.5" />
          <line x1="15" y1="73" x2="70" y2="73" strokeWidth="2" />
          {/* ECG waveform layout */}
          <path d="M5,22 L18,22 L22,6 L26,38 L30,22 L52,22 L56,10 L60,35 L64,22 L80,22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Pulse rate and SpO2 display data */}
          <rect x="58" y="4" width="22" height="10" rx="1.5" fill="#006764" fillOpacity="0.25" stroke="none" />
          <text x="69" y="12" fontSize="8" fontWeight="bold" fill="#006764" stroke="none" textAnchor="middle">78</text>
          <text x="8" y="52" fontSize="7" fill="#006764" stroke="none">ECG II</text>
          <text x="58" y="52" fontSize="7" fill="#006764" stroke="none">SpO2 98</text>
        </g>

        {/* Minimalist Medical Cross logo (Center Background) */}
        <g transform="translate(400, 160)" opacity="0.16">
          <circle cx="0" cy="0" r="32" fill="none" stroke="#006764" strokeWidth="2" />
          <rect x="-4" y="-18" width="8" height="36" rx="2" fill="#006764" />
          <rect x="-18" y="-4" width="32" height="8" rx="2" fill="#006764" />
        </g>
      </svg>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        {children}
      </div>

      <style jsx>{`
        @keyframes sceneEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

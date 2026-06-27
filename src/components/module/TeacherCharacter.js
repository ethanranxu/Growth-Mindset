'use client';

/**
 * TeacherCharacter — SVG cartoon senior Chinese female nurse preceptor
 * Features realistic dignified senior proportions, silver-streaked dark bun,
 * thin black-rimmed spectacles, preceptor badge, and expressive poses.
 * Poses: calm (gaze), frown (concerned), speaking (giving feedback)
 */

export default function TeacherCharacter({ pose = 'calm', className = '', size = 360 }) {
  const scrubsColor = '#1B365D'; // Dignified Dark Navy for senior nurse
  const scrubsDark = '#0F213F';
  const scrubsLight = '#4A6F9E';
  const skinColor = '#FFF2EB';   // Warm skin tone
  const skinShadow = '#EAD0C3';  // Shadow
  const hairColor = '#2F3238';   // Charcoal dark hair
  const silverHair = '#8A909A';  // Silver hair streaks for seniority
  const redCross = '#D32F2F';

  const renderHead = (tiltDeg = 0) => {
    // Brows based on pose
    const renderBrows = () => {
      if (pose === 'frown') {
        // Frowning brows (slanted downwards in center)
        return (
          <g stroke={hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M113,77 Q123,79 129,74" />
            <path d="M151,74 Q157,79 167,77" />
          </g>
        );
      }
      // Calm, soft brows
      return (
        <g stroke={hairColor} strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M114,75 Q122,70 129,75" />
          <path d="M151,75 Q158,70 166,75" />
        </g>
      );
    };

    // Glasses (spectacles) - key marker for the senior preceptor
    const renderGlasses = () => (
      <g stroke="#37474F" strokeWidth="2" fill="none" opacity="0.9">
        {/* Left lens */}
        <rect x="110" y="78" width="22" height="15" rx="3" fill="#E0F7FA" fillOpacity="0.3" />
        {/* Right lens */}
        <rect x="148" y="78" width="22" height="15" rx="3" fill="#E0F7FA" fillOpacity="0.3" />
        {/* Bridge */}
        <line x1="132" y1="84" x2="148" y2="84" />
        {/* Sides temple arms */}
        <path d="M110,82 Q105,80 103,84" />
        <path d="M170,82 Q175,80 177,84" />
      </g>
    );

    // Eyes behind glasses
    const renderEyes = () => {
      if (pose === 'frown') {
        // Looking down slightly worried/concerned
        return (
          <g>
            {/* Left Eye */}
            <ellipse cx="121" cy="85" rx="6" ry="7" fill="#FFFFFF" />
            <ellipse cx="121" cy="86.5" rx="4.5" ry="5" fill="#3E2723" /> {/* brown-black iris */}
            <circle cx="121" cy="85" r="2" fill="#1C2833" />
            <circle cx="119.5" cy="83.5" r="1.5" fill="#FFFFFF" />
            <path d="M113,83 Q121,79 129,83" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            
            {/* Right Eye */}
            <ellipse cx="159" cy="85" rx="6" ry="7" fill="#FFFFFF" />
            <ellipse cx="159" cy="86.5" rx="4.5" ry="5" fill="#3E2723" />
            <circle cx="159" cy="85" r="2" fill="#1C2833" />
            <circle cx="157.5" cy="83.5" r="1.5" fill="#FFFFFF" />
            <path d="M151,83 Q159,79 167,83" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </g>
        );
      }

      // Calm warm eyes
      return (
        <g>
          {/* Left Eye */}
          <ellipse cx="121" cy="85" rx="6.2" ry="7.2" fill="#FFFFFF" />
          <ellipse cx="121" cy="85" rx="4.8" ry="5.8" fill="#3E2723" />
          <circle cx="121" cy="85" r="2" fill="#1C2833" />
          <circle cx="119.5" cy="82.5" r="1.8" fill="#FFFFFF" />
          <path d="M113,83 Q121,78 129,83" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          
          {/* Right Eye */}
          <ellipse cx="159" cy="85" rx="6.2" ry="7.2" fill="#FFFFFF" />
          <ellipse cx="159" cy="85" rx="4.8" ry="5.8" fill="#3E2723" />
          <circle cx="159" cy="85" r="2" fill="#1C2833" />
          <circle cx="157.5" cy="82.5" r="1.8" fill="#FFFFFF" />
          <path d="M151,83 Q159,78 167,83" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </g>
      );
    };

    return (
      <g transform={`rotate(${tiltDeg}, 140, 90)`}>
        {/* HAIR - neat bun with silver streaks */}
        <circle cx="140" cy="52" r="26" fill={hairColor} />
        {/* Hairnet bow */}
        <path d="M124,60 Q140,64 156,60 L150,68 Q140,71 130,68 Z" fill="#0A101D" />
        {/* Face shape - mature and elegant */}
        <path d="M104,82 C104,110 114,124 140,124 C166,124 176,110 176,82 C176,58 162,55 140,55 C118,55 104,58 104,82 Z" fill="url(#skinGradient)" />

        {/* Hair streaks (silver age details) */}
        <path d="M105,74 C112,65 128,62 144,65 C132,68 120,77 116,84 C112,80 108,77 104,74 Z" fill={hairColor} />
        <path d="M176,74 C168,65 152,62 136,65 C148,68 160,77 164,84 C168,80 172,77 176,74 Z" fill={hairColor} />
        
        {/* Silver strands */}
        <path d="M110,63 Q125,58 138,62" stroke={silverHair} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M170,63 Q155,58 142,62" stroke={silverHair} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M135,42 Q140,48 145,42" stroke={silverHair} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />

        {/* Eyes, Brows, Glasses */}
        {renderBrows()}
        {renderEyes()}
        {renderGlasses()}

        {/* NOSE */}
        <path d="M138,91 Q140,96 142,91" stroke={skinShadow} strokeWidth="2.2" fill="none" strokeLinecap="round" />

        {/* Side hair locks */}
        <path d="M105,82 C103,90 103,98 105,103 Z" fill={hairColor} />
        <path d="M175,82 C177,90 177,98 175,103 Z" fill={hairColor} />

        {/* NURSE CAP - straight, flat cap centered */}
        <g transform="translate(122, 29)">
          <path d="M0,22 Q18,8 36,22 L31,28 L5,28 Z" fill="#CFD8DC" />
          <path d="M-2,20 Q18,4 38,20 L33,26 L3,26 Z" fill="#FFFFFF" />
          {/* Double blue strips denoting senior preceptor rank */}
          <rect x="6" y="22" width="28" height="1.5" fill={scrubsColor} />
          <rect x="6" y="24.5" width="28" height="1.5" fill={scrubsColor} />
          <path d="M16,11 L20,11 M18,9 L18,13" stroke={redCross} strokeWidth="2" strokeLinecap="square" />
        </g>
      </g>
    );
  };

  const renderTorso = () => (
    <g>
      {/* Neck */}
      <path d="M133,120 L147,120 L145,142 L135,142 Z" fill="url(#skinGradient)" />
      <path d="M133,120 L147,120 L145,126 L135,126 Z" fill={skinShadow} />

      {/* Senior scrubs (Navy) */}
      <path d="M106,140 C106,140 100,165 98,195 C96,220 98,255 98,255 L182,255 C182,255 184,220 182,195 C180,165 174,140 174,140 Z" fill="url(#scrubsGradient)" />

      {/* Collar detail */}
      <path d="M125,140 L140,158 L155,140" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M128,140 L140,154 L152,140" fill="none" stroke={scrubsLight} strokeWidth="1.5" />

      {/* Preceptor Badge (Red stripe indicating Teacher) */}
      <g transform="translate(112, 164)">
        <rect x="0" y="0" width="18" height="13" rx="1.5" fill="#FFFFFF" filter="url(#shadowFilter)" />
        <rect x="2" y="2" width="14" height="2" fill={redCross} />
        <text x="9" y="10" fontSize="5" fontWeight="bold" fill={scrubsColor} textAnchor="middle" stroke="none">TEACHER</text>
      </g>

      {/* Pocket */}
      <path d="M152,168 H166 V186 H152 Z" fill={scrubsDark} opacity="0.4; " />
      <line x1="152" y1="168" x2="166" y2="168" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />
    </g>
  );

  const renderLegs = () => (
    <g>
      <path d="M102,254 L102,328 C102,331 125,331 125,328 L128,256 Z" fill="url(#scrubsGradient)" />
      <path d="M152,256 L155,328 C155,331 178,331 178,328 L178,254 Z" fill="url(#scrubsGradient)" />
      <path d="M102,325 L125,325 L125,328 L102,328 Z" fill={scrubsDark} opacity="0.3" />
      <path d="M155,325 L178,325 L178,328 L155,328 Z" fill={scrubsDark} opacity="0.3" />
      {/* Shoes */}
      <path d="M98,336 C98,329 128,329 128,336 C128,339 123,344 113,344 C103,344 98,339 98,336 Z" fill="#FFFFFF" filter="url(#shadowFilter)" />
      <path d="M152,336 C152,329 182,329 182,336 C182,339 177,344 167,344 C157,344 152,339 152,336 Z" fill="#FFFFFF" filter="url(#shadowFilter)" />
    </g>
  );

  const renderMouth = () => {
    if (pose === 'speaking') {
      // Open rounded speaking mouth
      return (
        <g transform="translate(140, 106)">
          <ellipse cx="0" cy="0" rx="4" ry="2.5" fill="#C62828" />
          <path d="M-3,-1 Q0,-0.5 3,-1" stroke="#FFFFFF" strokeWidth="1" fill="none" />
        </g>
      );
    }
    if (pose === 'frown') {
      // Slightly displeased down-curved line
      return <path d="M133,108 Q140,103 147,108" stroke="#E57373" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
    // Calm/flat mouth
    return <line x1="134" y1="106" x2="146" y2="106" stroke="#E57373" strokeWidth="2.5" strokeLinecap="round" />;
  };

  const renderPose = () => {
    switch (pose) {
      case 'frown':
        return (
          <g className="animate-breathe">
            {renderHead(0.5)}
            {renderMouth()}
            {renderTorso()}
            {/* Arms folded behind back (stern posture) */}
            <g>
              {/* Left arm sleeve */}
              <path d="M106,146 C106,146 95,160 92,175 Z" fill="url(#scrubsGradient)" />
              <path d="M102,156 Q94,180 102,204" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              {/* Right arm sleeve */}
              <path d="M174,146 C174,146 184,160 188,175 Z" fill="url(#scrubsGradient)" />
              <path d="M178,156 Q186,180 178,204" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
            </g>
            {renderLegs()}
          </g>
        );

      case 'speaking':
        return (
          <g className="animate-breathe">
            {renderHead(-1)}
            {renderMouth()}
            {renderTorso()}
            {/* Right hand gesturing (pointing / advising) */}
            <g>
              {/* Left arm down */}
              <path d="M106,146 C106,146 95,160 92,175 Z" fill="url(#scrubsGradient)" />
              <path d="M102,156 Q94,185 96,208" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              <circle cx="96" cy="212" r="7" fill={skinColor} />

              {/* Right arm gesturing forward */}
              <path d="M174,146 C174,146 184,160 188,175 Z" fill="url(#scrubsGradient)" />
              <g className="animate-gesturing">
                <path d="M184,156 Q198,162 208,180" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
                <circle cx="210" cy="184" r="8" fill={skinColor} />
                <line x1="210" y1="184" x2="220" y2="182" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" /> {/* pointing finger */}
              </g>
            </g>
            {renderLegs()}
          </g>
        );

      case 'calm':
      default:
        return (
          <g className="animate-breathe">
            {renderHead(0)}
            {renderMouth()}
            {renderTorso()}
            {/* Stern posture - arms folded on chest or at side */}
            <g>
              {/* Left arm */}
              <path d="M106,146 C106,146 95,160 92,175 Z" fill="url(#scrubsGradient)" />
              <path d="M102,156 Q94,185 96,208" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              <circle cx="96" cy="212" r="7" fill={skinColor} />
              {/* Right arm */}
              <path d="M174,146 C174,146 184,160 188,175 Z" fill="url(#scrubsGradient)" />
              <path d="M178,156 Q186,185 184,208" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              <circle cx="184" cy="212" r="7" fill={skinColor} />
            </g>
            {renderLegs()}
          </g>
        );
    }
  };

  return (
    <div className={`inline-flex items-end justify-center ${className}`}>
      <svg
        viewBox="30 -20 220 380"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <defs>
          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.8" floodColor="#04284B" floodOpacity="0.1" />
          </filter>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skinColor} />
            <stop offset="100%" stopColor={skinShadow} />
          </linearGradient>
          <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1C2833" />
            <stop offset="100%" stopColor="#4E342E" />
          </linearGradient>
          <linearGradient id="scrubsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={scrubsColor} />
            <stop offset="100%" stopColor={scrubsDark} />
          </linearGradient>
        </defs>

        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.01) translateY(-2px); transform-origin: bottom center; }
          }
          .animate-breathe { animation: breathe 3.8s ease-in-out infinite; }

          @keyframes gesturing {
            0%, 100% { transform: rotate(0deg); transform-origin: 188px 175px; }
            50% { transform: rotate(-5deg); transform-origin: 188px 175px; }
          }
          .animate-gesturing { animation: gesturing 2.5s ease-in-out infinite; }
        `}</style>

        {renderPose()}
      </svg>
    </div>
  );
}

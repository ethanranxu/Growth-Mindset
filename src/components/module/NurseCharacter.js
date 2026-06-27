'use client';

/**
 * NurseCharacter — SVG cartoon Chinese female nurse with multiple poses
 * Designed with a dignified, professional, and elegant aesthetic (端庄大气).
 * Features balanced proportions, healthy/natural arm and hand widths (解决手细问题),
 * and subtle CSS keyframe animations for each pose (每一页都有合适的动作效果) 
 * including breathing, waving, thinking sway, and celebratory bobbing.
 * Poses: welcome, uncertain, confident, celebrating
 */

export default function NurseCharacter({ pose = 'welcome', className = '', size = 360 }) {
  // Graceful color palette
  const scrubsColor = '#1F6F6B'; // Dignified Teal
  const scrubsDark = '#134D4A';  // Shadow Teal
  const scrubsLight = '#A3E2DE'; // Highlights
  const skinColor = '#FFF5F0';   // Fair warm skin
  const skinShadow = '#F3D2C1';  // Soft warm shading
  const hairColor = '#1E1E24';   // Natural Chinese dark hair
  const hairHighlight = '#4E4E5A'; // Soft hair shine
  const badgeBlue = '#0D47A1';    // ID Badge color
  const redCross = '#D32F2F';    // Professional medical red
  
  // Render Head & Face with graceful, dignified features
  const renderHead = (tiltDeg = 0, expression = 'smile', headClass = '') => {
    // Beautiful, calm almond eyes
    const renderAlmondEyes = () => {
      if (expression === 'happy') {
        // Smiling warm eyes (crescent arcs)
        return (
          <g>
            {/* Left Eye */}
            <path d="M112,84 Q121,76 130,84" stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M110,85 L114,82" stroke={hairColor} strokeWidth="2" strokeLinecap="round" />
            {/* Right Eye */}
            <path d="M150,84 Q159,76 168,84" stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M166,82 L170,85" stroke={hairColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      }

      if (expression === 'worry') {
        // Thinking eyes, soft and attentive
        return (
          <g>
            {/* Left Eye */}
            <ellipse cx="121" cy="83" rx="7" ry="7.5" fill="#FFFFFF" />
            <ellipse cx="121" cy="83" rx="5.5" ry="6" fill="url(#eyeGradient)" />
            <circle cx="121" cy="83" r="3" fill="#1C2833" />
            <circle cx="119.5" cy="80.5" r="2" fill="#FFFFFF" />
            <path d="M111,81 Q121,75 131,81" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            
            {/* Right Eye */}
            <ellipse cx="159" cy="83" rx="7" ry="7.5" fill="#FFFFFF" />
            <ellipse cx="159" cy="83" rx="5.5" ry="6" fill="url(#eyeGradient)" />
            <circle cx="159" cy="83" r="3" fill="#1C2833" />
            <circle cx="157.5" cy="80.5" r="2" fill="#FFFFFF" />
            <path d="M149,81 Q159,75 169,81" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </g>
        );
      }

      if (expression === 'looking-up') {
        // Eyes glancing up-right toward preceptor — pupils shifted upper-right
        return (
          <g>
            {/* Left Eye */}
            <ellipse cx="121" cy="83" rx="7" ry="7.5" fill="#FFFFFF" />
            <ellipse cx="121" cy="83" rx="5.5" ry="6" fill="url(#eyeGradient)" />
            <circle cx="123" cy="80" r="3" fill="#1C2833" />
            <circle cx="122" cy="78.5" r="1.8" fill="#FFFFFF" />
            <path d="M111,80 Q121,74 131,80" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            
            {/* Right Eye */}
            <ellipse cx="159" cy="83" rx="7" ry="7.5" fill="#FFFFFF" />
            <ellipse cx="159" cy="83" rx="5.5" ry="6" fill="url(#eyeGradient)" />
            <circle cx="161" cy="80" r="3" fill="#1C2833" />
            <circle cx="160" cy="78.5" r="1.8" fill="#FFFFFF" />
            <path d="M149,80 Q159,74 169,80" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </g>
        );
      }

      if (expression === 'anxious') {
        // Downcast eyes — pupils shifted downward, slightly constricted
        return (
          <g>
            {/* Left Eye */}
            <ellipse cx="121" cy="84" rx="7" ry="7.5" fill="#FFFFFF" />
            <ellipse cx="121" cy="84" rx="5.5" ry="6" fill="url(#eyeGradient)" />
            <circle cx="120" cy="87" r="3.2" fill="#1C2833" />
            <circle cx="119" cy="85.5" r="1.6" fill="#FFFFFF" />
            <path d="M111,82 Q121,76 131,82" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            {/* Lower eyelid slight tension line */}
            <path d="M113,88 Q121,91 129,88" stroke={skinShadow} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />

            {/* Right Eye */}
            <ellipse cx="159" cy="84" rx="7" ry="7.5" fill="#FFFFFF" />
            <ellipse cx="159" cy="84" rx="5.5" ry="6" fill="url(#eyeGradient)" />
            <circle cx="158" cy="87" r="3.2" fill="#1C2833" />
            <circle cx="157" cy="85.5" r="1.6" fill="#FFFFFF" />
            <path d="M149,82 Q159,76 169,82" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M151,88 Q159,91 167,88" stroke={skinShadow} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
          </g>
        );
      }

      // Standard calm, warm, intelligent eyes
      return (
        <g>
          {/* Left Eye */}
          <ellipse cx="121" cy="84" rx="7" ry="8" fill="#FFFFFF" />
          <ellipse cx="121" cy="84" rx="5.8" ry="6.5" fill="url(#eyeGradient)" />
          <circle cx="121" cy="84" r="3" fill="#1C2833" />
          <circle cx="119.5" cy="81.5" r="2.2" fill="#FFFFFF" />
          <circle cx="123" cy="86" r="0.8" fill="#FFFFFF" />
          <path d="M112,82 Q121,76 130,82" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          
          {/* Right Eye */}
          <ellipse cx="159" cy="84" rx="7" ry="8" fill="#FFFFFF" />
          <ellipse cx="159" cy="84" rx="5.8" ry="6.5" fill="url(#eyeGradient)" />
          <circle cx="159" cy="84" r="3" fill="#1C2833" />
          <circle cx="157.5" cy="81.5" r="2.2" fill="#FFFFFF" />
          <circle cx="161" cy="86" r="0.8" fill="#FFFFFF" />
          <path d="M150,82 Q159,76 168,82" stroke={hairColor} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </g>
      );
    };

    // Soft eyebrows
    const renderBrows = () => {
      if (expression === 'worry') {
        return (
          <g>
            <path d="M114,73 Q122,70 128,74" stroke={hairColor} strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M152,74 Q158,69 166,73" stroke={hairColor} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );
      }
      if (expression === 'anxious') {
        // Steep V-shaped furrowed brows — inner corners raised, outer corners down
        return (
          <g>
            <path d="M112,76 Q119,69 128,73" stroke={hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M152,73 Q161,69 168,76" stroke={hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Forehead crease lines */}
            <path d="M136,71 L138,67" stroke={hairColor} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
            <path d="M142,71 L144,67" stroke={hairColor} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
          </g>
        );
      }
      return (
        <g>
          <path d="M113,72 Q122,67 129,72" stroke={hairColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M151,72 Q158,67 167,72" stroke={hairColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
      );
    };

    // Cheeks blush (very subtle, professional)
    const renderBlush = () => (
      <g opacity="0.3">
        <ellipse cx="117" cy="94" rx="7" ry="3.5" fill="#FF8A80" />
        <ellipse cx="163" cy="94" rx="7" ry="3.5" fill="#FF8A80" />
      </g>
    );

    return (
      <g className={headClass} transform={`rotate(${tiltDeg}, 140, 90)`}>
        {/* HAIR - Back neat bun */}
        <circle cx="140" cy="54" r="28" fill={hairColor} />
        {/* Elegant ribbon/bow hairnet under the bun */}
        <path d="M122,64 Q140,68 158,64 L152,72 Q140,75 128,72 Z" fill="#0E1E38" />
        <circle cx="140" cy="68" r="5" fill="#B0BEC5" />

        {/* EARS */}
        <path d="M103,88 C100,88 98,94 98,98 C98,102 101,105 104,103 Z" fill="url(#skinGradient)" />
        <path d="M177,88 C180,88 182,94 182,98 C182,102 179,105 176,103 Z" fill="url(#skinGradient)" />

        {/* FACE - Dignified oval chin shape */}
        <path d="M104,82 C104,110 114,126 140,126 C166,126 176,110 176,82 C176,58 162,54 140,54 C118,54 104,58 104,82 Z" fill="url(#skinGradient)" />

        {/* Blush & Brows */}
        {renderBlush()}
        {renderBrows()}

        {/* EYES */}
        {renderAlmondEyes()}

        {/* NOSE - Elegant and slender */}
        <path d="M138,91 Q140,96 142,91" stroke={skinShadow} strokeWidth="2.2" fill="none" strokeLinecap="round" />

        {/* HAIR - Neat Chinese side-swept bangs */}
        {/* Hair flow line */}
        <path d="M104,74 C112,65 128,62 144,65 C132,68 120,77 116,84 C112,80 108,77 104,74 Z" fill={hairColor} />
        <path d="M176,74 C168,65 152,62 136,65 C148,68 160,77 164,84 C168,80 172,77 176,74 Z" fill={hairColor} />
        {/* Side hair locks - neat and short, framing the face */}
        <path d="M105,82 C102,90 103,102 106,108 C107,108 107,100 106,92 C107,86 106,83 105,82 Z" fill={hairColor} />
        <path d="M175,82 C178,90 177,102 174,108 C173,108 173,100 174,92 C173,86 174,83 175,82 Z" fill={hairColor} />
        {/* Soft Hair reflection */}
        <path d="M120,59 C130,56 150,56 160,59 Q150,58 140,58 Q130,58 120,59 Z" fill={hairHighlight} opacity="0.4" />

        {/* NURSE CAP - Clean, straight, professional cap */}
        <g transform="translate(122, 28)">
          {/* Cap Back Shadow */}
          <path d="M0,22 Q18,8 36,22 L31,28 L5,28 Z" fill="#CFD8DC" />
          {/* Cap main body */}
          <path d="M-2,20 Q18,4 38,20 L33,26 L3,26 Z" fill="#FFFFFF" />
          {/* Clean folded edge */}
          <path d="M2,20 Q18,12 34,20 L31,22 Q18,15 5,22 Z" fill="#ECEFF1" />
          {/* Neat centered Red Cross */}
          <path d="M16,11 L20,11 M18,9 L18,13" stroke={redCross} strokeWidth="2.2" strokeLinecap="square" />
        </g>
      </g>
    );
  };

  // Professional nursing scrubs with clean lines and stethoscope
  const renderTorso = (poseType = 'welcome') => {
    return (
      <g>
        {/* Neck - Dignified proportions */}
        <path d="M132,120 L148,120 L146,142 L134,142 Z" fill="url(#skinGradient)" />
        <path d="M132,120 L148,120 L145,127 L135,127 Z" fill={skinShadow} />

        {/* Scrubs Clothes */}
        <path d="M106,140 C106,140 100,165 98,195 C96,220 98,255 98,255 L182,255 C182,255 184,220 182,195 C180,165 174,140 174,140 Z" fill="url(#scrubsGradient)" />

        {/* V-Neck Styling */}
        <path d="M125,140 L140,158 L155,140" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <path d="M128,140 L140,154 L152,140" fill="none" stroke={scrubsLight} strokeWidth="1.5" />
        <path d="M132,140 L140,149 L148,140" fill="url(#skinGradient)" />

        {/* Pocket and Pen */}
        <path d="M152,168 H166 V186 H152 Z" fill={scrubsDark} opacity="0.4" />
        <line x1="152" y1="168" x2="166" y2="168" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />
        <rect x="156" y="161" width="2.5" height="11" rx="1" fill="#0D47A1" />
        <circle cx="162" cy="166" r="1.5" fill="#FFB300" />

        {/* Stethoscope */}
        <path d="M124,140 Q112,154 114,178 Q116,192 127,198" fill="none" stroke="#546E7A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M156,140 Q168,154 166,178 Q162,194 151,199" fill="none" stroke="#546E7A" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="139" cy="201" r="2.5" fill="#263238" />
        <line x1="139" y1="203" x2="139" y2="212" stroke="#263238" strokeWidth="2" />
        <circle cx="139" cy="214" r="5" fill="#90A4AE" stroke="#37474F" strokeWidth="1.2" />

        {/* ID Badge */}
        <g transform="translate(112, 164)">
          <rect x="0" y="0" width="18" height="13" rx="1.5" fill="#FFFFFF" filter="url(#shadowFilter)" />
          <rect x="2" y="2" width="14" height="2" fill={badgeBlue} />
          <circle cx="4" cy="8" r="1.5" fill="#78909C" />
          <line x1="8" y1="7" x2="15" y2="7" stroke="#90A4AE" strokeWidth="1" />
          <line x1="8" y1="9" x2="13" y2="9" stroke="#CFD8DC" strokeWidth="0.8" />
        </g>
      </g>
    );
  };

  // Dignified pants and white nursing shoes
  const renderLegs = () => {
    return (
      <g>
        {/* Pants */}
        <path d="M102,254 L102,328 C102,331 125,331 125,328 L128,256 Z" fill="url(#scrubsGradient)" />
        <path d="M152,256 L155,328 C155,331 178,331 178,328 L178,254 Z" fill="url(#scrubsGradient)" />
        <path d="M102,325 L125,325 L125,328 L102,328 Z" fill={scrubsDark} opacity="0.3" />
        <path d="M155,325 L178,325 L178,328 L155,328 Z" fill={scrubsDark} opacity="0.3" />

        {/* Nursing Shoes */}
        <g>
          {/* Left Shoe */}
          <path d="M98,336 C98,329 128,329 128,336 C128,339 123,344 113,344 C103,344 98,339 98,336 Z" fill="#FFFFFF" filter="url(#shadowFilter)" />
          <path d="M98,336 C103,339 118,339 128,336 C128,338 123,342 113,342 C103,342 98,338 98,336 Z" fill="#CFD8DC" />
          {/* Right Shoe */}
          <path d="M152,336 C152,329 182,329 182,336 C182,339 177,344 167,344 C157,344 152,339 152,336 Z" fill="#FFFFFF" filter="url(#shadowFilter)" />
          <path d="M152,336 C157,339 172,339 182,336 C182,338 177,342 167,342 C157,342 152,338 152,336 Z" fill="#CFD8DC" />
        </g>
      </g>
    );
  };

  const renderMouth = (type = 'smile') => {
    switch (type) {
      case 'open-smile':
        // Warm, graceful smile showing teeth slightly
        return (
          <g transform="translate(140, 107)">
            <path d="M-6,-2 C-6,-2 0,5 6,-2 C7,-1 7,1 5,3 C2,4 -2,4 -5,3 C-7,1 -7,-1 -6,-2 Z" fill="#C62828" />
            <path d="M-5,-1 Q0,0 5,-1" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          </g>
        );
      case 'worried':
        // Mild, polite worried line (thoughtful, not overly cartoonish)
        return <path d="M132,109 Q140,104 148,108" stroke="#E57373" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
      case 'big-smile':
        return <path d="M130,106 Q140,115 150,106" stroke="#E57373" strokeWidth="2.8" fill="none" strokeLinecap="round" />;
      default: // smile
        return <path d="M132,107 Q140,113 148,107" stroke="#E57373" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
  };

  const renderPose = () => {
    switch (pose) {
      case 'uncertain':
        return (
          <g className="animate-breathe">
            {renderHead(-2.5, 'worry', 'animate-think-sway')}
            {renderMouth('worried')}
            {renderTorso('uncertain')}

            {/* Left Arm - resting calmly in front (Thicker, natural lines: strokeWidth="13.5") */}
            <g>
              <path d="M106,146 C100,154 90,172 88,180 C86,188 94,196 100,192 L112,168" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              <path d="M106,146 C106,146 95,160 92,175 Z" fill="url(#scrubsGradient)" />
              {/* Healthy proportioned hand */}
              <circle cx="100.5" cy="192" r="7" fill={skinColor} />
            </g>

            {/* Right Arm - Hand gently touching the chin (Thicker lines: strokeWidth="13.5") */}
            <g>
              <path d="M174,146 L185,165" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              <path d="M174,146 C174,146 182,156 188,172 Z" fill="url(#scrubsGradient)" />
              {/* Forearm curving up to chin */}
              <path d="M185,165 Q180,148 160,121" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              {/* Hand gently placed on chin */}
              <circle cx="158" cy="119" r="8" fill={skinColor} />
              <circle cx="154" cy="117" r="6" fill={skinColor} />
            </g>

            {/* Elegant Question Mark with float-bounce animation */}
            <g className="animate-float" transform="translate(15, -15)">
              <path d="M190,60 C190,53 198,51 201,56 C202.5,60 199,65 196,67 L196,71" fill="none" stroke={scrubsColor} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="196" cy="76" r="1.5" fill={scrubsColor} />
            </g>

            {renderLegs()}
          </g>
        );

      case 'confident':
        return (
          <g className="animate-breathe">
            {renderHead(0, 'calm')}
            {renderMouth('smile')}
            {renderTorso('confident')}

            {/* Professional Chinese standard nurse pose - hands gently overlapped in front (Thicker, natural lines) */}
            <g>
              {/* Left sleeve & forearm */}
              <path d="M106,146 C106,146 94,164 92,176 Z" fill="url(#scrubsGradient)" />
              <path d="M102,156 Q85,182 120,188" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              
              {/* Right sleeve & forearm */}
              <path d="M174,146 C174,146 186,164 188,176 Z" fill="url(#scrubsGradient)" />
              <path d="M178,156 Q195,182 136,188" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />

              {/* Hands neatly clasped at the waist (larger, proportional) */}
              <ellipse cx="127" cy="188" rx="8.5" ry="6.5" fill={skinColor} />
              <ellipse cx="133" cy="188" rx="8.5" ry="6.5" fill={skinColor} />
            </g>

            {renderLegs()}
          </g>
        );

      case 'celebrating':
        return (
          <g className="animate-celebrate-bob">
            {renderHead(1.5, 'happy')}
            {renderMouth('open-smile')}
            {renderTorso('celebrating')}

            {/* Dignified celebration - one hand encouragingly raised, other holding certificate (Thicker arms/hands) */}
            {/* Left Arm - Holding a neat completion certificate */}
            <g>
              <path d="M106,146 Q92,168 96,192" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              <path d="M106,146 C106,146 96,160 92,175 Z" fill="url(#scrubsGradient)" />
              <circle cx="97" cy="195" r="7.5" fill={skinColor} />

              {/* Certificate */}
              <g transform="translate(64, 185) rotate(-10)" filter="url(#shadowFilter)">
                <rect x="0" y="0" width="32" height="22" rx="1.5" fill="#FFFFFF" stroke="#FFB300" strokeWidth="1" />
                <rect x="3" y="3" width="26" height="16" fill="none" stroke="#FFE082" strokeWidth="0.8" />
                {/* Red stamp */}
                <circle cx="23" cy="11" r="3" fill="#E53935" opacity="0.75" />
                <line x1="6" y1="7" x2="18" y2="7" stroke="#B0BEC5" strokeWidth="1" />
                <line x1="6" y1="11" x2="15" y2="11" stroke="#B0BEC5" strokeWidth="1" />
                <line x1="6" y1="15" x2="18" y2="15" stroke="#B0BEC5" strokeWidth="1" />
              </g>
            </g>

            {/* Right Arm - Holding thumbs up with grace */}
            <g>
              <path d="M174,146 Q194,164 190,188" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              <path d="M174,146 C174,146 184,160 188,175 Z" fill="url(#scrubsGradient)" />
              {/* Hand */}
              <circle cx="189" cy="191" r="8" fill={skinColor} />
              {/* Thumbs up */}
              <path d="M189,191 L189,182" stroke={skinColor} strokeWidth="5.5" strokeLinecap="round" />
            </g>

            {/* Elegant celebration sparkles with sparkling keyframe */}
            <g className="animate-sparkle">
              <path d="M60,60 L62,64 L66,65 L63,68 L64,72 L60,70 L56,72 L57,68 L54,65 L58,64 Z" fill="#FFC107" />
              <path d="M220,60 L222,64 L226,65 L223,68 L224,72 L220,70 L216,72 L217,68 L214,65 L218,64 Z" fill="#FFC107" />
            </g>

            {renderLegs()}
          </g>
        );

      case 'looking-up':
        return (
          <g className="animate-breathe">
            {/* Head tilted up-right toward preceptor */}
            {renderHead(8, 'looking-up', 'animate-look-up')}
            {renderMouth('worried')}
            {renderTorso('uncertain')}

            {/* Left Arm - hanging slightly tense at side */}
            <g>
              <path d="M106,146 C106,146 95,160 92,175 Z" fill="url(#scrubsGradient)" />
              <path d="M102,156 Q90,185 92,208" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              <circle cx="92" cy="212" r="7" fill={skinColor} />
            </g>

            {/* Right Arm - slightly raised, open hand toward preceptor direction */}
            <g>
              <path d="M174,146 C174,146 184,158 188,170 Z" fill="url(#scrubsGradient)" />
              <path d="M184,155 Q198,145 208,130" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              {/* Open hand, palm slightly up — nervous, attentive */}
              <ellipse cx="211" cy="126" rx="7" ry="9" fill={skinColor} transform="rotate(25, 211, 126)" />
              <ellipse cx="215" cy="124" rx="3.5" ry="8" fill={skinColor} transform="rotate(25, 215, 124)" opacity="0.85" />
            </g>

            {renderLegs()}
          </g>
        );

      case 'anxious':
        return (
          <g className="animate-breathe">
            {/* Head slightly bowed — self-doubt, withdrawn */}
            {renderHead(-3, 'anxious', 'animate-anxious-sway')}
            {renderMouth('worried')}
            {renderTorso('uncertain')}

            {/* Sweat drop — floating beside head */}
            <g className="animate-sweat">
              <path
                d="M195,52 Q198,44 201,52 Q201,58 198,59 Q195,58 195,52 Z"
                fill="#90CAF9" opacity="0.85"
              />
            </g>

            {/* Left Arm - folded across chest (self-hugging, anxious) */}
            <g>
              <path d="M106,146 C100,152 96,162 98,175 Z" fill="url(#scrubsGradient)" />
              <path d="M100,160 Q108,172 140,172" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              {/* Hand resting on right arm */}
              <circle cx="143" cy="172" r="7.5" fill={skinColor} />
              <ellipse cx="148" cy="170" rx="5" ry="6.5" fill={skinColor} />
            </g>

            {/* Right Arm - bent up, fist lightly pressed to chest (doubting gesture) */}
            <g>
              <path d="M174,146 C178,152 180,162 178,172 Z" fill="url(#scrubsGradient)" />
              <path d="M178,158 Q172,150 158,140" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              {/* Closed fist at chest */}
              <circle cx="155" cy="137" r="8" fill={skinColor} />
              <ellipse cx="150" cy="135" rx="5" ry="6" fill={skinColor} />
            </g>

            {renderLegs()}
          </g>
        );

      case 'welcome':
      default:
        return (
          <g className="animate-breathe">
            {renderHead(1, 'calm')}
            {renderMouth('smile')}
            {renderTorso('welcome')}

            {/* Left Arm - resting at side (proportional, strokeWidth="13.5") */}
            <g>
              <path d="M106,146 C106,146 95,160 92,175 Z" fill="url(#scrubsGradient)" />
              <path d="M102,156 Q94,185 96,208" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
              <circle cx="96" cy="212" r="7" fill={skinColor} />
            </g>

            {/* Right Arm - Waving/Presenting gracefully (like an elegant flight attendant/hostess guide hand) */}
            <g>
              <path d="M174,146 C174,146 184,160 188,175 Z" fill="url(#scrubsGradient)" />
              {/* Dynamic Wave Rotation */}
              <g className="animate-wave">
                {/* Arm pointing gracefully upwards-outwards (strokeWidth="13.5") */}
                <path d="M184,156 Q200,146 214,124" stroke="url(#skinGradient)" strokeWidth="13.5" fill="none" strokeLinecap="round" />
                {/* Poised hand - fingers neatly grouped together (enlarged for balance) */}
                <ellipse cx="218" cy="119" rx="7" ry="9" fill={skinColor} transform="rotate(30, 218, 119)" />
                <ellipse cx="221" cy="119" rx="3.5" ry="8.5" fill={skinColor} transform="rotate(30, 221, 119)" opacity="0.8" />
              </g>
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
          {/* Shadow Filter */}
          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.8" floodColor="#04284B" floodOpacity="0.1" />
          </filter>

          {/* Elegant Skin Shading */}
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skinColor} />
            <stop offset="100%" stopColor={skinShadow} />
          </linearGradient>

          {/* Professional Chinese Eye Color (Warm brown-black) */}
          <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#211A1E" />
            <stop offset="70%" stopColor="#4A3B32" />
            <stop offset="100%" stopColor="#6E554F" />
          </linearGradient>

          {/* Scrubs Shading (Dignified Emerald Teal) */}
          <linearGradient id="scrubsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={scrubsColor} />
            <stop offset="100%" stopColor={scrubsDark} />
          </linearGradient>
        </defs>

        <style>{`
          /* Waving animation for welcome pose (Increased amplitude and slightly faster) */
          @keyframes wave {
            0%, 100% { transform: rotate(-12deg); transform-origin: 184px 156px; }
            50% { transform: rotate(16deg); transform-origin: 184px 156px; }
          }
          .animate-wave { animation: wave 1.8s ease-in-out infinite; }

          /* Floating effect for question marks */
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-float { animation: float 2.4s ease-in-out infinite; }

          /* Sparkle effect for celebrating pose */
          @keyframes sparkle {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(0.65); transform-origin: center; }
          }
          .animate-sparkle { animation: sparkle 1.5s ease-in-out infinite; }

          /* Global gentle breathing loop (for welcome, confident, uncertain poses - more pronounced) */
          @keyframes breathe {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.025) translateY(-3.5px); transform-origin: bottom center; }
          }
          .animate-breathe { animation: breathe 3.5s ease-in-out infinite; }

          /* Swaying head animation in thought pose (More noticeable head tilt) */
          @keyframes think-sway {
            0%, 100% { transform: rotate(-4.5deg); transform-origin: 140px 90px; }
            50% { transform: rotate(4.5deg); transform-origin: 140px 90px; }
          }
          .animate-think-sway { animation: think-sway 2.6s ease-in-out infinite; }

          /* Look-up animation — subtle upward head lift toward preceptor */
          @keyframes look-up {
            0%, 100% { transform: rotate(6deg); transform-origin: 140px 90px; }
            50% { transform: rotate(10deg); transform-origin: 140px 90px; }
          }
          .animate-look-up { animation: look-up 2.8s ease-in-out infinite; }

          /* Anxious sway — slight back-and-forth with low amplitude */
          @keyframes anxious-sway {
            0%, 100% { transform: rotate(-5deg); transform-origin: 140px 90px; }
            50% { transform: rotate(-2deg); transform-origin: 140px 90px; }
          }
          .animate-anxious-sway { animation: anxious-sway 2.2s ease-in-out infinite; }

          /* Sweat drop drip animation */
          @keyframes sweat-drip {
            0% { transform: translateY(-6px); opacity: 0; }
            30% { opacity: 1; }
            80% { transform: translateY(4px); opacity: 0.9; }
            100% { transform: translateY(8px); opacity: 0; }
          }
          .animate-sweat { animation: sweat-drip 2.0s ease-in 0.4s infinite; }

          /* Happy bobbing effect for celebration (More energetic jump) */
          @keyframes celebrate-bob {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-14px) scale(1.04); transform-origin: bottom center; }
          }
          .animate-celebrate-bob { animation: celebrate-bob 1.5s ease-in-out infinite; }
        `}</style>

        {renderPose()}
      </svg>
    </div>
  );
}

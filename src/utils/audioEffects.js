// Web Audio API sound synthesizer for Growth Mindset module interaction
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function checkMuted() {
  if (typeof window === 'undefined') return true;
  const localMuted = localStorage.getItem('gmi_audio_muted') === 'true';
  return localMuted || !!window.gmi_audio_muted;
}

export function playClick() {
  if (checkMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Cleansed, pronounced pop click sound
  osc.type = 'sine';
  osc.frequency.setValueAtTime(420, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

// playSuccess — Synthesized chime chime chords (For quiz correct check, polite and encouraging)
export function playSuccess() {
  if (checkMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  // Uplifting chord progression: C5 -> E5 -> G5 (triangle wave, pleasant and clear)
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const duration = 0.35;
  
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06);

    const startTime = ctx.currentTime + index * 0.06;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

// playApplause — Plays the downloaded crowd cheering & applause mp3 (Strictly for module completion summary)
export function playApplause() {
  if (checkMuted()) return;
  if (typeof window === 'undefined') return;

  const audio = new Audio('/audio/success.mp3');
  audio.volume = 0.5;
  audio.play().catch((err) => {
    console.log('Audio file playback failed, falling back to synthesized chime:', err);
    playSuccess();
  });
}

export function playError() {
  if (checkMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Soft low tone warning beep
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.setValueAtTime(130, ctx.currentTime + 0.12);

  gainNode.gain.setValueAtTime(0.22, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

  osc.start();
  osc.stop(ctx.currentTime + 0.16);
}

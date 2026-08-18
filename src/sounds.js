let audioCtx = null;

// Resuming a suspended AudioContext is async. Scheduling oscillators against
// ctx.currentTime *before* resume() finishes computes times against a frozen
// clock, so the notes can end up scheduled in the past and never actually
// sound. Awaiting resume() first guarantees the context is really running.
async function getAudioContext() {
  const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextImpl) return null;

  try {
    if (!audioCtx) {
      audioCtx = new AudioContextImpl();
    }
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    return audioCtx;
  } catch (error) {
    console.error('Web Audio unavailable:', error);
    return null;
  }
}

function playTone(ctx, { frequency, startTime, duration, type = 'sine', peakGain = 0.2 }) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

// Unlocks the AudioContext inside a real user gesture (the mic tap) so later
// programmatic sound playback isn't blocked by autoplay policies.
export async function primeAudio() {
  await getAudioContext();
}

export async function playCorrectSound() {
  const ctx = await getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 — bright ascending chime
  notes.forEach((frequency, i) => {
    playTone(ctx, {
      frequency,
      startTime: now + i * 0.09,
      duration: 0.22,
      type: 'sine',
      peakGain: 0.22,
    });
  });
}

export async function playWrongSound() {
  const ctx = await getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  // Two short descending low tones — a gentle "buzzer"
  playTone(ctx, { frequency: 196, startTime: now, duration: 0.16, type: 'square', peakGain: 0.16 });
  playTone(ctx, { frequency: 147, startTime: now + 0.13, duration: 0.22, type: 'square', peakGain: 0.16 });
}

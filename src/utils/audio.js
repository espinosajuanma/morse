let audioCtx = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const supportsVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

export const getMorseDuration = (code, wpm = 15) => {
  const dotDuration = 1.2 / wpm;
  const dashDuration = dotDuration * 3;
  const elementSpace = dotDuration;
  let total = 0;

  for (let char of code.split('')) {
    total += (char === '.' ? dotDuration : dashDuration) + elementSpace;
  }

  return Math.round(total * 1000);
};

export const vibrateMorse = (code) => {
  if (!supportsVibrate) {
    return 0;
  }

  const dotMs = 50;
  const dashMs = 150;
  const gapMs = 50;
  const pattern = [];

  code.split('').forEach((char, index) => {
    pattern.push(char === '.' ? dotMs : dashMs);
    if (index !== code.length - 1) {
      pattern.push(gapMs);
    }
  });

  navigator.vibrate(pattern);
  return pattern.reduce((sum, value) => sum + value, 0);
};

/**
 * Plays a morse sequence with standardized WPM timing and a smoothed audio envelope.
 * @param {string} code - The morse string (e.g. ".-")
 * @param {function} onEnded - Callback when the audio finishes
 * @param {number} wpm - Words Per Minute (speed)
 * @param {number} frequency - Pitch of the tone in Hz
 */
export const playMorseSequence = (code, onEnded, wpm = 15, frequency = 600) => {
  const ctx = initAudio();
  const dotDuration = 1.2 / wpm;
  const dashDuration = dotDuration * 3;
  const elementSpace = dotDuration;
  let time = ctx.currentTime + 0.05;

  for (let char of code.split('')) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = frequency * 2;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = frequency;

    const duration = char === '.' ? dotDuration : dashDuration;

    gain.gain.setValueAtTime(0, time);
    gain.gain.setTargetAtTime(1, time, 0.005);
    gain.gain.setTargetAtTime(0, time + duration - 0.01, 0.005);

    osc.start(time);
    osc.stop(time + duration + 0.05);

    time += duration + elementSpace;
  }

  vibrateMorse(code);

  if (onEnded) {
    const totalDurationMs = (time - ctx.currentTime) * 1000;
    setTimeout(onEnded, totalDurationMs);
  }
};

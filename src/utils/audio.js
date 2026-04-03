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

/**
 * Plays a morse sequence with standardized WPM timing and a smoothed audio envelope.
 * @param {string} code - The morse string (e.g. ".-")
 * @param {function} onEnded - Callback when the audio finishes
 * @param {number} wpm - Words Per Minute (speed)
 * @param {number} frequency - Pitch of the tone in Hz
 */
export const playMorseSequence = (code, onEnded, wpm = 15, frequency = 600) => {
  const ctx = initAudio();
  
  // Standard Morse timing math based on WPM
  const dotDuration = 1.2 / wpm; 
  const dashDuration = dotDuration * 3;
  const elementSpace = dotDuration; // Space between dots/dashes in the same letter
  
  // Start slightly in the future to prevent audio glitches on the first note
  let time = ctx.currentTime + 0.05; 

  code.split('').forEach((char) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Add a lowpass filter for a "warmer", less harsh radio sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency * 2; // Cut off harsh high harmonics

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.value = frequency;

    const duration = char === '.' ? dotDuration : dashDuration;

    // --- Smoothed Envelope (Attack/Release) ---
    // Start at volume 0
    gain.gain.setValueAtTime(0, time);
    
    // Attack: Rise to volume 1 quickly but smoothly (time constant: 0.005)
    gain.gain.setTargetAtTime(1, time, 0.005); 
    
    // Release: Fade back to 0 just before the note ends
    gain.gain.setTargetAtTime(0, time + duration - 0.01, 0.005);

    osc.start(time);
    // Stop the oscillator slightly after the release fade finishes to prevent abrupt cuts
    osc.stop(time + duration + 0.05); 

    // Advance the time marker for the next dot/dash
    time += duration + elementSpace;
  });

  // Calculate total sequence duration and fire the callback
  if (onEnded) {
    const totalDurationMs = (time - ctx.currentTime) * 1000;
    setTimeout(onEnded, totalDurationMs);
  }
};
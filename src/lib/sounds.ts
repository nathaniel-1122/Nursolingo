type WaveType = "sine" | "square" | "triangle" | "sawtooth";

let audioCtx: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let compressorNode: DynamicsCompressorNode | null = null;
let masterVolume = 0.7;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function getMasterOutput(): GainNode {
  const ctx = getAudioContext();

  if (!compressorNode) {
    compressorNode = ctx.createDynamicsCompressor();
    compressorNode.threshold.value = -24;
    compressorNode.knee.value = 30;
    compressorNode.ratio.value = 12;
    compressorNode.attack.value = 0.003;
    compressorNode.release.value = 0.25;
    compressorNode.connect(ctx.destination);
  }

  if (!masterGainNode) {
    masterGainNode = ctx.createGain();
    masterGainNode.gain.value = masterVolume;
    masterGainNode.connect(compressorNode);
  }

  return masterGainNode;
}

export function setMasterVolume(volume: number): void {
  masterVolume = Math.max(0, Math.min(1, volume));
  if (masterGainNode) {
    masterGainNode.gain.value = masterVolume;
  }
}

function playToneSwept(
  startFreq: number,
  endFreq: number,
  duration: number,
  type: WaveType,
  volume: number,
  delay = 0,
  attackTime = 0.005,
  filterCutoff: number | null = null,
  detuneCents = 0,
): void {
  const ctx = getAudioContext();
  const master = getMasterOutput();
  const t = ctx.currentTime + delay;

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, t);
  if (endFreq !== startFreq) {
    osc.frequency.exponentialRampToValueAtTime(
      endFreq,
      t + duration * 0.3,
    );
  }
  if (detuneCents !== 0) {
    osc.detune.setValueAtTime(detuneCents, t);
  }

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + attackTime);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  if (filterCutoff !== null) {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterCutoff, t);
    filter.Q.setValueAtTime(1, t);
    osc.connect(filter);
    filter.connect(gain);
  } else {
    osc.connect(gain);
  }

  gain.connect(master);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

function playNoiseTransient(
  centerFreq: number,
  q: number,
  duration: number,
  volume: number,
  delay = 0,
): void {
  const ctx = getAudioContext();
  const master = getMasterOutput();
  const t = ctx.currentTime + delay;
  const sampleCount = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < sampleCount; i++) {
    data[i] =
      (Math.random() * 2 - 1) * Math.exp(-i / (sampleCount * 0.15));
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(centerFreq, t);
  bandpass.Q.setValueAtTime(q, t);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  source.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(master);
  source.start(t);
}

function playNoiseSweep(
  startFreq: number,
  endFreq: number,
  duration: number,
  q: number,
  volume: number,
  delay = 0,
): void {
  const ctx = getAudioContext();
  const master = getMasterOutput();
  const t = ctx.currentTime + delay;
  const sampleCount = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  const mid = sampleCount / 2;
  for (let i = 0; i < sampleCount; i++) {
    const envelope =
      i < mid
        ? i / mid
        : (sampleCount - i) / (sampleCount - mid);
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(startFreq, t);
  bandpass.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
  bandpass.Q.setValueAtTime(q, t);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t);

  source.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(master);
  source.start(t);
  source.stop(t + duration + 0.05);
}

function playNoiseExhale(
  centerFreq: number,
  q: number,
  duration: number,
  volume: number,
  delay = 0,
): void {
  const ctx = getAudioContext();
  const master = getMasterOutput();
  const t = ctx.currentTime + delay;
  const sampleCount = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < sampleCount; i++) {
    const envelope = 1 - i / sampleCount;
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(centerFreq, t);
  bandpass.Q.setValueAtTime(q, t);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.linearRampToValueAtTime(0, t + duration);

  source.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(master);
  source.start(t);
  source.stop(t + duration + 0.05);
}

export const SoundEffects = {
  correct(): void {
    playNoiseTransient(3000, 2, 0.008, 0.12);
    playToneSwept(780, 880, 0.12, "sine", 0.22, 0, 0.005);
    playToneSwept(780, 880, 0.12, "triangle", 0.08, 0, 0.005, 2000);
    playToneSwept(1200, 1320, 0.16, "sine", 0.24, 0.055, 0.005);
    playToneSwept(1200, 1320, 0.16, "sine", 0.06, 0.055, 0.005, null, 8);
    playToneSwept(2640, 2640, 0.08, "sine", 0.03, 0.055, 0.003);
  },

  wrong(): void {
    playNoiseTransient(1500, 1.5, 0.015, 0.06);
    playToneSwept(400, 320, 0.14, "sine", 0.12, 0, 0.008, 1800);
    playToneSwept(200, 160, 0.12, "sine", 0.04, 0, 0.01, 800);
  },

  reveal(): void {
    playNoiseSweep(4000, 1200, 0.2, 1.5, 0.05);
    playToneSwept(523, 440, 0.22, "triangle", 0.10, 0.03, 0.015, 2200);
    playToneSwept(330, 330, 0.25, "sine", 0.04, 0.03, 0.02);
    playToneSwept(1320, 1320, 0.10, "sine", 0.02, 0.03, 0.005);
  },

  comboWarm(): void {
    playNoiseTransient(4000, 3, 0.006, 0.06);
    playToneSwept(620, 659, 0.10, "triangle", 0.16, 0, 0.005);
    playToneSwept(620, 659, 0.10, "triangle", 0.08, 0, 0.005, null, 6);
    playToneSwept(830, 880, 0.15, "triangle", 0.20, 0.07, 0.005);
    playToneSwept(830, 880, 0.15, "triangle", 0.10, 0.07, 0.005, null, -5);
  },

  comboHot(): void {
    playNoiseTransient(4500, 3, 0.008, 0.08);
    playToneSwept(620, 659, 0.08, "triangle", 0.16, 0, 0.005);
    playToneSwept(620, 659, 0.08, "triangle", 0.08, 0, 0.005, null, 7);
    playToneSwept(830, 880, 0.09, "triangle", 0.20, 0.055, 0.005);
    playToneSwept(830, 880, 0.09, "triangle", 0.10, 0.055, 0.005, null, -6);
    playToneSwept(1020, 1109, 0.16, "triangle", 0.24, 0.11, 0.005);
    playToneSwept(1020, 1109, 0.16, "triangle", 0.10, 0.11, 0.005, null, 8);
    playToneSwept(1109, 1109, 0.12, "sawtooth", 0.03, 0.11, 0.005, 3000);
  },

  comboFire(): void {
    playNoiseTransient(5000, 2.5, 0.010, 0.10);

    playToneSwept(620, 659, 0.07, "triangle", 0.15, 0, 0.005);
    playToneSwept(659, 659, 0.06, "sawtooth", 0.04, 0, 0.005, 3500);

    playToneSwept(830, 880, 0.06, "triangle", 0.20, 0.05, 0.005);
    playToneSwept(880, 880, 0.05, "sawtooth", 0.06, 0.05, 0.005, 3500);

    playToneSwept(1020, 1109, 0.05, "triangle", 0.26, 0.095, 0.005);
    playToneSwept(1109, 1109, 0.04, "sawtooth", 0.08, 0.095, 0.005, 4000);

    playToneSwept(1220, 1320, 0.20, "triangle", 0.32, 0.14, 0.005);
    playToneSwept(1320, 1320, 0.18, "sawtooth", 0.10, 0.14, 0.005, 4500);
    playToneSwept(1220, 1320, 0.20, "triangle", 0.12, 0.14, 0.005, null, -8);

    playNoiseSweep(2000, 6000, 0.15, 1.5, 0.05, 0.14);

    // G5 bridge primes the ear for comboLegendary's C major
    playToneSwept(784, 784, 0.12, "sine", 0.03, 0.28, 0.01);
  },

  comboLegendary(): void {
    // Bass foundation spanning the whole sequence
    playToneSwept(131, 131, 0.6, "sine", 0.06, 0, 0.02);

    // Chord 1: C5-E5-G5
    playToneSwept(490, 523, 0.12, "sine", 0.10, 0, 0.005);
    playToneSwept(625, 659, 0.12, "sine", 0.10, 0, 0.005);
    playToneSwept(745, 784, 0.12, "sine", 0.10, 0, 0.005);

    // Chord 2: E5-G5-C6
    playToneSwept(625, 659, 0.14, "sine", 0.13, 0.09, 0.005);
    playToneSwept(745, 784, 0.14, "sine", 0.13, 0.09, 0.005);
    playToneSwept(1000, 1047, 0.14, "sine", 0.13, 0.09, 0.005);

    // Chord 3: G5-C6-E6
    playToneSwept(745, 784, 0.16, "sine", 0.16, 0.18, 0.005);
    playToneSwept(1000, 1047, 0.16, "sine", 0.16, 0.18, 0.005);
    playToneSwept(1250, 1320, 0.16, "sine", 0.16, 0.18, 0.005);

    // Chord 4: C6-E6-G6 (peak) with detuned width pairs
    playToneSwept(1000, 1047, 0.35, "sine", 0.22, 0.27, 0.005);
    playToneSwept(1250, 1320, 0.35, "sine", 0.22, 0.27, 0.005);
    playToneSwept(1490, 1568, 0.35, "sine", 0.22, 0.27, 0.005);
    playToneSwept(1000, 1047, 0.35, "sine", 0.08, 0.27, 0.005, null, 5);
    playToneSwept(1250, 1320, 0.35, "sine", 0.08, 0.27, 0.005, null, -5);

    // Rising shimmer with chorus
    playToneSwept(1568, 1760, 0.45, "triangle", 0.08, 0.27, 0.01);
    playToneSwept(1568, 1760, 0.45, "triangle", 0.04, 0.27, 0.01, null, 5);

    // Confetti noise bloom
    playNoiseSweep(3000, 8000, 0.4, 1.5, 0.03, 0.27);
  },

  victory(): void {
    // Arpeggio in G major: G5-B5-D6-G6 with accelerating rhythm
    playToneSwept(740, 784, 0.08, "sine", 0.16, 0, 0.005);
    playToneSwept(940, 988, 0.07, "sine", 0.20, 0.07, 0.005);
    playToneSwept(1120, 1175, 0.06, "sine", 0.25, 0.125, 0.005);
    playToneSwept(1490, 1568, 0.18, "sine", 0.30, 0.17, 0.005);

    // Final chord: G6-B6-D7
    playToneSwept(1568, 1568, 0.35, "sine", 0.18, 0.40, 0.005);
    playToneSwept(1976, 1976, 0.35, "sine", 0.14, 0.40, 0.005);
    playToneSwept(2349, 2349, 0.30, "sine", 0.10, 0.40, 0.005);
    playToneSwept(1568, 1568, 0.35, "triangle", 0.06, 0.40, 0.005);
    playToneSwept(1568, 1568, 0.35, "sine", 0.06, 0.40, 0.005, null, 6);

    // Sparkle pings staggered during chord
    playToneSwept(3136, 3136, 0.06, "sine", 0.02, 0.42, 0.003);
    playToneSwept(3952, 3952, 0.05, "sine", 0.02, 0.45, 0.003);
    playToneSwept(4699, 4699, 0.04, "sine", 0.015, 0.48, 0.003);

    playNoiseTransient(4000, 2, 0.012, 0.08, 0.40);
  },

  sessionComplete(): void {
    // Melody: C5-E5-G5-C6-G5-C6-E6 with accelerating tempo and crescendo
    const melody: Array<[number, number, number, number]> = [
      [490, 523, 0.10, 0.14],
      [625, 659, 0.10, 0.16],
      [745, 784, 0.09, 0.18],
      [1000, 1047, 0.09, 0.21],
      [745, 784, 0.08, 0.18],
      [1000, 1047, 0.07, 0.24],
      [1250, 1320, 0.15, 0.28],
    ];
    const delays = [0, 0.09, 0.17, 0.24, 0.31, 0.37, 0.43];

    for (let i = 0; i < melody.length; i++) {
      const [start, end, dur, vol] = melody[i];
      playToneSwept(start, end, dur, "sine", vol, delays[i], 0.005);
      playToneSwept(start, end, dur, "triangle", vol * 0.4, delays[i], 0.005, 2500);
    }

    // Passing tone D6 between final C6 and E6
    playToneSwept(1130, 1175, 0.04, "sine", 0.10, 0.40, 0.005);

    // IV chord (F major) pre-resolution
    playToneSwept(349, 349, 0.12, "sine", 0.10, 0.60, 0.008);
    playToneSwept(440, 440, 0.12, "sine", 0.10, 0.60, 0.008);
    playToneSwept(523, 523, 0.12, "sine", 0.10, 0.60, 0.008);

    // Final C major chord (richest sound in the system)
    playToneSwept(1047, 1047, 0.50, "sine", 0.20, 0.72, 0.005);
    playToneSwept(1320, 1320, 0.50, "sine", 0.18, 0.72, 0.005);
    playToneSwept(1568, 1568, 0.50, "sine", 0.16, 0.72, 0.005);
    playToneSwept(1047, 1047, 0.50, "sine", 0.07, 0.72, 0.005, null, 5);
    playToneSwept(1320, 1320, 0.50, "sine", 0.07, 0.72, 0.005, null, -5);
    playToneSwept(1568, 1568, 0.50, "triangle", 0.06, 0.72, 0.005);
    playToneSwept(262, 262, 0.40, "sine", 0.05, 0.72, 0.01);

    // High shimmer
    playToneSwept(2093, 2093, 0.50, "triangle", 0.05, 0.72, 0.01);

    // Settling pitch bend
    playToneSwept(2093, 1976, 0.50, "triangle", 0.03, 0.72, 0.02, null, 3);

    // Noise bloom
    playNoiseSweep(3000, 10000, 0.4, 1.5, 0.03, 0.72);
  },

  streakMilestone(): void {
    // Chord 1: G major (V) -- staccato stab
    playToneSwept(196, 196, 0.18, "sine", 0.10, 0, 0.005);
    playToneSwept(392, 392, 0.12, "triangle", 0.10, 0, 0.005);
    playToneSwept(494, 494, 0.12, "triangle", 0.10, 0, 0.005);
    playToneSwept(587, 587, 0.12, "triangle", 0.10, 0, 0.005);
    playNoiseTransient(3000, 2, 0.005, 0.05);

    // Chord 2: C major (I)
    playToneSwept(262, 262, 0.20, "sine", 0.13, 0.14, 0.005);
    playToneSwept(523, 523, 0.15, "triangle", 0.13, 0.14, 0.005);
    playToneSwept(659, 659, 0.15, "triangle", 0.13, 0.14, 0.005);
    playToneSwept(784, 784, 0.15, "triangle", 0.13, 0.14, 0.005);
    playToneSwept(523, 523, 0.15, "triangle", 0.05, 0.14, 0.005, null, 5);
    playNoiseTransient(3500, 2, 0.006, 0.06, 0.14);

    // Chord 3: Am (vi) -- widest voicing
    playToneSwept(220, 220, 0.35, "sine", 0.08, 0.29, 0.005);
    playToneSwept(440, 440, 0.30, "triangle", 0.16, 0.29, 0.005);
    playToneSwept(523, 523, 0.30, "triangle", 0.16, 0.29, 0.005);
    playToneSwept(659, 659, 0.30, "triangle", 0.16, 0.29, 0.005);
    playToneSwept(440, 440, 0.30, "triangle", 0.06, 0.29, 0.005, null, 5);
    playToneSwept(659, 659, 0.30, "triangle", 0.06, 0.29, 0.005, null, -5);
    playNoiseTransient(4000, 2, 0.008, 0.08, 0.29);
  },

  xpGain(): void {
    playNoiseTransient(5000, 4, 0.004, 0.08);
    playToneSwept(1760, 880, 0.07, "triangle", 0.15, 0, 0.003);
    playToneSwept(3520, 1760, 0.05, "sine", 0.04, 0, 0.003, null, 12);
    playToneSwept(2640, 1320, 0.05, "triangle", 0.06, 0.025, 0.003);
  },

  buttonTap(): void {
    playNoiseTransient(3500, 2.5, 0.006, 0.08);
    playToneSwept(1200, 880, 0.025, "triangle", 0.06, 0.003, 0.002, 2000);
  },

  comboBreak(): void {
    playToneSwept(660, 330, 0.18, "sine", 0.08, 0, 0.015, 1200);
    playNoiseExhale(1000, 0.8, 0.15, 0.03);
  },

  cardTransition(): void {
    playNoiseSweep(1500, 3000, 0.15, 1.0, 0.04);
    playToneSwept(600, 800, 0.08, "sine", 0.03, 0.02, 0.01, 1500);
  },

  submitTap(): void {
    playNoiseTransient(3000, 2, 0.010, 0.10);
    playToneSwept(1000, 660, 0.05, "triangle", 0.08, 0.005, 0.003, 2200);
    playToneSwept(330, 330, 0.03, "sine", 0.04, 0.005, 0.005, 800);
  },
} as const;

export type SoundName = keyof typeof SoundEffects;

export const SOUND_CATEGORIES = {
  answers: {
    label: "Answer Feedback",
    description: "Correct and wrong answer sounds",
    sounds: ["correct", "wrong", "reveal"] as SoundName[],
  },
  combos: {
    label: "Combo Streaks",
    description: "Escalating chimes as your streak grows",
    sounds: [
      "comboWarm",
      "comboHot",
      "comboFire",
      "comboLegendary",
      "comboBreak",
    ] as SoundName[],
  },
  celebrations: {
    label: "Celebrations",
    description: "Victory fanfares and session complete",
    sounds: [
      "victory",
      "sessionComplete",
      "streakMilestone",
      "xpGain",
    ] as SoundName[],
  },
  ui: {
    label: "UI Sounds",
    description: "Button taps and navigation",
    sounds: ["buttonTap", "submitTap", "cardTransition"] as SoundName[],
  },
} as const;

export type SoundCategory = keyof typeof SOUND_CATEGORIES;

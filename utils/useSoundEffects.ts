"use client";

function playTone(context: AudioContext, frequency: number, start: number, duration: number, type: OscillatorType = "sine", volume = 0.16) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playNoiseBurst(context: AudioContext, start: number, duration: number, volume = 0.1) {
  const bufferSize = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < bufferSize; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / bufferSize);
  }

  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(context.destination);
  source.start(start);
}

function bendTone(context: AudioContext, start: number, from: number, to: number, duration: number, type: OscillatorType = "sine", volume = 0.14) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(from, start);
  oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

export function useSoundEffects(muted = false) {
  const getContext = () => {
    if (muted || typeof window === "undefined") {
      return null;
    }

    const audioWindow = window as Window & {
      AudioContext?: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };
    const AudioContextConstructor = audioWindow.AudioContext || audioWindow.webkitAudioContext;
    return AudioContextConstructor ? new AudioContextConstructor() : null;
  };

  const playPop = () => {
    const context = getContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    playTone(context, 520, now, 0.08, "triangle", 0.13);
    playTone(context, 880, now + 0.07, 0.12, "sine", 0.16);
  };

  const playClap = () => {
    const context = getContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    [0, 0.08, 0.16].forEach((offset) => {
      playNoiseBurst(context, now + offset, 0.045, 0.12);
      playTone(context, 880, now + offset, 0.045, "square", 0.08);
    });
  };

  const playCheer = () => {
    const context = getContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    [392, 523, 659, 784].forEach((frequency, index) => {
      playTone(context, frequency, now + index * 0.08, 0.16, "triangle", 0.11);
    });
  };

  const playSparkle = () => {
    const context = getContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    [1046, 1318, 1568, 2093].forEach((frequency, index) => {
      playTone(context, frequency, now + index * 0.055, 0.12, "sine", 0.1);
    });
  };

  const playBuzzer = () => {
    const context = getContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    playTone(context, 150, now, 0.16, "sawtooth", 0.09);
    playTone(context, 115, now + 0.08, 0.14, "sawtooth", 0.08);
  };

  const playSoftBoop = () => {
    const context = getContext();
    if (!context) {
      return;
    }

    playTone(context, 320, context.currentTime, 0.09, "sine", 0.09);
  };

  const playAnimalSound = (sound: string) => {
    const context = getContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    const key = sound.toLowerCase();

    if (key.includes("moo")) {
      bendTone(context, now, 170, 92, 0.58, "sawtooth", 0.16);
      bendTone(context, now + 0.06, 118, 76, 0.62, "triangle", 0.13);
      return;
    }

    if (key.includes("roar")) {
      playNoiseBurst(context, now, 0.42, 0.20);
      bendTone(context, now, 130, 62, 0.48, "sawtooth", 0.15);
      return;
    }

    if (key.includes("woof")) {
      bendTone(context, now, 230, 120, 0.16, "square", 0.15);
      bendTone(context, now + 0.19, 210, 105, 0.16, "square", 0.14);
      return;
    }

    if (key.includes("meow")) {
      bendTone(context, now, 520, 880, 0.22, "sine", 0.14);
      bendTone(context, now + 0.18, 880, 430, 0.26, "triangle", 0.12);
      return;
    }

    if (key.includes("quack")) {
      bendTone(context, now, 360, 280, 0.12, "sawtooth", 0.14);
      bendTone(context, now + 0.16, 390, 300, 0.12, "sawtooth", 0.13);
      return;
    }

    bendTone(context, now, 980, 1320, 0.08, "square", 0.09);
    bendTone(context, now + 0.1, 1120, 1480, 0.08, "square", 0.09);
  };

  return { playAnimalSound, playBuzzer, playCheer, playClap, playPop, playSoftBoop, playSparkle };
}

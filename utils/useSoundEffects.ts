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

  return { playBuzzer, playCheer, playClap, playPop, playSoftBoop, playSparkle };
}

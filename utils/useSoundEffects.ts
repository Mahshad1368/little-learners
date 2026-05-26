"use client";

function playTone(context: AudioContext, frequency: number, start: number, duration: number, type: OscillatorType = "sine") {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.18, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function useSoundEffects() {
  const getContext = () => {
    if (typeof window === "undefined") {
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
    playTone(context, 520, now, 0.08, "triangle");
    playTone(context, 780, now + 0.08, 0.12, "sine");
  };

  const playClap = () => {
    const context = getContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    [0, 0.08, 0.16].forEach((offset) => {
      playTone(context, 880, now + offset, 0.05, "square");
      playTone(context, 1320, now + offset + 0.02, 0.06, "triangle");
    });
  };

  const playSoftBoop = () => {
    const context = getContext();
    if (!context) {
      return;
    }

    playTone(context, 320, context.currentTime, 0.09, "sine");
  };

  return { playClap, playPop, playSoftBoop };
}

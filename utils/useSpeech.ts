"use client";

export function useSpeech() {
  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82;
    utterance.pitch = 1.18;
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
}

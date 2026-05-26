"use client";

import { useCallback } from "react";

export function useSpeech() {
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.78;
    utterance.pitch = 1.28;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}

"use client";

import { useCallback, useRef } from "react";

export type VoicePriority = 1 | 2 | 3;

type VoiceTask = {
  id: number;
  priority: VoicePriority;
  order: number;
  run: () => Promise<void>;
  resolve: () => void;
};

const TARGET_SPEECH_RATE = 0.72;
const TARGET_SPEECH_PITCH = 1.22;

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function playAudioDataUrl(dataUrl: string) {
  return new Promise<void>((resolve) => {
    const audio = new Audio(dataUrl);
    audio.volume = 0.92;

    const finish = () => resolve();
    audio.addEventListener("ended", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });

    void audio.play().catch(finish);
  });
}

function speakText(text: string) {
  return new Promise<void>((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = TARGET_SPEECH_RATE;
    utterance.pitch = TARGET_SPEECH_PITCH;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function useVoiceQueue(muted: boolean) {
  const queueRef = useRef<VoiceTask[]>([]);
  const activeRef = useRef(false);
  const orderRef = useRef(0);

  const runNext = useCallback(() => {
    if (activeRef.current) {
      return;
    }

    const next = queueRef.current
      .sort((a, b) => a.priority - b.priority || a.order - b.order)
      .shift();

    if (!next) {
      return;
    }

    activeRef.current = true;
    next
      .run()
      .finally(() => {
        activeRef.current = false;
        next.resolve();
        runNext();
      });
  }, []);

  const enqueue = useCallback(
    (priority: VoicePriority, run: () => Promise<void>) => {
      if (muted) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        queueRef.current.push({
          id: Date.now() + Math.random(),
          priority,
          order: orderRef.current,
          run,
          resolve
        });
        orderRef.current += 1;
        runNext();
      });
    },
    [muted, runNext]
  );

  const playClip = useCallback(
    (dataUrl: string, priority: VoicePriority) => enqueue(priority, () => playAudioDataUrl(dataUrl)),
    [enqueue]
  );

  const speak = useCallback(
    (text: string, priority: VoicePriority) => enqueue(priority, () => speakText(text)),
    [enqueue]
  );

  const playInstruction = useCallback(
    async (instructionDataUrl: string | null, target: string) => {
      if (instructionDataUrl) {
        await playClip(instructionDataUrl, 2);
        await wait(90);
      }
      await speak(target, 3);
    },
    [playClip, speak]
  );

  const clear = useCallback(() => {
    queueRef.current.forEach((task) => task.resolve());
    queueRef.current = [];
  }, []);

  return { clear, playClip, playInstruction, speak };
}

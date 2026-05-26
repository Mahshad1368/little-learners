"use client";

import { useSpeech } from "@/utils/useSpeech";

export function AudioButton({ label, text }: { label: string; text: string }) {
  const { speak } = useSpeech();

  return (
    <button
      aria-label={label}
      onClick={() => speak(text)}
      className="grid h-11 w-11 place-items-center rounded-full bg-ink text-lg text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus:ring-4 focus:ring-banana/60 dark:bg-white dark:text-ink"
      type="button"
      title={label}
    >
      ▶
    </button>
  );
}

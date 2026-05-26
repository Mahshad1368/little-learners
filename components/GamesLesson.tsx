"use client";

import { useMemo, useState } from "react";
import { RewardPopup } from "@/components/RewardPopup";
import { gameItems } from "@/data/games";
import { cn } from "@/utils/cn";

export function GamesLesson() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const shuffledPictures = useMemo(() => [...gameItems].sort((a, b) => a.word.localeCompare(b.word)), []);
  const isComplete = matchedIds.length === gameItems.length;

  function choosePicture(id: string) {
    if (!selectedLetter || matchedIds.includes(id)) {
      return;
    }

    const item = gameItems.find((gameItem) => gameItem.id === id);
    if (item?.letter === selectedLetter) {
      const nextMatches = [...matchedIds, id];
      setMatchedIds(nextMatches);
      setScore((current) => current + 10);
      setSelectedLetter(null);

      if (nextMatches.length === gameItems.length) {
        setShowReward(true);
        window.setTimeout(() => setShowReward(false), 2600);
      }
      return;
    }

    setScore((current) => Math.max(0, current - 2));
    setSelectedLetter(null);
  }

  function restart() {
    setSelectedLetter(null);
    setMatchedIds([]);
    setScore(0);
    setShowReward(false);
  }

  return (
    <>
      <RewardPopup show={showReward} title="You matched them all!" detail="Your letter badge is shining." />
      <section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white/75 p-5 shadow-soft dark:bg-white/10">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-berry">Matching game</p>
          <h2 className="text-3xl font-black text-ink dark:text-white">Score: {score}</h2>
        </div>
        <button className="kid-button" onClick={restart} type="button">Restart</button>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="lesson-card">
          <h3 className="mb-4 text-2xl font-black text-ink dark:text-white">Pick a letter</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {gameItems.map((item) => {
              const matched = matchedIds.includes(item.id);
              return (
                <button
                  key={item.letter}
                  className={cn(
                    "aspect-square rounded-[1.5rem] text-4xl font-black shadow-soft transition focus:outline-none focus:ring-4 focus:ring-banana/70",
                    selectedLetter === item.letter ? "bg-banana text-ink scale-105" : "bg-white text-berry dark:bg-white/10",
                    matched && "opacity-35"
                  )}
                  disabled={matched}
                  onClick={() => setSelectedLetter(item.letter)}
                  type="button"
                >
                  {item.letter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lesson-card">
          <h3 className="mb-4 text-2xl font-black text-ink dark:text-white">Match the picture</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {shuffledPictures.map((item) => {
              const matched = matchedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  className={cn(
                    "min-h-36 rounded-[1.5rem] bg-gradient-to-br from-white to-mint/30 p-3 text-center shadow-soft transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-banana/70 dark:from-white/10 dark:to-white/5",
                    matched && "bg-leaf/30 opacity-55"
                  )}
                  disabled={matched}
                  onClick={() => choosePicture(item.id)}
                  type="button"
                >
                  <span className="block text-5xl" aria-hidden="true">{item.emoji}</span>
                  <span className="mt-3 block text-lg font-black text-ink dark:text-white">{item.word}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {isComplete ? (
        <p className="mt-6 rounded-[2rem] bg-leaf/20 p-5 text-center text-xl font-black text-ink dark:text-white">
          Amazing matching. Every picture found its letter.
        </p>
      ) : null}
    </>
  );
}

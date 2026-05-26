"use client";

import { AudioButton } from "@/components/AudioButton";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { MotionArticle } from "@/components/Motion";
import { ProgressBar } from "@/components/ProgressBar";
import { letters } from "@/data/letters";
import { useLearningData } from "@/utils/useLearningData";

export function LettersLesson() {
  const { data, isLoading, error } = useLearningData(letters);

  if (isLoading) {
    return <LoadingState label="Warming up the alphabet" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <>
      <section className="mx-auto mb-8 max-w-2xl rounded-[2rem] bg-white/70 p-5 shadow-soft dark:bg-white/10">
        <div className="mb-2 flex justify-between text-sm font-black text-ink dark:text-white">
          <span>Alphabet progress</span>
          <span>12 of 26</span>
        </div>
        <ProgressBar value={46} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" aria-label="Alphabet cards">
        {data.map((item, index) => (
          <MotionArticle
            key={item.id}
            className="lesson-card group flex min-h-56 flex-col justify-between overflow-hidden"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.025 }}
            whileHover={{ y: -8, rotate: index % 2 === 0 ? -1 : 1 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-7xl font-black leading-none text-berry">{item.letter}</p>
                <h2 className="mt-3 text-2xl font-black text-ink dark:text-white">{item.word}</h2>
              </div>
              <AudioButton label={`Play ${item.sound}`} text={item.sound} />
            </div>
            <div className="mt-5 grid h-24 place-items-center rounded-[1.5rem] bg-gradient-to-br from-banana/40 to-mint/40 text-6xl">
              <span aria-label={`${item.word} image placeholder`} role="img">{item.emoji}</span>
            </div>
          </MotionArticle>
        ))}
      </section>
    </>
  );
}

"use client";

import { AudioButton } from "@/components/AudioButton";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { MotionArticle } from "@/components/Motion";
import { colors } from "@/data/colors";
import { useLearningData } from "@/utils/useLearningData";

export function ColorsLesson() {
  const { data, isLoading, error } = useLearningData(colors);

  if (isLoading) {
    return <LoadingState label="Mixing bright colors" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Color cards">
      {data.map((color, index) => (
        <MotionArticle
          key={color.id}
          className="lesson-card overflow-hidden p-0"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="h-36" style={{ backgroundColor: color.hex }} />
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-3xl font-black text-ink dark:text-white">{color.name}</h2>
                <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">Like a {color.example.toLowerCase()}</p>
              </div>
              <AudioButton label={`Play ${color.name}`} text={`${color.name}. ${color.example} is ${color.name}.`} />
            </div>
          </div>
        </MotionArticle>
      ))}
    </section>
  );
}

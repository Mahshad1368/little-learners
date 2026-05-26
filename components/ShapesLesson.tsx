"use client";

import { MotionArticle, MotionDiv } from "@/components/Motion";
import { shapes } from "@/data/shapes";
import { cn } from "@/utils/cn";

export function ShapesLesson() {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="Shape cards">
      {shapes.map((shape, index) => (
        <MotionArticle
          key={shape.id}
          className="lesson-card grid min-h-80 place-items-center text-center"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <AnimatedShape name={shape.name} className={cn(shape.className, shape.colorClass)} />
          <h2 className="mt-8 text-3xl font-black text-ink dark:text-white">{shape.name}</h2>
          <p className="mt-2 text-base font-bold leading-7 text-slate-600 dark:text-slate-300">{shape.description}</p>
        </MotionArticle>
      ))}
    </section>
  );
}

function AnimatedShape({ name, className }: { name: string; className: string }) {
  return (
    <div className="grid h-36 place-items-center">
      <MotionDiv
        aria-label={name}
        className={cn("h-32 w-32 shadow-soft", className)}
        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

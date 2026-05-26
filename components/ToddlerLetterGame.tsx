"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { cheers, mascotFaces, toddlerLetters } from "@/data/toddlerGame";
import { cn } from "@/utils/cn";
import { useSoundEffects } from "@/utils/useSoundEffects";
import { useSpeech } from "@/utils/useSpeech";

const optionColors = [
  "bg-[#ff7aa8]",
  "bg-[#7dd3fc]",
  "bg-[#facc15]",
  "bg-[#86efac]",
  "bg-[#c4b5fd]"
];

function makeChoices(target: string, round: number) {
  const otherLetters = toddlerLetters.filter((letter) => letter !== target);
  const first = otherLetters[(round + 1) % otherLetters.length];
  const second = otherLetters[(round + 4) % otherLetters.length];
  const choices = [target, first, second];
  const shift = round % choices.length;
  return [...choices.slice(shift), ...choices.slice(0, shift)];
}

export function ToddlerLetterGame() {
  const [hasStarted, setHasStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [stars, setStars] = useState(0);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const { speak } = useSpeech();
  const { playClap, playPop, playSoftBoop } = useSoundEffects();

  const target = toddlerLetters[round % toddlerLetters.length];
  const choices = useMemo(() => makeChoices(target, round), [target, round]);
  const progressStars = Array.from({ length: 6 }, (_, index) => index < Math.min(stars, 6));

  useEffect(() => {
    const storedStars = window.localStorage.getItem("little-learners-toddler-stars");
    if (storedStars) {
      setStars(Number(storedStars));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("little-learners-toddler-stars", String(stars));
  }, [stars]);

  useEffect(() => {
    if (hasStarted) {
      const timer = window.setTimeout(() => speak(`Find ${target}!`), 350);
      return () => window.clearTimeout(timer);
    }
  }, [hasStarted, speak, target]);

  function startGame() {
    setHasStarted(true);
    playPop();
    speak(`Find ${target}!`);
  }

  function chooseLetter(letter: string) {
    if (isCelebrating) {
      return;
    }

    if (letter !== target) {
      setWrongChoice(letter);
      playSoftBoop();
      window.setTimeout(() => setWrongChoice(null), 520);
      return;
    }

    const cheer = cheers[(stars + round) % cheers.length];
    setIsCelebrating(true);
    setStars((current) => current + 1);
    playPop();
    playClap();
    speak(cheer);

    window.setTimeout(() => {
      setRound((current) => current + 1);
      setIsCelebrating(false);
    }, 1500);
  }

  function resetStars() {
    setStars(0);
    setRound(0);
    setParentOpen(false);
  }

  if (!hasStarted) {
    return (
      <section className="toy-screen grid min-h-[calc(100svh-5rem)] place-items-center px-5 py-8">
        <motion.div
          className="w-full max-w-xl text-center"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 170, damping: 16 }}
        >
          <motion.div
            className="mx-auto grid h-48 w-48 place-items-center rounded-full bg-white/70 text-8xl shadow-lift backdrop-blur"
            animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            {mascotFaces.calm}
          </motion.div>
          <h1 className="mt-8 text-5xl font-black text-ink dark:text-white sm:text-7xl">Little Learners</h1>
          <motion.button
            className="mt-10 min-h-28 w-full rounded-[2.5rem] bg-[#ff7aa8] px-10 text-5xl font-black text-white shadow-lift outline-none ring-offset-4 transition focus:ring-8 focus:ring-banana sm:min-h-32 sm:text-6xl"
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.03 }}
            onClick={startGame}
            type="button"
          >
            Start
          </motion.button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="toy-screen relative flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden px-4 py-4 sm:px-6">
      <Confetti show={isCelebrating} />

      <div className="z-10 flex items-center justify-between gap-3">
        <button
          aria-label="Parent area"
          className="rounded-full bg-white/60 px-4 py-3 text-sm font-black text-ink shadow-soft backdrop-blur dark:bg-white/10 dark:text-white"
          onClick={() => setParentOpen((open) => !open)}
          type="button"
        >
          Parent
        </button>
        <div className="flex gap-1 rounded-full bg-white/60 p-2 shadow-soft backdrop-blur dark:bg-white/10" aria-label={`${stars} stars earned`}>
          {progressStars.map((filled, index) => (
            <motion.span
              key={index}
              className={cn("grid h-9 w-9 place-items-center rounded-full text-xl", filled ? "bg-banana" : "bg-white/70 opacity-55 dark:bg-white/10")}
              animate={filled ? { scale: [1, 1.2, 1] } : undefined}
            >
              ⭐
            </motion.span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {parentOpen ? (
          <motion.div
            className="absolute left-4 top-20 z-30 max-w-xs rounded-[2rem] bg-white/95 p-5 shadow-lift dark:bg-slate-900"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <p className="text-sm font-black uppercase tracking-[0.16em] text-berry">Parent area</p>
            <p className="mt-2 text-lg font-black text-ink dark:text-white">{stars} stars earned</p>
            <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">Simple toddler mode with voice prompts and no negative feedback.</p>
            <button className="mt-4 rounded-full bg-ink px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-ink" onClick={resetStars} type="button">
              Reset
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="z-10 flex flex-1 flex-col items-center justify-between gap-5 pt-3">
        <motion.div
          className="grid h-28 w-28 place-items-center rounded-full bg-white/70 text-6xl shadow-soft backdrop-blur sm:h-36 sm:w-36 sm:text-7xl"
          animate={isCelebrating ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] } : { y: [0, -8, 0] }}
          transition={{ duration: isCelebrating ? 0.65 : 2.4, repeat: isCelebrating ? 1 : Infinity }}
          aria-hidden="true"
        >
          {isCelebrating ? mascotFaces.sparkle : mascotFaces.happy}
        </motion.div>

        <div className="text-center">
          <motion.p
            className="mb-4 text-3xl font-black text-berry sm:text-5xl"
            key={`prompt-${target}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Find {target}!
          </motion.p>
          <motion.div
            key={target}
            className="relative mx-auto grid h-64 w-64 place-items-center rounded-full bg-white/75 text-[11rem] font-black leading-none text-ink shadow-lift backdrop-blur sm:h-80 sm:w-80 sm:text-[14rem]"
            animate={isCelebrating ? { scale: [1, 1.18, 0.9, 1], rotate: [0, -10, 10, 0] } : { scale: [1, 1.04, 1] }}
            transition={{ duration: isCelebrating ? 0.8 : 2.2, repeat: isCelebrating ? 1 : Infinity, ease: "easeInOut" }}
            aria-label={`Target letter ${target}`}
          >
            {target}
            <span className="absolute -right-4 top-6 h-14 w-14 rounded-full bg-mint/70" />
            <span className="absolute bottom-8 left-4 h-9 w-9 rounded-full bg-banana/70" />
          </motion.div>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-3 gap-3 pb-2 sm:gap-5">
          {choices.map((letter, index) => (
            <motion.button
              key={`${round}-${letter}`}
              className={cn(
                "min-h-28 rounded-[2.25rem] text-6xl font-black text-white shadow-lift outline-none ring-offset-4 focus:ring-8 focus:ring-banana sm:min-h-36 sm:text-8xl",
                optionColors[index]
              )}
              animate={wrongChoice === letter ? { x: [-10, 10, -8, 8, 0] } : { y: [0, -5, 0] }}
              transition={wrongChoice === letter ? { duration: 0.42 } : { duration: 2 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => chooseLetter(letter)}
              type="button"
              aria-label={`Choose ${letter}`}
            >
              {letter}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Confetti({ show }: { show: boolean }) {
  const pieces = ["⭐", "✨", "💛", "🌟", "🎉", "⭐", "✨", "💛", "🌟", "🎉", "⭐", "✨"];

  return (
    <AnimatePresence>
      {show ? (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {pieces.map((piece, index) => (
            <motion.span
              key={`${piece}-${index}`}
              className="absolute text-4xl"
              initial={{ opacity: 0, x: `${10 + index * 7}%`, y: "-10%", rotate: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: ["0%", "38%", "86%"], rotate: 360, scale: [0.6, 1.2, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.35, delay: index * 0.035, ease: "easeOut" }}
              aria-hidden="true"
            >
              {piece}
            </motion.span>
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  );
}

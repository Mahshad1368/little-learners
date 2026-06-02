"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cheers, mascotFaces, miniGames, toddlerAnimals, toddlerLetters } from "@/data/toddlerGame";
import { cn } from "@/utils/cn";
import { useSoundEffects } from "@/utils/useSoundEffects";
import { useSpeech } from "@/utils/useSpeech";

type Mode = "home" | "letters" | "animals" | "minis";
type MiniGameId = (typeof miniGames)[number]["id"];
type ToddlerAnimal = (typeof toddlerAnimals)[number];
type RecordedVoiceClip = {
  id: string;
  label: string;
  dataUrl: string;
  createdAt: number;
};

type GameFeedback = {
  wrongChoice: string | null;
  celebrationId: number;
  celebrating: boolean;
};

const SETUP_KEY = "little-learners-parent-setup-complete";
const VOICE_KEY = "little-learners-parent-voice-clips";
const STARS_KEY = "little-learners-toy-stars";
const MUTE_KEY = "little-learners-muted";

const letterSwim = [
  { x: ["4vw", "28vw", "12vw"], y: ["12vh", "22vh", "44vh"], rotate: [-8, 8, -4], duration: 8 },
  { x: ["56vw", "70vw", "38vw"], y: ["18vh", "42vh", "30vh"], rotate: [5, -9, 6], duration: 9 },
  { x: ["20vw", "48vw", "72vw"], y: ["54vh", "38vh", "58vh"], rotate: [-4, 10, -7], duration: 10 },
  { x: ["68vw", "44vw", "78vw"], y: ["52vh", "20vh", "34vh"], rotate: [9, -4, 7], duration: 8.8 },
  { x: ["32vw", "10vw", "40vw"], y: ["28vh", "62vh", "48vh"], rotate: [2, -10, 3], duration: 9.6 },
  { x: ["76vw", "62vw", "18vw"], y: ["14vh", "64vh", "18vh"], rotate: [-8, 5, -6], duration: 10.4 }
];

const animalPaths = [
  { x: ["3vw", "34vw", "12vw"], y: ["18vh", "32vh", "54vh"], duration: 9 },
  { x: ["60vw", "72vw", "44vw"], y: ["16vh", "44vh", "24vh"], duration: 10 },
  { x: ["16vw", "50vw", "76vw"], y: ["58vh", "38vh", "60vh"], duration: 11 },
  { x: ["70vw", "36vw", "66vw"], y: ["48vh", "62vh", "30vh"], duration: 9.5 },
  { x: ["42vw", "8vw", "36vw"], y: ["26vh", "52vh", "20vh"], duration: 10.5 },
  { x: ["78vw", "52vw", "20vw"], y: ["24vh", "56vh", "36vh"], duration: 11.5 }
];

const bubblePositions = [
  "left-[8%] top-[16%]",
  "left-[64%] top-[15%]",
  "left-[28%] top-[38%]",
  "left-[72%] top-[48%]",
  "left-[12%] top-[58%]",
  "left-[48%] top-[64%]"
];

export function ToddlerLetterGame() {
  const [mode, setMode] = useState<Mode>("home");
  const [round, setRound] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<GameFeedback>({ wrongChoice: null, celebrationId: 0, celebrating: false });
  const [parentOpen, setParentOpen] = useState(false);
  const [activeMini, setActiveMini] = useState<MiniGameId>("bubbles");
  const [fedCount, setFedCount] = useState(0);
  const [setupComplete, setSetupComplete] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const [voiceClips, setVoiceClips] = useState<RecordedVoiceClip[]>([]);
  const [muted, setMuted] = useState(false);
  const { speak } = useSpeech();
  const { playBuzzer, playCheer, playClap, playPop, playSparkle } = useSoundEffects(muted);

  const targetLetter = toddlerLetters[round % toddlerLetters.length];
  const targetAnimal = toddlerAnimals[round % toddlerAnimals.length];
  const starSlots = Array.from({ length: 8 }, (_, index) => index < Math.min(stars, 8));
  const cheer = cheers[(round + stars) % cheers.length];

  const floatingLetters = useMemo(() => {
    const start = round % toddlerLetters.length;
    const pool = Array.from({ length: 6 }, (_, index) => toddlerLetters[(start + index) % toddlerLetters.length]);
    return pool.includes(targetLetter) ? pool : [targetLetter, ...pool.slice(1)];
  }, [round, targetLetter]);

  const visibleAnimals = useMemo(() => {
    const start = round % toddlerAnimals.length;
    const pool = Array.from({ length: 6 }, (_, index) => toddlerAnimals[(start + index) % toddlerAnimals.length]);
    return pool.some((animal) => animal.name === targetAnimal.name) ? pool : [targetAnimal, ...pool.slice(1)];
  }, [round, targetAnimal]);

  useEffect(() => {
    setSetupComplete(window.localStorage.getItem(SETUP_KEY) === "true");
    setMuted(window.localStorage.getItem(MUTE_KEY) === "true");

    const storedClips = window.localStorage.getItem(VOICE_KEY);
    if (storedClips) {
      try {
        setVoiceClips(JSON.parse(storedClips) as RecordedVoiceClip[]);
      } catch {
        setVoiceClips([]);
      }
    }

    const storedStars = window.localStorage.getItem(STARS_KEY);
    if (storedStars) {
      setStars(Number(storedStars));
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STARS_KEY, String(stars));
  }, [stars]);

  useEffect(() => {
    window.localStorage.setItem(MUTE_KEY, String(muted));
  }, [muted]);

  useEffect(() => {
    if (mode === "letters") {
      const timer = window.setTimeout(() => !muted && speak(`Catch ${targetLetter}!`), 450);
      return () => window.clearTimeout(timer);
    }

    if (mode === "animals") {
      const timer = window.setTimeout(() => !muted && speak(`Find the ${targetAnimal.name}!`), 450);
      return () => window.clearTimeout(timer);
    }
  }, [mode, muted, speak, targetAnimal.name, targetLetter]);

  function playParentVoice(fallbackVoice: string) {
    if (muted) {
      return;
    }

    const clip = voiceClips.length > 0 ? voiceClips[Math.floor(Math.random() * voiceClips.length)] : null;
    if (clip) {
      const audio = new Audio(clip.dataUrl);
      audio.volume = 0.9;
      void audio.play().catch(() => speak(fallbackVoice));
      return;
    }

    speak(fallbackVoice);
  }

  function reward(extraVoice?: string) {
    setFeedback((current) => ({
      wrongChoice: null,
      celebrationId: current.celebrationId + 1,
      celebrating: true
    }));
    setStars((current) => current + 1);
    playPop();
    playClap();
    playCheer();
    playSparkle();
    playParentVoice(extraVoice ?? cheer);

    window.setTimeout(() => {
      setFeedback((current) => ({ ...current, celebrating: false }));
      setRound((current) => current + 1);
    }, 1450);
  }

  function retry(id: string) {
    setFeedback((current) => ({ ...current, wrongChoice: id }));
    playBuzzer();
    window.setTimeout(() => setFeedback((current) => ({ ...current, wrongChoice: null })), 620);
  }

  function chooseMode(nextMode: Mode) {
    setMode(nextMode);
    setParentOpen(false);
    playPop();

    if (!muted && nextMode === "letters") {
      speak(`Catch ${targetLetter}!`);
    }

    if (!muted && nextMode === "animals") {
      speak(`Find the ${targetAnimal.name}!`);
    }
  }

  function chooseLetter(letter: string) {
    if (feedback.celebrating) {
      return;
    }
    letter === targetLetter ? reward() : retry(letter);
  }

  function chooseAnimal(name: string, sound: string) {
    if (feedback.celebrating) {
      return;
    }
    name === targetAnimal.name ? reward(sound) : retry(name);
  }

  function playMini(id: MiniGameId) {
    setActiveMini(id);
    setFedCount(0);
    playPop();
    const prompts: Record<MiniGameId, string> = {
      bubbles: "Pop bubbles!",
      monster: "Feed monster!",
      fishing: `Catch ${targetLetter}!`,
      star: "Catch star!"
    };
    if (!muted) {
      speak(prompts[id]);
    }
  }

  function resetStars() {
    setStars(0);
    setRound(0);
    setFedCount(0);
    setParentOpen(false);
  }

  function completeSetup(clips: RecordedVoiceClip[]) {
    setVoiceClips(clips);
    window.localStorage.setItem(VOICE_KEY, JSON.stringify(clips));
    window.localStorage.setItem(SETUP_KEY, "true");
    setSetupComplete(true);
  }

  if (!storageReady) {
    return <section className="toy-screen min-h-[calc(100svh-5rem)]" />;
  }

  if (!setupComplete) {
    return <ParentSetupScreen onContinue={completeSetup} />;
  }

  return (
    <section className="toy-screen relative min-h-[calc(100svh-5rem)] overflow-hidden px-4 pb-5 pt-2 sm:px-6">
      <FloatingParticles />
      <Confetti show={feedback.celebrating} celebrationId={feedback.celebrationId} />
      <CelebrationBurst show={feedback.celebrating} celebrationId={feedback.celebrationId} />

      <div className="relative z-20 flex items-center justify-between gap-3">
        {mode === "home" ? (
          <span className="rounded-full bg-white/55 px-4 py-3 text-sm font-black text-ink shadow-soft backdrop-blur dark:bg-white/10 dark:text-white">
            Toy time
          </span>
        ) : (
          <button className="rounded-full bg-white/65 px-5 py-3 text-base font-black text-ink shadow-soft backdrop-blur dark:bg-white/10 dark:text-white" onClick={() => chooseMode("home")} type="button">
            Home
          </button>
        )}
        <div className="flex gap-1 rounded-full bg-white/60 p-2 shadow-soft backdrop-blur dark:bg-white/10" aria-label={`${stars} stars earned`}>
          {starSlots.map((filled, index) => (
            <motion.span
              key={index}
              className={cn("grid h-9 w-9 place-items-center rounded-full text-xl", filled ? "bg-banana" : "bg-white/70 opacity-55 dark:bg-white/10")}
              animate={filled ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : undefined}
            >
              ⭐
            </motion.span>
          ))}
        </div>
      </div>

      <ParentPanel
        open={parentOpen}
        onToggle={() => setParentOpen((open) => !open)}
        stars={stars}
        muted={muted}
        voiceClipCount={voiceClips.length}
        onReset={resetStars}
        onToggleMute={() => setMuted((current) => !current)}
        onRedoSetup={() => {
          window.localStorage.removeItem(SETUP_KEY);
          setSetupComplete(false);
          setParentOpen(false);
        }}
      />

      <AnimatePresence mode="wait">
        {mode === "home" ? (
          <HomeToy key="home" onChoose={chooseMode} mascotHappy={feedback.celebrating} />
        ) : null}
        {mode === "letters" ? (
          <LettersMode key="letters" target={targetLetter} letters={floatingLetters} wrongChoice={feedback.wrongChoice} celebrating={feedback.celebrating} onPick={chooseLetter} />
        ) : null}
        {mode === "animals" ? (
          <AnimalsMode key="animals" target={targetAnimal.name} animals={visibleAnimals} wrongChoice={feedback.wrongChoice} celebrating={feedback.celebrating} onPick={chooseAnimal} />
        ) : null}
        {mode === "minis" ? (
          <MiniGamesMode
            key="minis"
            activeMini={activeMini}
            targetLetter={targetLetter}
            wrongChoice={feedback.wrongChoice}
            fedCount={fedCount}
            onChooseMini={playMini}
            onReward={reward}
            onRetry={retry}
            onFeed={() => {
              setFedCount((current) => current + 1);
              reward("Yum!");
            }}
          />
        ) : null}
      </AnimatePresence>

      <button
        aria-label="Parent area"
        className="absolute bottom-4 left-4 z-30 rounded-full bg-white/55 px-4 py-3 text-sm font-black text-ink shadow-soft backdrop-blur dark:bg-white/10 dark:text-white"
        onClick={() => setParentOpen((open) => !open)}
        type="button"
      >
        Parent
      </button>
    </section>
  );
}

function ParentSetupScreen({ onContinue }: { onContinue: (clips: RecordedVoiceClip[]) => void }) {
  const [clips, setClips] = useState<RecordedVoiceClip[]>([]);
  const [recordingSlot, setRecordingSlot] = useState<1 | 2 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording(slot: 1 | 2) {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setError("Recording is not available in this browser. You can skip for now.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorderRef.current = recorder;
      setRecordingSlot(slot);
      setError(null);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = String(reader.result);
          setClips((current) => {
            const withoutSlot = current.filter((clip) => clip.id !== `voice-${slot}`);
            return [
              ...withoutSlot,
              {
                id: `voice-${slot}`,
                label: `Voice ${slot}`,
                dataUrl,
                createdAt: Date.now()
              }
            ].sort((a, b) => a.id.localeCompare(b.id));
          });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
        setRecordingSlot(null);
      };

      recorder.start();
    } catch {
      setError("Microphone permission was not granted. You can skip for now.");
      setRecordingSlot(null);
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function playPreview(slot: 1 | 2) {
    const clip = clips.find((item) => item.id === `voice-${slot}`);
    if (!clip) {
      return;
    }
    const audio = new Audio(clip.dataUrl);
    audio.volume = 0.9;
    void audio.play();
  }

  return (
    <section className="toy-screen relative grid min-h-[calc(100svh-5rem)] place-items-center overflow-hidden px-4 py-6">
      <FloatingParticles />
      <motion.div className="relative z-10 w-full max-w-3xl rounded-[2.5rem] bg-white/86 p-6 shadow-lift backdrop-blur dark:bg-slate-900/90 sm:p-8" initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-banana text-5xl shadow-soft" aria-hidden="true">🎙️</div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-berry">Parent setup</p>
            <h1 className="text-3xl font-black text-ink dark:text-white sm:text-5xl">Record happy voices</h1>
          </div>
        </div>

        <p className="max-w-2xl text-lg font-bold leading-8 text-slate-600 dark:text-slate-300">
          Add one or two short encouragement clips for reward moments. Try “Yay! Great job!” or “Bravo! You did it!”
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[1, 2].map((slot) => {
            const typedSlot = slot as 1 | 2;
            const hasClip = clips.some((clip) => clip.id === `voice-${typedSlot}`);
            const isRecording = recordingSlot === typedSlot;

            return (
              <div key={slot} className="rounded-[2rem] bg-white/75 p-4 shadow-soft dark:bg-white/10">
                <p className="mb-3 text-xl font-black text-ink dark:text-white">Voice {slot}</p>
                <div className="grid gap-3">
                  <button className={cn("min-h-16 rounded-[1.5rem] px-5 text-lg font-black text-white shadow-soft", isRecording ? "bg-red-400" : "bg-berry")} onClick={() => startRecording(typedSlot)} disabled={recordingSlot !== null} type="button">
                    {isRecording ? "Recording..." : `Record voice ${slot}`}
                  </button>
                  <button className="min-h-14 rounded-[1.5rem] bg-ink px-5 text-base font-black text-white shadow-soft disabled:opacity-35 dark:bg-white dark:text-ink" onClick={stopRecording} disabled={!isRecording} type="button">
                    Stop recording
                  </button>
                  <button className="min-h-14 rounded-[1.5rem] bg-banana px-5 text-base font-black text-ink shadow-soft disabled:opacity-35" onClick={() => playPreview(typedSlot)} disabled={!hasClip || recordingSlot !== null} type="button">
                    Play preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {error ? <p className="mt-4 rounded-2xl bg-red-100 px-4 py-3 text-sm font-black text-red-600">{error}</p> : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button className="min-h-16 flex-1 rounded-[1.5rem] bg-leaf px-6 text-xl font-black text-ink shadow-soft" onClick={() => onContinue(clips)} type="button">
            Continue
          </button>
          <button className="min-h-16 flex-1 rounded-[1.5rem] bg-white px-6 text-xl font-black text-ink shadow-soft dark:bg-white/10 dark:text-white" onClick={() => onContinue([])} type="button">
            Skip for now
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function HomeToy({ onChoose, mascotHappy }: { onChoose: (mode: Mode) => void; mascotHappy: boolean }) {
  const buttons: Array<{ mode: Mode; label: string; emoji: string; className: string }> = [
    { mode: "letters", label: "Letters", emoji: "🔤", className: "bg-[#ff7aa8]" },
    { mode: "animals", label: "Animals", emoji: "🦁", className: "bg-[#7dd3fc]" },
    { mode: "minis", label: "Mini Games", emoji: "⭐", className: "bg-[#86efac]" }
  ];

  return (
    <motion.div className="relative z-10 mx-auto flex min-h-[calc(100svh-10rem)] max-w-5xl flex-col items-center justify-center gap-7 py-6" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
      <motion.div
        className="grid h-40 w-40 place-items-center rounded-full bg-white/70 text-8xl shadow-lift backdrop-blur sm:h-52 sm:w-52 sm:text-9xl"
        animate={mascotHappy ? { scale: [1, 1.18, 1], rotate: [0, -8, 8, 0] } : { y: [0, -16, 0], rotate: [0, 4, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        {mascotFaces.calm}
      </motion.div>
      <div className="grid w-full gap-4 sm:grid-cols-3">
        {buttons.map((button, index) => (
          <motion.button
            key={button.mode}
            className={cn("min-h-36 rounded-[2.5rem] px-4 text-4xl font-black text-white shadow-lift outline-none ring-offset-4 focus:ring-8 focus:ring-banana sm:min-h-56 sm:text-5xl", button.className)}
            animate={{ y: [0, -8, 0], rotate: [0, index % 2 === 0 ? 1.5 : -1.5, 0] }}
            transition={{ duration: 2.4 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChoose(button.mode)}
            type="button"
          >
            <span className="mb-3 block text-6xl sm:text-7xl" aria-hidden="true">{button.emoji}</span>
            {button.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function LettersMode({ target, letters, wrongChoice, celebrating, onPick }: { target: string; letters: readonly string[]; wrongChoice: string | null; celebrating: boolean; onPick: (letter: string) => void }) {
  return (
    <motion.div className="relative z-10 h-[calc(100svh-10rem)] min-h-[34rem]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <MascotPrompt mascot={celebrating ? mascotFaces.sparkle : mascotFaces.happy} prompt={`Catch ${target}!`} celebrating={celebrating} />
      {letters.map((letter, index) => {
        const path = letterSwim[index % letterSwim.length];
        const isTarget = letter === target;
        return (
          <motion.button
            key={`${letter}-${index}-${target}`}
            aria-label={`Catch ${letter}`}
            className={cn(
              "absolute grid h-28 w-28 place-items-center rounded-full text-6xl font-black shadow-lift backdrop-blur sm:h-36 sm:w-36 sm:text-8xl",
              isTarget ? "bg-banana/90 text-berry ring-8 ring-banana/45" : "bg-white/65 text-ink dark:text-white",
              wrongChoice === letter && "z-20 bg-red-400 text-white ring-8 ring-red-200"
            )}
            initial={{ x: path.x[0], y: path.y[0] }}
            animate={
              wrongChoice === letter
                ? { x: [path.x[0], `calc(${path.x[0]} + 14px)`, `calc(${path.x[0]} - 12px)`, path.x[0]], y: path.y[0] }
                : {
                    x: path.x,
                    y: path.y,
                    rotate: path.rotate,
                    scale: isTarget && celebrating ? [1, 1.45, 0.78, 1] : isTarget ? [1, 1.16, 1] : [1, 1.05, 1],
                    boxShadow: isTarget ? ["0 18px 45px rgba(255, 209, 102, 0.35)", "0 26px 70px rgba(255, 122, 168, 0.5)", "0 18px 45px rgba(255, 209, 102, 0.35)"] : undefined
                  }
            }
            transition={wrongChoice === letter ? { duration: 0.42 } : { duration: path.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            whileTap={{ scale: 0.82 }}
            onClick={() => onPick(letter)}
            type="button"
          >
            {letter}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

function AnimalsMode({ target, animals, wrongChoice, celebrating, onPick }: { target: string; animals: readonly ToddlerAnimal[]; wrongChoice: string | null; celebrating: boolean; onPick: (name: string, sound: string) => void }) {
  return (
    <motion.div className="relative z-10 h-[calc(100svh-10rem)] min-h-[34rem]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <MascotPrompt mascot={celebrating ? mascotFaces.sparkle : "🐯"} prompt={`Find ${target}!`} celebrating={celebrating} />
      {animals.map((animal, index) => {
        const path = animalPaths[index % animalPaths.length];
        const isTarget = animal.name === target;
        return (
          <motion.button
            key={`${animal.name}-${target}`}
            aria-label={`Find ${animal.name}`}
            className={cn(
              "absolute grid h-28 w-28 place-items-center rounded-[2.25rem] text-7xl shadow-lift backdrop-blur sm:h-40 sm:w-40 sm:text-8xl",
              isTarget ? "bg-banana/90 ring-8 ring-banana/45" : "bg-white/70",
              wrongChoice === animal.name && "z-20 bg-red-400 ring-8 ring-red-200"
            )}
            initial={{ x: path.x[0], y: path.y[0] }}
            animate={
              wrongChoice === animal.name
                ? { rotate: [0, -8, 8, -5, 0] }
                : {
                    x: path.x,
                    y: path.y,
                    rotate: isTarget && celebrating ? [0, -12, 12, 0] : [0, 4, -4, 0],
                    scale: isTarget && celebrating ? [1, 1.36, 1] : isTarget ? [1, 1.15, 1] : [1, 1.04, 1],
                    boxShadow: isTarget ? ["0 18px 45px rgba(255, 209, 102, 0.35)", "0 28px 76px rgba(94, 234, 212, 0.52)", "0 18px 45px rgba(255, 209, 102, 0.35)"] : undefined
                  }
            }
            transition={wrongChoice === animal.name ? { duration: 0.45 } : { duration: path.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            whileTap={{ scale: 0.84 }}
            onClick={() => onPick(animal.name, animal.sound)}
            type="button"
          >
            {animal.emoji}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

function MiniGamesMode({ activeMini, targetLetter, wrongChoice, fedCount, onChooseMini, onReward, onRetry, onFeed }: { activeMini: MiniGameId; targetLetter: string; wrongChoice: string | null; fedCount: number; onChooseMini: (id: MiniGameId) => void; onReward: (voice?: string) => void; onRetry: (id: string) => void; onFeed: () => void }) {
  return (
    <motion.div className="relative z-10 mx-auto flex min-h-[calc(100svh-10rem)] max-w-6xl flex-col gap-4 py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-2">
        {miniGames.map((game) => (
          <motion.button
            key={game.id}
            className={cn("min-h-20 rounded-[1.75rem] px-2 text-3xl font-black shadow-soft sm:text-4xl", activeMini === game.id ? "bg-banana text-ink" : "bg-white/65 text-ink dark:bg-white/10 dark:text-white")}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChooseMini(game.id)}
            type="button"
            aria-label={game.title}
          >
            <span aria-hidden="true">{game.emoji}</span>
          </motion.button>
        ))}
      </div>
      <div className="relative min-h-[31rem] flex-1 overflow-hidden rounded-[3rem] bg-white/35 shadow-soft backdrop-blur dark:bg-white/5">
        {activeMini === "bubbles" ? <BubblePop onReward={() => onReward("Pop!")} /> : null}
        {activeMini === "monster" ? <FeedMonster fedCount={fedCount} onFeed={onFeed} /> : null}
        {activeMini === "fishing" ? <FishingLetters target={targetLetter} wrongChoice={wrongChoice} onReward={onReward} onRetry={onRetry} /> : null}
        {activeMini === "star" ? <CatchStar onReward={() => onReward("You caught it!")} /> : null}
      </div>
    </motion.div>
  );
}

function BubblePop({ onReward }: { onReward: () => void }) {
  return (
    <div className="relative h-full min-h-[31rem]">
      <MascotPrompt mascot="🫧" prompt="Pop!" celebrating={false} compact />
      {bubblePositions.map((position, index) => (
        <motion.button
          key={position}
          className={cn("absolute grid h-28 w-28 place-items-center rounded-full bg-white/60 text-4xl shadow-lift backdrop-blur sm:h-36 sm:w-36", position)}
          animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.3 + index * 0.18, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.35, opacity: 0 }}
          onClick={onReward}
          type="button"
          aria-label="Pop bubble"
        >
          🫧
        </motion.button>
      ))}
    </div>
  );
}

function FeedMonster({ fedCount, onFeed }: { fedCount: number; onFeed: () => void }) {
  const foods = ["🍓", "🍌", "🫐"];

  return (
    <div className="flex h-full min-h-[31rem] flex-col items-center justify-center gap-8 p-4">
      <motion.div className="grid h-52 w-52 place-items-center rounded-[3rem] bg-[#c4b5fd] text-9xl shadow-lift sm:h-64 sm:w-64" animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }} transition={{ duration: 2.1, repeat: Infinity }}>
        {fedCount % 2 === 0 ? "👾" : "😋"}
      </motion.div>
      <div className="grid w-full max-w-xl grid-cols-3 gap-3">
        {foods.map((food) => (
          <motion.button key={food} drag dragSnapToOrigin className="min-h-28 rounded-[2rem] bg-white/70 text-6xl shadow-lift sm:min-h-36 sm:text-7xl" whileTap={{ scale: 0.9 }} onClick={onFeed} onDragEnd={onFeed} type="button" aria-label="Feed monster">
            {food}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function FishingLetters({ target, wrongChoice, onReward, onRetry }: { target: string; wrongChoice: string | null; onReward: () => void; onRetry: (id: string) => void }) {
  const choices = [target, toddlerLetters[(toddlerLetters.indexOf(target as (typeof toddlerLetters)[number]) + 2) % toddlerLetters.length], toddlerLetters[(toddlerLetters.indexOf(target as (typeof toddlerLetters)[number]) + 5) % toddlerLetters.length]];

  return (
    <div className="relative h-full min-h-[31rem] bg-sky/10">
      <MascotPrompt mascot="🎣" prompt={`Catch ${target}!`} celebrating={false} compact />
      {choices.map((letter, index) => {
        const path = letterSwim[(index + 2) % letterSwim.length];
        return (
          <motion.button
            key={`${target}-${letter}`}
            className={cn(
              "absolute grid h-28 w-36 place-items-center rounded-full text-6xl font-black shadow-lift sm:h-32 sm:w-44 sm:text-7xl",
              letter === target ? "bg-banana/90 text-berry ring-8 ring-banana/45" : "bg-white/70 text-sky",
              wrongChoice === letter && "bg-red-400 text-white ring-8 ring-red-200"
            )}
            initial={{ x: path.x[0], y: path.y[0] }}
            animate={
              wrongChoice === letter
                ? { x: [path.x[0], `calc(${path.x[0]} + 12px)`, path.x[0]] }
                : { x: path.x, y: path.y, rotate: path.rotate, scale: letter === target ? [1, 1.14, 1] : [1, 1.04, 1] }
            }
            transition={wrongChoice === letter ? { duration: 0.4 } : { duration: path.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            whileTap={{ scale: 0.86 }}
            onClick={() => (letter === target ? onReward() : onRetry(letter))}
            type="button"
            aria-label={`Fish ${letter}`}
          >
            {letter}
          </motion.button>
        );
      })}
    </div>
  );
}

function CatchStar({ onReward }: { onReward: () => void }) {
  return (
    <div className="relative h-full min-h-[31rem]">
      <MascotPrompt mascot="🌟" prompt="Catch!" celebrating={false} compact />
      <motion.button
        className="absolute grid h-40 w-40 place-items-center rounded-full bg-banana text-8xl shadow-lift"
        initial={{ x: "18vw", y: "22vh" }}
        animate={{ x: ["8vw", "62vw", "28vw", "70vw"], y: ["14vh", "20vh", "56vh", "42vh"], rotate: [0, 120, 240, 360], scale: [1, 1.12, 0.96, 1.08] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        whileTap={{ scale: 0.72 }}
        onClick={onReward}
        type="button"
        aria-label="Catch star"
      >
        ⭐
      </motion.button>
    </div>
  );
}

function MascotPrompt({ mascot, prompt, celebrating, compact = false }: { mascot: string; prompt: string; celebrating: boolean; compact?: boolean }) {
  return (
    <div className={cn("pointer-events-none absolute left-1/2 top-4 z-20 flex -translate-x-1/2 flex-col items-center", compact ? "gap-1" : "gap-2")}>
      <motion.div className={cn("grid place-items-center rounded-full bg-white/70 shadow-soft backdrop-blur", compact ? "h-20 w-20 text-5xl" : "h-28 w-28 text-7xl sm:h-36 sm:w-36 sm:text-8xl")} animate={celebrating ? { scale: [1, 1.28, 1], rotate: [0, -12, 12, 0] } : { y: [0, -7, 0] }} transition={{ duration: celebrating ? 0.7 : 2.2, repeat: Infinity, ease: "easeInOut" }}>
        {mascot}
      </motion.div>
      <motion.p key={prompt} className={cn("rounded-full bg-white/65 px-5 py-2 font-black text-berry shadow-soft backdrop-blur", compact ? "text-2xl" : "text-3xl sm:text-5xl")} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {prompt}
      </motion.p>
    </div>
  );
}

function ParentPanel({
  open,
  stars,
  muted,
  voiceClipCount,
  onToggle,
  onReset,
  onToggleMute,
  onRedoSetup
}: {
  open: boolean;
  stars: number;
  muted: boolean;
  voiceClipCount: number;
  onToggle: () => void;
  onReset: () => void;
  onToggleMute: () => void;
  onRedoSetup: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="absolute bottom-20 left-4 z-40 max-w-xs rounded-[2rem] bg-white/95 p-5 shadow-lift dark:bg-slate-900" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-berry">Parent area</p>
          <p className="mt-2 text-lg font-black text-ink dark:text-white">{stars} stars earned</p>
          <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
            {voiceClipCount > 0 ? `${voiceClipCount} parent voice clip${voiceClipCount > 1 ? "s" : ""} saved.` : "Using built-in happy voices."}
          </p>
          <div className="mt-4 grid gap-2">
            <button className="rounded-full bg-banana px-5 py-3 text-sm font-black text-ink" onClick={onToggleMute} type="button">
              {muted ? "Sound on" : "Mute"}
            </button>
            <button className="rounded-full bg-berry px-5 py-3 text-sm font-black text-white" onClick={onRedoSetup} type="button">Record voices</button>
            <button className="rounded-full bg-ink px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-ink" onClick={onReset} type="button">Reset</button>
            <button className="rounded-full bg-banana px-5 py-3 text-sm font-black text-ink" onClick={onToggle} type="button">Close</button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {["bg-banana/40", "bg-mint/35", "bg-berry/25", "bg-sky/30", "bg-leaf/25"].map((color, index) => (
        <motion.span
          key={color}
          className={cn("absolute h-16 w-16 rounded-full blur-[1px]", color)}
          initial={{ x: `${index * 21 + 4}vw`, y: `${index * 13 + 10}vh` }}
          animate={{ x: [`${index * 21 + 4}vw`, `${index * 12 + 20}vw`, `${index * 18 + 7}vw`], y: [`${index * 13 + 10}vh`, `${index * 10 + 18}vh`, `${index * 14 + 8}vh`] }}
          transition={{ duration: 8 + index, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function CelebrationBurst({ show, celebrationId }: { show: boolean; celebrationId: number }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key={`burst-${celebrationId}`}
          className="pointer-events-none absolute inset-0 z-40 grid place-items-center"
          initial={{ opacity: 0, scale: 0.4, rotate: -10 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.2, 1], rotate: [0, -8, 8, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.25, ease: "easeOut" }}
        >
          <div className="rounded-full bg-white/70 px-8 py-6 text-8xl shadow-lift backdrop-blur sm:text-9xl">
            🌸⭐💖
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Confetti({ show, celebrationId }: { show: boolean; celebrationId: number }) {
  const pieces = ["⭐", "✨", "💛", "🌟", "🎉", "🌸", "💖", "⭐", "✨", "🌼", "💛", "🌟", "🎉", "🌺", "💖", "⭐", "✨", "🌸", "💛", "🌟", "🎉", "🌼", "💖", "⭐"];

  return (
    <AnimatePresence>
      {show ? (
        <div key={`confetti-${celebrationId}`} className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          {pieces.map((piece, index) => (
            <motion.span
              key={`${piece}-${index}`}
              className="absolute text-4xl sm:text-5xl"
              initial={{ opacity: 0, x: `${4 + (index * 9) % 92}%`, y: "-10%", rotate: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: ["0%", `${30 + (index % 4) * 12}%`, "92%"], rotate: index % 2 === 0 ? 360 : -360, scale: [0.6, 1.35, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.55, delay: index * 0.025, ease: "easeOut" }}
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

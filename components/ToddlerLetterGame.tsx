"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cheers, mascotFaces, miniGames, toddlerAnimals, toddlerLetters } from "@/data/toddlerGame";
import { cn } from "@/utils/cn";
import { Language, useI18n } from "@/utils/useI18n";
import { useSoundEffects } from "@/utils/useSoundEffects";
import { useVoiceQueue } from "@/utils/useVoiceQueue";

type Mode = "welcome" | "home" | "letters" | "animals" | "minis";
type MiniGameId = (typeof miniGames)[number]["id"];
type ToddlerAnimal = (typeof toddlerAnimals)[number];
type VoiceClipKind = "encouragement";
type RecordedVoiceClip = {
  id: string;
  label: string;
  kind: VoiceClipKind;
  dataUrl: string;
  createdAt: number;
};

type GameFeedback = {
  wrongChoice: string | null;
  celebrationId: number;
  celebrating: boolean;
};

const SETUP_KEY = "little-learners-parent-setup-complete";
const SETUP_VERSION = "4";
const VOICE_KEY = "little-learners-parent-voice-clips";
const STARS_KEY = "little-learners-toy-stars";
const MUTE_KEY = "little-learners-muted";
const WELCOMED_KEY = "little-learners-welcomed-this-session";

const mainChoiceLayouts = [
  { left: "12%", top: "28%", x: [0, 42, -18, 28, 0], y: [0, -28, 24, -12, 0], rotate: [-6, 9, -4, 7, -6], duration: 4.2 },
  { left: "58%", top: "26%", x: [0, -36, 24, -18, 0], y: [0, 22, -26, 14, 0], rotate: [5, -8, 6, -5, 5], duration: 4.6 },
  { left: "25%", top: "52%", x: [0, 34, -28, 18, 0], y: [0, 28, -18, 24, 0], rotate: [-3, 8, -7, 4, -3], duration: 4.4 },
  { left: "56%", top: "56%", x: [0, -32, 26, -24, 0], y: [0, -24, 22, -14, 0], rotate: [4, -7, 8, -5, 4], duration: 4.8 },
  { left: "40%", top: "74%", x: [0, 28, -34, 20, 0], y: [0, -30, 16, -22, 0], rotate: [-5, 6, -9, 5, -5], duration: 4.5 },
  { left: "72%", top: "42%", x: [0, -38, 20, -28, 0], y: [0, 18, -30, 12, 0], rotate: [6, -9, 5, -6, 6], duration: 4.7 }
];

const miniChoiceLayouts = [
  { left: "10%", top: "34%" },
  { left: "68%", top: "34%" },
  { left: "22%", top: "58%" },
  { left: "62%", top: "60%" },
  { left: "42%", top: "46%" }
];

const bubblePositions = [
  "left-[8%] top-[16%]",
  "left-[64%] top-[15%]",
  "left-[28%] top-[38%]",
  "left-[72%] top-[48%]",
  "left-[12%] top-[58%]",
  "left-[48%] top-[64%]"
];

const localizedLetters: Record<Language, readonly string[]> = {
  en: toddlerLetters,
  de: toddlerLetters,
  fa: ["آ", "ب", "پ", "ت", "ث", "ج", "چ", "ح"]
};

function triggerHaptic(pattern: number | number[] = 18) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function formatDragPrompt(language: Language, target: string) {
  return language === "fa" ? `حرف ${target} را بکش!` : `Drag ${target}!`;
}

function formatCatchPrompt(language: Language, target: string) {
  return language === "fa" ? `${target} را بگیر!` : `Catch ${target}!`;
}

function formatFindPrompt(language: Language, target: string) {
  return language === "fa" ? `${target} را پیدا کن!` : `Find ${target}!`;
}

export function ToddlerLetterGame() {
  const { dir, language, setLanguage, t } = useI18n();
  const [mode, setMode] = useState<Mode>("welcome");
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
  const voiceQueue = useVoiceQueue(muted);
  const { playBuzzer, playCheer, playClap, playPop, playSparkle } = useSoundEffects(muted);

  const letterPool = localizedLetters[language] ?? localizedLetters.en;
  const targetLetter = letterPool[round % letterPool.length];
  const targetAnimal = toddlerAnimals[round % toddlerAnimals.length];
  const starSlots = Array.from({ length: 8 }, (_, index) => index < Math.min(stars, 8));
  const cheer = cheers[(round + stars) % cheers.length];
  const encouragementClips = voiceClips.filter((clip) => clip.kind === "encouragement");

  const floatingLetters = useMemo(() => {
    const start = round % letterPool.length;
    const pool = Array.from({ length: 6 }, (_, index) => letterPool[(start + index) % letterPool.length]);
    return pool.includes(targetLetter) ? pool : [targetLetter, ...pool.slice(1)];
  }, [letterPool, round, targetLetter]);

  const visibleAnimals = useMemo(() => {
    const start = round % toddlerAnimals.length;
    const pool = Array.from({ length: 6 }, (_, index) => toddlerAnimals[(start + index) % toddlerAnimals.length]);
    return pool.some((animal) => animal.name === targetAnimal.name) ? pool : [targetAnimal, ...pool.slice(1)];
  }, [round, targetAnimal]);

  useEffect(() => {
    const complete = window.localStorage.getItem(SETUP_KEY) === SETUP_VERSION;
    setSetupComplete(complete);
    setMode(complete && window.sessionStorage.getItem(WELCOMED_KEY) === "true" ? "home" : "welcome");
    setMuted(window.localStorage.getItem(MUTE_KEY) === "true");

    const storedClips = window.localStorage.getItem(VOICE_KEY);
    if (storedClips) {
      try {
        const parsedClips = JSON.parse(storedClips) as Array<RecordedVoiceClip | Omit<RecordedVoiceClip, "kind">>;
        setVoiceClips(
          parsedClips.map((clip) => ({
            ...clip,
            kind: "kind" in clip ? clip.kind : "encouragement"
          }))
        );
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
      const timer = window.setTimeout(() => playInstruction(t("game.catch"), targetLetter), 450);
      return () => window.clearTimeout(timer);
    }

    if (mode === "animals") {
      const timer = window.setTimeout(() => playInstruction(t("game.find"), targetAnimal.name), 450);
      return () => window.clearTimeout(timer);
    }
  }, [mode, targetAnimal.name, targetLetter, t]);

  function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
      window.setTimeout(resolve, milliseconds);
    });
  }

  async function playInstruction(action: string, target: string) {
    if (muted) {
      return;
    }

    await voiceQueue.speak(`${action} ${target}`, 3);
  }

  async function playEncouragement(fallbackVoice: string) {
    if (muted) {
      await wait(1000);
      return;
    }

    const clip = encouragementClips.length > 0 ? encouragementClips[Math.floor(Math.random() * encouragementClips.length)] : null;
    if (clip) {
      await voiceQueue.playClip(clip.dataUrl, 1);
      return;
    }

    await voiceQueue.speak(fallbackVoice, 1);
  }

  async function reward(extraVoice?: string) {
    if (feedback.celebrating) {
      return;
    }

    voiceQueue.clear();
    setFeedback((current) => ({
      wrongChoice: null,
      celebrationId: current.celebrationId + 1,
      celebrating: true
    }));
    setStars((current) => current + 1);
    triggerHaptic([18, 40, 18]);
    playPop();
    playClap();
    playCheer();
    playSparkle();

    await playEncouragement(extraVoice ?? cheer);
    await wait(500);

    setFeedback((current) => ({ ...current, celebrating: false }));
    setRound((current) => current + 1);
  }

  function retry(id: string) {
    setFeedback((current) => ({ ...current, wrongChoice: id }));
    triggerHaptic(12);
    playBuzzer();
    window.setTimeout(() => setFeedback((current) => ({ ...current, wrongChoice: null })), 620);
  }

  function chooseMode(nextMode: Mode) {
    voiceQueue.clear();
    setMode(nextMode);
    setParentOpen(false);
    playPop();
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
      bubbles: t("game.tapBubbles"),
      monster: t("game.feedMonster"),
      fishing: formatDragPrompt(language, targetLetter),
      star: t("game.catchFish")
    };
    if (id === "fishing") {
      void playInstruction(t("game.drag"), targetLetter);
      return;
    }
    void voiceQueue.speak(prompts[id], 3);
  }

  function resetStars() {
    setStars(0);
    setRound(0);
    setFedCount(0);
    setParentOpen(false);
  }

  function completeSetup(clips: RecordedVoiceClip[]) {
    const parentVoiceClips = clips.filter((clip) => clip.kind === "encouragement");
    setVoiceClips(parentVoiceClips);
    window.localStorage.setItem(VOICE_KEY, JSON.stringify(parentVoiceClips));
    window.localStorage.setItem(SETUP_KEY, SETUP_VERSION);
    setSetupComplete(true);
    setMode("welcome");
  }

  function startWelcome() {
    window.sessionStorage.setItem(WELCOMED_KEY, "true");
    chooseMode("home");
  }

  if (!storageReady) {
    return <section className="toy-screen min-h-[calc(100svh-5rem)]" />;
  }

  if (!setupComplete) {
    return <ParentSetupScreen dir={dir} language={language} onContinue={completeSetup} setLanguage={setLanguage} t={t} />;
  }

  return (
    <section className="toy-screen relative min-h-[calc(100svh-5rem)] overflow-hidden px-4 pb-5 pt-2 sm:px-6" dir={dir}>
      <FloatingParticles />
      <Confetti show={feedback.celebrating} celebrationId={feedback.celebrationId} />
      <CelebrationBurst show={feedback.celebrating} celebrationId={feedback.celebrationId} />

      <div className="relative z-20 flex items-center justify-between gap-3">
        {mode === "home" ? (
          <span className="rounded-full bg-white/55 px-4 py-3 text-sm font-black text-ink shadow-soft backdrop-blur dark:bg-white/10 dark:text-white">
            {t("home.toyTime")}
          </span>
        ) : (
          <button className="rounded-full bg-white/65 px-5 py-3 text-base font-black text-ink shadow-soft backdrop-blur dark:bg-white/10 dark:text-white" onClick={() => chooseMode("home")} type="button">
            {t("home.home")}
          </button>
        )}
        <div className="flex gap-1 rounded-full bg-white/60 p-2 shadow-soft backdrop-blur dark:bg-white/10" aria-label={`${stars} ${t("parent.stars")}`}>
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
        voiceClipCount={voiceClips.filter((clip) => clip.kind === "encouragement").length}
        onReset={resetStars}
        onToggleMute={() => setMuted((current) => !current)}
        onRedoSetup={() => {
          window.localStorage.removeItem(SETUP_KEY);
          setSetupComplete(false);
          setParentOpen(false);
        }}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />

      <AnimatePresence mode="wait">
        {mode === "home" ? (
          <HomeToy key="home" onChoose={chooseMode} mascotHappy={feedback.celebrating} t={t} />
        ) : null}
        {mode === "welcome" ? (
          <WelcomeToy key="welcome" onStart={startWelcome} t={t} />
        ) : null}
        {mode === "letters" ? (
          <LettersMode key="letters" target={targetLetter} letters={floatingLetters} language={language} wrongChoice={feedback.wrongChoice} celebrating={feedback.celebrating} onPick={chooseLetter} t={t} />
        ) : null}
        {mode === "animals" ? (
          <AnimalsMode key="animals" target={targetAnimal.name} animals={visibleAnimals} language={language} wrongChoice={feedback.wrongChoice} celebrating={feedback.celebrating} onPick={chooseAnimal} t={t} />
        ) : null}
        {mode === "minis" ? (
          <MiniGamesMode
            key="minis"
            activeMini={activeMini}
            targetLetter={targetLetter}
            letterPool={letterPool}
            language={language}
            wrongChoice={feedback.wrongChoice}
            fedCount={fedCount}
            onChooseMini={playMini}
            onReward={reward}
            onRetry={retry}
            onFeed={() => {
              setFedCount((current) => current + 1);
              reward("Yum!");
            }}
            t={t}
          />
        ) : null}
      </AnimatePresence>

      <button
        aria-label={t("home.parentArea")}
        className="absolute bottom-4 left-4 z-30 rounded-full bg-white/55 px-4 py-3 text-sm font-black text-ink shadow-soft backdrop-blur dark:bg-white/10 dark:text-white"
        onClick={() => setParentOpen((open) => !open)}
        type="button"
      >
        {t("home.parentArea")}
      </button>
    </section>
  );
}

type Translate = ReturnType<typeof useI18n>["t"];

function ParentSetupScreen({
  dir,
  language,
  onContinue,
  setLanguage,
  t
}: {
  dir: "ltr" | "rtl";
  language: Language;
  onContinue: (clips: RecordedVoiceClip[]) => void;
  setLanguage: (language: Language) => void;
  t: Translate;
}) {
  const [clips, setClips] = useState<RecordedVoiceClip[]>([]);
  const [recordingSlot, setRecordingSlot] = useState<VoiceClipKind | null>(null);
  const [duration, setDuration] = useState(0);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const recordedClip = clips.find((clip) => clip.kind === "encouragement") ?? null;
  const isRecording = recordingSlot === "encouragement";

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
    };
  }, []);

  async function startRecording(kind: VoiceClipKind) {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setError(t("setup.unsupportedError"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorderRef.current = recorder;
      setRecordingSlot(kind);
      setDuration(0);
      setRecordedDuration(0);
      setError(null);
      startedAtRef.current = Date.now();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      timerRef.current = window.setInterval(() => {
        setDuration(Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)));
      }, 250);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalDuration = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = String(reader.result);
          setClips((current) => {
            const withoutSlot = current.filter((clip) => clip.kind !== kind);
            return [
              ...withoutSlot,
              {
                id: `voice-${kind}`,
                label: t("setup.headline"),
                kind,
                dataUrl,
                createdAt: Date.now()
              }
            ].sort((a, b) => a.kind.localeCompare(b.kind));
          });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
        setRecordingSlot(null);
        setDuration(finalDuration);
        setRecordedDuration(finalDuration);
      };

      recorder.start();
    } catch {
      setError(t("setup.permissionError"));
      setRecordingSlot(null);
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function playPreview(kind: VoiceClipKind) {
    const clip = clips.find((item) => item.kind === kind);
    if (!clip) {
      return;
    }
    const audio = new Audio(clip.dataUrl);
    audio.volume = 0.9;
    void audio.play();
  }

  return (
    <section className="toy-screen relative min-h-[calc(100svh-5rem)] overflow-hidden px-4 py-5 sm:px-6" dir={dir}>
      <FloatingParticles />
      <motion.div className="relative z-10 mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-6xl flex-col gap-5 py-1 sm:py-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-banana text-2xl shadow-soft" aria-hidden="true">⭐</span>
            <div className="min-w-0">
              <p className="truncate text-lg font-black text-ink dark:text-white">Little Learners</p>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-berry">{t("setup.eyebrow")}</p>
            </div>
          </div>
          <LanguageSelector language={language} setLanguage={setLanguage} t={t} />
        </div>

        <div className="grid flex-1 items-center gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/80 bg-white/86 p-5 shadow-lift backdrop-blur dark:border-white/10 dark:bg-slate-900/90 sm:p-7">
            <div className="mb-5 flex items-center gap-4">
              <FamilyIllustration />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-berry">{t("setup.eyebrow")}</p>
                <h1 className="mt-1 text-4xl font-black leading-tight text-ink dark:text-white sm:text-5xl">{t("setup.headline")}</h1>
              </div>
            </div>
            <p className="text-lg font-bold leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              {t("setup.subheadline")}
            </p>

            <div className="mt-5 rounded-3xl border border-banana/55 bg-banana/20 p-4 shadow-soft dark:border-banana/30 dark:bg-banana/10">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-soft dark:bg-white/10" aria-hidden="true">👪</span>
                <div>
                  <h2 className="text-xl font-black text-ink dark:text-white">{t("setup.noticeTitle")}</h2>
                  <p className="mt-1 text-base font-bold leading-7 text-slate-600 dark:text-slate-300">{t("setup.noticeBody")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-lift backdrop-blur dark:border-white/10 dark:bg-slate-900/90 sm:p-7">
            <div className="grid place-items-center gap-4 text-center">
              <MicrophoneIllustration recording={isRecording} />
              <p className="max-w-md text-lg font-black leading-7 text-ink dark:text-white">{t("setup.micLabel")}</p>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-4 dark:bg-white/10">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black uppercase tracking-[0.13em] text-slate-500 dark:text-slate-300">{t("setup.duration")}</span>
                <span className="rounded-full bg-white px-4 py-2 text-lg font-black text-ink shadow-soft dark:bg-slate-900 dark:text-white">{formatDuration(isRecording ? duration : recordedDuration)}</span>
              </div>
              <Waveform active={isRecording} ready={Boolean(recordedClip)} />
            </div>

            {error ? <p className="mt-4 rounded-2xl bg-red-100 px-4 py-3 text-sm font-black text-red-600 dark:bg-red-950/50 dark:text-red-200">{error}</p> : null}

            <div className="mt-5 grid gap-3">
              {isRecording ? (
                <button className="min-h-16 rounded-[1.5rem] bg-red-500 px-6 text-xl font-black text-white shadow-soft focus:outline-none focus:ring-4 focus:ring-red-200" onClick={stopRecording} type="button">
                  {t("setup.stopRecording")}
                </button>
              ) : (
                <button className="min-h-16 rounded-[1.5rem] bg-berry px-6 text-xl font-black text-white shadow-soft focus:outline-none focus:ring-4 focus:ring-berry/30" onClick={() => startRecording("encouragement")} type="button">
                  {recordedClip ? t("setup.recordAgain") : t("setup.startRecording")}
                </button>
              )}

              {recordedClip ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <button className="min-h-14 rounded-[1.4rem] bg-banana px-5 text-base font-black text-ink shadow-soft focus:outline-none focus:ring-4 focus:ring-banana/45" onClick={() => playPreview("encouragement")} disabled={isRecording} type="button">
                    {t("setup.playPreview")}
                  </button>
                  <button className="min-h-14 rounded-[1.4rem] bg-leaf px-5 text-base font-black text-ink shadow-soft focus:outline-none focus:ring-4 focus:ring-leaf/35" onClick={() => onContinue(clips)} disabled={isRecording} type="button">
                    {t("setup.continue")}
                  </button>
                </div>
              ) : (
                <button className="min-h-14 rounded-[1.4rem] bg-slate-200 px-5 text-base font-black text-slate-500 shadow-soft dark:bg-white/10 dark:text-slate-400" disabled type="button">
                  {t("setup.continue")}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function LanguageSelector({ language, setLanguage, t }: { language: Language; setLanguage: (language: Language) => void; t: Translate }) {
  const options: Language[] = ["en", "de", "fa"];

  return (
    <label className="flex items-center gap-2 rounded-2xl bg-white/75 px-3 py-2 shadow-soft backdrop-blur dark:bg-white/10">
      <span className="sr-only">{t("language.label")}</span>
      <span className="text-lg" aria-hidden="true">🌐</span>
      <select
        aria-label={t("language.label")}
        className="min-h-11 rounded-xl bg-transparent px-2 text-sm font-black text-ink outline-none dark:text-white"
        onChange={(event) => setLanguage(event.target.value as Language)}
        value={language}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {t(`language.${option}`)}
          </option>
        ))}
      </select>
    </label>
  );
}

function FamilyIllustration() {
  return (
    <div className="relative h-24 w-24 shrink-0" aria-hidden="true">
      <div className="absolute inset-x-2 bottom-1 h-16 rounded-[2rem] bg-mint/70 shadow-soft" />
      <div className="absolute left-1 top-3 grid h-16 w-16 place-items-center rounded-full bg-banana text-4xl shadow-soft">👩</div>
      <div className="absolute right-0 top-7 grid h-14 w-14 place-items-center rounded-full bg-sky/80 text-3xl shadow-soft">👨</div>
      <div className="absolute bottom-0 left-9 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-soft dark:bg-white/20">👶</div>
    </div>
  );
}

function MicrophoneIllustration({ recording }: { recording: boolean }) {
  return (
    <div className="relative grid h-40 w-40 place-items-center" aria-hidden="true">
      <motion.span
        className={cn("absolute h-36 w-36 rounded-full bg-berry/15", recording && "bg-red-400/20")}
        animate={recording ? { scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] } : { scale: [1, 1.05, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative grid h-28 w-28 place-items-center rounded-[2rem] bg-ink text-6xl text-white shadow-lift dark:bg-white dark:text-ink">🎙️</div>
    </div>
  );
}

function Waveform({ active, ready }: { active: boolean; ready: boolean }) {
  const bars = [24, 42, 30, 58, 36, 64, 46, 72, 40, 60, 34, 52, 28, 48, 32, 44, 26, 38];

  return (
    <div className="mt-4 flex h-24 items-center justify-center gap-1 rounded-2xl bg-white px-3 shadow-inner dark:bg-slate-950/50" aria-hidden="true">
      {bars.map((height, index) => (
        <motion.span
          key={index}
          className={cn("w-2 rounded-full", active ? "bg-berry" : ready ? "bg-leaf" : "bg-slate-200 dark:bg-white/15")}
          animate={active ? { height: [18, height, 20 + (index % 4) * 8] } : { height: ready ? height : 18 }}
          transition={{ duration: 0.75, repeat: active ? Infinity : 0, repeatType: "mirror", delay: index * 0.035 }}
        />
      ))}
    </div>
  );
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function WelcomeToy({ onStart, t }: { onStart: () => void; t: Translate }) {
  return (
    <motion.div
      className="relative z-10 mx-auto flex min-h-[calc(100svh-10rem)] max-w-5xl flex-col items-center justify-center gap-7 py-8 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
    >
      <motion.div
        className="relative grid h-44 w-44 place-items-center rounded-[3rem] bg-white/72 text-8xl shadow-lift backdrop-blur sm:h-64 sm:w-64 sm:text-9xl"
        animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <span className="absolute -right-4 -top-4 grid h-16 w-16 place-items-center rounded-full bg-banana text-3xl shadow-soft">⭐</span>
        {mascotFaces.happy}
      </motion.div>
      <div className="grid gap-2">
        <h1 className="text-5xl font-black text-ink dark:text-white sm:text-7xl">{t("home.welcomeTitle")}</h1>
        <p className="text-2xl font-black text-berry sm:text-3xl">{t("home.welcomeTagline")}</p>
      </div>
      <motion.button
        className="min-h-20 rounded-[2rem] bg-berry px-10 text-3xl font-black text-white shadow-lift outline-none ring-offset-4 focus:ring-8 focus:ring-banana"
        whileTap={{ scale: 0.92 }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        onClick={onStart}
        type="button"
      >
        {t("home.getStarted")}
      </motion.button>
    </motion.div>
  );
}

function HomeToy({ onChoose, mascotHappy, t }: { onChoose: (mode: Mode) => void; mascotHappy: boolean; t: Translate }) {
  const buttons: Array<{ mode: Mode; label: string; emoji: string; className: string }> = [
    { mode: "letters", label: t("home.letters"), emoji: "🔤", className: "bg-[#ff7aa8]" },
    { mode: "animals", label: t("home.animals"), emoji: "🦁", className: "bg-[#7dd3fc]" },
    { mode: "minis", label: t("home.miniGames"), emoji: "⭐", className: "bg-[#86efac]" }
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

function LettersMode({ target, letters, language, wrongChoice, celebrating, onPick, t }: { target: string; letters: readonly string[]; language: Language; wrongChoice: string | null; celebrating: boolean; onPick: (letter: string) => void; t: Translate }) {
  const letterColors = [
    "bg-white/72 text-ink dark:bg-white/12 dark:text-white",
    "bg-mint/65 text-ink",
    "bg-sky/55 text-ink",
    "bg-leaf/55 text-ink",
    "bg-white/72 text-plum dark:bg-white/12",
    "bg-banana/50 text-ink"
  ];

  return (
    <motion.div className="relative z-10 h-[calc(100svh-10rem)] min-h-[34rem]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <MascotPrompt mascot={celebrating ? mascotFaces.sparkle : mascotFaces.happy} prompt={formatCatchPrompt(language, target)} celebrating={celebrating} />
      {letters.map((letter, index) => {
        const path = mainChoiceLayouts[index % mainChoiceLayouts.length];
        const isTarget = letter === target;
        return (
          <motion.button
            key={`${letter}-${index}-${target}`}
            aria-label={`${t("game.catch")} ${letter}`}
            className={cn(
              "absolute grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-6xl font-black shadow-lift backdrop-blur sm:h-36 sm:w-36 sm:text-8xl",
              isTarget ? "z-10 bg-banana/95 text-berry ring-8 ring-banana/45" : letterColors[index % letterColors.length],
              wrongChoice === letter && "z-20 bg-red-400 text-white ring-8 ring-red-200"
            )}
            style={{ left: path.left, top: path.top }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={
              wrongChoice === letter
                ? { x: [0, 14, -12, 0], y: 0, opacity: 1 }
                : {
                    x: path.x,
                    y: path.y,
                    rotate: path.rotate,
                    opacity: 1,
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

function AnimalsMode({ target, animals, language, wrongChoice, celebrating, onPick, t }: { target: string; animals: readonly ToddlerAnimal[]; language: Language; wrongChoice: string | null; celebrating: boolean; onPick: (name: string, sound: string) => void; t: Translate }) {
  const animalColors = ["bg-white/72", "bg-mint/60", "bg-sky/50", "bg-leaf/50", "bg-banana/45", "bg-white/72"];

  return (
    <motion.div className="relative z-10 h-[calc(100svh-10rem)] min-h-[34rem]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <MascotPrompt mascot={celebrating ? mascotFaces.sparkle : "🐯"} prompt={formatFindPrompt(language, target)} celebrating={celebrating} />
      {animals.map((animal, index) => {
        const path = mainChoiceLayouts[index % mainChoiceLayouts.length];
        const isTarget = animal.name === target;
        return (
          <motion.button
            key={`${animal.name}-${target}`}
            aria-label={`${t("game.find")} ${animal.name}`}
            className={cn(
              "absolute grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2.25rem] text-7xl shadow-lift backdrop-blur sm:h-40 sm:w-40 sm:text-8xl",
              isTarget ? "z-10 bg-banana/95 ring-8 ring-banana/45" : animalColors[index % animalColors.length],
              wrongChoice === animal.name && "z-20 bg-red-400 ring-8 ring-red-200"
            )}
            style={{ left: path.left, top: path.top }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={
              wrongChoice === animal.name
                ? { x: [0, -10, 10, -6, 0], rotate: [0, -8, 8, -5, 0], opacity: 1 }
                : {
                    x: path.x,
                    y: path.y,
                    rotate: isTarget && celebrating ? [0, -12, 12, 0] : [0, 4, -4, 0],
                    opacity: 1,
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

function MiniGamesMode({
  activeMini,
  targetLetter,
  letterPool,
  language,
  wrongChoice,
  fedCount,
  onChooseMini,
  onReward,
  onRetry,
  onFeed,
  t
}: {
  activeMini: MiniGameId;
  targetLetter: string;
  letterPool: readonly string[];
  language: Language;
  wrongChoice: string | null;
  fedCount: number;
  onChooseMini: (id: MiniGameId) => void;
  onReward: (voice?: string) => void;
  onRetry: (id: string) => void;
  onFeed: () => void;
  t: Translate;
}) {
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
            <span className="grid place-items-center" aria-hidden="true">
              {game.id === "star" ? <CuteRedFish small /> : game.emoji}
            </span>
          </motion.button>
        ))}
      </div>
      <div className="relative min-h-[31rem] flex-1 overflow-hidden rounded-[3rem] bg-white/35 shadow-soft backdrop-blur dark:bg-white/5">
        {activeMini === "bubbles" ? <BubblePop onReward={() => onReward(t("game.pop"))} t={t} /> : null}
        {activeMini === "monster" ? <FeedMonster fedCount={fedCount} onFeed={onFeed} /> : null}
        {activeMini === "fishing" ? <DragLetters target={targetLetter} letterPool={letterPool} language={language} wrongChoice={wrongChoice} onReward={onReward} onRetry={onRetry} t={t} /> : null}
        {activeMini === "star" ? <CatchFish onReward={() => onReward(t("game.catchFish"))} t={t} /> : null}
      </div>
    </motion.div>
  );
}

function BubblePop({ onReward, t }: { onReward: () => void; t: Translate }) {
  const [popped, setPopped] = useState<string[]>([]);
  const [wrongBubble, setWrongBubble] = useState<string | null>(null);
  const correctCount = bubblePositions.length - 1;

  function popBubble(id: string, isDecoy: boolean) {
    if (isDecoy) {
      setWrongBubble(id);
      triggerHaptic(10);
      window.setTimeout(() => setWrongBubble(null), 580);
      return;
    }

    if (popped.includes(id)) {
      return;
    }

    const nextPopped = [...popped, id];
    setPopped(nextPopped);
    triggerHaptic([12, 28, 12]);
    onReward();

    if (nextPopped.length >= correctCount) {
      window.setTimeout(() => setPopped([]), 900);
    }
  }

  return (
    <div className="relative h-full min-h-[31rem]">
      <MascotPrompt mascot="🫧" prompt={t("game.tapBubbles")} celebrating={false} compact />
      <VisualInstruction label={t("game.tapBubbles")} />
      <AnimatePresence>
        {bubblePositions.map((position, index) => {
          const id = `bubble-${index}`;
          const isDecoy = index === 2;
          if (popped.includes(id)) {
            return (
              <PopBurst key={`burst-${id}`} position={position} />
            );
          }

          return (
            <motion.button
              key={id}
              className={cn(
                "absolute grid h-28 w-28 place-items-center rounded-full bg-white/85 text-6xl shadow-lift ring-2 ring-white/70 outline-none backdrop-blur focus:ring-8 focus:ring-banana/40 sm:h-36 sm:w-36 sm:text-7xl",
                position,
                wrongBubble === id && "ring-8 ring-berry/30"
              )}
              initial={{ opacity: 0, scale: 0.65 }}
              animate={
                wrongBubble === id
                  ? { x: [0, -9, 9, -5, 0], scale: [1, 0.96, 1] }
                  : { x: [0, 10 + index * 2, -8, 0], y: [0, -22, 10, 0], scale: isDecoy ? [1, 1.02, 1] : [1, 1.12, 1] }
              }
              exit={{ opacity: 0, scale: [1, 1.4, 0], rotate: 18 }}
              transition={wrongBubble === id ? { duration: 0.46 } : { duration: 4.6 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
              whileTap={{ scale: 0.72 }}
              onClick={() => popBubble(id, isDecoy)}
              type="button"
              aria-label={isDecoy ? t("game.tryAgain") : t("game.pop")}
            >
              {isDecoy ? "☁️" : "🫧"}
            </motion.button>
          );
        })}
      </AnimatePresence>
      {wrongBubble ? (
        <motion.p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/75 px-5 py-2 text-xl font-black text-berry shadow-soft" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {t("game.tryAgain")}
        </motion.p>
      ) : null}
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

function DragLetters({
  target,
  letterPool,
  language,
  wrongChoice,
  onReward,
  onRetry,
  t
}: {
  target: string;
  letterPool: readonly string[];
  language: Language;
  wrongChoice: string | null;
  onReward: () => void;
  onRetry: (id: string) => void;
  t: Translate;
}) {
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [successId, setSuccessId] = useState(0);
  const targetIndex = Math.max(0, letterPool.indexOf(target));
  const choices = Array.from({ length: Math.min(5, letterPool.length) }, (_, index) => letterPool[(targetIndex + index * 2) % letterPool.length]);

  function handleDrop(letter: string, point: { x: number; y: number }) {
    const rect = dropRef.current?.getBoundingClientRect();
    const insideDropZone = rect ? point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom : false;

    if (!insideDropZone) {
      return;
    }

    if (letter === target) {
      setSuccessId((current) => current + 1);
      onReward();
      return;
    }

    onRetry(letter);
  }

  return (
    <div className="relative h-full min-h-[31rem] overflow-hidden bg-sky/10">
      <MascotPrompt mascot="🧺" prompt={formatDragPrompt(language, target)} celebrating={false} compact />
      <VisualInstruction label={formatDragPrompt(language, target)} drag />
      <div className="absolute left-1/2 top-28 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/75 px-5 py-3 text-xl font-black text-ink shadow-soft">
        <span className="text-sm uppercase tracking-[0.12em] text-berry">{t("game.target")}</span>
        <span className="grid h-14 w-14 place-items-center rounded-full bg-banana text-4xl text-berry">{target}</span>
      </div>
      <motion.div
        ref={dropRef}
        className="absolute bottom-6 left-1/2 z-10 grid h-32 w-64 -translate-x-1/2 place-items-center rounded-[2.25rem] border-4 border-dashed border-banana bg-white/65 text-2xl font-black text-ink shadow-lift backdrop-blur sm:h-40 sm:w-80"
        animate={{ scale: [1, 1.04, 1], boxShadow: ["0 20px 55px rgba(255, 209, 102, 0.20)", "0 26px 75px rgba(255, 122, 168, 0.32)", "0 20px 55px rgba(255, 209, 102, 0.20)"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-5xl" aria-hidden="true">🧺</span>
        {t("game.dropHere")}
      </motion.div>
      <AnimatePresence>
        {successId ? <PopBurst key={`letter-success-${successId}`} position="left-1/2 top-1/2" /> : null}
      </AnimatePresence>
      {choices.map((letter, index) => {
        const path = miniChoiceLayouts[index % miniChoiceLayouts.length];
        return (
          <motion.button
            key={`${target}-${letter}`}
            className={cn(
              "absolute z-20 grid h-28 w-36 cursor-grab place-items-center rounded-full text-6xl font-black shadow-lift outline-none active:cursor-grabbing sm:h-32 sm:w-44 sm:text-7xl",
              letter === target ? "bg-banana/90 text-berry ring-8 ring-banana/45" : "bg-white/70 text-sky",
              wrongChoice === letter && "bg-red-400 text-white ring-8 ring-red-200"
            )}
            style={{ left: path.left, top: path.top }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={
              wrongChoice === letter
                ? { x: [0, 12, -10, 0], opacity: 1 }
                : { x: [0, 18, -14, 10, 0], y: [0, -18, 12, -10, 0], rotate: [-4, 7, -6, 4, -4], opacity: 1, scale: letter === target ? [1, 1.14, 1] : [1, 1.04, 1] }
            }
            transition={wrongChoice === letter ? { duration: 0.4 } : { duration: 4.2 + index * 0.25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            drag
            dragSnapToOrigin
            dragElastic={0.14}
            whileDrag={{ scale: 1.18, zIndex: 40, rotate: 0 }}
            whileTap={{ scale: 0.96 }}
            onDragEnd={(_, info) => handleDrop(letter, info.point)}
            type="button"
            aria-label={`${t("game.drag")} ${letter}`}
          >
            {letter}
          </motion.button>
        );
      })}
    </div>
  );
}

function CatchFish({ onReward, t }: { onReward: () => void; t: Translate }) {
  const [caught, setCaught] = useState(false);
  const [swimRound, setSwimRound] = useState(0);
  const paths = [
    { left: "16%", top: "34%", x: [0, 220, 90, 340, 0], y: [0, -36, 150, 58, 0], rotate: [-8, 10, -12, 8, -8] },
    { left: "62%", top: "62%", x: [0, -260, 80, -180, 0], y: [0, -128, -260, 42, 0], rotate: [8, -12, 10, -8, 8] },
    { left: "34%", top: "28%", x: [0, 300, 160, -90, 0], y: [0, 120, 260, 90, 0], rotate: [-6, 12, 7, -10, -6] }
  ];
  const path = paths[swimRound % paths.length];

  function catchFish() {
    if (caught) {
      return;
    }

    setCaught(true);
    triggerHaptic([20, 35, 20]);
    onReward();
    window.setTimeout(() => {
      setCaught(false);
      setSwimRound((current) => current + 1);
    }, 950);
  }

  return (
    <div className="relative h-full min-h-[31rem]">
      <MascotPrompt mascot="🐟" prompt={t("game.catchFish")} celebrating={false} compact />
      <VisualInstruction label={t("game.catchFish")} />
      <AnimatePresence>
        {!caught ? (
          <motion.button
            key={`fish-${swimRound}`}
            className="absolute grid h-36 w-52 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/65 shadow-lift outline-none backdrop-blur focus:ring-8 focus:ring-banana/40 sm:h-44 sm:w-64"
            style={{ left: path.left, top: path.top }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, x: path.x, y: path.y, rotate: path.rotate, scale: [1, 1.06, 0.98, 1.04, 1] }}
            exit={{ opacity: 0, scale: 0.2, rotate: 24 }}
            transition={{ duration: 4.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            whileTap={{ scale: 0.8 }}
            onClick={catchFish}
            type="button"
            aria-label={t("game.catchFish")}
          >
            <CuteRedFish />
            <motion.span className="pointer-events-none absolute right-2 top-2 text-2xl" animate={{ x: [0, 14, 24], y: [0, -10, -24], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>🫧</motion.span>
            <motion.span className="pointer-events-none absolute right-8 top-9 text-xl" animate={{ x: [0, 18, 30], y: [0, -14, -30], opacity: [0, 1, 0] }} transition={{ duration: 1.7, repeat: Infinity, delay: 0.35 }}>🫧</motion.span>
          </motion.button>
        ) : (
          <motion.div
            key={`splash-${swimRound}`}
            className="absolute left-1/2 top-1/2 grid h-44 w-44 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sky/40 text-7xl shadow-lift"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.45, 1.8], rotate: [0, -8, 8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.82, ease: "easeOut" }}
          >
            💦✨
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VisualInstruction({ label, drag = false }: { label: string; drag?: boolean }) {
  return (
    <div className="pointer-events-none absolute right-5 top-28 z-30 hidden items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-sm font-black text-ink shadow-soft backdrop-blur sm:flex">
      <motion.span
        className="text-3xl"
        animate={drag ? { x: [0, -22, 20, 0], y: [0, 10, -6, 0], rotate: [0, -10, 8, 0] } : { y: [0, -10, 0], scale: [1, 1.16, 1] }}
        transition={{ duration: drag ? 1.8 : 1.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        👆
      </motion.span>
      <span>{label}</span>
    </div>
  );
}

function PopBurst({ position }: { position: string }) {
  return (
    <motion.div
      className={cn("pointer-events-none absolute grid h-28 w-28 place-items-center rounded-full text-5xl sm:h-36 sm:w-36", position)}
      initial={{ opacity: 0, scale: 0.45 }}
      animate={{ opacity: [0, 1, 0], scale: [0.45, 1.35, 1.65], rotate: [0, -12, 10] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.72, ease: "easeOut" }}
    >
      🌸✨
    </motion.div>
  );
}

function CuteRedFish({ small = false }: { small?: boolean }) {
  return (
    <span className={cn("relative block", small ? "h-10 w-16" : "h-24 w-40")} aria-hidden="true">
      <span className={cn("absolute rounded-[60%_48%_48%_60%] bg-gradient-to-br from-[#ff174d] via-[#ff4d2e] to-[#ff9f1c] shadow-soft", small ? "left-4 top-2 h-7 w-10" : "left-10 top-5 h-16 w-24")} />
      <span className={cn("absolute h-0 w-0 border-y-transparent", small ? "left-0 top-[14px] border-y-[10px] border-r-[19px] border-r-[#ff174d]" : "left-1 top-9 border-y-[22px] border-r-[42px] border-r-[#ff174d]")} />
      <span className={cn("absolute rounded-full bg-ink", small ? "right-1 top-4 h-1.5 w-1.5" : "right-3 top-10 h-3.5 w-3.5")} />
      <span className={cn("absolute rounded-full bg-white/80", small ? "right-0 top-6 h-1 w-3" : "right-0 top-14 h-2 w-6")} />
      <span className={cn("absolute rotate-[-16deg] rounded-full bg-[#ffd166]/90", small ? "left-8 top-0 h-3 w-4" : "left-20 top-0 h-7 w-10")} />
      <span className={cn("absolute rotate-[18deg] rounded-full bg-[#ffd166]/90", small ? "left-7 bottom-0 h-3 w-4" : "left-18 bottom-0 h-7 w-10")} />
    </span>
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
  onRedoSetup,
  language,
  setLanguage,
  t
}: {
  open: boolean;
  stars: number;
  muted: boolean;
  voiceClipCount: number;
  onToggle: () => void;
  onReset: () => void;
  onToggleMute: () => void;
  onRedoSetup: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translate;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="absolute bottom-20 left-4 z-40 max-w-xs rounded-[2rem] bg-white/95 p-5 shadow-lift dark:bg-slate-900" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-berry">{t("parent.title")}</p>
          <p className="mt-2 text-lg font-black text-ink dark:text-white">{stars} {t("parent.stars")}</p>
          <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
            {voiceClipCount > 0 ? t("parent.clipsSaved") : t("parent.builtIn")}
          </p>
          <div className="mt-4 grid gap-2">
            <div className="rounded-[1.25rem] bg-banana/25 p-2">
              <p className="mb-1 px-2 text-xs font-black uppercase tracking-[0.12em] text-berry">{t("parent.changeLanguage")}</p>
              <LanguageSelector language={language} setLanguage={setLanguage} t={t} />
            </div>
            <button className="rounded-full bg-banana px-5 py-3 text-sm font-black text-ink" onClick={onToggleMute} type="button">
              {muted ? t("parent.soundOn") : t("parent.mute")}
            </button>
            <button className="rounded-full bg-berry px-5 py-3 text-sm font-black text-white" onClick={onRedoSetup} type="button">{t("parent.recordVoices")}</button>
            <button className="rounded-full bg-ink px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-ink" onClick={onReset} type="button">{t("parent.reset")}</button>
            <button className="rounded-full bg-banana px-5 py-3 text-sm font-black text-ink" onClick={onToggle} type="button">{t("parent.close")}</button>
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

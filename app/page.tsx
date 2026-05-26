import Image from "next/image";
import Link from "next/link";
import { MotionArticle, MotionDiv, MotionSection } from "@/components/Motion";
import { ProgressBar } from "@/components/ProgressBar";

const learningPaths = [
  { href: "/letters", title: "Letters", detail: "Meet A to Z with words and sounds.", icon: "🔤", accent: "bg-berry" },
  { href: "/shapes", title: "Shapes", detail: "Spin, tap, and learn friendly shapes.", icon: "🔺", accent: "bg-sky" },
  { href: "/colors", title: "Colors", detail: "Discover bright colors with examples.", icon: "🎨", accent: "bg-leaf" },
  { href: "/games", title: "Games", detail: "Match letters and pictures for points.", icon: "🎮", accent: "bg-plum" },
  { href: "/dashboard", title: "Dashboard", detail: "See progress, stars, and lesson wins.", icon: "📊", accent: "bg-banana" }
];

export default function HomePage() {
  return (
    <div className="page-pad">
      <MotionSection
        className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-black text-berry shadow-soft dark:border-white/10 dark:bg-white/10">
            <span aria-hidden="true">✨</span>
            Playful learning for ages 3-7
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] text-ink dark:text-white sm:text-7xl">
            Learn letters, shapes, colors, and first words.
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-bold leading-9 text-slate-600 dark:text-slate-300">
            Little Learners turns early skills into cheerful, bite-sized adventures with sound, motion, rewards, and parent-friendly progress.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/letters" className="kid-button">Start learning</Link>
            <Link href="/games" className="kid-button bg-white text-ink dark:bg-white/10 dark:text-white">Play a game</Link>
          </div>
          <div className="mt-8 max-w-md">
            <div className="mb-2 flex justify-between text-sm font-black text-ink dark:text-white">
              <span>Today&apos;s adventure</span>
              <span>72%</span>
            </div>
            <ProgressBar value={72} />
          </div>
        </div>
        <MotionDiv
          className="relative"
          initial={{ scale: 0.92, rotate: 2 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 130, damping: 16 }}
        >
          <div className="absolute -left-4 top-6 z-10 rounded-3xl bg-white/90 px-4 py-3 text-3xl shadow-soft dark:bg-slate-900">🌈</div>
          <Image
            src="/images/little-learners-hero.png"
            alt="Colorful learning scene with alphabet blocks and classroom objects"
            width={1200}
            height={900}
            priority
            className="aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-lift"
          />
          <div className="absolute -bottom-5 right-5 z-10 rounded-3xl bg-banana px-5 py-4 text-lg font-black text-ink shadow-soft">+3 stars</div>
        </MotionDiv>
      </MotionSection>

      <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {learningPaths.map((item, index) => (
          <MotionArticle
            key={item.href}
            className="lesson-card group"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Link href={item.href} className="block h-full">
              <span className={`mb-5 grid h-16 w-16 place-items-center rounded-3xl ${item.accent} text-3xl shadow-soft`} aria-hidden="true">{item.icon}</span>
              <h2 className="text-2xl font-black text-ink dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
            </Link>
          </MotionArticle>
        ))}
      </section>
    </div>
  );
}

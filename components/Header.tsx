import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="relative z-30 bg-transparent">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-banana text-2xl shadow-soft" aria-hidden="true">⭐</span>
          <span className="text-lg font-black text-ink dark:text-white sm:text-xl">Little Learners</span>
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}

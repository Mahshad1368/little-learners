"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-white/80 text-xl shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift dark:border-white/10 dark:bg-white/10"
      type="button"
      title="Toggle theme"
    >
      {theme === "light" ? "☀️" : "🌙"}
    </button>
  );
}

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/letters", label: "Letters" },
  { href: "/shapes", label: "Shapes" },
  { href: "/colors", label: "Colors" },
  { href: "/games", label: "Games" },
  { href: "/dashboard", label: "Dashboard" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-lime-50/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-banana text-2xl shadow-soft">⭐</span>
          <span className="text-xl font-black text-ink dark:text-white">Little Learners</span>
        </Link>
        <div className="hidden items-center gap-2 rounded-full bg-white/70 p-1 shadow-soft dark:bg-white/10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-extrabold text-ink transition hover:bg-banana dark:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}

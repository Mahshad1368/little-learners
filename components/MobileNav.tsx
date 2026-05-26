import Link from "next/link";

const navItems = [
  { href: "/letters", label: "ABC", icon: "🔤" },
  { href: "/shapes", label: "Shapes", icon: "🔺" },
  { href: "/colors", label: "Colors", icon: "🎨" },
  { href: "/games", label: "Games", icon: "🎮" },
  { href: "/dashboard", label: "Grownups", icon: "📊" }
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[1.5rem] border border-white/70 bg-white/90 p-2 shadow-lift backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 md:hidden" aria-label="Mobile navigation">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-center text-[0.7rem] font-black text-ink transition hover:bg-banana/60 dark:text-white">
            <span className="text-lg" aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

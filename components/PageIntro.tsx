import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-berry">{eyebrow}</p>
      <h1 className="text-4xl font-black text-ink dark:text-white sm:text-6xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg font-bold leading-8 text-slate-600 dark:text-slate-300">{children}</p>
    </section>
  );
}

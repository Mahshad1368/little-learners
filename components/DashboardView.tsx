import { ProgressBar } from "@/components/ProgressBar";
import { activityItems, dashboardMetrics } from "@/data/dashboard";

export function DashboardView() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <article key={metric.label} className="lesson-card">
            <span className={`mb-4 block h-3 w-16 rounded-full ${metric.accent}`} />
            <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{metric.label}</p>
            <h2 className="mt-2 text-4xl font-black text-ink dark:text-white">{metric.value}</h2>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="lesson-card">
          <h2 className="text-3xl font-black text-ink dark:text-white">Learning progress</h2>
          <p className="mt-2 text-base font-bold text-slate-600 dark:text-slate-300">A quick view of this week&apos;s practice.</p>
          <div className="mt-8 grid place-items-center rounded-[2rem] bg-gradient-to-br from-banana/50 via-mint/40 to-sky/40 p-8 text-center">
            <div className="grid h-44 w-44 place-items-center rounded-full bg-white text-5xl font-black text-ink shadow-soft dark:bg-slate-900 dark:text-white">
              71%
            </div>
          </div>
        </article>

        <article className="lesson-card">
          <h2 className="text-3xl font-black text-ink dark:text-white">Activity cards</h2>
          <div className="mt-5 space-y-4">
            {activityItems.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] bg-white/65 p-4 dark:bg-white/10">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-ink dark:text-white">{item.title}</h3>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{item.detail}</p>
                  </div>
                  <span className={`h-10 w-10 rounded-2xl ${item.accent}`} />
                </div>
                <ProgressBar value={item.progress} />
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

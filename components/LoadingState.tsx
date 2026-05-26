export function LoadingState({ label = "Loading lesson" }: { label?: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-[2rem] border border-white/70 bg-white/70 p-8 text-center shadow-soft dark:border-white/10 dark:bg-white/10">
      <div>
        <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-8 border-banana border-t-berry" />
        <p className="text-lg font-extrabold text-ink dark:text-white">{label}</p>
      </div>
    </div>
  );
}

import { cn } from "@/utils/cn";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div
      aria-label={`${width}% complete`}
      className={cn("h-3 overflow-hidden rounded-full bg-white/70 dark:bg-white/10", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={width}
    >
      <div className="h-full rounded-full bg-gradient-to-r from-berry via-banana to-leaf" style={{ width: `${width}%` }} />
    </div>
  );
}

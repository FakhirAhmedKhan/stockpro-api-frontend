import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label: string;
  tone?: "success" | "neutral" | "warning" | "danger";
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  success: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  danger: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

export function StatusBadge({ label, tone = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}

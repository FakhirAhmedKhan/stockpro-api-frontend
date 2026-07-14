import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label: string;
  tone?: "success" | "neutral" | "warning" | "danger";
  className?: string;
}

const TONE_VARS: Record<
  NonNullable<StatusBadgeProps["tone"]>,
  { color: string; background: string }
> = {
  success: { color: "var(--success)", background: "var(--success-soft)" },
  neutral: { color: "var(--text-secondary)", background: "var(--surface-2)" },
  warning: { color: "var(--warning)", background: "var(--warning-soft)" },
  danger: { color: "var(--danger)", background: "var(--danger-soft)" },
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  const vars = TONE_VARS[tone];
  return (
    <span
      className={cn("badge", className)}
      style={{ color: vars.color, background: vars.background }}
    >
      {label}
    </span>
  );
}

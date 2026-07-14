import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({
  label = "Loading…",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-3 py-16",
        className,
      )}
      style={{ color: "var(--text-secondary)" }}
    >
      <Loader2
        className="h-5 w-5 animate-spin"
        style={{ color: "var(--accent)" }}
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}

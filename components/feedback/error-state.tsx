import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border py-16 text-center",
        className,
      )}
      style={{
        borderColor: "var(--danger-soft)",
        background: "var(--danger-soft)",
      }}
    >
      <AlertTriangle
        className="h-7 w-7"
        style={{ color: "var(--danger)" }}
        aria-hidden="true"
      />
      <p
        className="text-sm font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </p>
      <p
        className="max-w-sm text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {description}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-secondary btn-sm mt-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}

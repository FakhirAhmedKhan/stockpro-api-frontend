import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-card flex flex-1 flex-col items-center justify-center gap-2 border-dashed py-16 text-center",
        className,
      )}
    >
      <div
        className="mb-1 flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: "var(--surface-2)",
          color: "var(--text-tertiary)",
        }}
        aria-hidden="true"
      >
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <p
        className="text-sm font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </p>
      {description && (
        <p
          className="max-w-sm text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

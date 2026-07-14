"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface MoneyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  currencyPrefix?: string;
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, currencyPrefix = "AED", ...props }, ref) => {
    return (
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          {currencyPrefix}
        </span>
        <input
          ref={ref}
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          className={cn("input-field pl-12", className)}
          {...props}
        />
      </div>
    );
  },
);

MoneyInput.displayName = "MoneyInput";

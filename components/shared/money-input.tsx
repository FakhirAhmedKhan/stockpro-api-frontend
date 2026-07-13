"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  currencyPrefix?: string;
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, currencyPrefix = "AED", ...props }, ref) => {
    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
          {currencyPrefix}
        </span>
        <input
          ref={ref}
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          className={cn(
            "w-full rounded-md border border-zinc-300 py-2 pl-12 pr-3 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

MoneyInput.displayName = "MoneyInput";

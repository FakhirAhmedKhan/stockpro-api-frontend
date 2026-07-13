"use client";

import { useState } from "react";
import type { RepairBatchResponseDto, RepairItemOutcome } from "@/types/repair.types";

interface CompleteRepairFormProps {
  batch: RepairBatchResponseDto;
  onSubmit: (items: { productId: string; status: RepairItemOutcome; cost: number }[]) => void;
  isSubmitting?: boolean;
}

export function CompleteRepairForm({ batch, onSubmit, isSubmitting = false }: CompleteRepairFormProps) {
  const pendingItems = batch.items.filter((item) => item.status === "Pending");

  const [outcomes, setOutcomes] = useState<Record<string, RepairItemOutcome>>(
    Object.fromEntries(pendingItems.map((item) => [item.productId, "Repaired" as const])),
  );
  const [costs, setCosts] = useState<Record<string, string>>(
    Object.fromEntries(pendingItems.map((item) => [item.productId, "0"])),
  );
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    const items = pendingItems.map((item) => {
      const cost = Number(costs[item.productId]);
      return { productId: item.productId, status: outcomes[item.productId], cost };
    });

    if (items.some((item) => Number.isNaN(item.cost) || item.cost < 0)) {
      setFormError("Enter a valid cost (0 or greater) for every item.");
      return;
    }

    onSubmit(items);
  }

  if (pendingItems.length === 0) {
    return <p className="text-sm text-zinc-500">All items in this batch have been resolved.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-4">
      {formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {pendingItems.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
          >
            <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{item.productId}</span>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name={`outcome-${item.productId}`}
                  checked={outcomes[item.productId] === "Repaired"}
                  disabled={isSubmitting}
                  onChange={() => setOutcomes((prev) => ({ ...prev, [item.productId]: "Repaired" }))}
                />
                Repaired
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name={`outcome-${item.productId}`}
                  checked={outcomes[item.productId] === "Scrap"}
                  disabled={isSubmitting}
                  onChange={() => setOutcomes((prev) => ({ ...prev, [item.productId]: "Scrap" }))}
                />
                Scrap
              </label>
              <label className="ml-auto flex items-center gap-1.5 text-sm">
                Cost
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={costs[item.productId]}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setCosts((prev) => ({ ...prev, [item.productId]: event.target.value }))
                  }
                  className="w-24 rounded-md border border-zinc-300 px-2 py-1 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {isSubmitting ? "Saving…" : "Complete selected items"}
      </button>
    </form>
  );
}

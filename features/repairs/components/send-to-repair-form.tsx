"use client";

import { useState } from "react";
import { ProductIdList } from "@/components/shared/product-id-list";
import type { SendToRepairPayload } from "@/types/repair.types";

interface SendToRepairFormProps {
  onSubmit: (payload: SendToRepairPayload) => void;
  isSubmitting?: boolean;
}

export function SendToRepairForm({ onSubmit, isSubmitting = false }: SendToRepairFormProps) {
  const [stockId, setStockId] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [technician, setTechnician] = useState("");
  const [narration, setNarration] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    if (!stockId.trim()) {
      setFormError("Enter a stock ID.");
      return;
    }
    if (productIds.length === 0) {
      setFormError("Add at least one product.");
      return;
    }

    onSubmit({
      stockId: stockId.trim(),
      productIds,
      technician: technician || undefined,
      narration: narration || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-5">
      {formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="stockId" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Stock ID
        </label>
        <input
          id="stockId"
          type="text"
          value={stockId}
          disabled={isSubmitting}
          onChange={(event) => setStockId(event.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <ProductIdList value={productIds} onChange={setProductIds} disabled={isSubmitting} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="technician" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Technician <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="technician"
          type="text"
          maxLength={100}
          value={technician}
          disabled={isSubmitting}
          onChange={(event) => setTechnician(event.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="narration" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Narration <span className="text-zinc-400">(optional)</span>
        </label>
        <textarea
          id="narration"
          maxLength={255}
          value={narration}
          disabled={isSubmitting}
          onChange={(event) => setNarration(event.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {isSubmitting ? "Sending…" : "Send to repair"}
      </button>
    </form>
  );
}

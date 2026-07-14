"use client";

import { useState } from "react";
import { ProductMultiSelect } from "@/components/shared/product-multi-select";
import type { SendToRepairPayload } from "@/types/repair.types";

interface SendToRepairFormProps {
  onSubmit: (payload: SendToRepairPayload) => void;
  isSubmitting?: boolean;
}

export function SendToRepairForm({
  onSubmit,
  isSubmitting = false,
}: SendToRepairFormProps) {
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
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex max-w-xl flex-col gap-5"
    >
      {formError && (
        <p
          role="alert"
          className="rounded-lg px-3 py-2 text-sm"
          style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
        >
          {formError}
        </p>
      )}

      <ProductMultiSelect
        selectedIds={productIds}
        onSelectedIdsChange={setProductIds}
        lockedStockId={stockId || undefined}
        onStockLock={setStockId}
        statuses={["Available", "Repaired", "Sold"]}
        disabled={isSubmitting}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="technician"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Technician <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="technician"
          type="text"
          maxLength={100}
          value={technician}
          disabled={isSubmitting}
          onChange={(event) => setTechnician(event.target.value)}
          className="input-field"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="narration"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Narration <span className="text-zinc-400">(optional)</span>
        </label>
        <textarea
          id="narration"
          maxLength={255}
          value={narration}
          disabled={isSubmitting}
          onChange={(event) => setNarration(event.target.value)}
          className="input-field"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary self-start"
      >
        {isSubmitting ? "Sending…" : "Send to repair"}
      </button>
    </form>
  );
}

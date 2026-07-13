"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { ProductIdList } from "@/components/shared/product-id-list";
import { createReturnSchema } from "@/features/returns/schemas/return.schema";
import type { CreateReturnPayload, ReturnType } from "@/types/return.types";

const RETURN_TYPES: { value: ReturnType; label: string; helpText: string }[] = [
  { value: "ToStock", label: "To stock", helpText: "Accepted products return to available stock." },
  { value: "ToRepair", label: "To repair", helpText: "Products enter the repair workflow." },
  { value: "ToVendor", label: "To vendor", helpText: "Products are sent back to the supplier." },
  { value: "ToScrap", label: "To scrap", helpText: "Products are permanently discarded." },
];

interface ReturnFormProps {
  onSubmit: (payload: CreateReturnPayload) => void;
  isSubmitting?: boolean;
}

export function ReturnForm({ onSubmit, isSubmitting = false }: ReturnFormProps) {
  const [stockId, setStockId] = useState("");
  const [returnType, setReturnType] = useState<ReturnType>("ToStock");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [narration, setNarration] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    const parsed = createReturnSchema.safeParse({ stockId, returnType, productIds, narration });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    onSubmit({
      stockId: parsed.data.stockId,
      returnType: parsed.data.returnType,
      productIds: parsed.data.productIds,
      narration: parsed.data.narration || undefined,
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

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Return type</legend>
        <div className="grid grid-cols-2 gap-2">
          {RETURN_TYPES.map((type) => (
            <label
              key={type.value}
              className={`flex cursor-pointer flex-col gap-0.5 rounded-md border px-3 py-2 text-sm ${
                returnType === type.value
                  ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <span className="flex items-center gap-1.5 font-medium">
                <input
                  type="radio"
                  name="returnType"
                  value={type.value}
                  checked={returnType === type.value}
                  disabled={isSubmitting}
                  onChange={() => setReturnType(type.value)}
                  className="h-3.5 w-3.5"
                />
                {type.label}
              </span>
              <span className="text-xs text-zinc-500">{type.helpText}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {returnType === "ToScrap" && (
        <p role="alert" className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Scrapping is permanent — these products are removed from inventory and cannot be recovered.
        </p>
      )}

      <ProductIdList value={productIds} onChange={setProductIds} disabled={isSubmitting} />

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
        {isSubmitting ? "Processing…" : "Process return"}
      </button>
    </form>
  );
}

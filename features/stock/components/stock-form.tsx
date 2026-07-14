"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { SupplierSelect } from "@/components/shared/supplier-select";
import { MoneyInput } from "@/components/shared/money-input";
import { cn } from "@/lib/utils";
import {
  stockFormSchema,
  type StockFormValues,
} from "@/features/stock/schemas/stock.schema";

interface StockFormProps {
  onSubmit: (values: StockFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const inputClass = "input-field";
const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

export function StockForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create stock batch",
}: StockFormProps) {
  const [supplierLabel, setSupplierLabel] = useState("");
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      title: "",
      supplierId: "",
      totalQuantity: 1,
      unitPrice: 0,
      stockPrice: 0,
      totalAmountPaid: 0,
      storage: "",
      color: "",
      condition: "",
    },
  });

  const supplierId = watch("supplierId");
  const stockPrice = watch("stockPrice");
  const totalAmountPaid = watch("totalAmountPaid");
  const balanceDue = Math.max(
    0,
    (Number(stockPrice) || 0) - (Number(totalAmountPaid) || 0),
  );

  function submit(values: StockFormValues) {
    if (isSubmitting) return;
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelClass}>
          Batch title
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. iPhone 14 Pro — Batch 12"
          aria-invalid={Boolean(errors.title)}
          className={inputClass}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <SupplierSelect
          value={supplierId || null}
          onChange={(id, label) => {
            setValue("supplierId", id, { shouldValidate: true });
            setSupplierLabel(label);
          }}
        />
        {supplierId && supplierLabel && (
          <p className="text-xs text-zinc-500">
            Selected:{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {supplierLabel}
            </span>
          </p>
        )}
        {errors.supplierId && (
          <p className="text-xs text-red-600">{errors.supplierId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="totalQuantity" className={labelClass}>
            Quantity
          </label>
          <input
            id="totalQuantity"
            type="number"
            min={1}
            step={1}
            aria-invalid={Boolean(errors.totalQuantity)}
            className={inputClass}
            {...register("totalQuantity", { valueAsNumber: true })}
          />
          <p className="text-xs text-zinc-500">
            Number of Product units to generate for this batch.
          </p>
          {errors.totalQuantity && (
            <p className="text-xs text-red-600">
              {errors.totalQuantity.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="unitPrice" className={labelClass}>
            Unit price
          </label>
          <MoneyInput
            id="unitPrice"
            aria-invalid={Boolean(errors.unitPrice)}
            {...register("unitPrice", { valueAsNumber: true })}
          />
          <p className="text-xs text-zinc-500">Selling price per unit.</p>
          {errors.unitPrice && (
            <p className="text-xs text-red-600">{errors.unitPrice.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 p-4 sm:grid-cols-2 dark:border-zinc-800">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="stockPrice" className={labelClass}>
            Total stock price
          </label>
          <MoneyInput
            id="stockPrice"
            aria-invalid={Boolean(errors.stockPrice)}
            {...register("stockPrice", { valueAsNumber: true })}
          />
          <p className="text-xs text-zinc-500">
            Total amount owed to the supplier for this batch.
          </p>
          {errors.stockPrice && (
            <p className="text-xs text-red-600">{errors.stockPrice.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="totalAmountPaid" className={labelClass}>
            Amount paid now
          </label>
          <MoneyInput
            id="totalAmountPaid"
            aria-invalid={Boolean(errors.totalAmountPaid)}
            {...register("totalAmountPaid", { valueAsNumber: true })}
          />
          {errors.totalAmountPaid ? (
            <p className="text-xs text-red-600">
              {errors.totalAmountPaid.message}
            </p>
          ) : (
            <p className="text-xs text-zinc-500">
              Balance due:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {balanceDue.toFixed(2)}
              </span>
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowMoreDetails((prev) => !prev)}
        className="flex w-fit items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        aria-expanded={showMoreDetails}
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            showMoreDetails && "rotate-180",
          )}
          aria-hidden="true"
        />
        Additional details <span className="text-zinc-400">(optional)</span>
      </button>

      {showMoreDetails && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="storage" className={labelClass}>
              Storage
            </label>
            <input
              id="storage"
              type="text"
              className={inputClass}
              {...register("storage")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="color" className={labelClass}>
              Color
            </label>
            <input
              id="color"
              type="text"
              className={inputClass}
              {...register("color")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="condition" className={labelClass}>
              Condition
            </label>
            <input
              id="condition"
              type="text"
              className={inputClass}
              {...register("condition")}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-2 self-start"
      >
        {isSubmitting ? "Creating…" : submitLabel}
      </button>
    </form>
  );
}

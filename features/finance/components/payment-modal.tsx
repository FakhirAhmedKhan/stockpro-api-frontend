"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MoneyInput } from "@/components/shared/money-input";
import { formatCurrency } from "@/lib/formatters";

interface PaymentModalProps {
  open: boolean;
  invoiceId: string;
  outstanding: number;
  isSubmitting?: boolean;
  onSubmit: (payload: { invoiceId: string; amount: number; method?: string; reference?: string; idempotencyKey: string }) => void;
  onClose: () => void;
}

export function PaymentModal({ open, invoiceId, outstanding, isSubmitting = false, onSubmit, onClose }: PaymentModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const idempotencyKey = useId();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setAmount("");
      setError(null);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (numericAmount > outstanding) {
      setError(`Amount cannot exceed the outstanding balance of ${formatCurrency(outstanding)}.`);
      return;
    }

    onSubmit({
      invoiceId,
      amount: numericAmount,
      method: method || undefined,
      reference: reference || undefined,
      idempotencyKey: `${invoiceId}-${idempotencyKey}`,
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="payment-modal-title"
      className="m-auto w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-0 shadow-lg backdrop:bg-black/40 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 p-5">
        <div>
          <h2 id="payment-modal-title" className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Record payment
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Outstanding balance: {formatCurrency(outstanding)}
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="payment-amount" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Amount
          </label>
          <MoneyInput
            id="payment-amount"
            value={amount}
            disabled={isSubmitting}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="payment-method" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Method <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            id="payment-method"
            type="text"
            maxLength={50}
            value={method}
            disabled={isSubmitting}
            onChange={(event) => setMethod(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="payment-reference" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Reference <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            id="payment-reference"
            type="text"
            maxLength={100}
            value={reference}
            disabled={isSubmitting}
            onChange={(event) => setReference(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {isSubmitting ? "Recording…" : "Record payment"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

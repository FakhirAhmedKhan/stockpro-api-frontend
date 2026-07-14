"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerSelect } from "@/components/shared/customer-select";
import { ProductMultiSelect } from "@/components/shared/product-multi-select";
import { useCreateOrder } from "@/features/orders/hooks/use-orders";
import { createOrderSchema } from "@/features/orders/schemas/order.schema";
import { formatCurrency } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";

export default function NewOrderPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateOrder();

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerLabel, setCustomerLabel] = useState("");
  const [stockId, setStockId] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [unitPrice, setUnitPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const quantity = productIds.length;
  const totalPrice = useMemo(() => {
    const price = Number(unitPrice) || 0;
    return Math.round(price * quantity * 100) / 100;
  }, [unitPrice, quantity]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isPending) return;
    setFormError(null);

    const parsed = createOrderSchema.safeParse({
      customerId,
      stockId,
      productIds,
      unitPrice,
      paidAmount: paidAmount || 0,
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    mutate(
      {
        customerId: parsed.data.customerId,
        stockId: parsed.data.stockId,
        productIds: parsed.data.productIds,
        quantity: parsed.data.productIds.length,
        unitPrice: parsed.data.unitPrice,
        totalPrice,
        paidAmount: parsed.data.paidAmount,
      },
      {
        onSuccess: (order) => {
          router.push(ROUTES.orderDetail(order.orderId));
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New order"
        description="Point of sale — create a customer order."
      />

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

        <CustomerSelect
          value={customerId}
          disabled={isPending}
          onChange={(id, label) => {
            setCustomerId(id);
            setCustomerLabel(label);
          }}
        />
        {customerLabel && (
          <p className="-mt-3 text-xs text-zinc-500">
            Selected: {customerLabel}
          </p>
        )}

        <ProductMultiSelect
          selectedIds={productIds}
          onSelectedIdsChange={setProductIds}
          lockedStockId={stockId || undefined}
          onStockLock={setStockId}
          disabled={isPending}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="unitPrice"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Unit sale price
          </label>
          <input
            id="unitPrice"
            type="number"
            min={0}
            step="0.01"
            value={unitPrice}
            disabled={isPending}
            onChange={(event) => setUnitPrice(event.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="paidAmount"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Initial payment
          </label>
          <input
            id="paidAmount"
            type="number"
            min={0}
            step="0.01"
            value={paidAmount}
            disabled={isPending}
            onChange={(event) => setPaidAmount(event.target.value)}
            className="input-field"
          />
        </div>

        <div className="surface-card p-4 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>Quantity</span>
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {quantity}
            </span>
          </div>
          <div className="mt-1 flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>
              Preview total (backend is authoritative)
            </span>
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary self-start"
        >
          {isPending ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}

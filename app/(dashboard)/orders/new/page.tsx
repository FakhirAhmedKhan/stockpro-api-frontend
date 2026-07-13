"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerSelect } from "@/components/shared/customer-select";
import { ProductIdList } from "@/components/shared/product-id-list";
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
      <PageHeader title="New order" description="Point of sale — create a customer order." />

      <form onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-5">
        {formError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
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
          <p className="-mt-3 text-xs text-zinc-500">Selected: {customerLabel}</p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="stockId" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Stock ID
          </label>
          <p className="text-xs text-zinc-500">
            There is currently no stock lookup endpoint — enter the stock ID from its creation
            receipt.
          </p>
          <input
            id="stockId"
            type="text"
            value={stockId}
            disabled={isPending}
            onChange={(event) => setStockId(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>

        <ProductIdList value={productIds} onChange={setProductIds} disabled={isPending} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="unitPrice" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="paidAmount" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex justify-between">
            <span className="text-zinc-500">Quantity</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{quantity}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-zinc-500">Preview total (backend is authoritative)</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isPending ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}

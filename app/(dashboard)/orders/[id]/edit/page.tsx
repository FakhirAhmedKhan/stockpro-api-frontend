"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { ProductMultiSelect } from "@/components/shared/product-multi-select";
import {
  useOrderCache,
  useUpdateOrder,
} from "@/features/orders/hooks/use-orders";
import { ROUTES } from "@/constants/routes";

export default function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const order = useOrderCache(id);
  const router = useRouter();
  const { mutate, isPending } = useUpdateOrder(id);

  const [productIds, setProductIds] = useState<string[]>(
    order?.productIds ?? [],
  );
  const [unitPrice, setUnitPrice] = useState(
    order ? String(Number(order.totalPrice) / Math.max(order.quantity, 1)) : "",
  );
  const [paidAmount, setPaidAmount] = useState(order?.paidAmount ?? "");
  const [narration, setNarration] = useState("");

  if (!order) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Edit order" />
        <EmptyState
          title="Order not available"
          description="There is no order lookup endpoint on the backend yet, so an order can only be edited right after it's created or updated in this session."
        />
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isPending) return;

    mutate(
      {
        productIds,
        unitPrice: Number(unitPrice) || undefined,
        paidAmount: paidAmount !== "" ? Number(paidAmount) : undefined,
        narration: narration || undefined,
      },
      {
        onSuccess: () => router.push(ROUTES.orderDetail(id)),
      },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit order"
        description="Changing products restores/consumes inventory and recalculates the invoice server-side."
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex max-w-xl flex-col gap-5"
      >
        <ProductMultiSelect
          selectedIds={productIds}
          onSelectedIdsChange={setProductIds}
          lockedStockId={order.stockId}
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
            Paid amount
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
            disabled={isPending}
            onChange={(event) => setNarration(event.target.value)}
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary self-start"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

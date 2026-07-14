"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StockForm } from "@/features/stock/components/stock-form";
import { useCreateStock } from "@/features/stock/hooks/use-stock";
import { ROUTES } from "@/constants/routes";
import type { StockFormValues } from "@/features/stock/schemas/stock.schema";

export default function NewStockPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateStock();

  function handleSubmit(values: StockFormValues) {
    mutate(
      {
        title: values.title,
        supplierId: values.supplierId,
        totalQuantity: values.totalQuantity,
        unitPrice: values.unitPrice,
        stockPrice: values.stockPrice,
        totalAmountPaid: values.totalAmountPaid,
        storage: values.storage || undefined,
        color: values.color || undefined,
        condition: values.condition || undefined,
      },
      {
        onSuccess: (stock) => {
          router.push(ROUTES.stockDetail(stock.id));
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New stock batch"
        description="Add incoming stock from a supplier. This generates Product units, a Supplier invoice, and a Ledger entry."
      />
      <div className="surface-card max-w-2xl p-6">
        <StockForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel="Create stock batch"
        />
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { useStock } from "@/features/stock/hooks/use-stock";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";

export default function StockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: stock } = useStock(id);

  if (!stock) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Stock batch" description="Batch details." />
        <EmptyState
          title="This batch isn't available here"
          description="Stock details are only available right after you create a batch — the backend doesn't yet expose a lookup endpoint for stock batches. Try creating a new one, or return to the list."
          action={
            <Link href={ROUTES.stock} className="btn-secondary">
              Back to Stock
            </Link>
          }
        />
      </div>
    );
  }

  const soldCount = stock.totalQuantity - stock.quantityAvailable;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={stock.title}
        description="Stock batch details."
        actions={
          <StatusBadge
            label={
              stock.quantityAvailable > 0
                ? `${stock.quantityAvailable} available`
                : "Sold out"
            }
            tone={stock.quantityAvailable > 0 ? "success" : "neutral"}
          />
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Total units
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {stock.totalQuantity}
          </p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Available
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {stock.quantityAvailable}
          </p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Sold / used
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {soldCount}
          </p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Units generated
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {stock.generatedProductCount}
          </p>
        </div>
      </div>

      <dl className="surface-card grid max-w-lg grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Unit price
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            {formatCurrency(stock.unitPrice)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Total stock price
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            {formatCurrency(stock.stockPrice)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Supplier invoice
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            <Link
              href={ROUTES.supplierInvoiceDetail(stock.supplierInvoiceId)}
              className="underline-offset-2 hover:underline"
            >
              View invoice
            </Link>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Supplier
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            <Link
              href={ROUTES.supplierDetail(stock.supplierId)}
              className="underline-offset-2 hover:underline"
            >
              View supplier
            </Link>
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Created
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            {formatDateTime(stock.createdAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

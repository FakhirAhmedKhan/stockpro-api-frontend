"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { useOrderCache } from "@/features/orders/hooks/use-orders";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const order = useOrderCache(id);

  if (!order) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Order" />
        <EmptyState
          title="Order not available"
          description="There is no order lookup endpoint on the backend yet, so an order can only be viewed right after it's created or updated in this session. Refreshing or navigating here directly loses that data."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Order ${order.orderId.slice(0, 8)}`}
        description={`Placed ${formatDateTime(order.orderDate)}`}
        actions={
          <Link
            href={ROUTES.orderEdit(order.orderId)}
            className="btn-secondary"
          >
            Edit order
          </Link>
        }
      />

      <dl className="grid max-w-lg grid-cols-2 gap-4 surface-card p-6">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Customer
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            <Link
              href={ROUTES.customerDetail(order.customerId)}
              className="hover:underline"
            >
              {order.customerId}
            </Link>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Stock
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            {order.stockId}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Quantity
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            {order.quantity}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Total
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            {formatCurrency(order.totalPrice)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Paid
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            {formatCurrency(order.paidAmount)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Outstanding
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            {formatCurrency(
              Number(order.totalPrice) - Number(order.paidAmount),
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Invoice
          </dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">
            {order.invoiceId}
          </dd>
        </div>
      </dl>

      <div>
        <h2 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Products
        </h2>
        <ul className="flex flex-col gap-1.5">
          {order.productIds.map((productId) => (
            <li
              key={productId}
              className="rounded-md border border-zinc-200 px-3 py-1.5 font-mono text-xs dark:border-zinc-800"
            >
              {productId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

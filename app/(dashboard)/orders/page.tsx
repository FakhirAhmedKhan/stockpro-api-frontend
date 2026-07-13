"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { useOrdersCache } from "@/features/orders/hooks/use-orders";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";

export default function OrdersPage() {
  const orders = useOrdersCache();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description="There is no order list endpoint on the backend yet — this shows orders created or updated during this session only."
        actions={
          <Link
            href={ROUTES.orderNew}
            className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New order
          </Link>
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet this session"
          description="Create an order to see it listed here."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                <th scope="col" className="px-4 py-3 font-medium">
                  Order
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Total
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Paid
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                  <td className="px-4 py-3">
                    <Link href={ROUTES.orderDetail(order.orderId)} className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
                      {order.orderId.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(order.orderDate)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{order.quantity}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(order.paidAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

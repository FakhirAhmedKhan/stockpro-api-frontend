"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerSelect } from "@/components/shared/customer-select";
import { Pagination } from "@/components/shared/pagination";
import { LoadingState } from "@/components/feedback/loading-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { useCustomerInvoiceLedger } from "@/features/finance/hooks/use-finance";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { ApiError } from "@/types/api.types";

const PAGE_SIZE = 20;

export default function CustomerInvoicesPage() {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerLabel, setCustomerLabel] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useCustomerInvoiceLedger(customerId ?? "", {
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customer invoices"
        description="There is no global invoice list on the backend — select a customer to view their invoices."
      />

      <div className="max-w-sm">
        <CustomerSelect
          value={customerId}
          onChange={(id, label) => {
            setCustomerId(id);
            setCustomerLabel(label);
            setPage(1);
          }}
        />
      </div>

      {!customerId ? (
        <EmptyState title="Select a customer" description="Choose a customer above to view their invoices." />
      ) : isLoading ? (
        <LoadingState label="Loading invoices…" />
      ) : isError || !data ? (
        <ErrorState description={(error as unknown as ApiError)?.message} onRetry={() => refetch()} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total invoiced</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(data.total)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Paid</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(data.paid)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Outstanding</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(data.outstanding)}
              </p>
            </div>
          </div>

          {data.invoices.length === 0 ? (
            <EmptyState title="No invoices" description={`${customerLabel} has no invoices yet.`} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                      <th scope="col" className="px-4 py-3 font-medium">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Total
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Paid
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Outstanding
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                        <td className="px-4 py-3">
                          <Link
                            href={`/finance/customer-invoices/${invoice.id}?customerId=${customerId}`}
                            className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                          >
                            {formatDate(invoice.createdAt)}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                          {formatCurrency(invoice.paidAmount)}
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                          {formatCurrency(Number(invoice.totalAmount) - Number(invoice.paidAmount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination pagination={data.pagination} onPageChange={setPage} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

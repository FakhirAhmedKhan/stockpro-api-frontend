"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { SupplierSelect } from "@/components/shared/supplier-select";
import { Pagination } from "@/components/shared/pagination";
import { TableSkeleton } from "@/components/feedback/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { useSupplierInvoiceLedger } from "@/features/finance/hooks/use-finance";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";
import type { ApiError } from "@/types/api.types";

const PAGE_SIZE = 20;

export default function SupplierInvoicesPage() {
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [supplierLabel, setSupplierLabel] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useSupplierInvoiceLedger(
    supplierId ?? "",
    {
      page,
      pageSize: PAGE_SIZE,
    },
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Supplier invoices"
        description="There is no global invoice list on the backend — select a supplier to view their invoices."
        actions={
          <Link href={ROUTES.customerInvoices} className="btn-secondary">
            Customer invoices
          </Link>
        }
      />

      <div className="max-w-sm">
        <SupplierSelect
          value={supplierId}
          onChange={(id, label) => {
            setSupplierId(id);
            setSupplierLabel(label);
            setPage(1);
          }}
        />
      </div>

      {!supplierId ? (
        <EmptyState
          title="Select a supplier"
          description="Choose a supplier above to view their invoices."
        />
      ) : isLoading ? (
        <TableSkeleton columns={4} />
      ) : isError || !data ? (
        <ErrorState
          description={(error as unknown as ApiError)?.message}
          onRetry={() => refetch()}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="surface-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Total invoiced
              </p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(data.total)}
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Paid
              </p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(data.paid)}
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Outstanding
              </p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(data.outstanding)}
              </p>
            </div>
          </div>

          {data.invoices.length === 0 ? (
            <EmptyState
              title="No invoices"
              description={`${supplierLabel} has no invoices yet.`}
            />
          ) : (
            <>
              <div className="table-wrap">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="table-head-row">
                      <th scope="col" className="px-4 py-3 font-medium">
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium"
                      >
                        Paid
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium"
                      >
                        Outstanding
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices.map((invoice) => (
                      <tr key={invoice.id} className="table-row">
                        <td className="px-4 py-3">
                          <Link
                            href={`/finance/supplier-invoices/${invoice.id}?supplierId=${supplierId}`}
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
                          {formatCurrency(
                            Number(invoice.totalAmount) -
                              Number(invoice.paidAmount),
                          )}
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

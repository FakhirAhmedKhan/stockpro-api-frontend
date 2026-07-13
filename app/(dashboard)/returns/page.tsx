"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DateRangeFilter } from "@/components/shared/date-range-filter";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingState } from "@/components/feedback/loading-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { useReturnHistory } from "@/features/returns/hooks/use-returns";
import { formatDateTime } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";
import type { ApiError } from "@/types/api.types";
import type { ReturnType } from "@/types/return.types";

const PAGE_SIZE = 20;
const RETURN_TYPE_TONE: Record<ReturnType, "success" | "warning" | "neutral" | "danger"> = {
  ToStock: "success",
  ToRepair: "warning",
  ToVendor: "neutral",
  ToScrap: "danger",
};

export default function ReturnsPage() {
  const [page, setPage] = useState(1);
  const [returnType, setReturnType] = useState<ReturnType | "">("");
  const [range, setRange] = useState({ startDate: "", endDate: "" });

  const { data, isLoading, isError, error, refetch } = useReturnHistory({
    page,
    pageSize: PAGE_SIZE,
    returnType: returnType || undefined,
    startDate: range.startDate || undefined,
    endDate: range.endDate || undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Returns"
        description="Return history across all stock batches."
        actions={
          <Link
            href={ROUTES.returnNew}
            className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Process return
          </Link>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="returnType" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Type
          </label>
          <select
            id="returnType"
            value={returnType}
            onChange={(event) => {
              setReturnType(event.target.value as ReturnType | "");
              setPage(1);
            }}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="">All types</option>
            <option value="ToStock">To stock</option>
            <option value="ToRepair">To repair</option>
            <option value="ToVendor">To vendor</option>
            <option value="ToScrap">To scrap</option>
          </select>
        </div>
        <DateRangeFilter
          startDate={range.startDate}
          endDate={range.endDate}
          onChange={(next) => {
            setRange(next);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <LoadingState label="Loading returns…" />
      ) : isError ? (
        <ErrorState description={(error as unknown as ApiError).message} onRetry={() => refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState title="No returns found" description="Process a return to see it listed here." />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  <th scope="col" className="px-4 py-3 font-medium">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Stock
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Products
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.returnId} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                    <td className="px-4 py-3">
                      <StatusBadge label={item.returnType} tone={RETURN_TYPE_TONE[item.returnType]} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {item.stockId}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{item.productIds.length}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {formatDateTime(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

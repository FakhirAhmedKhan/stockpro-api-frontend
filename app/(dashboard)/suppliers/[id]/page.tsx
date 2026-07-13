"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { useSupplier } from "@/features/suppliers/hooks/use-suppliers";
import { formatDate } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";
import type { ApiError } from "@/types/api.types";

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: supplier, isLoading, isError, error, refetch } = useSupplier(id);

  if (isLoading) return <LoadingState label="Loading supplier…" className="min-h-[50vh]" />;
  if (isError || !supplier) {
    return (
      <ErrorState description={(error as unknown as ApiError)?.message ?? "Supplier not found."} onRetry={() => refetch()} />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={supplier.name}
        description="Supplier details."
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge
              label={supplier.activeStatus ? "Active" : "Inactive"}
              tone={supplier.activeStatus ? "success" : "neutral"}
            />
            <Link
              href={ROUTES.supplierLedger(supplier.id)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              View ledger
            </Link>
          </div>
        }
      />

      <dl className="grid max-w-md grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Email</dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{supplier.email ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Phone</dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{supplier.phoneNumber ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Created</dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{formatDate(supplier.createdAt)}</dd>
        </div>
      </dl>
    </div>
  );
}

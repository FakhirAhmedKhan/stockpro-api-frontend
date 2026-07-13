"use client";

import { use, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CustomerForm } from "@/features/customers/components/customer-form";
import {
  useCustomer,
  useDeactivateCustomer,
  useUpdateCustomer,
} from "@/features/customers/hooks/use-customers";
import { ROUTES } from "@/constants/routes";
import type { CustomerFormValues } from "@/features/customers/schemas/customer.schema";
import type { ApiError } from "@/types/api.types";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: customer, isLoading, isError, error, refetch } = useCustomer(id);
  const updateCustomer = useUpdateCustomer(id);
  const deactivateCustomer = useDeactivateCustomer();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) return <LoadingState label="Loading customer…" className="min-h-[50vh]" />;
  if (isError || !customer) {
    return (
      <ErrorState description={(error as unknown as ApiError)?.message ?? "Customer not found."} onRetry={() => refetch()} />
    );
  }

  function handleUpdate(values: CustomerFormValues) {
    updateCustomer.mutate({
      fullName: values.fullName,
      email: values.email || undefined,
      phoneNumber: values.phoneNumber || undefined,
      role: values.role || undefined,
      activeStatus: values.activeStatus,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={customer.fullName}
        description="Customer details."
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge
              label={customer.activeStatus ? "Active" : "Inactive"}
              tone={customer.activeStatus ? "success" : "neutral"}
            />
            <Link
              href={ROUTES.customerLedger(customer.id)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              View ledger
            </Link>
            {customer.activeStatus && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                Deactivate
              </button>
            )}
          </div>
        }
      />

      <div className="max-w-lg rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <CustomerForm
          defaultValues={customer}
          onSubmit={handleUpdate}
          isSubmitting={updateCustomer.isPending}
          submitLabel="Save changes"
        />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Deactivate customer"
        description="This customer will no longer appear in active lists. Existing orders and invoices are unaffected."
        confirmLabel="Deactivate"
        destructive
        isLoading={deactivateCustomer.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          deactivateCustomer.mutate(id, { onSuccess: () => setConfirmOpen(false) });
        }}
      />
    </div>
  );
}

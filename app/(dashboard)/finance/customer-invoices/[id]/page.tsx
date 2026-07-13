"use client";

import { use, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { PdfDownloadButton } from "@/components/shared/pdf-download-button";
import { PaymentModal } from "@/features/finance/components/payment-modal";
import { useCustomerInvoiceLedger, usePayCustomerInvoice } from "@/features/finance/hooks/use-finance";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { ApiError } from "@/types/api.types";

export default function CustomerInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId") ?? "";
  const [paymentOpen, setPaymentOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useCustomerInvoiceLedger(customerId, { pageSize: 100 });
  const payInvoice = usePayCustomerInvoice(customerId);

  if (!customerId) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Invoice" />
        <EmptyState
          title="Missing customer context"
          description="Open this invoice from the customer invoices list — there is no standalone invoice lookup endpoint."
        />
      </div>
    );
  }

  if (isLoading) return <LoadingState label="Loading invoice…" className="min-h-[50vh]" />;
  if (isError || !data) {
    return <ErrorState description={(error as unknown as ApiError)?.message} onRetry={() => refetch()} />;
  }

  const invoice = data.invoices.find((item) => item.id === id);
  if (!invoice) {
    return <EmptyState title="Invoice not found" description="This invoice could not be located for the selected customer." />;
  }

  const outstanding = Number(invoice.totalAmount) - Number(invoice.paidAmount);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Invoice · ${formatDate(invoice.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <PdfDownloadButton path={`/Invoice/customer/${invoice.id}`} fallbackFilename={`invoice-${invoice.id}.pdf`} />
            {outstanding > 0 && (
              <button
                type="button"
                onClick={() => setPaymentOpen(true)}
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Record payment
              </button>
            )}
          </div>
        }
      />

      <dl className="grid max-w-md grid-cols-2 gap-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total</dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{formatCurrency(invoice.totalAmount)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Paid</dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{formatCurrency(invoice.paidAmount)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Outstanding</dt>
          <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{formatCurrency(outstanding)}</dd>
        </div>
        {invoice.orderId && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Order</dt>
            <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{invoice.orderId}</dd>
          </div>
        )}
      </dl>

      <PaymentModal
        open={paymentOpen}
        invoiceId={invoice.id}
        outstanding={outstanding}
        isSubmitting={payInvoice.isPending}
        onClose={() => setPaymentOpen(false)}
        onSubmit={(payload) =>
          payInvoice.mutate(payload, { onSuccess: () => setPaymentOpen(false) })
        }
      />
    </div>
  );
}

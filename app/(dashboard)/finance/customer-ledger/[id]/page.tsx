"use client";

import { use, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DateRangeFilter } from "@/components/shared/date-range-filter";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LedgerStatement } from "@/features/finance/components/ledger-statement";
import { usePartyLedger } from "@/features/finance/hooks/use-finance";
import type { ApiError } from "@/types/api.types";

const PAGE_SIZE = 20;

export default function CustomerLedgerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [page, setPage] = useState(1);
  const [range, setRange] = useState({ startDate: "", endDate: "" });

  const { data, isLoading, isError, error, refetch } = usePartyLedger(
    id,
    "Customer",
    {
      page,
      pageSize: PAGE_SIZE,
      startDate: range.startDate || undefined,
      endDate: range.endDate || undefined,
    },
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customer ledger"
        description="Statement of invoices and payments."
      />

      <DateRangeFilter
        startDate={range.startDate}
        endDate={range.endDate}
        onChange={(next) => {
          setRange(next);
          setPage(1);
        }}
      />

      {isLoading ? (
        <LoadingState label="Loading ledger…" />
      ) : isError || !data ? (
        <ErrorState
          description={(error as unknown as ApiError)?.message}
          onRetry={() => refetch()}
        />
      ) : (
        <LedgerStatement report={data} onPageChange={setPage} />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DateRangeFilter } from "@/components/shared/date-range-filter";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { MetricCards } from "@/features/dashboard/components/metric-cards";
import { SalesChart } from "@/features/dashboard/components/sales-chart";
import {
  useDashboardMetrics,
  useSalesChart,
} from "@/features/dashboard/hooks/use-dashboard";
import type { ApiError } from "@/types/api.types";

export default function DashboardPage() {
  const [range, setRange] = useState({ startDate: "", endDate: "" });
  const dateRange = {
    startDate: range.startDate || undefined,
    endDate: range.endDate || undefined,
  };

  const metricsQuery = useDashboardMetrics(dateRange);
  const chartQuery = useSalesChart(dateRange, "all");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Business performance overview."
      />

      <DateRangeFilter
        startDate={range.startDate}
        endDate={range.endDate}
        onChange={setRange}
      />

      {metricsQuery.isLoading ? (
        <LoadingState label="Loading metrics…" />
      ) : metricsQuery.isError || !metricsQuery.data ? (
        <ErrorState
          description={(metricsQuery.error as unknown as ApiError)?.message}
          onRetry={() => metricsQuery.refetch()}
        />
      ) : (
        <MetricCards metrics={metricsQuery.data} />
      )}

      <div className="surface-card p-4">
        <h2 className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Sales trend
        </h2>
        {chartQuery.isLoading ? (
          <LoadingState label="Loading chart…" />
        ) : chartQuery.isError || !chartQuery.data ? (
          <ErrorState
            description={(chartQuery.error as unknown as ApiError)?.message}
            onRetry={() => chartQuery.refetch()}
          />
        ) : (
          <SalesChart data={chartQuery.data} />
        )}
      </div>
    </div>
  );
}

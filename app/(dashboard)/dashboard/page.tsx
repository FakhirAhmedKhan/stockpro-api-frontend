"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DateRangeFilter } from "@/components/shared/date-range-filter";
import { CardGridSkeleton, Skeleton } from "@/components/feedback/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { MetricCards } from "@/features/dashboard/components/metric-cards";
import { SalesChart } from "@/features/dashboard/components/sales-chart";
import {
  useDashboardMetrics,
  useSalesChart,
} from "@/features/dashboard/hooks/use-dashboard";
import { useAuth } from "@/hooks/use-auth";
import type { ApiError } from "@/types/api.types";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
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
        title={`${getGreeting()}${user?.userName ? `, ${user.userName}` : ""}`}
        description="Here's how your business is performing."
      />

      <DateRangeFilter
        startDate={range.startDate}
        endDate={range.endDate}
        onChange={setRange}
      />

      {metricsQuery.isLoading ? (
        <CardGridSkeleton count={8} />
      ) : metricsQuery.isError || !metricsQuery.data ? (
        <ErrorState
          description={(metricsQuery.error as unknown as ApiError)?.message}
          onRetry={() => metricsQuery.refetch()}
        />
      ) : (
        <MetricCards metrics={metricsQuery.data} />
      )}

      <div className="surface-card p-4">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
          <h2 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Sales trend
          </h2>
        </div>
        {chartQuery.isLoading ? (
          <Skeleton className="h-48 w-full" />
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

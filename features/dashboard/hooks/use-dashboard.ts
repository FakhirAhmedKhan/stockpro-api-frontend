"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/dashboard.api";
import { queryKeys } from "@/constants/query-keys";
import type { DashboardDateRange, SalesChartType } from "@/types/dashboard.types";

export function useDashboardMetrics(range: DashboardDateRange) {
  return useQuery({
    queryKey: queryKeys.dashboard(range),
    queryFn: () => dashboardApi.metrics(range),
  });
}

export function useSalesChart(range: DashboardDateRange, type: SalesChartType = "all") {
  return useQuery({
    queryKey: queryKeys.dashboardSalesChart(range, type),
    queryFn: () => dashboardApi.salesChart({ ...range, type }),
  });
}

import { apiClient } from "@/lib/api-client";
import type { DashboardDateRange, PerformanceMetricsDto, SalesChartDto, SalesChartType } from "@/types/dashboard.types";

export const dashboardApi = {
  metrics: (range: DashboardDateRange = {}) =>
    apiClient.get<PerformanceMetricsDto>("/DashBoard", { params: range }).then((res) => res.data),

  salesChart: (range: DashboardDateRange & { type?: SalesChartType } = {}) =>
    apiClient.get<SalesChartDto>("/DashBoard/sales-chart", { params: range }).then((res) => res.data),
};

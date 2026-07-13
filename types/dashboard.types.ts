export interface PerformanceMetricsDto {
  totalStockValue: string;
  totalSales: string;
  totalOrders: number;
  totalCustomers: number;
  totalVendors: number;
  totalRepairCost: string;
  totalExpense: string;
  totalPayments: string;
  customerReceivables: string;
  totalProfit: string;
  totalNetProfit: string;
}

export interface DashboardDateRange {
  startDate?: string;
  endDate?: string;
}

export type SalesChartType = "sales" | "payments" | "outstanding" | "all";

export interface SalesChartDto {
  type: SalesChartType;
  dates: string[];
  sales?: number[];
  payments?: number[];
  outstanding?: number[];
}

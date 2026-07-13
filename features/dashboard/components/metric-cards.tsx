import { formatCurrency } from "@/lib/formatters";
import type { PerformanceMetricsDto } from "@/types/dashboard.types";

interface MetricCardsProps {
  metrics: PerformanceMetricsDto;
}

const MONEY_METRICS: { key: keyof PerformanceMetricsDto; label: string }[] = [
  { key: "totalSales", label: "Total sales" },
  { key: "totalPayments", label: "Total payments" },
  { key: "customerReceivables", label: "Customer receivables" },
  { key: "totalStockValue", label: "Stock value (unsold)" },
  { key: "totalRepairCost", label: "Repair cost" },
  { key: "totalExpense", label: "Expenses" },
  { key: "totalProfit", label: "Gross profit" },
  { key: "totalNetProfit", label: "Net profit" },
];

const COUNT_METRICS: { key: keyof PerformanceMetricsDto; label: string }[] = [
  { key: "totalOrders", label: "Orders" },
  { key: "totalCustomers", label: "Customers" },
  { key: "totalVendors", label: "Vendors" },
];

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {MONEY_METRICS.map((metric) => (
        <div key={metric.key} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{metric.label}</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(metrics[metric.key] as string)}
          </p>
        </div>
      ))}
      {COUNT_METRICS.map((metric) => (
        <div key={metric.key} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{metric.label}</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {metrics[metric.key] as number}
          </p>
        </div>
      ))}
    </div>
  );
}

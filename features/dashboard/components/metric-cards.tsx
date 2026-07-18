import {
  TrendingUp,
  Landmark,
  Wallet,
  Boxes,
  Wrench,
  Receipt,
  PiggyBank,
  Sparkles,
  ShoppingCart,
  Users,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { PerformanceMetricsDto } from "@/types/dashboard.types";

interface MetricCardsProps {
  metrics: PerformanceMetricsDto;
}

type Tone = "accent" | "success" | "warning";

const TONE_VARS: Record<Tone, { color: string; background: string }> = {
  accent: { color: "var(--accent)", background: "var(--accent-soft)" },
  success: { color: "var(--success)", background: "var(--success-soft)" },
  warning: { color: "var(--warning)", background: "var(--warning-soft)" },
};

const MONEY_METRICS: {
  key: keyof PerformanceMetricsDto;
  label: string;
  icon: LucideIcon;
  tone: Tone;
}[] = [
  { key: "totalSales", label: "Total sales", icon: TrendingUp, tone: "accent" },
  { key: "totalPayments", label: "Total payments", icon: Landmark, tone: "accent" },
  { key: "customerReceivables", label: "Customer receivables", icon: Wallet, tone: "warning" },
  { key: "totalStockValue", label: "Stock value (unsold)", icon: Boxes, tone: "accent" },
  { key: "totalRepairCost", label: "Repair cost", icon: Wrench, tone: "warning" },
  { key: "totalExpense", label: "Expenses", icon: Receipt, tone: "warning" },
  { key: "totalProfit", label: "Gross profit", icon: PiggyBank, tone: "success" },
  { key: "totalNetProfit", label: "Net profit", icon: Sparkles, tone: "success" },
];

const COUNT_METRICS: {
  key: keyof PerformanceMetricsDto;
  label: string;
  icon: LucideIcon;
  tone: Tone;
}[] = [
  { key: "totalOrders", label: "Orders", icon: ShoppingCart, tone: "accent" },
  { key: "totalCustomers", label: "Customers", icon: Users, tone: "accent" },
  { key: "totalVendors", label: "Vendors", icon: Truck, tone: "accent" },
];

function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: Tone;
}) {
  const vars = TONE_VARS[tone];
  return (
    <div className="surface-card surface-card-hover flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
          {label}
        </p>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: vars.background, color: vars.color }}
          aria-hidden="true"
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {MONEY_METRICS.map((metric) => (
        <MetricCard
          key={metric.key}
          label={metric.label}
          value={formatCurrency(metrics[metric.key] as string)}
          icon={metric.icon}
          tone={metric.tone}
        />
      ))}
      {COUNT_METRICS.map((metric) => (
        <MetricCard
          key={metric.key}
          label={metric.label}
          value={String(metrics[metric.key] as number)}
          icon={metric.icon}
          tone={metric.tone}
        />
      ))}
    </div>
  );
}

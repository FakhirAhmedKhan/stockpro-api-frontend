"use client";

import { formatCurrency, formatDate } from "@/lib/formatters";
import type { SalesChartDto } from "@/types/dashboard.types";

interface SalesChartProps {
  data: SalesChartDto;
}

const SERIES: {
  key: "sales" | "payments" | "outstanding";
  label: string;
  color: string;
}[] = [
  { key: "sales", label: "Sales", color: "var(--accent)" },
  { key: "payments", label: "Supplier payments", color: "var(--warning)" },
  {
    key: "outstanding",
    label: "Outstanding (net new)",
    color: "var(--text-tertiary)",
  },
];

export function SalesChart({ data }: SalesChartProps) {
  const activeSeries = SERIES.filter(
    (series) => data[series.key] !== undefined,
  );
  const max = Math.max(
    1,
    ...activeSeries.flatMap((series) => data[series.key] ?? []),
  );

  if (data.dates.length === 0) {
    return <p className="text-sm text-zinc-500">No data for this range.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-4 text-xs text-zinc-600 dark:text-zinc-400">
        {activeSeries.map((series) => (
          <span key={series.key} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: series.color }}
              aria-hidden="true"
            />
            {series.label}
          </span>
        ))}
      </div>

      <div
        role="img"
        aria-label={`Chart of ${activeSeries.map((series) => series.label).join(", ")} from ${formatDate(data.dates[0])} to ${formatDate(data.dates[data.dates.length - 1])}`}
        className="flex h-48 items-end gap-1 overflow-x-auto surface-card p-4"
      >
        {data.dates.map((date, index) => (
          <div
            key={date}
            className="flex min-w-[10px] flex-1 flex-col items-center justify-end gap-0.5"
            title={formatDate(date)}
          >
            <div
              className="flex w-full items-end justify-center gap-0.5"
              style={{ height: "160px" }}
            >
              {activeSeries.map((series) => {
                const value = data[series.key]?.[index] ?? 0;
                const heightPct = Math.max(
                  (value / max) * 100,
                  value > 0 ? 2 : 0,
                );
                return (
                  <div
                    key={series.key}
                    className="w-1.5 rounded-t"
                    style={{
                      height: `${heightPct}%`,
                      background: series.color,
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>Sales chart data</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            {activeSeries.map((series) => (
              <th key={series.key} scope="col">
                {series.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.dates.map((date, index) => (
            <tr key={date}>
              <th scope="row">{formatDate(date)}</th>
              {activeSeries.map((series) => (
                <td key={series.key}>
                  {formatCurrency(data[series.key]?.[index] ?? 0)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

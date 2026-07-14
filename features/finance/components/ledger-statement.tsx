"use client";

import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import type { PartyLedgerReportDto } from "@/types/finance.types";

interface LedgerStatementProps {
  report: PartyLedgerReportDto;
  onPageChange: (page: number) => void;
}

export function LedgerStatement({
  report,
  onPageChange,
}: LedgerStatementProps) {
  const isSupplier = report.partyType === "Supplier";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="surface-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {isSupplier ? "Total invoiced (credit)" : "Total invoiced (debit)"}
          </p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(
              isSupplier ? report.totalCredit : report.totalDebit,
            )}
          </p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {isSupplier ? "Total paid (debit)" : "Total received (credit)"}
          </p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(
              isSupplier ? report.totalDebit : report.totalCredit,
            )}
          </p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Closing balance
          </p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(report.closingBalance)}
          </p>
        </div>
      </div>

      {report.entries.length === 0 ? (
        <EmptyState title="No entries in this date range" />
      ) : (
        <div className="table-wrap">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="table-head-row">
                <th scope="col" className="px-4 py-3 font-medium">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Narration
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Debit
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody>
              {report.entries.map((entry) => (
                <tr key={entry.id} className="table-row">
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {entry.narration ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-900 dark:text-zinc-100">
                    {Number(entry.debit) > 0
                      ? formatCurrency(entry.debit)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-900 dark:text-zinc-100">
                    {Number(entry.credit) > 0
                      ? formatCurrency(entry.credit)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={report.pagination} onPageChange={onPageChange} />
    </div>
  );
}

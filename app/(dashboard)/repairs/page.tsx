"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { useRepairsCache } from "@/features/repairs/hooks/use-repairs";
import { formatDateTime } from "@/lib/formatters";
import { ROUTES } from "@/constants/routes";

export default function RepairsPage() {
  const batches = useRepairsCache();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Repairs"
        description="There is no repair list endpoint on the backend yet — this shows batches sent or completed during this session only."
        actions={
          <Link
            href={ROUTES.repairNew}
            className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Send to repair
          </Link>
        }
      />

      {batches.length === 0 ? (
        <EmptyState title="No repair batches yet this session" description="Send products to repair to see them listed here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                <th scope="col" className="px-4 py-3 font-medium">
                  Batch
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Technician
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Products
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Completed
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Scrapped
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => {
                const completed = batch.items.filter((item) => item.status === "Repaired").length;
                const scrapped = batch.items.filter((item) => item.status === "Scrap").length;
                return (
                  <tr key={batch.repairId} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                    <td className="px-4 py-3">
                      <Link href={ROUTES.repairDetail(batch.repairId)} className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
                        {batch.repairId.slice(0, 8)}
                      </Link>
                      <div className="text-xs text-zinc-400">{formatDateTime(batch.sentAt)}</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{batch.technician ?? "—"}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{batch.items.length}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{completed}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{scrapped}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={batch.status} tone={batch.status === "Repaired" ? "success" : "warning"} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

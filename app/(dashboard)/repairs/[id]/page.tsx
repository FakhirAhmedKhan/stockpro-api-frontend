"use client";

import { use } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { CompleteRepairForm } from "@/features/repairs/components/complete-repair-form";
import {
  useCompleteRepair,
  useRepairCache,
} from "@/features/repairs/hooks/use-repairs";
import { formatDateTime } from "@/lib/formatters";
import type { RepairItemOutcome } from "@/types/repair.types";

export default function RepairDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const batch = useRepairCache(id);
  const { mutate, isPending } = useCompleteRepair(() => {});

  if (!batch) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Repair batch" />
        <EmptyState
          title="Repair batch not available"
          description="There is no repair lookup endpoint on the backend yet, so a batch can only be viewed right after it's sent or updated in this session."
        />
      </div>
    );
  }

  function handleComplete(
    items: { productId: string; status: RepairItemOutcome; cost: number }[],
  ) {
    mutate({ repairId: id, items });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Repair batch ${batch.id.slice(0, 8)}`}
        description={`Sent ${formatDateTime(batch.createdAt)}${batch.technician ? ` · ${batch.technician}` : ""}`}
        actions={
          <StatusBadge
            label={batch.status}
            tone={batch.status === "Repaired" ? "success" : "warning"}
          />
        }
      />

      <div>
        <h2 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Items
        </h2>
        <ul className="flex flex-col gap-1.5">
          {batch.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-800"
            >
              <span className="font-mono text-xs">{item.productId}</span>
              <StatusBadge
                label={item.status}
                tone={
                  item.status === "Repaired"
                    ? "success"
                    : item.status === "Scrap"
                      ? "danger"
                      : "neutral"
                }
              />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Complete items
        </h2>
        <CompleteRepairForm
          batch={batch}
          onSubmit={handleComplete}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
}

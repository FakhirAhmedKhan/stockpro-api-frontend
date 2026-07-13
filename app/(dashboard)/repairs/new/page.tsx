"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SendToRepairForm } from "@/features/repairs/components/send-to-repair-form";
import { useSendToRepair } from "@/features/repairs/hooks/use-repairs";
import { ROUTES } from "@/constants/routes";
import type { SendToRepairPayload } from "@/types/repair.types";

export default function NewRepairPage() {
  const router = useRouter();
  const { mutate, isPending } = useSendToRepair();

  function handleSubmit(payload: SendToRepairPayload) {
    mutate(payload, {
      onSuccess: (batch) => router.push(ROUTES.repairDetail(batch.repairId)),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Send to repair" description="Send eligible products from a stock batch for repair." />
      <SendToRepairForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}

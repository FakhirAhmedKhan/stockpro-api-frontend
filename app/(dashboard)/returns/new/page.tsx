"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ReturnForm } from "@/features/returns/components/return-form";
import { useCreateReturn } from "@/features/returns/hooks/use-returns";
import { ROUTES } from "@/constants/routes";
import type { CreateReturnPayload } from "@/types/return.types";

export default function NewReturnPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateReturn();

  function handleSubmit(payload: CreateReturnPayload) {
    mutate(payload, { onSuccess: () => router.push(ROUTES.returns) });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Process return"
        description="Return sold products from a stock batch."
      />
      <ReturnForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}

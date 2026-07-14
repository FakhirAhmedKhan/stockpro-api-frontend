"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SupplierForm } from "@/features/suppliers/components/supplier-form";
import { useCreateSupplier } from "@/features/suppliers/hooks/use-suppliers";
import { ROUTES } from "@/constants/routes";
import type { SupplierFormValues } from "@/features/suppliers/schemas/supplier.schema";

export default function NewSupplierPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateSupplier();

  function handleSubmit(values: SupplierFormValues) {
    mutate(
      {
        name: values.name,
        email: values.email || undefined,
        phoneNumber: values.phoneNumber || undefined,
        activeStatus: values.activeStatus,
      },
      {
        onSuccess: (supplier) => {
          router.push(ROUTES.supplierDetail(supplier.id));
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New supplier"
        description="Add a new supplier to your directory."
      />
      <div className="surface-card max-w-lg p-6">
        <SupplierForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel="Create supplier"
        />
      </div>
    </div>
  );
}

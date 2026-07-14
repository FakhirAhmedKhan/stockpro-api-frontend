"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerForm } from "@/features/customers/components/customer-form";
import { useCreateCustomer } from "@/features/customers/hooks/use-customers";
import { ROUTES } from "@/constants/routes";
import type { CustomerFormValues } from "@/features/customers/schemas/customer.schema";

export default function NewCustomerPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateCustomer();

  function handleSubmit(values: CustomerFormValues) {
    mutate(
      {
        fullName: values.fullName,
        email: values.email || undefined,
        phoneNumber: values.phoneNumber || undefined,
        role: values.role || undefined,
        activeStatus: values.activeStatus,
      },
      {
        onSuccess: (customer) => {
          router.push(ROUTES.customerDetail(customer.id));
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New customer"
        description="Add a new customer to your directory."
      />
      <div className="surface-card max-w-lg p-6">
        <CustomerForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel="Create customer"
        />
      </div>
    </div>
  );
}

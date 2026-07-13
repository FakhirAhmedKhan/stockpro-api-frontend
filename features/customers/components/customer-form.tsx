"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerFormSchema, type CustomerFormValues } from "@/features/customers/schemas/customer.schema";
import type { CustomerResponseDto } from "@/types/customer.types";

interface CustomerFormProps {
  defaultValues?: Partial<CustomerResponseDto>;
  onSubmit: (values: CustomerFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save customer",
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      email: defaultValues?.email ?? "",
      phoneNumber: defaultValues?.phoneNumber ?? "",
      role: defaultValues?.role ?? "",
      activeStatus: defaultValues?.activeStatus ?? true,
    },
  });

  function submit(values: CustomerFormValues) {
    if (isSubmitting) return;
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          aria-invalid={Boolean(errors.fullName)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          {...register("fullName")}
        />
        {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phoneNumber" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Phone number <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="phoneNumber"
          type="tel"
          aria-invalid={Boolean(errors.phoneNumber)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Role label <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="role"
          type="text"
          aria-invalid={Boolean(errors.role)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          {...register("role")}
        />
        {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="activeStatus"
          type="checkbox"
          className="h-4 w-4 rounded border-zinc-300"
          {...register("activeStatus")}
        />
        <label htmlFor="activeStatus" className="text-sm text-zinc-700 dark:text-zinc-300">
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

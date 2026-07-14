"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  supplierFormSchema,
  type SupplierFormValues,
} from "@/features/suppliers/schemas/supplier.schema";

interface SupplierFormProps {
  onSubmit: (values: SupplierFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function SupplierForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create supplier",
}: SupplierFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: { name: "", email: "", phoneNumber: "", activeStatus: true },
  });

  function submit(values: SupplierFormValues) {
    if (isSubmitting) return;
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          aria-invalid={Boolean(errors.name)}
          className="input-field"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          className="input-field"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="phoneNumber"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Phone number <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="phoneNumber"
          type="tel"
          aria-invalid={Boolean(errors.phoneNumber)}
          className="input-field"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && (
          <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="activeStatus"
          type="checkbox"
          className="h-4 w-4 rounded border-zinc-300"
          {...register("activeStatus")}
        />
        <label
          htmlFor="activeStatus"
          className="text-sm text-zinc-700 dark:text-zinc-300"
        >
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-2 self-start"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

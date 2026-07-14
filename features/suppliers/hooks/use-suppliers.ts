"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supplierApi } from "@/services/supplier.api";
import { queryKeys } from "@/constants/query-keys";
import type {
  CreateSupplierPayload,
  SupplierListFilters,
} from "@/types/supplier.types";
import type { ApiError } from "@/types/api.types";

export function useSuppliers(filters: SupplierListFilters) {
  return useQuery({
    queryKey: queryKeys.suppliers(filters),
    queryFn: () => supplierApi.list(filters),
    placeholderData: (previous) => previous,
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: queryKeys.supplier(id),
    queryFn: () => supplierApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSupplierPayload) => supplierApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier created.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Unable to create supplier.");
    },
  });
}

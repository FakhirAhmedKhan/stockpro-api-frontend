"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerApi } from "@/services/customer.api";
import { queryKeys } from "@/constants/query-keys";
import type {
  CreateCustomerPayload,
  CustomerListFilters,
  UpdateCustomerPayload,
} from "@/types/customer.types";
import type { ApiError } from "@/types/api.types";

export function useCustomers(filters: CustomerListFilters) {
  return useQuery({
    queryKey: queryKeys.customers(filters),
    queryFn: () => customerApi.list(filters),
    placeholderData: (previous) => previous,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customer(id),
    queryFn: () => customerApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => customerApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Unable to create customer.");
    },
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCustomerPayload) =>
      customerApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer(id) });
      toast.success("Customer updated.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Unable to update customer.");
    },
  });
}

export function useDeactivateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerApi.deactivate(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer(id) });
      toast.success("Customer deactivated.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Unable to deactivate customer.");
    },
  });
}

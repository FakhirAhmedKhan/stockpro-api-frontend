"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { returnApi } from "@/services/return.api";
import { queryKeys } from "@/constants/query-keys";
import type {
  CreateReturnPayload,
  ReturnHistoryFilters,
} from "@/types/return.types";
import type { ApiError } from "@/types/api.types";

export function useReturnHistory(filters: ReturnHistoryFilters) {
  return useQuery({
    queryKey: queryKeys.returns(filters),
    queryFn: () => returnApi.history(filters),
    placeholderData: (previous) => previous,
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReturnPayload) => returnApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Return processed.");
    },
    onError: (error: ApiError) => {
      if (error.status === 409) {
        toast.error(
          "This return can't be processed — the product may already be returned, or the order's paid amount would exceed the reduced total (a manual refund is required first).",
        );
      } else {
        toast.error(error.message || "Unable to process return.");
      }
    },
  });
}

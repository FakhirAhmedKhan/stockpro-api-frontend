"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { repairApi } from "@/services/repair.api";
import { queryKeys } from "@/constants/query-keys";
import type {
  CompleteRepairPayload,
  RepairBatchResponseDto,
  SendToRepairPayload,
} from "@/types/repair.types";
import type { ApiError } from "@/types/api.types";

/**
 * There is no `GET /api/Reparing` list/detail endpoint on the backend today
 * — repair batches only exist in the query cache once sent/completed in
 * this session (mirrors the Order module's same gap).
 */
export function useRepairsCache() {
  const queryClient = useQueryClient();
  return (
    queryClient.getQueryData<RepairBatchResponseDto[]>(queryKeys.repairs()) ??
    []
  );
}

export function useRepairCache(
  repairId: string,
): RepairBatchResponseDto | undefined {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<RepairBatchResponseDto>(
    queryKeys.repair(repairId),
  );
}

function upsertRepairCache(
  queryClient: ReturnType<typeof useQueryClient>,
  batch: RepairBatchResponseDto,
) {
  queryClient.setQueryData<RepairBatchResponseDto[]>(
    queryKeys.repairs(),
    (existing) => {
      const withoutCurrent = (existing ?? []).filter(
        (item) => item.id !== batch.id,
      );
      return [batch, ...withoutCurrent];
    },
  );
  queryClient.setQueryData(queryKeys.repair(batch.id), batch);
}

export function useSendToRepair() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendToRepairPayload) => repairApi.send(payload),
    onSuccess: (batch) => {
      upsertRepairCache(queryClient, batch);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Products sent to repair.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Unable to send products to repair.");
    },
  });
}

export function useCompleteRepair(onBatchUpdated: (repairId: string) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompleteRepairPayload) => repairApi.complete(payload),
    onSuccess: (result) => {
      const existing = queryClient.getQueryData<RepairBatchResponseDto>(
        queryKeys.repair(result.batchId),
      );
      if (existing) {
        const updated: RepairBatchResponseDto = {
          ...existing,
          status: result.status,
          items: existing.items.map((item) => {
            const completion = result.items.find(
              (entry) => entry.productId === item.productId,
            );
            return completion ? { ...item, status: completion.status } : item;
          }),
        };
        upsertRepairCache(queryClient, updated);
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Repair items completed.");
      onBatchUpdated(result.batchId);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Unable to complete repair.");
    },
  });
}

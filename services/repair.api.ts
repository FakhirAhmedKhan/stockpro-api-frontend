import { apiClient } from "@/lib/api-client";
import type {
  CompleteRepairPayload,
  RepairBatchResponseDto,
  RepairCompletionResponseDto,
  SendToRepairPayload,
} from "@/types/repair.types";

/** Route prefix is intentionally `Reparing` (backend typo, preserved). */
export const repairApi = {
  send: (payload: SendToRepairPayload) =>
    apiClient.post<RepairBatchResponseDto>("/Reparing/send", payload).then((res) => res.data),

  complete: (payload: CompleteRepairPayload) =>
    apiClient.post<RepairCompletionResponseDto>("/Reparing/complete", payload).then((res) => res.data),
};

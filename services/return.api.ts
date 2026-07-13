import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api.types";
import type { CreateReturnPayload, ReturnHistoryFilters, ReturnResponseDto } from "@/types/return.types";

export const returnApi = {
  create: (payload: CreateReturnPayload) =>
    apiClient.post<ReturnResponseDto>("/return", payload).then((res) => res.data),

  history: (filters: ReturnHistoryFilters = {}) =>
    apiClient
      .get<PaginatedResponse<ReturnResponseDto>>("/return/history", { params: filters })
      .then((res) => res.data),
};

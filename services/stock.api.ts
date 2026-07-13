import { apiClient } from "@/lib/api-client";
import type { CreateStockPayload, StockResponseDto } from "@/types/stock.types";

/**
 * The backend currently exposes only `POST /api/Stock` — there is no
 * `GET /api/Stock` or `GET /api/Stock/:id` (frontend_specification.md §3.1).
 * Stock detail views must therefore be sourced from the create response /
 * query-cache rather than an independent fetch.
 */
export const stockApi = {
  create: (payload: CreateStockPayload) =>
    apiClient.post<StockResponseDto>("/Stock", payload).then((res) => res.data),
};

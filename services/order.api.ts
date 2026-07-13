import { apiClient } from "@/lib/api-client";
import type { CreateOrderPayload, OrderResponseDto, UpdateOrderPayload } from "@/types/order.types";

/**
 * The backend currently exposes only `POST /api/Order` and `PUT /api/Order/:id`
 * — there is no `GET /api/Order` or `GET /api/Order/:id` (frontend_specification.md
 * §4.1). Order list/detail pages must be sourced from the create/update
 * response kept in the query cache, not an independent fetch.
 */
export const orderApi = {
  create: (payload: CreateOrderPayload) =>
    apiClient.post<OrderResponseDto>("/Order", payload).then((res) => res.data),

  update: (id: string, payload: UpdateOrderPayload) =>
    apiClient.put<OrderResponseDto>(`/Order/${id}`, payload).then((res) => res.data),
};

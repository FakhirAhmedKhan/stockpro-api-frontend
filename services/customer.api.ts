import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api.types";
import type {
  CreateCustomerPayload,
  CustomerListFilters,
  CustomerResponseDto,
  UpdateCustomerPayload,
} from "@/types/customer.types";

export const customerApi = {
  list: (filters: CustomerListFilters = {}) =>
    apiClient
      .get<PaginatedResponse<CustomerResponseDto>>("/Customer", { params: filters })
      .then((res) => res.data),

  getById: (id: string) =>
    apiClient.get<CustomerResponseDto>(`/Customer/${id}`).then((res) => res.data),

  create: (payload: CreateCustomerPayload) =>
    apiClient.post<CustomerResponseDto>("/Customer", payload).then((res) => res.data),

  update: (id: string, payload: UpdateCustomerPayload) =>
    apiClient.put<CustomerResponseDto>(`/Customer/${id}`, payload).then((res) => res.data),

  deactivate: (id: string) => apiClient.delete<void>(`/Customer/${id}`).then((res) => res.data),
};

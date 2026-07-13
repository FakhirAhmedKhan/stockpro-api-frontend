import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api.types";
import type {
  CreateSupplierPayload,
  SupplierListFilters,
  SupplierResponseDto,
} from "@/types/supplier.types";

export const supplierApi = {
  list: (filters: SupplierListFilters = {}) =>
    apiClient
      .get<PaginatedResponse<SupplierResponseDto>>("/supplier", { params: filters })
      .then((res) => res.data),

  getById: (id: string) =>
    apiClient.get<SupplierResponseDto>(`/supplier/${id}`).then((res) => res.data),

  create: (payload: CreateSupplierPayload) =>
    apiClient.post<SupplierResponseDto>("/supplier", payload).then((res) => res.data),
};

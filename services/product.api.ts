import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api.types";
import type {
  CreateProductPayload,
  ProductListFilters,
  ProductResponseDto,
} from "@/types/product.types";

export const productApi = {
  list: (filters: ProductListFilters = {}) =>
    apiClient
      .get<PaginatedResponse<ProductResponseDto>>("/Product", {
        params: {
          ...filters,
          // Sent as a comma-separated string rather than relying on axios's
          // bracket-array query serialization, which Express 5's default
          // "simple" query parser does not merge back into an array.
          statuses: filters.statuses?.join(","),
        },
      })
      .then((res) => res.data),

  create: (payload: CreateProductPayload) =>
    apiClient
      .post<ProductResponseDto>("/Product", payload)
      .then((res) => res.data),
};

import { apiClient } from "@/lib/api-client";
import type { CreateProductPayload, ProductResponseDto } from "@/types/product.types";

/**
 * The backend currently exposes only `POST /api/Product` (add one product to
 * an existing Stock) — there is no `GET /api/Product` list endpoint
 * (frontend_specification.md §3.1). Product pickers cannot be populated from
 * the server today; barcodes must be entered/scanned and are resolved by the
 * consuming endpoint (e.g. Order creation) at submission time.
 */
export const productApi = {
  create: (payload: CreateProductPayload) =>
    apiClient.post<ProductResponseDto>("/Product", payload).then((res) => res.data),
};

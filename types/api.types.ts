/**
 * Shared API response shapes. Business-domain types (Customer, Order, ...)
 * live in their own `types/*.types.ts` files.
 */

/** Normalized error shape produced by the api-client interceptor. */
export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
  isNetworkError?: boolean;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

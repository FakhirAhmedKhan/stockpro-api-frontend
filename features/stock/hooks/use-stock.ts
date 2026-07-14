"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { stockApi } from "@/services/stock.api";
import { queryKeys } from "@/constants/query-keys";
import type { CreateStockPayload, StockResponseDto } from "@/types/stock.types";
import type { ApiError } from "@/types/api.types";

/**
 * The backend only exposes `POST /api/Stock` — there is no list or
 * detail-by-id endpoint yet (see stock.api.ts). Stock batches created during
 * this session are cached in the query client so the list/detail pages can
 * show them without a fake network call the server can't answer.
 */
export function useStocks() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: queryKeys.stocks(),
    queryFn: () =>
      queryClient.getQueryData<StockResponseDto[]>(queryKeys.stocks()) ?? [],
    staleTime: Infinity,
  });
}

export function useStock(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: queryKeys.stock(id),
    queryFn: () =>
      queryClient.getQueryData<StockResponseDto>(queryKeys.stock(id)) ?? null,
    enabled: Boolean(id),
    staleTime: Infinity,
  });
}

export function useCreateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStockPayload) => stockApi.create(payload),
    onSuccess: (stock) => {
      queryClient.setQueryData<StockResponseDto[]>(
        queryKeys.stocks(),
        (existing) => [stock, ...(existing ?? [])],
      );
      queryClient.setQueryData(queryKeys.stock(stock.id), stock);
      toast.success("Stock batch created.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Unable to create stock batch.");
    },
  });
}

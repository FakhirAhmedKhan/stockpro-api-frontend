"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderApi } from "@/services/order.api";
import { queryKeys } from "@/constants/query-keys";
import type { CreateOrderPayload, OrderResponseDto, UpdateOrderPayload } from "@/types/order.types";
import type { ApiError } from "@/types/api.types";

/**
 * There is no `GET /api/Order` or `GET /api/Order/:id` on the backend today
 * (frontend_specification.md §4.1), so orders are not fetched — they only
 * exist in the query cache once created/updated in this session. This hook
 * reads that cache; it intentionally has no queryFn/network fallback.
 */
export function useOrdersCache() {
  const queryClient = useQueryClient();
  const list = queryClient.getQueryData<OrderResponseDto[]>(queryKeys.orders()) ?? [];
  return list;
}

export function useOrderCache(orderId: string): OrderResponseDto | undefined {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<OrderResponseDto>(queryKeys.order(orderId));
}

function appendToOrderListCache(
  queryClient: ReturnType<typeof useQueryClient>,
  order: OrderResponseDto,
) {
  queryClient.setQueryData<OrderResponseDto[]>(queryKeys.orders(), (existing) => {
    const withoutCurrent = (existing ?? []).filter((item) => item.orderId !== order.orderId);
    return [order, ...withoutCurrent];
  });
  queryClient.setQueryData(queryKeys.order(order.orderId), order);
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.create(payload),
    onSuccess: (order) => {
      appendToOrderListCache(queryClient, order);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["customer-ledger", order.customerId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Order created.");
    },
    onError: (error: ApiError) => {
      if (error.status === 409) {
        toast.error("One or more products are no longer available. Please review and try again.");
      } else {
        toast.error(error.message || "Unable to create order.");
      }
    },
  });
}

export function useUpdateOrder(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateOrderPayload) => orderApi.update(orderId, payload),
    onSuccess: (order) => {
      appendToOrderListCache(queryClient, order);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["customer-ledger", order.customerId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Order updated.");
    },
    onError: (error: ApiError) => {
      if (error.status === 409) {
        toast.error("Inventory changed since you loaded this order. Please review and try again.");
      } else {
        toast.error(error.message || "Unable to update order.");
      }
    },
  });
}

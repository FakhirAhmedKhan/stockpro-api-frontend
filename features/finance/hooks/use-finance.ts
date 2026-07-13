"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { financeApi } from "@/services/finance.api";
import { queryKeys } from "@/constants/query-keys";
import type { PartyLedgerFilters, PartyType, RecordPaymentPayload } from "@/types/finance.types";
import type { ApiError } from "@/types/api.types";

export function useCustomerInvoiceLedger(customerId: string, params: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: queryKeys.customerInvoices({ customerId, ...params }),
    queryFn: () => financeApi.customerInvoiceLedger(customerId, params),
    enabled: Boolean(customerId),
    placeholderData: (previous) => previous,
  });
}

export function useSupplierInvoiceLedger(supplierId: string, params: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: queryKeys.supplierInvoices({ supplierId, ...params }),
    queryFn: () => financeApi.supplierInvoiceLedger(supplierId, params),
    enabled: Boolean(supplierId),
    placeholderData: (previous) => previous,
  });
}

export function usePartyLedger(partyId: string, partyType: PartyType, filters: PartyLedgerFilters) {
  const key =
    partyType === "Customer"
      ? queryKeys.customerLedger(partyId, filters)
      : queryKeys.supplierLedger(partyId, filters);

  return useQuery({
    queryKey: key,
    queryFn: () => financeApi.partyLedger(partyId, partyType, filters),
    enabled: Boolean(partyId),
    placeholderData: (previous) => previous,
  });
}

export function usePayCustomerInvoice(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecordPaymentPayload) => financeApi.payCustomerInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.customerLedger(customerId) });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Payment recorded.");
    },
    onError: (error: ApiError) => {
      if (error.status === 409) {
        toast.error("This payment would exceed the invoice's outstanding balance.");
      } else {
        toast.error(error.message || "Unable to record payment.");
      }
    },
  });
}

export function usePaySupplierInvoice(supplierId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecordPaymentPayload) => financeApi.paySupplierInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-invoices"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierLedger(supplierId) });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Payment recorded.");
    },
    onError: (error: ApiError) => {
      if (error.status === 409) {
        toast.error("This payment would exceed the invoice's outstanding balance.");
      } else {
        toast.error(error.message || "Unable to record payment.");
      }
    },
  });
}

import { apiClient } from "@/lib/api-client";
import type {
  PartyInvoiceLedgerDto,
  PartyLedgerFilters,
  PartyLedgerReportDto,
  PartyType,
  PaymentResponseDto,
  RecordPaymentPayload,
} from "@/types/finance.types";

export const financeApi = {
  payCustomerInvoice: (payload: RecordPaymentPayload) =>
    apiClient.post<PaymentResponseDto>("/Finance/customer/payment", payload).then((res) => res.data),

  paySupplierInvoice: (payload: RecordPaymentPayload) =>
    apiClient.post<PaymentResponseDto>("/Finance/supplier/payment", payload).then((res) => res.data),

  /** Invoice-rollup view — one row per invoice for a single party. */
  customerInvoiceLedger: (customerId: string, params: { page?: number; pageSize?: number } = {}) =>
    apiClient
      .get<PartyInvoiceLedgerDto>(`/Finance/customer/${customerId}/ledger`, { params })
      .then((res) => res.data),

  supplierInvoiceLedger: (supplierId: string, params: { page?: number; pageSize?: number } = {}) =>
    apiClient
      .get<PartyInvoiceLedgerDto>(`/Finance/supplier/${supplierId}/ledger`, { params })
      .then((res) => res.data),

  /** Party-wide statement — preferred for new ledger UI (frontend_specification.md §7). */
  partyLedger: (partyId: string, partyType: PartyType, filters: PartyLedgerFilters = {}) =>
    apiClient
      .get<PartyLedgerReportDto>(`/Finance/party/ledger/${partyId}/${partyType}`, { params: filters })
      .then((res) => res.data),
};

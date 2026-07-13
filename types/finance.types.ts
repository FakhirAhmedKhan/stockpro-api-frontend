export type PartyType = "Customer" | "Supplier";

export interface PaymentResponseDto {
  paymentId: string;
  invoiceId: string;
  amount: string;
  paidAmount: string;
  outstanding: string;
  createdAt: string;
}

export interface RecordPaymentPayload {
  invoiceId: string;
  amount: number;
  paymentDate?: string;
  method?: string;
  reference?: string;
  idempotencyKey?: string;
}

/** One row of the invoice-rollup ledger (`GET .../:partyId/ledger`) — one per invoice, not per ledger entry. */
export interface InvoiceRollupDto {
  id: string;
  totalAmount: string;
  paidAmount: string;
  createdAt: string;
  orderId?: string;
  stockId?: string;
}

export interface PartyInvoiceLedgerDto {
  total: string;
  paid: string;
  outstanding: string;
  invoices: InvoiceRollupDto[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface LedgerEntryDto {
  id: string;
  invoiceId: string | null;
  debit: string;
  credit: string;
  narration: string | null;
  referenceType: string | null;
  referenceId: string | null;
  createdAt: string;
}

export interface PartyLedgerReportDto {
  partyId: string;
  partyType: PartyType;
  totalDebit: string;
  totalCredit: string;
  closingBalance: string;
  entries: LedgerEntryDto[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PartyLedgerFilters {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

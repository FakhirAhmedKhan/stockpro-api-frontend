export interface StockResponseDto {
  id: string;
  title: string;
  totalQuantity: number;
  quantityAvailable: number;
  /** Decimal-safe — backend returns money fields as strings. */
  unitPrice: string;
  stockPrice: string;
  supplierId: string;
  generatedProductCount: number;
  supplierInvoiceId: string;
  createdAt: string;
}

export interface CreateStockPayload {
  title: string;
  totalQuantity: number;
  unitPrice: number;
  stockPrice: number;
  totalAmountPaid: number;
  supplierId: string;
  storage?: string;
  color?: string;
  condition?: string;
}

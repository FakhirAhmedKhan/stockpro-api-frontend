export interface OrderResponseDto {
  orderId: string;
  customerId: string;
  stockId: string;
  quantity: number;
  totalPrice: string;
  paidAmount: string;
  productIds: string[];
  invoiceId: string;
  orderDate: string;
}

export interface CreateOrderPayload {
  customerId: string;
  stockId: string;
  productIds: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paidAmount: number;
}

export interface UpdateOrderPayload {
  productIds?: string[];
  unitPrice?: number;
  paidAmount?: number;
  narration?: string;
}

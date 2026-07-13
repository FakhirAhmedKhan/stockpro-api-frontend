export type ProductStatus = "Available" | "Sold" | "SentToRepair" | "Repaired" | "Vendor" | "Scrap";

export interface ProductResponseDto {
  id: string;
  stockId: string;
  name: string;
  barcode: string;
  storage: string | null;
  color: string | null;
  condition: string | null;
  price: string;
  status: ProductStatus;
}

export interface CreateProductPayload {
  stockId: string;
  name?: string;
  barcode?: string;
  price?: number;
  storage?: string;
  color?: string;
  condition?: string;
}

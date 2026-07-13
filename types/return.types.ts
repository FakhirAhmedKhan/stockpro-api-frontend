export type ReturnType = "ToStock" | "ToRepair" | "ToVendor" | "ToScrap";

export interface ReturnResponseDto {
  returnId: string;
  stockId: string;
  returnType: ReturnType;
  productIds: string[];
  narration: string | null;
  createdAt: string;
}

export interface CreateReturnPayload {
  stockId: string;
  returnType: ReturnType;
  productIds: string[];
  narration?: string;
}

export interface ReturnHistoryFilters {
  page?: number;
  pageSize?: number;
  stockId?: string;
  returnType?: ReturnType;
  startDate?: string;
  endDate?: string;
}

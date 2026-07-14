export type RepairItemOutcome = "Repaired" | "Scrap";

export interface RepairBatchItemDto {
  id: string;
  productId: string;
  status: "Pending" | RepairItemOutcome;
}

export interface RepairBatchResponseDto {
  id: string;
  stockId: string;
  technician: string | null;
  narration: string | null;
  status: string;
  completedAt: string | null;
  createdAt: string;
  items: RepairBatchItemDto[];
}

export interface SendToRepairPayload {
  stockId: string;
  productIds: string[];
  narration?: string;
  technician?: string;
}

export interface CompleteRepairItemPayload {
  productId: string;
  status: RepairItemOutcome;
  cost: number;
}

export interface CompleteRepairPayload {
  repairId: string;
  narration?: string;
  items: CompleteRepairItemPayload[];
}

export interface RepairCompletionItemDto {
  id: string;
  productId: string;
  status: RepairItemOutcome;
  cost: string;
  completedAt: string;
}

export interface RepairCompletionResponseDto {
  batchId: string;
  status: "Pending" | "Repaired";
  completedAt: string | null;
  items: RepairCompletionItemDto[];
}

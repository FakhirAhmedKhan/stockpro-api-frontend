export interface SupplierResponseDto {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  activeStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierPayload {
  name: string;
  email?: string;
  phoneNumber?: string;
  activeStatus?: boolean;
}

export interface SupplierListFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  activeStatus?: boolean;
}

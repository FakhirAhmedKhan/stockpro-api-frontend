export interface CustomerResponseDto {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  role: string | null;
  activeStatus: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface CreateCustomerPayload {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  activeStatus?: boolean;
  lastLoginAt?: string;
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

export interface CustomerListFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  activeStatus?: boolean;
}

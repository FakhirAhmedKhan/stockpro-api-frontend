import { apiClient } from "@/lib/api-client";
import type { LoginResponseDto, UserInfoDto } from "@/types/auth.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  userName: string;
  password: string;
  phoneNumber?: string;
  currency?: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponseDto>("/User/login", payload).then((res) => res.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<LoginResponseDto>("/User/register", payload).then((res) => res.data),

  me: () => apiClient.get<UserInfoDto>("/User/me").then((res) => res.data),
};

"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginPayload, type RegisterPayload } from "@/services/auth.api";
import { clearToken, getToken, setToken } from "@/lib/auth-storage";
import { queryKeys } from "@/constants/query-keys";
import type { LoginResponseDto, UserInfoDto } from "@/types/auth.types";
import type { ApiError } from "@/types/api.types";

interface AuthContextValue {
  user: UserInfoDto | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  loginError: ApiError | null;
  registerError: ApiError | null;
  isLoggingIn: boolean;
  isRegistering: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Reads localStorage after mount to avoid SSR/client markup mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasToken(Boolean(getToken()));
  }, []);

  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: authApi.me,
    enabled: hasToken,
    retry: false,
  });

  const loginMutation = useMutation<LoginResponseDto, ApiError, LoginPayload>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.token);
      setHasToken(true);
      queryClient.setQueryData(queryKeys.currentUser, data.user);
    },
  });

  const registerMutation = useMutation<LoginResponseDto, ApiError, RegisterPayload>({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setToken(data.token);
      setHasToken(true);
      queryClient.setQueryData(queryKeys.currentUser, data.user);
    },
  });

  function logout() {
    clearToken();
    setHasToken(false);
    queryClient.setQueryData(queryKeys.currentUser, undefined);
    queryClient.removeQueries({ queryKey: queryKeys.currentUser });
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading: hasToken && (isLoading || isFetching) && !user,
    login: async (payload) => {
      await loginMutation.mutateAsync(payload);
    },
    register: async (payload) => {
      await registerMutation.mutateAsync(payload);
    },
    logout,
    loginError: loginMutation.error ?? null,
    registerError: registerMutation.error ?? null,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

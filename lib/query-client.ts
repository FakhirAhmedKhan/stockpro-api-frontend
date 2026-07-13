import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/api.types";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => {
          const status = (error as unknown as ApiError)?.status;
          if (status && [401, 403, 404, 409, 400].includes(status)) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

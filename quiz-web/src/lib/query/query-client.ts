import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { ApiContractError } from "@/lib/http/api-contract";

export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= 2 || error instanceof ApiContractError) return false;
  if (!axios.isAxiosError(error)) return false;
  return !error.response || error.response.status >= 500;
}

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: true,
        retry: shouldRetryQuery,
        staleTime: 60_000,
      },
      mutations: { retry: false },
    },
  });
}

import { queryOptions } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export const authQueries = {
  profile: () => queryOptions({
    queryKey: authKeys.profile(),
    queryFn: authApi.profile,
    staleTime: 5 * 60_000,
  }),
};

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { getStoredRefreshToken, setAccessToken, storeRefreshToken } from "@/lib/http/client";
import { authKeys } from "./auth-queries";
import { useAuthSessionStore } from "./auth-provider";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthSessionStore((state) => state.setAuthenticated);
  return useMutation({
    mutationKey: [...authKeys.all, "login"],
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setAccessToken(response.accessToken);
      storeRefreshToken(response.refreshToken);
      queryClient.setQueryData(authKeys.profile(), response.user);
      setAuthenticated();
    },
  });
}

export function useRegisterMutation() {
  return useMutation({ mutationKey: [...authKeys.all, "register"], mutationFn: authApi.register });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const setAnonymous = useAuthSessionStore((state) => state.setAnonymous);
  return useMutation({
    mutationKey: [...authKeys.all, "logout"],
    mutationFn: async () => {
      const refreshToken = getStoredRefreshToken();
      if (refreshToken) await authApi.logout(refreshToken);
    },
    onSettled: () => {
      setAccessToken(null);
      storeRefreshToken(null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      setAnonymous();
    },
  });
}

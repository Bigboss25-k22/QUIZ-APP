"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { authKeys } from "./auth-queries";
import { useAuthSessionStore } from "./auth-provider";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthSessionStore((state) => state.setAuthenticated);
  return useMutation({
    mutationKey: [...authKeys.all, "login"],
    mutationFn: authApi.login,
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.profile(), response.user);
      setAuthenticated();
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthSessionStore((state) => state.setAuthenticated);
  return useMutation({
    mutationKey: [...authKeys.all, "register"],
    mutationFn: authApi.register,
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.profile(), response.user);
      setAuthenticated();
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const setAnonymous = useAuthSessionStore((state) => state.setAnonymous);
  return useMutation({
    mutationKey: [...authKeys.all, "logout"],
    mutationFn: async () => {
      await authApi.logout();
    },
    onSettled: () => {
      window.localStorage.removeItem("quiz_refresh_token");
      queryClient.removeQueries({ queryKey: authKeys.all });
      setAnonymous();
    },
  });
}

"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "zustand";
import { authApi } from "../api/auth-api";
import { configureAuthClient, getStoredRefreshToken, setAccessToken, storeRefreshToken } from "@/lib/http/client";
import { authKeys, authQueries } from "./auth-queries";
import { createAuthSessionStore, type AuthSessionState, type AuthSessionStore } from "./auth-session-store";

const AuthSessionContext = createContext<AuthSessionStore | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createAuthSessionStore);
  return <AuthSessionContext.Provider value={store}><AuthBootstrap/>{children}</AuthSessionContext.Provider>;
}

export function useAuthSessionStore<T>(selector: (state: AuthSessionState) => T) {
  const store = useContext(AuthSessionContext);
  if (!store) throw new Error("useAuthSessionStore must be used inside AuthProvider");
  return useStore(store, selector);
}

function AuthBootstrap() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthSessionStore((state) => state.setAuthenticated);
  const setAnonymous = useAuthSessionStore((state) => state.setAnonymous);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    storeRefreshToken(null);
    queryClient.removeQueries({ queryKey: authKeys.all });
    setAnonymous();
  }, [queryClient, setAnonymous]);

  useEffect(() => {
    configureAuthClient({
      onTokenRefreshed: setAuthenticated,
      onUnauthorized: () => {
        clearSession();
        if (window.location.pathname !== "/login") router.replace("/login");
      },
    });

    const restoreTimer = window.setTimeout(async () => {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        setAnonymous();
        return;
      }
      try {
        const tokens = await authApi.refresh(refreshToken);
        setAccessToken(tokens.accessToken);
        storeRefreshToken(tokens.refreshToken);
        const user = await authApi.profile();
        queryClient.setQueryData(authKeys.profile(), user);
        setAuthenticated();
      } catch {
        clearSession();
      }
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, [clearSession, queryClient, router, setAnonymous, setAuthenticated]);

  return null;
}

export function useAuth() {
  const status = useAuthSessionStore((state) => state.status);
  const profile = useQuery({ ...authQueries.profile(), enabled: status === "authenticated" });
  return { status, user: profile.data ?? null };
}

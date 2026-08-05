import axios from "axios";
import { parseApiResponse } from "./api-contract";
import { tokenPairSchema } from "./token-schema";

const refreshTokenKey = "quiz_refresh_token";
let accessToken: string | null = null;
let refreshInFlight: Promise<string> | null = null;
let callbacks: { onTokenRefreshed?: (token: string) => void; onUnauthorized?: () => void } = {};

export const apiClient = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getStoredRefreshToken() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(refreshTokenKey);
}

export function storeRefreshToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(refreshTokenKey, token);
  else window.localStorage.removeItem(refreshTokenKey);
}

export function configureAuthClient(nextCallbacks: typeof callbacks) {
  callbacks = nextCallbacks;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiClient.interceptors.response.use(undefined, async (error) => {
  const request = error.config as { url?: string; _retry?: boolean; headers?: Record<string, string> } | undefined;
  const isAuthRequest = request?.url?.includes("/api/auth/");

  if (error.response?.status !== 401 || !request || request._retry || isAuthRequest) {
    return Promise.reject(error);
  }

  request._retry = true;
  try {
    refreshInFlight ??= apiClient
      .post<unknown>("/api/auth/refresh", { refreshToken: getStoredRefreshToken() })
      .then(({ data }) => {
        const tokens = parseApiResponse(tokenPairSchema, data, "/api/auth/refresh");
        setAccessToken(tokens.accessToken);
        storeRefreshToken(tokens.refreshToken);
        callbacks.onTokenRefreshed?.(tokens.accessToken);
        return tokens.accessToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });

    const token = await refreshInFlight;
    request.headers = { ...request.headers, Authorization: `Bearer ${token}` };
    return apiClient(request);
  } catch (refreshError) {
    setAccessToken(null);
    storeRefreshToken(null);
    callbacks.onUnauthorized?.();
    return Promise.reject(refreshError);
  }
});

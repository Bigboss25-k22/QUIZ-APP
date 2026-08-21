import axios from "axios";

let refreshInFlight: Promise<void> | null = null;
let callbacks: { onTokenRefreshed?: () => void; onUnauthorized?: () => void } = {};

export const apiClient = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export function configureAuthClient(nextCallbacks: typeof callbacks) {
  callbacks = nextCallbacks;
}

apiClient.interceptors.response.use(undefined, async (error) => {
  const request = error.config as { url?: string; _retry?: boolean; headers?: Record<string, string> } | undefined;
  const isAuthRequest = request?.url?.includes("/api/auth/");

  if (error.response?.status !== 401 || !request || request._retry || isAuthRequest) {
    return Promise.reject(error);
  }

  request._retry = true;
  try {
    refreshInFlight ??= apiClient.post("/api/auth/refresh")
      .then(() => callbacks.onTokenRefreshed?.())
      .finally(() => {
        refreshInFlight = null;
      });

    await refreshInFlight;
    return apiClient(request);
  } catch (refreshError) {
    callbacks.onUnauthorized?.();
    return Promise.reject(refreshError);
  }
});

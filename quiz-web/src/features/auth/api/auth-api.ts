import { apiClient } from "@/lib/http/client";
import { parseApiResponse } from "@/lib/http/api-contract";
import { authResponseSchema, userSchema, type LoginInput, type RegisterInput } from "../model/schemas";

export const authApi = {
  login: async (payload: LoginInput) => parseApiResponse(authResponseSchema, (await apiClient.post<unknown>("/api/auth/login", payload)).data, "/api/auth/login"),
  register: async ({ confirmPassword: _confirmPassword, ...payload }: RegisterInput) =>
    parseApiResponse(authResponseSchema, (await apiClient.post<unknown>("/api/auth/signup", payload)).data, "/api/auth/signup"),
  refresh: async () => apiClient.post("/api/auth/refresh"),
  logout: async () => apiClient.post("/api/auth/logout"),
  profile: async () => parseApiResponse(userSchema, (await apiClient.get<unknown>("/api/users/profile")).data, "/api/users/profile"),
};

import axiosInstance from "../../../lib/axiosInstance";
import { AuthResponse } from "../../../types/user.type";

export async function loginUser({ email, password }: Record<string, string>): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/api/auth/login", { email, password });
    return response.data;
}

export async function registerUser({ email, password, name }: Record<string, string>): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>("/api/auth/signup", { email, password, name });
    return response.data;
}

export async function refreshToken(refreshTokenStr: string): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/api/auth/refresh", { refreshToken: refreshTokenStr });
    return response.data;
}

export async function logoutUser(refreshTokenStr: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>("/api/auth/logout", { refreshToken: refreshTokenStr });
    return response.data;
}

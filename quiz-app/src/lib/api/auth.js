import axiosInstance from "../axiosInstance";

export async function loginUser({ email, password }) {
    const response = await axiosInstance.post("/api/auth/login", { email, password });
    return response.data;
}

export async function registerUser({ email, password, name }) {
    const response = await axiosInstance.post("/api/auth/signup", { email, password, name });
    return response.data;
}

export async function refreshToken(refreshToken) {
    const response = await axiosInstance.post("/api/auth/refresh", { refreshToken });
    return response.data;
}

export async function logoutUser(refreshToken) {
    const response = await axiosInstance.post("/api/auth/logout", { refreshToken });
    return response.data;
}

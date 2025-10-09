import { apiFetch } from "@/lib/apiClient";

export function loginUser({ email, password }) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function registerUser({ email, password, name }) {
    return apiFetch("/auth/sign-up", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
    });
}

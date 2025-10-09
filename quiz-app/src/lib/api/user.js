import { apiFetch } from "@/lib/apiClient";

export function getUserProfile() {
    return apiFetch("/user/profile");
}

export function updateUserProfile(data) {
    return apiFetch("/user/profile", {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

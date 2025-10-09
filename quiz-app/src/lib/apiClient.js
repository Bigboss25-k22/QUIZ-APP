// Chuẩn hóa fetch cho toàn bộ API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiFetch(path, options = {}) {
    const res = await fetch(BASE_URL + path, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Có lỗi xảy ra");
    }
    return res.json();
}

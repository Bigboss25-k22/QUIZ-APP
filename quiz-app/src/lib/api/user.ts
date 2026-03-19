import axiosInstance from "../axiosInstance";

export function getUserProfile() {
    return axiosInstance.get("/user/profile");
}

export function updateUserProfile(data: any) {
    return axiosInstance.put("/user/profile", data);
}

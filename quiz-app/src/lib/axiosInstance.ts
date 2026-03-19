/// <reference types="vite/client" />
import axios from 'axios';

import { API_BASE_URL } from '../config/env';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let accessToken: string | null = null;
let authContextFunctions: { updateToken?: (t: string) => void; logout?: () => void } | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};


export const getAccessToken = () => {
    return accessToken;
};

export const setAuthContext = (functions: { updateToken?: (t: string) => void; logout?: () => void }) => {
    authContextFunctions = functions;
};

axiosInstance.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('quiz_refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(
                    `${API_BASE_URL}/api/auth/refresh`,
                    { refreshToken },
                    { withCredentials: true }
                );

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                setAccessToken(newAccessToken);
                localStorage.setItem('quiz_refresh_token', newRefreshToken);

                if (authContextFunctions?.updateToken) {
                    authContextFunctions.updateToken(newAccessToken);
                }

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                if (authContextFunctions?.logout) {
                    authContextFunctions.logout();
                }
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        const status = error.response?.status;
        const message = error.response?.data?.message || 'An error occurred';

        switch (status) {
            case 403:
                console.error('Permission denied:', message);
                break;
            case 404:
                console.error('Resource not found:', message);
                break;
            case 500:
                console.error('Server error:', message);
                break;
            default:
                console.error('Error:', message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
